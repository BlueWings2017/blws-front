<template>
    <div>
      <v-row>
        <v-col :cols="12">
          <kcard>
            <cardBody>
                <p>Excel Download</p>
                <kbutton :theme-color="'primary'" @click="exportExcel">Export Excel</kbutton>
            </cardBody>
          </kcard>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <kcard>
            <cardBody>
                <p>Dialog</p>
                <kbutton @click="toggleDialog">Open Dialog</kbutton>
                <p>Popup</p>
                <kbutton @click="toggleWindow">Open Window</kbutton>
            </cardBody>
          </kcard>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <kcard>
            <cardBody>
                <p>Pop</p>
                <kbutton
                    @click="onClick"
                    ref="button"
                >
                    {{buttonText}}
                </kbutton>
                <Popup
                    :anchor="'button'"
                    :show="show"
                    :popup-class="'popup-content'"
                >
                    팝업 메모 컨텐츠.
                </Popup>
            </cardBody>
          </kcard>
        </v-col>
      </v-row>
      <k-dialog
        v-if="visibleDialog"
        :title="'확인'"
        @close="toggleDialog"
        >
        <p :style="{ margin: '25px', textAlign: 'center' }">
            확인하시겠습니까?
        </p>
        <dialog-actions-bar>
            <kbutton @click="toggleDialog">확인</kbutton>
            <kbutton @click="toggleDialog">취소</kbutton>
        </dialog-actions-bar>
        </k-dialog>
        <window v-if="visibleWindow" :title="'Window'" @close="toggleWindow">
        윈도우 팝업
        </window>
    </div>
  </template>
    <script>
    import mixinGlobal from "@/mixin/global.js";
    import Utility from "~/plugins/utility";
    import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
    import { saveExcel } from '@progress/kendo-vue-excel-export';
    import { aggregateBy,process } from '@progress/kendo-data-query';
    import { Button } from '@progress/kendo-vue-buttons';
    import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
    import { Popup } from '@progress/kendo-vue-popup';
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
          CardBody, 
          CardTitle, 
          CardActions,
          "kcard" : Card,
          'kbutton': Button,
          "k-dialog": Dialog,
          window: Window,
          "dialog-actions-bar": DialogActionsBar,
          'Popup': Popup,
      },
      data() {
        return {
            headerCellConfig: { textAlign: 'center' },
            footerCellConfig: { wrap: true, textAlign: 'center' },
            groupFooterCellConfig: {textAlign: 'right' },
            visibleDialog: false,
            visibleWindow: false,
            show: false
        };
      },
      computed: {
        buttonText: function(){
            return this.show ? 'Hide' : 'Show';
        }
      },
      watch: {
      },
      beforeCreate() {
      },
      methods: {
        exportExcel () {
            saveExcel({
                data: data,
                group: group,
                fileName:"Products.xlsx",
                columns: [
                  { field: 'ProductID', locked: true, width:200},
                  { field: 'ProductName', title: 'Product Name', width: 350 },
                  { 
                    title: 'Availability', headerCellOptions: this.headerCellConfig , children: [
                        { 
                          field: 'UnitPrice', 
                          title: 'Price',
                          cellOptions: { format: '$#,##0.00' },
                          width:150,
                          footerCellOptions: this.footerCellConfig,
                          groupFooterCellOptions: this.groupFooterCellConfig,
                          groupFooter: CustomGroupFooter,
                          footer: CustomFooter
                        },
                        { field: 'UnitsOnOrder', title: 'Units on Order' },
                        { field: 'UnitsInStock', title: 'Units in Stock' }
                    ]
                  },
                  { 
                    field: 'Discontinued', 
                    title: 'Discontinued', 
                    hidden: true,  
                    groupHeader: CustomGroupHeader
                  }
              ]
            });
        },
        toggleDialog() {
            this.visibleDialog = !this.visibleDialog;
        },
        toggleWindow() {
            this.visibleWindow = !this.visibleWindow;
        },
        onClick () {
            this.show = !this.show;
        }
      }
    };
    let products = [
        {
            "ProductID": 1,
            "ProductName": "Chai",
            "SupplierID": 1,
            "CategoryID": 1,
            "QuantityPerUnit": "10 boxes x 20 bags",
            "UnitPrice": 18.0000,
            "UnitsInStock": 39,
            "UnitsOnOrder": 0,
            "ReorderLevel": 10,
            "Discontinued": false,
            "Category": {
                "CategoryID": 1,
                "CategoryName": "Beverages",
                "Description": "Soft drinks, coffees, teas, beers, and ales"
            }
        },
        {
            "ProductID": 2,
            "ProductName": "Chang",
            "SupplierID": 1,
            "CategoryID": 1,
            "QuantityPerUnit": "24 - 12 oz bottles",
            "UnitPrice": 19.0000,
            "UnitsInStock": 17,
            "UnitsOnOrder": 40,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "CategoryID": 1,
                "CategoryName": "Beverages",
                "Description": "Soft drinks, coffees, teas, beers, and ales"
            }
        },
        {
            "ProductID": 3,
            "ProductName": "Aniseed Syrup",
            "SupplierID": 1,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 550 ml bottles",
            "UnitPrice": 10.0000,
            "UnitsInStock": 13,
            "UnitsOnOrder": 70,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "CategoryID": 2,
                "CategoryName": "Condiments",
                "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
            }
        },
        {
            "ProductID": 4,
            "ProductName": "Chef Anton's Cajun Seasoning",
            "SupplierID": 2,
            "CategoryID": 2,
            "QuantityPerUnit": "48 - 6 oz jars",
            "UnitPrice": 22.0000,
            "UnitsInStock": 53,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "CategoryID": 2,
                "CategoryName": "Condiments",
                "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
            }
        },
        {
            "ProductID": 5,
            "ProductName": "Chef Anton's Gumbo Mix",
            "SupplierID": 2,
            "CategoryID": 2,
            "QuantityPerUnit": "36 boxes",
            "UnitPrice": 21.3500,
            "UnitsInStock": 0,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": true,
            "Category": {
                "CategoryID": 2,
                "CategoryName": "Condiments",
                "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
            }
        },
        {
            "ProductID": 6,
            "ProductName": "Grandma's Boysenberry Spread",
            "SupplierID": 3,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 8 oz jars",
            "UnitPrice": 25.0000,
            "UnitsInStock": 120,
            "UnitsOnOrder": 0,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "CategoryID": 2,
                "CategoryName": "Condiments",
                "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
            }
        },
        {
            "ProductID": 7,
            "ProductName": "Uncle Bob's Organic Dried Pears",
            "SupplierID": 3,
            "CategoryID": 7,
            "QuantityPerUnit": "12 - 1 lb pkgs.",
            "UnitPrice": 30.0000,
            "UnitsInStock": 15,
            "UnitsOnOrder": 0,
            "ReorderLevel": 10,
            "Discontinued": false,
            "Category": {
                "CategoryID": 7,
                "CategoryName": "Produce",
                "Description": "Dried fruit and bean curd"
            }
        },
        {
            "ProductID": 8,
            "ProductName": "Northwoods Cranberry Sauce",
            "SupplierID": 3,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 12 oz jars",
            "UnitPrice": 40.0000,
            "UnitsInStock": 6,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "CategoryID": 2,
                "CategoryName": "Condiments",
                "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
            }
        },
        {
            "ProductID": 9,
            "ProductName": "Mishi Kobe Niku",
            "SupplierID": 4,
            "CategoryID": 6,
            "QuantityPerUnit": "18 - 500 g pkgs.",
            "UnitPrice": 97.0000,
            "UnitsInStock": 29,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": true,
            "Category": {
                "CategoryID": 6,
                "CategoryName": "Meat/Poultry",
                "Description": "Prepared meats"
            }
        }
    ];
    const aggregates = [ { field: 'UnitPrice', aggregate: 'sum' } ];
    const group = [ { field: 'Discontinued', aggregates: aggregates } ];
    const data = process(products, {group: group}).data;
    const total = aggregateBy(products, aggregates);
    const CustomGroupHeader = (props) => (`Discontinued: ${props.value}`);
    const CustomGroupFooter = (props) => (`SUM: \$ ${(props.aggregates.UnitPrice.sum).toFixed(2)}`);
    const CustomFooter = (props) => (`Total ${props.column.title}: \$ ${total.UnitPrice.sum}`);
    </script>
    <style lang="scss">
    .popup-content {
        padding: 30px !important;
        color: #787878 !important;
        background-color: #fcf7f8 !important;
        border: 1px solid rgba(0,0,0,.05) !important;
        width: 300px !important;
        height: 300px !important;
    }
    </style>