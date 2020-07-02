<template>
  <div class="auth-page">
    <LogoImg class="auth-page__logo"/>

    <v-form class="auth-page__form">
      <h2 class="auth-page__form-header">API-консолька</h2>

      <div
        v-if="loginStatus === LoginStatus.ERROR"
        class="auth-page__form-error"
      >
        <SadFaceImg class="auth-page__form-error-image"/>
        <div class="auth-page__form-error-text">
          <span class="auth-page__form-error-text-title">Вход не вышел</span>
          <span class="auth-page__form-error-text-message">{{ errorMessage }}</span>
        </div>
      </div>

      <template v-for="input in inputs">
        <AuthInput
          v-model="input.value"
          :key="input.label"
          :type="input.type"
          :label="input.label"
          :status.sync="input.status"
          :subtext="input.subtext || ''"
          :required="input.required"
          :is-valid="input.isValid"
        />
      </template>

      <div class="auth-page__form-button">
        <BaseButton
          text="Войти"
          :is-loading="loginStatus === LoginStatus.SENT"
          :is-disabled="!isValid"
          @click="auth"
        />
      </div>
    </v-form>

    <div class="auth-page__github">
      <a
        href="https://github.com/Eukki"
        class="link-to-github"
      >
        @eukki
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import { Action, Component, State, Vue } from 'nuxt-property-decorator';

  import AuthInput from '@/components/pages/AuthInput.vue';
  import BaseButton from '@/components/base/BaseButton.vue';

  import LogoImg from '@/assets/images/logo.svg';
  import SadFaceImg from '@/assets/images/icons/sad-face.svg';

  import { InputStatus, LoginStatus } from '@/scripts/Types';
  import Utils from "../scripts/Utils";

  @Component({
    components: { AuthInput, BaseButton, SadFaceImg, LogoImg }
  })
  export default class AuthPage extends Vue {
    @State(state => (state as any).User.isAuth) isAuth;
    @Action('LOGIN') login;

    LoginStatus = LoginStatus;

    loginStatus = LoginStatus.WRITING;
    errorMessage = '';

    inputs = {
      login: {
        value: '',
        label: 'Логин',
        status: InputStatus.WRITING,
        required: true,
        type: 'text',
        isValid: (value) => {
          const login = /^[a-zA-Z0-9_]+$/;
          return value && (login.test(value) || Utils.Const.EMAIL.test(value));
        }
      },
      sublogin: {
        value: '',
        label: 'Сублогин',
        status: InputStatus.WRITING,
        required: false,
        type: 'text',
        subtext: 'Опционально',
        isValid: () => true
      },
      password: {
        value: '',
        label: 'Пароль',
        status: InputStatus.WRITING,
        required: true,
        type: 'password',
        isValid: (value) => {
          const cyrillic = /[а-яё]/i;
          return value && !cyrillic.test(value);
        }
      }
    };

    get isValid() {
      const { login, password } = this.inputs;
      return login.isValid(login.value) && password.isValid(password.value);
    }

    fetch({ store, redirect }) {
      if (store.state.User.isAuth && Utils.Document.getCookie('vue-sendsay-session')) {
        redirect('/console');
      }
    }

    async auth() {
      this.loginStatus = LoginStatus.SENT;
      const response = await this.login({
        login: this.inputs.login.value,
        sublogin: this.inputs.sublogin.value,
        password: this.inputs.password.value
      });

      if (response.success) {
        this.loginStatus = LoginStatus.SUCCESS;
        (this as any).$router.push('/console');
      }
      else {
        this.loginStatus = LoginStatus.ERROR;
        this.errorMessage = JSON.stringify(response);
      }
    }
  }
</script>
