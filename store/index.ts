import Vue from 'vue';

// ------------------------------ //
// ------------ State ----------- //
// ------------------------------ //
export const state = () => {
  const s = {
    items: {
      /* [id: number]: Item */
    },
    users: {
      /* [id: string]: User */
    },
    feeds: {
      /* [page: number] : [ [id: number] ] */
    }
  }

  return s;
}

// --------------------------------- //
// ------------ Actions ------------ //
// --------------------------------- //
export const mutations = {
  SET_FEED: (state, { feed, ids, page }) => {
    Vue.set(state.feeds[feed], page, ids)
  },
  SET_ITEM: (state, { item }) => {
    if (item) {
      Vue.set(state.items, item.id, item)
    }
  },
  SET_ITEMS: (state, { items }) => {
    items.forEach((item) => {
      if (item) {
        Vue.set(state.items, item.id, item)
      }
    })
  },
  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  }
}

// --------------------------------- //
// ------------ Actions ------------ //
// --------------------------------- //
export const actions = {

}
