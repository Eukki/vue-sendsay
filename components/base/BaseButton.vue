<template>
  <div
    class="base-button"
    :class="{
      '_disabled': isDisabled,
      '_loading': isLoading
    }"
    @click="!isDisabled && !isLoading && $emit('click')"
  >
    <span v-if="!isLoading">{{ text }}</span>

    <LoaderImg
      v-else
      class="base-button__loader"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'nuxt-property-decorator';

  import LoaderImg from '@/assets/images/icons/button-loader.svg';

  @Component({
    components: { LoaderImg }
  })
  export default class BaseButtonComponent extends Vue {
    @Prop(String) text;
    @Prop({ type: Boolean, default: false }) isLoading;
    @Prop({ type: Boolean, default: false }) isDisabled;
  }
</script>

