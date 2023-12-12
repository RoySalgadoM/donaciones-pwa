import "./assets/main.css";

import "material-icons/iconfont/material-icons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "@/config/router";
import "./boot/access";
import Input from "@/kernel/components/Input.vue";
import Btn from "@/kernel/components/Btn.vue";
import Form from "@/kernel/components/Form.vue";
import Select from "@/kernel/components/Select.vue";
import ContentSection from "@/kernel/layouts/ContentSection.vue";
import Collapse from "@/kernel/components/Collapse.vue";
import Dialog from "@/kernel/components/Dialog.vue";
import Modal from "@/kernel/components/Modal.vue";
import Table from "@/kernel/components/Table.vue";
import Icon from "@/kernel/components/Icon.vue";
import PaginationTable from "@/kernel/components/PaginationTable.vue";
import Calendar from "@/kernel/components/Calendar.vue";
import { notify } from "@/kernel/components/notify";
import { loading } from "@/kernel/components/loading";
import { registerSW } from "virtual:pwa-register";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("Input", Input);
app.component("Btn", Btn);
app.component("Form", Form);
app.component("Select", Select);
app.component("Collapse", Collapse);
app.component("Dialog", Dialog);
app.component("Modal", Modal);
app.component("Table", Table);
app.component("Icon", Icon);
app.component("PaginationTable", PaginationTable);
app.component("Calendar", Calendar);
app.component("ContentSection", ContentSection);
app.config.globalProperties.$notify = notify;
app.config.globalProperties.$loading = loading;

if ("serviceWorker" in navigator) {
    registerSW({

    });

    
    console.log("Service Worker Registered");
}

app.mount("#app");
