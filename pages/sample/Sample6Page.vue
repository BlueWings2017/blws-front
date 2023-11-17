<template>
    <div>
      <v-row>
        <v-col :cols="12">
          <kcard>
            <cardBody>
              <button
                class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                @click="onToggle('success')"
              >
                {{ (success ? 'Hide ' : 'Show ') + 'Success' }}
              </button>
              &nbsp;
              <button
                class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                @click="onToggle('error')"
              >
                {{ (error ? 'Hide ' : 'Show ') + 'Error' }}
              </button>
              &nbsp;
              <button
                class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                @click="onToggle('warning')"
              >
                {{ (warning ? 'Hide ' : 'Show ') + 'Warning' }}
              </button>
              &nbsp;
              <button
                class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                @click="onToggle('info')"
              >
                {{ (info ? 'Hide ' : 'Show ') + 'Info' }}
              </button>
              &nbsp;
              <button
                class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                @click="onToggle('none')"
              >
                {{ (none ? 'Hide ' : 'Show ') + 'Unstyled' }}
              </button>
            </cardBody>
          </kcard>
        </v-col>
      </v-row> 
      <NotificationGroup
        :style="{
          right: 0,
          bottom: 0,
          alignItems: 'flex-start',
          flexWrap: 'wrap-reverse',
        }"
      >
      <Fade :appear="success">
        <Notification
          v-if="success"
          :type="{
            style: 'success',
            icon: true,
          }"
          :closable="true"
          @close="onClose('success')"
        >
          <span>저장되었습니다.</span>
        </Notification>
      </Fade>
      <Fade :appear="error">
        <Notification
          v-if="error"
          :type="{
            style: 'error',
            icon: true,
          }"
          :closable="true"
          @close="onClose('error')"
        >
          <span>에러가 발생했습니다.</span>
        </Notification>
      </Fade>
      <Fade :appear="warning">
        <Notification
          v-if="warning"
          :type="{
            style: 'warning',
            icon: true,
          }"
          :closable="true"
          @close="onClose('warning')"
        >
          <span>지난 일정이 2개 있습니다.</span>
        </Notification>
      </Fade>
      <Fade :appear="info">
        <Notification
          v-if="info"
          :type="{
            style: 'info',
            icon: true,
          }"
          :closable="true"
          @close="onClose('info')"
        >
          <span>1개의 새로운 메시지가 있습니다.</span>
        </Notification>
      </Fade>
      <Fade :appear="none">
        <Notification
          v-if="none"
          :type="{
            style: 'none',
            icon: false,
          }"
          :closable="true"
          @close="onClose('none')"
          :style="{
            overflow: 'visible',
          }"
        >
          <span>Welcome Framework.</span>
        </Notification>
      </Fade>
    </NotificationGroup>
  </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import { Fade } from '@progress/kendo-vue-animation';
  import {
    Notification,
    NotificationGroup,
  } from '@progress/kendo-vue-notification';
  import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";

  let myTitle;
  let myMenuId;
  export default {
    mixins: [mixinGlobal],
    async asyncData(context) {
      const myState = context.store.state;
      myMenuId = context.route.query.menuId;
      await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
      myTitle = await myState.activeMenuInfo.menuNm;
    },
    meta: {
      title: () => {
        return myTitle;
      },
      menuId: myMenuId,
      closable: true
    },
    components: {
      Fade,
      Notification,
      NotificationGroup,
      CardBody, 
      CardTitle, 
      CardActions,
      "kcard" : Card,
    },
    data() {
      return {
        success: false,
        error: false,
        warning: false,
        info: false,
        none: false,
      };
    },
    computed: {
    },
    watch: {
    },
    beforeCreate() {
    },
    methods: {
      onToggle(flag) {
      this[flag] = !this[flag];
    },
    onClose(flag) {
      this[flag] = false;
    },
    }
  };
  
  </script>
  <style lang="scss">
  .k-notification-container {
    margin: 6px;
  }
  </style>