<template>
</template>

<script lang="ts">
  import { Vue, Component } from 'nuxt-property-decorator';
  import Utils from '@/scripts/Utils';

  @Component({})
  export default class App extends Vue {
    fetch({ store, redirect }) {
      if (store.state.User.isAuth && Utils.Document.getCookie('vue-sendsay-session')) {
        redirect('/console');
      }
      redirect('/auth');
    }
  }
</script>
