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

  computed: {
    scrollable(): boolean {
      return this.skuRow!.largeImageMode && this.skuRow!.v.length > 6;
    },
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

    genIndicator() {
      if (this.scrollable) {
        const style = {
          transform: `translate3d(${this.progress * 20}px, 0, 0)`,
        };

        return (
          <div class={bem("indicator-wrapper")}>
            <div class={bem("indicator")}>
              <div class={bem("indicator-slider")} style={style} />
            </div>
          </div>
        );
      }
    },

    genContent() {
      const template = this.$slots.default!();

      const nodes: any[] = [];

      template.map((node) => {
        Array.isArray(node.children)
          ? nodes.push(...node.children)
          : nodes.push(node);
      });

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
        {this.genIndicator()}
      </div>
    );
  },
});
