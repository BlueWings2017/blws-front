<template>
  <div>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Weather
            :wetherData="wetherInfo">
            </Weather>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Weather
            :wetherData="wetherInfo2">
            </Weather>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Weather
            :wetherData="wetherInfo3">
            </Weather>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
</div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import Weather from "@/components/common/Weather.vue"
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
    "kbutton": Button,
    "kcard" : Card,
    CardBody, CardTitle, CardActions,
    Weather
  },
  data() {
    return {
      wetherInfo : {"coord": {"lon":126.9778,"lat":37.5683},
                    "weather":[{"id":803,"main":"Mist","description":"broken clouds","icon":"01d"}],
                    "base":"stations","main":{"temp":288.45,"feels_like":287.52,"temp_min":286.84,"temp_max":288.93,"pressure":1021,"humidity":57},
                    "visibility":10000,
                    "wind":{"speed":3.6,"deg":340},
                    "clouds":{"all":75},
                    "dt":1669010066,
                    "sys":{"type":1,"id":8105,"country":"KR","sunrise":1668982666,"sunset":1669018694},
                    "timezone":32400,
                    "id":1835848,
                    "name":"Seoul",
                    "cod":200
      },
      wetherInfo2 : {"coord": {"lon":126.9778,"lat":37.5683},
                    "weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"02d"}],
                    "base":"stations","main":{"temp":280.45,"feels_like":287.52,"temp_min":275.84,"temp_max":287.93,"pressure":1021,"humidity":57},
                    "visibility":10000,
                    "wind":{"speed":3.6,"deg":340},
                    "clouds":{"all":75},
                    "dt":1669010066,
                    "sys":{"type":1,"id":8105,"country":"KR","sunrise":1668982666,"sunset":1669018694},
                    "timezone":32400,
                    "id":1835848,
                    "name":"Seoul",
                    "cod":200
      },
      wetherInfo3 : {"coord": {"lon":126.9778,"lat":37.5683},
                    "weather":[{"id":803,"main":"Snow","description":"broken clouds","icon":"04d"}],
                    "base":"stations","main":{"temp":275.45,"feels_like":287.52,"temp_min":270.84,"temp_max":280.93,"pressure":1021,"humidity":23},
                    "visibility":10000,
                    "wind":{"speed":3.6,"deg":340},
                    "clouds":{"all":60},
                    "dt":1669010066,
                    "sys":{"type":1,"id":8105,"country":"KR","sunrise":1668982666,"sunset":1669018694},
                    "timezone":32400,
                    "id":1835848,
                    "name":"Seoul",
                    "cod":200
      },
    };
  },
  computed: {
  },
  watch: {
  },
  beforeCreate() {
  },
  mounted(){
    /*날씨 API 연동 */
  },
  methods: {
   
  }
};

</script>
<style lang="scss">

</style>