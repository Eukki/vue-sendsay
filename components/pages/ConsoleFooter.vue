<template>
  <div
    class="base-button"
    :class="{
      '_disabled': isDisabled,
      '_loading': isLoading
    }"
    @click="!isDisabled && !isLoading && $emit('onClick')"
  >
    <span v-if="!isLoading">{{ text }}</span>

    <img
      v-else
      class="base-button__loader"
      src="@/assets/images/icons/button-loader.svg"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'nuxt-property-decorator';

  @Component({})
  export default class BaseButtonComponent extends Vue {
    @Prop(String) text;
    @Prop({ type: Boolean, default: false }) isLoading;
    @Prop({ type: Boolean, default: false }) isDisabled;
  }
</script>

