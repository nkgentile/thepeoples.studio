import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "not-found" */ '@/views/NotFound'),
    },
  ],
});

export default router;
