import type { CustomerRouteConfig } from '../../../src';
export const fileRoutes: CustomerRouteConfig[] =
  /* vite routes begin */
[
  {
    name: 'contact',
    path: '/contact',
    routes: [
      {
        name: 'contact-index',
        path: '/contact',
        exact: true
      },
      {
        name: 'contact-xixi',
        path: '/contact/xixi'
      }
    ]
  },
  {
    name: 'haha',
    path: '/haha'
  },
  {
    name: 'todo',
    path: '/todo'
  }
]
/* vite routes end */
