import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import "./app.css";

createApp(App).use(store).mount("#app");
