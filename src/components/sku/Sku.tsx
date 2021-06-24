import { defineComponent, PropType } from "vue";
import { createNamespace } from "vant/lib/utils";
import Popup from "vant/lib/popup";

import {
  isAllSelected,
  getSkuComb,
  getSelectedProperties,
  getSelectedPropValues,
} from "./utils/sku-helper";

import type { SkuData, SkuGoodsData, SelectedSkuData } from "./data";

import SkuHeader from "./components/SkuHeader";

const [name, bem] = createNamespace("sku");

export default defineComponent({
  name,

  props: {
    sku: Object as PropType<SkuData>,
    goods: Object,
    value: Boolean,
    buyText: String,
    goodsId: [Number, String],
    priceTag: String,
    lazyLoad: Boolean,
    hideStock: Boolean,
    properties: Array,
    addCartText: String,
    stepperTitle: String,
    getContainer: [String, Function],
    hideQuotaText: Boolean,
    hideSelectedText: Boolean,
    resetStepperOnHide: Boolean,
    customSkuValidator: Function,
    disableStepperInput: Boolean,
    resetSelectedSkuOnHide: Boolean,
    quota: {
      type: Number,
      default: 0,
    },
    quotaUsed: {
      type: Number,
      default: 0,
    },
    startSaleNum: {
      type: Number,
      default: 1,
    },
    initialSku: {
      type: Object,
      default: () => ({}),
    },
    stockThreshold: {
      type: Number,
      default: 50,
    },
    showSoldoutSku: {
      type: Boolean,
      default: true,
    },
    showAddCartBtn: {
      type: Boolean,
      default: true,
    },
    disableSoldoutSku: {
      type: Boolean,
      default: true,
    },
    customStepperConfig: {
      type: Object,
      default: () => ({}),
    },
    showHeaderImage: {
      type: Boolean,
      default: true,
    },
    previewOnClickImage: {
      type: Boolean,
      default: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    bodyOffsetTop: {
      type: Number,
      default: 200,
    },
    messageConfig: {
      type: Object,
      default: () => ({
        initialMessages: {},
        placeholderMap: {},
        uploadImg: () => Promise.resolve(),
        uploadMaxSize: 5,
      }),
    },
  },

  data(): {
    selectedSku: SelectedSkuData;
    selectedProp: Record<string, string>;
    selectedNum: number;
    show: boolean;
  } {
    return {
      selectedSku: {},
      selectedProp: {},
      selectedNum: 1,
      show: this.value,
    };
  },

  computed: {
    bodyStyle(): { maxHeight: string } {
      const maxHeight = window.innerHeight - this.bodyOffsetTop;

      return {
        maxHeight: maxHeight + "px",
      };
    },
    isSkuEmpty(): boolean {
      return Object.keys(this.sku!).length === 0;
    },

    hasSku(): boolean {
      return !this.sku!.none_sku;
    },

    propList(): any[] {
      return this.properties || [];
    },

    skuTree(): any[] {
      return this.sku!.tree || [];
    },

    isSkuCombSelected(): boolean {
      // SKU 未选完
      if (this.hasSku && !isAllSelected(this.skuTree, this.selectedSku)) {
        return false;
      }
      // // 属性未全选
      return !this.propList
        .filter((i) => i.is_necessary !== false)
        .some((i) => (this.selectedProp[i.k_id] || []).length === 0);
    },

    skuList(): any[] {
      return this.sku!.list || [];
    },

    selectedPropValues(): any {
      return getSelectedPropValues(this.propList, this.selectedProp);
    },

    selectedSkuComb(): {
      id?: number;
      price?: number;
      stock_num?: number;
      property_price?: number;
    } | null {
      let skuComb = null;
      if (this.isSkuCombSelected) {
        if (this.hasSku) {
          skuComb = getSkuComb(this.skuList, this.selectedSku);
        } else {
          skuComb = {
            id: this.sku?.collection_id,
            price: Math.round(Number(this.sku!.price) * 100),
            stock_num: this.sku!.stock_num,
          };
        }
        if (skuComb) {
          skuComb.properties = getSelectedProperties(
            this.propList,
            this.selectedProp
          );
          // skuComb.property_price = this.selectedPropValues.reduce(
          //   (acc, cur) => acc + (cur.price || 0),
          //   0
          // );
        }
      }
      return skuComb;
    },

    price(): string {
      if (this.selectedSkuComb) {
        return (
          ((this.selectedSkuComb?.price || 0) +
            (this.selectedSkuComb?.property_price || 0)) /
          100
        ).toFixed(2);
      }
      // sku.price是一个格式化好的价格区间
      return this.sku!.price;
    },
  },

  render() {
    if (this.isSkuEmpty) {
      return <></>;
    }

    const { sku, goods, price, selectedSku, showHeaderImage } = this;

    const slots = this.$slots;

    const Header = slots["sku-header"] || (
      <SkuHeader
        sku={sku}
        goods={goods}
        // skuEventBus={skuEventBus}
        selectedSku={selectedSku}
        showHeaderImage={showHeaderImage}
      >
        {slots["sku-header-price"] || (
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span>
            <span class="van-sku__price-num">{price}</span>
            {this.priceTag && (
              <span class="van-sku__price-tag">{this.priceTag}</span>
            )}
          </div>
        )}
        {slots["sku-header-extra"]}
      </SkuHeader>
    );

    return (
      <Popup
        v-model={[this.show, "show"]}
        round
        closeable
        position="bottom"
        class="van-sku-container"
        teleport={this.getContainer}
        closeOnClickOverlay={this.closeOnClickOverlay}
        safeAreaInsetBottom={this.safeAreaInsetBottom}
        onOpened={() => {}}
      >
        {Header}
        <div class="van-sku-body" style={this.bodyStyle}>
          {slots["sku-body-top"]}
          {slots["extra-sku-group"]}
        </div>
      </Popup>
    );
  },
});
