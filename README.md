<h1 align="center">vite-react-view</h1>

## vite-react-view 是什么

vite-react-view 是一款基于 `node` 文件系统的契合 `vite` 生态的约定式路由插件。

## vite-react-view 做了什么

通过文件系统监听指定路径下的视图文件变化并实时生成对应的路由文件，提供便捷的 `hooks` 供用户在逻辑代码中读取路由文件信息。

> 说人话就是：你只管写界面，插件帮你搞定路由

## vite-react-view 约定了什么

- `src/config/routes-config.tsx`(默认) 文件，为插件生成的约定路由表。

- `routes-config.tsx` 文件将默认引入 ts 类型 与导出 `fileRoutes` 路由对象。

- 你将会看到一对固定锚点 `/* vite routes begin */` `/* vite routes end */`，被锚点包裹的对象将会在每次 vite 生命周期中被刷新覆盖，如有个性化字段需求请放置于 `meta` 字段中。

- `src/views`(默认)，路径下文件为视图层文件，所有非 `ignore`(默认为 ['/component?(s)', '/util?(s)', '/test?(s)']) 文件夹下 `.(j|t)sx` 文件将被创建为路由，例如：

存在此项目结构

```bash
├── src                     // 项目目录
│    └── views              // 视图层目录
│          └── Dashboard
│                  ├── index.tsx
│                  ├── Main.tsx
│                  └── Child
│                        ├── index.tsx
│                        └── SubChild.tsx
```

则 vite-react-view 将会生成如下内容

```typescript
export const fileRoutes: VrpRouteConfig[] =
  /* vite routes begin */
  [
    {
      name: 'dashboard',
      path: '/dashboard',
      order: -1,
      routes: [
        {
          name: 'dashboard-index',
          path: '/dashboard',
          exact: true
        },
        {
          name: 'dashboard-main',
          path: '/dashboard/com',
          // 个性化字段
          meta: {
            auth: ['admin']
          }
        },
        {
          name: 'dashboard-child',
          path: '/dashboard/child',
          routes: [
            {
              name: 'dashboard-child-index',
              path: '/dashboard/child',
              exact: true
            },
            {
              name: 'dashboard-child-subChild',
              path: '/dashboard/child/subChild'
            }
          ]
        }
      ]
    }
  ];
/* vite routes end */
```

> 注 `order` 字段用于手动对路由结构进行排序，手动修改不会被覆盖。

## 快速上手

1. 安装插件包

```bash
cd your-project
yarn add vite-react-view --dev
```

2. 在 `vite.config.ts` 中启用插件

```typescript
import viteReactView from 'vite-react-view';

export default defineConfig({
  plugins: [
    // ...yourPlugins
    viteReactView({
      // 入口文件夹，默认为 ['/src']
      entryDir: ['/src', '/client']
      // 视图层文件夹，默认为 '/views'
      viewDir: '/views'
    })
  ]
});
```

3. 在项目中使用

```typescript
import useLiteRouter from 'virtual:vite-react-view';

const viteRouter = useLiteRouter(routeConfig);
```

> 启动后将在 `entryDir` 路径下自动生成 `config/routes-config.tsx` 文件以及 `.vite/react-view/config.ts` 文件。

## FAQ
