import {
  createRouter, createWebHashHistory, RouteRecordRaw,
} from 'vue-router';
import BasicLayout from '../components/basiclayout.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: BasicLayout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          title: '主页',
          keepAlive: true,
          pinned: true,
          customRefresh: true,
        },
        component: () => import('@/pages/views/index/index.vue'),
      },
      {
        path: '/iframe-page',
        name: 'IframePage',
        meta: {
          title: 'Iframe页面',
          keepAlive: true,
          pageType: 'iframe',
          customRefresh: true,
        },
        component: () => import('@/pages/views/iframePage/index.vue'),
      },
      // #endregion
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
