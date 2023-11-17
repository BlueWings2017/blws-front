<template>
  <div>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>AutoComplete</p>
            <autocomplete :style="{ width: '230px' }" :data-items='sports' :placeholder="'Your favorite sport'" ></autocomplete>

          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>ComboBox</p>
             <combobox
              :style="{ width: '230px' }" :data-items='sports' :default-value="'Basketball'" ></combobox>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>DropDownList</p>
             <dropdownlist
              :style="{ width: '230px' }" :data-items='sports' :default-value="'Basketball'" ></dropdownlist>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>MultiSelect</p>
            <multiselect :style="{ width: '230px' }" :data-items='sports' :default-value="['Basketball']" ></multiselect>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
</template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import { AutoComplete, ComboBox, DropDownList, MultiSelect } from '@progress/kendo-vue-dropdowns';
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
        'autocomplete': AutoComplete,
        'combobox': ComboBox,
        'dropdownlist': DropDownList,
        'multiselect': MultiSelect,
        CardBody, 
        CardTitle, 
        CardActions,
        "kcard" : Card,
    },
    data() {
      return {
        sports: ["Baseball", "Basketball", "Cricket", "Field Hockey", "Football", "Table Tennis", "Tennis", "Volleyball" ],
      };
    },
    computed: {
    },
    watch: {
    },
    beforeCreate() {
    },
    methods: {
    }
  };
  
  const defaultData = {
  };
  </script>
  <style lang="scss">
  
  </style>