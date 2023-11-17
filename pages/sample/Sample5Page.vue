<template>
  <div>
     <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Editor
            :tools="tools"
            :content-style="{
              height: '690px',
            }"
            :default-content="content"
            :default-edit-mode="'div'"
            />
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
</template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import { Editor } from "@progress/kendo-vue-editor";
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
      Editor,
      CardBody, 
      CardTitle, 
      CardActions,
      "kcard" : Card,
    },
    data() {
      return {
        tools: [
        ["Bold", "Italic", "Underline", "Strikethrough"],
        ["Subscript", "Superscript"],
        ["AlignLeft", "AlignCenter", "AlignRight", "AlignJustify"],
        ["Indent", "Outdent"],
        ["OrderedList", "UnorderedList"],
        "FontSize",
        "FontName",
        "FormatBlock",
        ["Undo", "Redo"],
        ["Link", "Unlink", "InsertImage", "ViewHtml"],
        ["InsertTable"],
        ["AddRowBefore", "AddRowAfter", "AddColumnBefore", "AddColumnAfter"],
        ["DeleteRow", "DeleteColumn", "DeleteTable"],
        ["MergeCells", "SplitCell"],
      ],
      content : `<p>Some content with a list, paragraphs and a table.</p><ul><li>list item 1</li><li>list item 2</li></ul><p>a paragraph</p><table>
       <tbody><tr><td><p>cell 1</p></td><td><p>cell 2</p></td><td><p>cell 3</p></td></tr><tr><td><p>cell 4</p></td><td>
       <p>cell 5</p></td><td><p>cell 6</p></td></tr></tbody></table><p>another paragraph</p>`,
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
  
  </script>
  <style lang="scss">
  
  </style>