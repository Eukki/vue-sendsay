import Vue from 'vue';
import API from '@/scripts/api';
import Utils from '@/scripts/Utils';

// ------------------------------ //
// ------------ State ----------- //
// ------------------------------ //
export const state = () => {
  const defaultState = {
    User: {
      isAuth: false,
      login: '',
      sublogin: ''
    },
    History: {
      items: []
    },
    Config: {
      textareaWidth: '50%'
    }
  }

  return defaultState;
}

// --------------------------------- //
// ------------ Actions ------------ //
// --------------------------------- //
export const actions = {
  // USER
  async LOGIN({ dispatch }, { login, sublogin, password }) {
    const response = await API.login({ login, sublogin, passwd: password });
    if (response.success) {
      API.setSession(response.session);
      dispatch('EDIT_USER', { login, sublogin, isAuth: true });
    }

    return response;
  },

  async LOGOUT({ dispatch }) {
    const response = await API.logout();
    if (response.success) dispatch('FLUSH_STORE');
    return response;
  },

  EDIT_USER({ commit }, update: Object) {
    for (const key in update) {
      commit('SET', { root: 'User', key, value: update[key] });
    }
  },

  // HISTORY
  async SEND_REQUEST({ dispatch }, request) {
    const response = await API.request(JSON.parse(request));
    const success = Object.assign({}, response).success;
    delete response.success;

    dispatch('UPDATE_HISTORY', {
      request,
      success,
      response: JSON.stringify(response, null, 2),
      action: (response || {}).action || ((response || {}).request || {}).action || request.action || 'undefined'
    });

    return { response, success };
  },

  UPDATE_HISTORY({ state, commit }, requestData) {
    const history = state.History.items.slice();
    const findedInHistoryIndex = history.findIndex((h) => h.action === requestData.action);
    if (findedInHistoryIndex >= 0) {
      const historyItem = {
        ...history[findedInHistoryIndex],
        ...requestData,
        date: Date.now()
      };
      history[findedInHistoryIndex] = historyItem;
    } else {
      const historyItem = {
        ...requestData,
        id: Utils.String.hash(6),
        date: Date.now()
      };
      history.push(historyItem);
    }

    commit('SET', { root: 'History', key: 'items', value: history });
  },

  DELETE_FROM_HISTORY({ state, commit }, { id }) {
    const history = state.History.items.slice();
    const index = Utils.Array.find(history, id);
    history.splice(index, 1);
    commit('SET', { root: 'History', key: 'items', value: history });
  },

  CLEAR_HISTORY({ dispatch }) {
    dispatch('EDIT_HISTORY', { items: [] });
  },

  EDIT_HISTORY({ commit }, update: Object) {
    for (const key in update) {
      commit('SET', { root: 'History', key, value: update[key] });
    }
  },

  // CONFIG
  UPDATE_TEXTAREA_WIDTH({ commit }, value) {
    commit('SET', { root: 'Config', key: 'textareaWidth', value });
  },

  EDIT_CONFIG({ commit }, update: Object) {
    for (const key in update) {
      commit('SET', { root: 'Config', key, value: update[key] });
    }
  },

  // SYSTEM
  FLUSH_STORE({ dispatch }) {
    dispatch('EDIT_USER', { login: '', sublogin: '', isAuth: false });
    dispatch('EDIT_HISTORY', { items: [] });
    dispatch('EDIT_CONFIG', { textareaWidth: '50%' });
  },

  async CHECK_SESSION() {
    return await API.pong();
  }
}

// ----------------------------------- //
// ------------ Mutations ------------ //
// ----------------------------------- //
export const mutations = {
  SET: (state, { root, key, value }) => {
    Vue.set(state[root], key, value);
  }
}
