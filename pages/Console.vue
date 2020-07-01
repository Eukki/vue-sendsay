<template>
  <div class="console-page">
    <fullscreen
      ref="fullscreen"
      background="#fff"
      @change="fullscreenChange"
    >
      <v-app>
        <ConsoleHeader
          :is-fullscreen="isFullscreen"
          @toggleFullscreen="toggleFullscreen"
        />

        <div class="border"/>

        <ConsoleRequestHistory
          @copy="copy"
          @copyOnBuffer="copyOnBuffer"
          @copyAndSend="copyAndSend"
          @remove="remove"
        />

        <div class="border"/>

        <div class="console-page__textarea">
          <multipane
            class="custom-resizer"
            layout="vertical"
            @paneResizeStop="onTextareaWidthChanged"
          >
            <ConsoleTextarea
              title="Запрос:"
              :body="request"
              :is-error="isError"
              :width="textareaWidth"
              @checkValid="checkValid"
              @onInputRequest="onInputRequest"
            />

            <multipane-resizer>
              <DotsImg/>
            </multipane-resizer>

            <ConsoleTextarea
              title="Ответ:"
              style="flex-grow: 1;"
              readonly
              :body="response"
              :is-error="isError"
            />
          </multipane>
        </div>

        <div class="border"/>

        <ConsoleFooter
          :is-loading="isLoading"
          :is-disabled="isError"
          @send="send()"
          @format="format"
        />
      </v-app>
    </fullscreen>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Action, State } from 'nuxt-property-decorator';

  import { Multipane, MultipaneResizer } from 'vue-multipane';

  import ConsoleHeader from '@/components/pages/ConsoleHeader.vue';
  import ConsoleRequestHistory from '@/components/pages/ConsoleRequestHistory.vue';
  import ConsoleTextarea from '@/components/pages/ConsoleTextarea.vue';
  import ConsoleFooter from '@/components/pages/ConsoleFooter.vue';

  import DotsImg from '@/assets/images/icons/dots.svg';

  @Component({
    components: {
      ConsoleHeader,
      ConsoleRequestHistory,
      ConsoleTextarea,
      ConsoleFooter,
      DotsImg,
      Multipane,
      MultipaneResizer
    }
  })
  export default class ConsolePage extends Vue {
    @State(state => (state as any).History.items) historyItems;
    @State(state => (state as any).Config.textareaWidth) textareaWidth;
    @Action('SEND_REQUEST') sendRequest;
    @Action('DELETE_FROM_HISTORY') deleteFromHistory;
    @Action('UPDATE_TEXTAREA_WIDTH') updateTextareaWidth;

    isFullscreen = false;
    isLoading = false;
    isError = false;

    request = '';
    response = '';

    fetch({ store, redirect }) {
      if (!store.state.User.isAuth) redirect('/auth');
    }

    fullscreenChange(fullscreen) {
      this.isFullscreen = fullscreen;
    }

    toggleFullscreen() {
      (this.$refs['fullscreen'] as any).toggle();
    }

    copy(id, withError = true) {
      const item = this.historyItems.find((h) => h.id === id);
      this.request = item.request;
      this.response = item.response;
      this.format();
      if (withError) this.isError = !item.success;
    }

    copyOnBuffer(id) {
      const item = this.historyItems.find((h) => h.id === id);
      (this as any).$copyText(item.request);
    }

    async send() {
      if (!this.isError) {
        this.isLoading = true;
        const response = await this.sendRequest(this.request);
        if (!response.success) this.isError = true;
        this.response = JSON.stringify(response, null, 2);
        this.isLoading = false;
      }
    }

    copyAndSend(id) {
      this.isError = false;
      this.copy(id, false);
      this.send();
    }

    remove(id) {
      this.deleteFromHistory({ id });
    }

    onInputRequest(value) {
      this.isError = false;
      this.request = value;
      this.response = '';
    }

    onTextareaWidthChanged(pane, container, size) {
      this.updateTextareaWidth(size);
    }

    checkValid() {
      try {
        if (this.request) JSON.parse(this.request);
        return true;
      } catch {
        this.isError = true;
        return false;
      }
    }

    format() {
      if (!this.checkValid()) return;
      if (this.request) this.request = JSON.stringify(JSON.parse(this.request),null, 2);
      if (this.response) this.response = JSON.stringify(JSON.parse(this.response),null, 2);
    }
  }
</script>
