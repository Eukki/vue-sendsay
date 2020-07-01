<template>
  <div class="console-header">
    <div class="console-header__logo">
      <LogoImg/>
      <h2 class="console-header__logo-title">API-консолька</h2>
    </div>

    <div class="console-header__setting">
      <div class="console-header__setting-info">
        {{ login }}
        <span v-if="sublogin">&nbsp;:&nbsp;</span>
        {{ sublogin }}
      </div>

      <button
        class="button"
        @click="signout"
      >
        <span>Выйти</span>
        <LogoutImg/>
      </button>

      <button
        class="button"
        @click="$emit('toggleFullscreen')"
      >
        <EnterFullscreenImg v-if="!isFullscreen"/>
        <ExitFullscreenImg v-else/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, State, Action, Prop } from 'nuxt-property-decorator';

  import LogoImg from '@/assets/images/logo.svg';
  import LogoutImg from '@/assets/images/icons/log-out.svg';
  import ExitFullscreenImg from '@/assets/images/icons/exit-full-screen.svg';
  import EnterFullscreenImg from '@/assets/images/icons/enter-full-screen.svg';

  @Component({
    components: { LogoImg, LogoutImg, EnterFullscreenImg, ExitFullscreenImg }
  })
  export default class ConsoleHeaderComponent extends Vue {
    @Prop(Boolean) isFullscreen;

    @State(state => (state as any).User.login) login;
    @State(state => (state as any).User.sublogin) sublogin;
    @Action('LOGOUT') logout;

    async signout() {
      const response = await this.logout();
      if (response.success) {
        (this as any).$router.push('/auth');
      }
    }
  }
</script>

