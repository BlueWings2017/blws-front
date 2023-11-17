<template>
  <div>
     <v-row>
      <v-col :cols="4">
        <kcard>
          <cardBody>
            <p>Input</p>
            <Input :style="{ width: '230px' }" :label="'First name'"></Input>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="4">
        <kcard :style="{height:'136px'}">
          <cardBody>
            <p>NumericTextBox</p>
            <NumericTextBox :style="{ width: '230px' }" :default-value="123.45" :format="'c2'">
            </NumericTextBox>
          </cardBody>
        </kcard>
      </v-col>    
      <v-col :cols="4">
        <kcard :style="{height:'136px'}">
          <cardBody>
            <p>MaskedTextBox</p>
            <MaskedTextBox :style="{ width: '230px' }" :mask="'9-000'" :default-value="'_-___'">
            </MaskedTextBox>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="4">
        <kcard>
          <cardBody>
            <p>Slider</p>
            <Slider :buttons="true" :step="1" :default-value="7" :min="1" :max="10">
            </Slider>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="4">
        <kcard :style="{height:'112px'}">
          <cardBody>
            <p>RangeSlider</p>
            <RangeSlider :step="1" :default-value="{ start: 3, end: 8 }" :min="1" :max="10">
              <SliderLabel :position="1">1</SliderLabel>
              <SliderLabel :position="3">3</SliderLabel>
              <SliderLabel :position="5">5</SliderLabel>
              <SliderLabel :position="7">7</SliderLabel>
              <SliderLabel :position="10">10</SliderLabel>
            </RangeSlider>
          </cardBody>
        </kcard>
      </v-col> 
    </v-row>
    <v-row>
      <v-col :cols="4">
        <kcard :style="{height:'168px'}">
          <cardBody>
            <p>Checkbox</p>
            <Checkbox :checked="true" :label="'Checkbox Option'" />
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="4">
        <kcard :style="{height:'168px'}">
          <cardBody>
            <p>RadioButton</p>
            <RadioButton :checked="true" :label="'RadioButton Option'" />
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="4">
        <kcard>
          <cardBody>    
            <p>RadioGroup</p>
            <RadioGroup :data-items="dataItems" :default-value="dataItems[2].value" />
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="3">
        <kcard :style="{height:'136px'}">
          <cardBody>  
            <p>Switch</p>
            <kSwitch />
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="3">
        <kcard>
          <cardBody>  
            <p>TextArea</p>
            <TextArea></TextArea>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="3">
        <kcard :style="{height:'136px'}">
          <cardBody>  
            <p>ColorPicker</p>
            <ColorPicker />
          </cardBody>
        </kcard>
      </v-col>  
    </v-row>
    <v-row>
      <v-col :cols="3">
        <kcard :style="{height:'478px'}">
          <cardBody>  
            <p>ColorPalette</p>
            <ColorPalette />
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="3">
        <kcard :style="{height:'478px'}">
          <cardBody>  
            <p>ColorGradient</p>
            <ColorGradient />
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="3">
        <kcard>
          <cardBody>  
            <p>FlatColorPicker</p>
            <FlatColorPicker />
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import {
  NumericTextBox,
  Input,
  MaskedTextBox,
  Slider,
  SliderLabel,
  RangeSlider,
  Checkbox,
  RadioButton,
  RadioGroup,
  Switch,
  TextArea,
  ColorGradient,
  ColorPicker,
  FlatColorPicker,
  ColorPalette,
} from "@progress/kendo-vue-inputs";
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
        Input,
        NumericTextBox,
        MaskedTextBox,
        Slider,
        SliderLabel,
        RangeSlider,
        Checkbox,
        RadioButton,
        RadioGroup,
        kSwitch : Switch,
        TextArea,
        ColorGradient,
        ColorPicker,
        FlatColorPicker,
        ColorPalette,
        CardBody, 
        CardTitle, 
        CardActions,
        "kcard" : Card,
    },
    data() {
      return {
        dataItems: [
        {
          label: "Option 1",
          value: "option1",
        },
        {
          label: "Option 2",
          value: "option2",
        },
        {
          label: "Option 3",
          value: "option3",
        },
      ],
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