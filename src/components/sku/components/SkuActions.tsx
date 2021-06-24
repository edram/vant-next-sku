import { defineComponent } from "vue";
import { createNamespace } from "vant/lib/utils";
import Button from "vant/lib/button";

const [name, bem] = createNamespace("sku-actions");

export default defineComponent({
  name,

  props: {
    buyText: String,
    // skuEventBus: Vue;
    addCartText: String,
    showAddCartBtn: Boolean,
  },

  setup(props, { slots }) {
    const createEmitter = (name: string) => () => {
      // props.skuEventBus.$emit(name);
    };

    return () => (
      <div class={bem()}>
        {props.showAddCartBtn && (
          <Button
            size="large"
            type="warning"
            text={props.addCartText || "加入购物车"}
            onClick={createEmitter("sku:addCart")}
          />
        )}
        <Button
          size="large"
          type="danger"
          text={props.buyText || "立即购买"}
          onClick={createEmitter("sku:buy")}
        />
      </div>
    );
  },
});
