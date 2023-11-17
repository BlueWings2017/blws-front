<template>
  <v-row ref="contents" style="height: 100%">
    <v-col :cols="3" :style="{ height: '100%' }">
      <ProcessList v-if="gridShow"/>
    </v-col>
    <v-col :cols="9">
      <EventList v-if="gridShow" />
    </v-col>
  </v-row>
</template>

<script>

import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import ProcessList from './ProcessList';
import EventList from './EventList';

export default {
  name: "ProcessTab",
  mixins: [],
  components: {
    Card,
    CardBody, 
    CardTitle,
    ProcessList,
    EventList
  },
  props:{
    propData: {
      type: Object,
      require: false,
    },
  },
  data() {
    return {
      gridShow: true
    };
  },
  created() {
    // this.$nuxt.$on('changTab', () => {
    //   this.gridShow = false;
    //   this.$nextTick(() => {
    //     this.gridShow = true;
    //   })
    // });
  },
  async mounted() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style>
</style>