<template>
  <div>
     <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>Button Color</p>
            <!--<kbutton>Default</kbutton>-->
            <kbutton :theme-color="'primary'">Primary</kbutton>
            <kbutton :theme-color="'secondary'">Secondary</kbutton>
            <kbutton :disabled="true">Disabled</kbutton>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>Button Size</p>
            <kbutton :theme-color="'secondary'" :size="'small'">SM</kbutton>
            <kbutton :theme-color="'primary'" :size="'medium'">MD</kbutton>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>Button Category</p>
            <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'">조회</kbutton>
            <kbutton :theme-color="'primary'" :size="'medium'" :icon="'excel'">엑셀</kbutton>
            <kbutton :theme-color="'secondary'" :size="'medium'" :class="'btn-form'">...</kbutton>
            <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'">저장</kbutton>
            <kbutton :theme-color="'secondary'" :size="'small'" :icon="'add'">추가</kbutton>
            <kbutton :theme-color="'secondary'" :size="'small'" :icon="'delete'">삭제</kbutton>
            <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'">UNDO</kbutton>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>ButtonGroup</p>
            <buttongroup>
              <kbutton toggleble="true"> Option A </kbutton>
              <kbutton toggleble="true"> Option B </kbutton>
              <kbutton toggleble="true"> Option C </kbutton>
            </buttongroup>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>DropDownButton</p>
            <dropdownbutton
              :text-field="'actionName'"
              :icon="'cog'"
              :items="dropDownButtonItems"
              :text="'Edit'"
            ></dropdownbutton>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>SplitButton</p>
            <splitbutton :text="'Paste'" :icon="'paste'" :items="splitButtonItems">
            </splitbutton>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <p>Toolbar</p>
            <toolbar>
              <toolbaritem>
                <buttongroup>
                  <kbutton
                    :icon="'bold'"
                    :title="'Bold'"
                    :togglable="true"
                  ></kbutton>
                  <kbutton
                    :icon="'italic'"
                    :title="'Italic'"
                    :togglable="true"
                  ></kbutton>
                  <kbutton
                    :icon="'underline'"
                    :title="'Underline'"
                    :togglable="true"
                  ></kbutton>
                </buttongroup>
              </toolbaritem>
              <toolbarseparator />
              <toolbaritem>
                <buttongroup>
                  <kbutton
                    :icon="'align-left'"
                    :title="'Align Left'"
                    :togglable="true"
                  ></kbutton>
                  <kbutton
                    :icon="'align-center'"
                    :title="'Align Center'"
                    :togglable="true"
                  ></kbutton>
                  <kbutton
                    :icon="'align-right'"
                    :title="'Align Right'"
                    :togglable="true"
                  ></kbutton>
                  <kbutton
                    :icon="'align-justify'"
                    :title="'Align Justify'"
                    :togglable="true"
                  ></kbutton>
                </buttongroup>
              </toolbaritem>
              <toolbarseparator />
              <toolbaritem>
                <kbutton :icon="'cut'" :title="'Cut'">Cut</kbutton>
              </toolbaritem>
              <toolbarseparator />
              <toolbaritem>
                <kbutton :icon="'copy'" :title="'Copy'">Copy</kbutton>
              </toolbaritem>
              <toolbarseparator />
              <toolbaritem>
                <kbutton :icon="'paste'" :title="'Paste'">Paste</kbutton>
              </toolbaritem>
            </toolbar>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>  
            <p>Chip and ChipList</p>
            <chiplist :rounded="'full'" :default-data-items="people" :selection="'single'" :chip="chip">
              <template v-slot:myTemplate="{ props }">
                  <chip
                  :rounded="'full'"
                  :data-item="props.dataItem"
                  :value="props.value"
                  :text="props.text"
                  :icon="props.icon"
                  :removable="true"/>
              </template>
            </chiplist>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>    
    <v-row>
      <v-col :cols="6">
        <kcard :style="{ height: '130px' }">
          <cardBody>
              <fab
                :icon="'check'"
                :text="'Floating Action Button'"
                :align="{ horizontal: 'end', vertical: 'top' }"
                :positionMode="'absolute'"
              ></fab>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>    
  </div>
</template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import {
    Button,
    ButtonGroup,
    ChipList,
    DropDownButton,
    FloatingActionButton,
    Toolbar,
    ToolbarItem,
    ToolbarSeparator,
    SplitButton,
    Chip
  } from "@progress/kendo-vue-buttons";
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
      "kbutton": Button,
      buttongroup: ButtonGroup,
      fab: FloatingActionButton,
      chiplist: ChipList,
      'chip': Chip,
      dropdownbutton: DropDownButton,
      toolbar: Toolbar,
      toolbaritem: ToolbarItem,
      toolbarseparator: ToolbarSeparator,
      splitbutton: SplitButton,
      CardBody, 
      CardTitle, 
      CardActions,
      "kcard" : Card,
    },
    data() {
      return {
        people: people,
        chip: "myTemplate",
        dropDownButtonItems: editItems,
        splitButtonItems: pasteItems,
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
  
  const people = [
  {
    text: "Pedro Afonso",
    value: "pedro",
    icon: "k-chip-avatar pedro",
  },
  {
    text: "Thomas Hardy",
    value: "thomas",
    icon: "k-chip-avatar thomas",
  },
  {
    text: "Christina Berg",
    value: "christina",
    icon: "k-chip-avatar christina",
  },
  {
    text: "Paula Wilson",
    value: "paula",
    icon: "k-chip-avatar paula",
  },
];

const editItems = [
  {
    actionName: "Undo",
    icon: "undo",
  },
  {
    actionName: "Redo",
    icon: "redo",
    disabled: true,
  },
  {
    actionName: "Cut",
    icon: "cut",
  },
  {
    actionName: "Copy",
    icon: "copy",
  },
  {
    actionName: "Paste",
    icon: "paste",
  },
];

const pasteItems = [
  { text: "Keep Text Only", icon: "paste-plain-text" },
  { text: "Paste as HTML", icon: "paste-as-html" },
  { text: "Paste Markdown", icon: "paste-markdown" },
  { text: "Set Default Paste" },
];
  </script>
  <style lang="scss">
    .k-chip {
    margin-right: 10px;
    }
    .pedro {
    background-image: url("https://demos.telerik.com/kendo-ui/content/web/Customers/SPLIR.jpg");
    }
    .thomas {
    background-image: url("https://demos.telerik.com/kendo-ui/content/web/Customers/RICSU.jpg");
    }
    .christina {
    background-image: url("https://demos.telerik.com/kendo-ui/content/web/Customers/BERGS.jpg");
    }
    .paula {
    background-image: url("https://demos.telerik.com/kendo-ui/content/web/Customers/RATTC.jpg");
    }
    .custom-style {
    color: #6200ee;
    background-color: #f3ebfe;
    border-color: #6200ee;
    }
    .k-button {
    margin-right: 3px;
    }
    .k-button-group > .k-button {
    margin-right: 0px;
    }
    .k-button > .k-image {
    width: 20px;
    height: 20px;
    }
  </style>