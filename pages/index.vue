<template>
</template>

<script lang="ts">
  import { Vue, Component } from 'nuxt-property-decorator';

  @Component({})
  export default class App extends Vue {
    fetch({ store, redirect }) {
      if (store.state.User.isAuth) redirect('/console');
      redirect('/auth');
    }
  }
</script>
