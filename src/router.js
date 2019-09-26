import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';

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
      path: '/about',
      meta: { isInMenu: true, title: 'about', disabled: true },
      // component: () => import(/* webpackChunkName: "about" */ '@/views/About'),
    },
    {
      path: '/form',
      meta: { isInMenu: true, title: 'form', toolbar: 'white' },
      component: () => import(/* webpackChunkName: "form" */ '@/views/Form'),
    },
    {
      path: '/texture',
      meta: { isInMenu: true, title: 'texture', disabled: true },
      // component: () =>
      //   import(/* webpackChunkName: "texture" */ '@/views/Texture'),
    },
    {
      path: '/material',
      meta: { isInMenu: true, title: 'material', disabled: true },
      // component: () =>
      //   import(/* webpackChunkName: "material" */ '@/views/Material'),
    },
    {
      path: '/site',
      meta: { isInMenu: true, title: 'site', disabled: true },
      // component: () => import(/* webpackChunkName: "site" */ '@/views/Site'),
    },
    {
      path: '/scale',
      meta: { isInMenu: true, title: 'scale', disabled: true },
      // component: () => import(/* webpackChunkName: "scale" */ '@/views/Scale'),
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "not-found" */ '@/views/NotFound'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { meta } = to;
  if (meta.disabled) {
    next(false);
  } else {
    next();
  }
});

router.afterEach(() => {
  store.dispatch('closeMenu');
});

export default router;
