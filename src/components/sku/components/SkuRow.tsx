import { defineComponent, renderSlot } from "vue";
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
  },

  render() {
    return (
      <div class={[bem(), BORDER_BOTTOM]}>
        {this.genTitle()}
        {/* {this.genContent()}
        {this.genIndicator()} */}
      </div>
    );
  },
});
