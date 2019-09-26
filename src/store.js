import Vue from 'vue';
import Vuex from 'vuex';

import { randomInt } from 'd3-random';
import { map, constructN, pipe } from 'ramda';

Vue.use(Vuex);

import forms from '@/assets/json/forms.json';
const createRandomFormIndex = randomInt(0, forms.length);

export default new Vuex.Store({
  state: {
    menu: 'closed',
    forms: pipe(
      map(({ id, ...form }) => [id, form]),
      constructN(1, Map)
    )(forms),
    form: forms[createRandomFormIndex()].id,
    color: 0xb4ddc0,
  },
  getters: {
    isMenuOpen: ({ menu }) => menu === 'open',
  },
  mutations: {
    setMenuState(state, payload) {
      state.menu = payload.state;
    },
    setForm(state, payload) {
      state.form = payload.id;
    },
  },
  actions: {
    toggleMenu({ state, dispatch }) {
      switch (state.menu) {
        case 'open':
          dispatch('closeMenu');
          break;
        case 'closed':
          dispatch('openMenu');
          break;
        default:
          break;
      }
    },
    openMenu({ commit }) {
      commit('setMenuState', { state: 'open' });
    },
    closeMenu({ commit }) {
      commit('setMenuState', { state: 'closed' });
    },
  },
});
