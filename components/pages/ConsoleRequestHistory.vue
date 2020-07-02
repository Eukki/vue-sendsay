<template>
  <div class="console-history">
    <transition-group
      name="list-complete"
      class="console-history__items"
      tag="div"
    >
      <div
        v-for="item in filteredItems"
        class="console-history__items-item list-complete-item"
        :key="item.id"
        @click="onEmit('copy', item.id)"
      >
        <transition
          name="custom-classes-transition"
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
        >
          <div
            v-if="showCopiedById.find((showId) => showId === item.id)"
            class="console-history__items-item-copy"
          >
            Скопировано
          </div>
        </transition>

        <div
          class="console-history__items-item-status"
          :class="`${item.success ? '_success' : '_error'}`"
        />

        <span class="console-history__items-item-text">{{ item.action.split(' ').join('&nbsp;') }}</span>

        <v-menu
          offset-y
          content-class="console-history__items-item-menu"
        >
          <template v-slot:activator="{ on }">
            <div
              v-on="on"
              class="console-history__items-item-dots"
            >
              <DotsImg/>
            </div>
          </template>
          <v-list class="console-history__items-item-menu-list">
            <v-list-item
              v-for="(menuItem, index) in menu"
              class="console-history__items-item-menu-list-item"
              :class="menuItem.hoverColorClass"
              :key="index"
              @click="onEmit(menuItem.emit, item.id)"
            >
              <div
                v-if="menuItem.topBorder"
                class="border"
              />
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </transition-group>

    <div class="console-history__cancel">
      <CancelImg/>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator';

  import DotsImg from '@/assets/images/icons/dots.svg';
  import CancelImg from '@/assets/images/icons/cancel.svg';

  @Component({
    components: { DotsImg, CancelImg }
  })
  export default class ConsoleRequestHistoryComponent extends Vue {
    @State(state => (state as any).History.items) items;

    showCopiedById = [];

    menu = [
      { title: 'Выполнить', emit: 'copyAndSend' },
      { title: 'Скопировать', emit: 'copyOnBuffer' },
      { title: 'Удалить', topBorder: true, hoverColorClass: '_red', emit: 'remove' }
    ];

    get filteredItems() {
      if (!this.items) return [];
      return this.items
        .slice()
        .reverse()
        .sort((a, b) => b.date - a.date)
        .filter((item, index) => index < 20);
    }

    onEmit(emit, id) {
      this.$emit(emit, id);

      if (emit === 'copyOnBuffer') {
        this.showCopiedById.push(id);
        setTimeout(() => {
          const index = this.showCopiedById.findIndex((showId) => showId === id);
          this.showCopiedById.splice(index, 1);
        }, 3000);
      }
    }
  }
</script>

