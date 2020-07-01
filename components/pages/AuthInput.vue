<template>
  <div
    class="auth-input"
    :class="{ '_error': status === InputStatus.ERROR }"
  >
    <div class="auth-input__text">
      <label class="auth-input__text-label">
        {{ label }}
      </label>

      <div class="auth-input__text-subtext">
        {{ subtext }}
      </div>
    </div>

    <input
      class="auth-input__input"
      maxlength="40"
      :value="model"
      :type="type"
      :required="required"
      @input="onChange"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Model } from 'nuxt-property-decorator';

  import { InputStatus } from '@/scripts/Types';

  @Component({})
  export default class AuthInputComponent extends Vue {
    @Model('input') model;

    @Prop(String) type;
    @Prop(String) label;
    @Prop(String) status;
    @Prop(String) subtext;
    @Prop({ type: Boolean, default: false }) required;

    InputStatus = InputStatus;

    onChange(e) {
      this.$emit('input', e.target.value);
    }

    auth() {
      console.log('auth');
    }
  }
</script>
