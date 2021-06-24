import { defineComponent } from "vue";
import { createNamespace } from "vant/lib/utils";
const [name, bem] = createNamespace("sku-header-item");

export default defineComponent({
  name,

  setup(props, { slots }) {
    return () => <div class={bem()}>{slots.default && slots.default()}</div>;
  },
});
