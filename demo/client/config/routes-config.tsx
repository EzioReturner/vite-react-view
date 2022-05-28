import type { CustomerRouteConfig } from "@lite/react-view";
export const fileRoutes:CustomerRouteConfig[] = 
/* lite routes begin */
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
/* lite routes end */