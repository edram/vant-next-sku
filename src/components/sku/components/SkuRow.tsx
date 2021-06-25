import { defineComponent } from "vue";
import { createNamespace } from "vant/lib/utils";

import { BORDER_BOTTOM } from "vant/lib/utils/constant";

const [name, bem] = createNamespace("sku-row");

export default defineComponent({
  name,

  props: {
    skuRow: Object,
  },

  data() {
    return {
      progress: 0,
    };
  },

  methods: {
    genTitle() {
      return (
        <div class={bem("title")}>
          {this.skuRow!.k}
          {this.skuRow!.is_multiple && (
            <span class={bem("title-multiple")}>（可多选）</span>
          )}
        </div>
      );
    },

    genContent() {
      const template = this.$slots.default!();

      const nodes: any[] = [];

      template.map((node) => {
        Array.isArray(node.children)
          ? nodes.push(...node.children)
          : nodes.push(node);
      });

      console.log(this.skuRow);

      if (this.skuRow!.largeImageMode) {
        const top: any[] = [];
        const bottom: any[] = [];

        nodes.forEach((node, index) => {
          const group = Math.floor(index / 3) % 2 === 0 ? top : bottom;
          group.push(node);
        });

        return (
          <div class={bem("scroller")} ref="scroller">
            <div class={bem("row")} ref="row">
              {top}
            </div>
            {bottom.length ? <div class={bem("row")}>{bottom}</div> : null}
          </div>
        );
      }

      return nodes;
    },
  },

  render() {
    return (
      <div class={[bem(), BORDER_BOTTOM]}>
        {this.genTitle()}
        {this.genContent()}
        {/* {this.genIndicator()} */}
      </div>
    );
  },
});
