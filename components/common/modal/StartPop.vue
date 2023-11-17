<template>
    <div>
        <k-dialog v-if="visibleDialog" :title="title" @close="toggleDialog">
            <v-row align="center" :style="{ width: modalWidth }">
                <v-col :cols="12">
                    <p :style="{ margin: '25px', textAlign: 'center' }">
                        {{ message }}
                    </p>
                </v-col>
            </v-row>
            <dialog-actions-bar>
                <kbutton @keydown.enter="toggleDialog" @click="toggleDialog">
                    {{ $t("CommLang.btn.closeBtn") }}
                </kbutton>
            </dialog-actions-bar>
        </k-dialog>
    </div>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";

export default {
    components: {
        "k-dialog": Dialog,
        "dialog-actions-bar": DialogActionsBar,
        kbutton: Button,
    },
    props: {
        callBack: {
            type: Function,
            default: () => true
        },
    },
    data: function () {
        return {
            visibleDialog: false,
            message: null,
            title: null,
            modalWidth: "300px",
        };
    },
    computed: {},
    watch: {},
    mounted() { },
    methods: {
        toggleDialog() {
            this.visibleDialog = !this.visibleDialog;
            this.callBack();
        },
        show(title, message, modalWidth = "300px", visibleDialog = true) {
            this.title = title;
            this.message = message;
            this.modalWidth = modalWidth;
            this.visibleDialog = visibleDialog;
        },
    },
};
</script>
<style scoped lang="scss">
.k-window-titlebar {
    border-color: inherit !important;
    color: white !important;
    background-color: #e7607b !important;
}
</style>