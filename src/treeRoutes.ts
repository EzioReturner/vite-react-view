import fs from 'fs';
import { filterProperty } from './utils/tools';
import { START_ANCHOR, END_ANCHOR, getEnvConstants } from './constants';
import { createRouteTreeFile } from './utils/createFile';
import type { FlattenRouteItem, TreeRouteItem, SimpleEntryOptions } from './interface';

export default function generateTreeRoutes(
  root: string,
  routes: FlattenRouteItem[],
  options: SimpleEntryOptions
) {
  const { USER_CONFIG_DIR, USER_CONFIG_FILE } = getEnvConstants(root, options);

  const userFileExist = fs.existsSync(`${USER_CONFIG_DIR}/${USER_CONFIG_FILE}`);

  const filterRoutes = routes.map(r => filterProperty(r, ['component'])) as TreeRouteItem[];

  if (userFileExist) {
    compareRouteTree(USER_CONFIG_DIR, USER_CONFIG_FILE, filterRoutes, options);
  } else {
    let baseConfig =
      'import type { CustomerRouteConfig } from "@lite/react-view";\nexport const fileRoutes:CustomerRouteConfig[] = ' +
      '\n' +
      START_ANCHOR +
      '\n' +
      JSON.stringify(generateTree(filterRoutes), null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/"/g, "'") +
      '\n' +
      END_ANCHOR;

    options?.beforeAssign && options.beforeAssign(baseConfig);

    createRouteTreeFile(`${USER_CONFIG_DIR}/${USER_CONFIG_FILE}`, baseConfig);
  }
}

async function compareRouteTree(
  userConfigDir: string,
  configFile: string,
  routes: TreeRouteItem[],
  options?: SimpleEntryOptions
) {
  const userFile = fs.readFileSync(`${userConfigDir}/${configFile}`, 'utf-8');

  const startOfRoutes = userFile.indexOf(START_ANCHOR);

  const endOfRoutes = userFile.indexOf(END_ANCHOR);

  const userImports = userFile.slice(0, startOfRoutes);

  const userConfigAfterRoutes = userFile.slice(endOfRoutes + END_ANCHOR.length);

  let formatUserConfig = userFile
    .slice(startOfRoutes + START_ANCHOR.length, endOfRoutes)
    // 移除空格换行
    .replace(/\n|\s/g, '')
    .replace(/(-?Infinity)/g, '"$1"')
    // 替换jsx标签
    .replace(/</g, "'$LITE_JSX_LABEL_LEFT")
    .replace(/(\s?)\/>/g, "$LITE_JSX_LABEL_RIGHT'")
    // key增加双引号
    .replace(/(\w+):/g, '"$1":')
    // value替换双引号
    .replace(/'([^']+)'/g, '"$1"')
    .replace(/;$/, '');

  let jsonUserConfig = [];

  if (options?.beforeParse) {
    formatUserConfig = options.beforeParse(formatUserConfig);
  }

  try {
    jsonUserConfig = JSON.parse(formatUserConfig);
  } catch (error) {
    console.error(error);
  }

  const flattenUserConfig = flattenRouteTree(jsonUserConfig);

  const mergedConfig = routes.map(route => {
    const { name } = route;

    const userProperty = flattenUserConfig.find(uc => uc.name === name);

    return Object.assign(
      {
        ...route
      },
      userProperty?.order && {
        order: userProperty.order
      },
      userProperty?.meta && {
        meta: userProperty.meta
      }
    );
  });

  const routeTree = generateTree(mergedConfig);

  const sortedTree = sortTreeByOrder(routeTree);

  const formatTreeString = JSON.stringify(sortedTree, null, 2)
    // 移除key双引号
    .replace(/"([^"]+)":/g, '$1:')
    // value双引号转单引号
    .replace(/"/g, "'")
    .replace(/'(-?Infinity)'/g, '$1')
    .replace(/'\$LITE_JSX_LABEL_LEFT/g, '<')
    .replace(/\$LITE_JSX_LABEL_RIGHT'/g, ' />');

  let routeTreeConfig =
    userImports +
    START_ANCHOR +
    '\n' +
    formatTreeString +
    '\n' +
    END_ANCHOR +
    userConfigAfterRoutes;

  if (options?.beforeAssign) {
    routeTreeConfig = options.beforeAssign(routeTreeConfig);
  }

  createRouteTreeFile(`${userConfigDir}/${configFile}`, routeTreeConfig);
}

function flattenRouteTree(routeTree: TreeRouteItem[]) {
  return routeTree.reduce((res: TreeRouteItem[], route) => {
    const { routes, ...rest } = route;

    if (routes) {
      res.push(rest, ...flattenRouteTree(routes));
    } else {
      res.push(rest);
    }

    return res;
  }, []);
}

function generateTree(mergedRoutes: TreeRouteItem[]) {
  return mergedRoutes.reduce((tree: TreeRouteItem[], route) => {
    const path = route.name.split('-');

    const pathLen = path.length;

    let parent = tree;

    for (let i = 0; i < pathLen; i++) {
      /*
       * 如果文件夹下没有 index 文件, 则所有的路径将平铺推向根节点
       * 例如: psAuth-bus-subway, 在片段 0 (psAuth) 时由于不存在上一级 parent.routes, 故创建了全称路径
       * 进而在片段 1 (bus) 时由于在上一级匹配到name完全相同的项, 所以退出循环
       */
      if (parent.some(t => t.name === route.name)) break;

      const piece = path.slice(0, i + 1).join('-');

      let index = parent.findIndex(t => t.name === piece);

      if (index > -1) {
        if (!parent[index].routes) {
          parent[index].routes = [];
        }

        parent = parent[index].routes!;
      } else {
        let data: TreeRouteItem = { ...route };

        parent.push(data);
      }
    }

    return tree;
  }, []);
}

function sortTreeByOrder(routeTree: TreeRouteItem[]): TreeRouteItem[] {
  return routeTree
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(r =>
      Object.assign(
        {
          ...r
        },
        r.routes && {
          routes: sortTreeByOrder(r.routes)
        }
      )
    );
}
