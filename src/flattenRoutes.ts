import { createFlattenRoutesFile } from './utils/createFile';
import { getConstantsMergedOptions, getEnvConstants } from './constants';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { FlattenRouteItem, SimpleEntryOptions } from './interface';

export default function generateFlattenRoutes(
  root: string,
  scanningResult: string[],
  options: SimpleEntryOptions
) {
  const { viewIndex, ext } = getConstantsMergedOptions(options);

  const { VITE_REACT_VIEW_CONFIG_FILE } = getEnvConstants(root, options);

  let flattenRoutes = formatResult(scanningResult, viewIndex, ext);

  let sortedRoutes = flattenRoutes.sort((a, b) => a.name.localeCompare(b.name));

  let suppleRoutes = suppleGroupRouteIndex(sortedRoutes, viewIndex);

  const configTpl = readFileSync(resolve(__dirname, './templates/vite-config.art'), 'utf-8');

  createFlattenRoutesFile(suppleRoutes, VITE_REACT_VIEW_CONFIG_FILE, configTpl);

  return suppleRoutes;
}

/**
 * @name 对含有子页面的入口文件增加index
 */
function suppleGroupRouteIndex(routes: FlattenRouteItem[], entryName: string) {
  return routes.reduce((res: FlattenRouteItem[], route, index) => {
    res.push(route);

    if (
      route.component.indexOf(entryName) > -1 &&
      routes.slice(index + 1).some(r => r.name.indexOf(`${route.name}-`) > -1)
    ) {
      res.push({
        ...route,
        name: `${route.name}-index`,
        exact: true
      });
    }

    return res;
  }, []);
}

function formatResult(scanningResult: string[], viewIndex: string, ext: string) {
  return scanningResult.reduce((routes: FlattenRouteItem[], path) => {
    const pathArr = path.split('/').map(p => p.toLocaleLowerCase());

    const fileName = pathArr.pop()!.replace(`.${ext}`, '');

    if (!(fileName === viewIndex)) {
      pathArr.push(fileName);
    }

    let info: FlattenRouteItem = {
      name: `${pathArr.join('-')}`,
      path: `/${pathArr.join('/')}`,
      component: path.replace(`.${ext}`, '')
    };

    routes.push(info);

    return routes;
  }, []);
}
