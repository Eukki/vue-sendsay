<template>
  <div class="console-footer">
    <BaseButton
      text="Отправить"
      :is-loading="isLoading"
      :is-disabled="isDisabled"
      @onClick="$emit('send')"
    />

    <a
      href="https://github.com/Eukki"
      class="link-to-github"
    >
      @eukki
    </a>

    <button
      class="button"
      @click="$emit('format')"
    >
      <LinesImg/>
      <span>Форматировать</span>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'nuxt-property-decorator';

  import BaseButton from '@/components/base/BaseButton.vue';
  import LinesImg from '@/assets/images/icons/lines.svg';

  @Component({
    components: { BaseButton, LinesImg }
  })
  export default class ConsoleFooterComponent extends Vue {
    @Prop(Boolean) isLoading;
    @Prop(Boolean) isDisabled;
  }
</script>

