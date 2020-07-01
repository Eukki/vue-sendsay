<template>
  <div
    class="console-textarea"
    :style="styles"
    :class="{
      '_error': isError
    }"
  >
    <div class="console-textarea__title">{{ title }}</div>
    <textarea
      class="console-textarea__textarea"
      :value="body"
      :readonly="readonly"
      @input="onInput"
      @blur="$emit('checkValid')"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'nuxt-property-decorator';

  @Component({})
  export default class ConsoleTextareaComponent extends Vue {
    @Prop(String) body;
    @Prop(String) width;
    @Prop(String) title;
    @Prop(Boolean) isError;
    @Prop({ type: Boolean, default: false }) readonly;

    get styles() {
      return this.width ? `width: ${this.width};` : '';
    }

    onInput(e) {
      this.$emit('onInputRequest', e.target.value);
    }
  }
</script>

