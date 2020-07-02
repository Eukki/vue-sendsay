<template>
  <v-dialog
    max-width="350"
    :value="isOpen"
    @input="$emit('closeModal')"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        {{ text }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <BaseButton
          v-for="(button, index) in buttons"
          style="margin: 0.5rem"
          :key="index"
          :text="button.text"
          @click="$emit(button.emit)"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop, PropSync } from 'nuxt-property-decorator';

  import BaseButton from '@/components/base/BaseButton.vue';

  @Component({
    components: { BaseButton }
  })
  export default class BaseModalComponent extends Vue {
    @Prop(String) text;
    @Prop(String) title;
    @Prop(Boolean) isOpen;
    @Prop({ type: Array, default: () => [] }) buttons;
  }
</script>

