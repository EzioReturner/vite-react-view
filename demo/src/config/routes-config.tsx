import type { VrpRouteConfig } from '@/router';
import { InfoCircleOutlined } from '@ant-design/icons';

export const constantRouteConfig: { app: VrpRouteConfig } = {
  app: {
    name: 'app',
    path: '/',
    component: () => import('@/layout/Main'),
    meta: {
      authority: ['admin', 'guest']
    },
    routes: [
      {
        name: 'redirect-dashboard',
        path: '/',
        exact: true,
        redirect: '/dashboard',
        meta: {
          hideMenu: true
        }
      }
    ]
  }
};

export const fileRoutes: VrpRouteConfig[] =
  /* vite routes begin */
  [
    {
      name: 'psauth-identifypsuser',
      path: '/psauth/identifypsuser',
      order: -1
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      routes: [
        {
          name: 'dashboard-index',
          path: '/dashboard',
          exact: true
        },
        {
          name: 'dashboard-com',
          path: '/dashboard/com',
          routes: [
            {
              name: 'dashboard-com-index',
              path: '/dashboard/com',
              exact: true
            },
            {
              name: 'dashboard-com-jojo',
              path: '/dashboard/com/jojo'
            }
          ]
        },
        {
          name: 'dashboard-page1',
          path: '/dashboard/page1'
        },
        {
          name: 'dashboard-page2',
          path: '/dashboard/page2'
        }
      ]
    },
    {
      name: 'demo',
      path: '/demo',
      routes: [
        {
          name: 'demo-index',
          path: '/demo',
          exact: true
        },
        {
          name: 'demo-haha',
          path: '/demo/haha'
        }
      ]
    },
    {
      name: 'detail',
      path: '/detail',
      routes: [
        {
          name: 'detail-index',
          path: '/detail',
          exact: true
        },
        {
          name: 'detail-subinof',
          path: '/detail/subinof'
        }
      ]
    },
    {
      name: 'psauth-bus-subway',
      path: '/psauth/bus/subway'
    },
    {
      name: 'psauth-page',
      path: '/psauth/page'
    },
    {
      name: 'exception',
      path: '/exception',
      order: Infinity,
      meta: {
        icon: <InfoCircleOutlined />
      },
      routes: [
        {
          name: 'exception-index',
          path: '/exception',
          exact: true,
          meta: {
            hideMenu: true
          }
        },
        {
          name: 'exception-403',
          path: '/exception/403'
        },
        {
          name: 'exception-404',
          path: '/exception/404'
        },
        {
          name: 'exception-500',
          path: '/exception/500'
        }
      ]
    }
  ];
/* vite routes end */
