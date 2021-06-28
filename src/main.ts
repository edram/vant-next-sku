import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import vant from "vant";
import App from "./App.vue";
import Sku from "./components/sku";

import "vant/lib/index.less";

import "./components/sku/index.less";

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
});

app.use(i18n);
app.use(vant);
app.component(Sku.name, Sku);

app.mount("#app");
