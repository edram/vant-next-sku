import { defineComponent, PropType } from "vue";
import { TinyEmitter } from "tiny-emitter";
import { createNamespace } from "vant/lib/utils";
import Popup from "vant/lib/popup";

import {
  isAllSelected,
  getSkuComb,
  getSelectedSkuValues,
  getSelectedProperties,
  getSelectedPropValues,
} from "./utils/sku-helper";
import { LIMIT_TYPE, UNSELECTED_SKU_VALUE_ID } from "./constants";

import SkuHeader from "./components/SkuHeader";
import SkuHeaderItem from "./components/SkuHeaderItem";
import SkuRow from "./components/SkuRow";
import SkuRowItem from "./components/SkuRowItem";
import SkuRowPropItem from "./components/SkuRowPropItem";
import SkuActions from "./components/SkuActions";
import SkuStepper from "./components/SkuStepper";
import SkuMessages from "./components/SkuMessages";

import type { SkuData, SkuGoodsData, SelectedSkuData } from "./data";

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
    skuEventBus: TinyEmitter | undefined;
  } {
    return {
      selectedSku: {},
      selectedProp: {},
      selectedNum: 1,
      show: this.value,
      skuEventBus: undefined,
    };
  },

  computed: {
    skuGroupClass(): any[] {
      return [
        "van-sku-group-container",
        {
          "van-sku-group-container--hide-soldout": !this.showSoldoutSku,
        },
      ];
    },

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

    hasSkuOrAttr(): boolean {
      return this.hasSku || this.propList.length > 0;
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
      origin_price?: number;
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

    selectedSkuValues(): any[] {
      return getSelectedSkuValues(this.skuTree, this.selectedSku);
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

    originPrice(): string {
      if (this.selectedSkuComb && this.selectedSkuComb.origin_price) {
        return (
          (this.selectedSkuComb.origin_price +
            (this.selectedSkuComb?.property_price || 0)) /
          100
        ).toFixed(2);
      }
      return this.sku!.origin_price || "";
    },

    stock(): number {
      const { stockNum } = this.customStepperConfig;
      if (stockNum !== undefined) {
        return stockNum;
      }
      if (this.selectedSkuComb) {
        return this.selectedSkuComb.stock_num || 0;
      }
      return this.sku!.stock_num;
    },

    stockText(): any {
      const { stockFormatter } = this.customStepperConfig;
      if (stockFormatter) {
        return stockFormatter(this.stock);
      }

      return [
        `剩余 `,
        <span
          class={bem("stock-num", {
            highlight: this.stock < this.stockThreshold,
          })}
        >
          {this.stock}
        </span>,
        ` 件`,
      ];
    },

    selectedText(): string {
      if (this.selectedSkuComb) {
        const values = this.selectedSkuValues.concat(this.selectedPropValues);
        return `已选 ${values.map((item) => item.name).join(" ")}`;
      }

      const unselectedSku = this.skuTree
        .filter(
          (item) => this.selectedSku[item.k_s] === UNSELECTED_SKU_VALUE_ID
        )
        .map((item) => item.k);

      const unselectedProp = this.propList
        .filter((item) => (this.selectedProp[item.k_id] || []).length < 1)
        .map((item) => item.k);

      return `请选择 ${unselectedSku.concat(unselectedProp).join(" ")}`;
    },
  },

  created() {
    const skuEventBus = new TinyEmitter();
    this.skuEventBus = skuEventBus;

    // skuEventBus.$on("sku:select", this.onSelect);
    // skuEventBus.$on("sku:propSelect", this.onPropSelect);
    // skuEventBus.$on("sku:numChange", this.onNumChange);
    // skuEventBus.$on("sku:previewImage", this.onPreviewImage);
    // skuEventBus.$on("sku:overLimit", this.onOverLimit);
    // skuEventBus.$on("sku:stepperState", this.onStepperState);
    // skuEventBus.$on("sku:addCart", this.onAddCart);
    // skuEventBus.$on("sku:buy", this.onBuy);

    // this.resetStepper();
    // this.resetSelectedSku();

    // 组件初始化后的钩子，抛出skuEventBus
    this.$emit("after-sku-create", skuEventBus);
  },

  render() {
    if (this.isSkuEmpty) {
      return <></>;
    }

    const {
      sku,
      skuList,
      goods,
      price,
      lazyLoad,
      originPrice,
      selectedSku,
      selectedProp,
      selectedNum,
      stepperTitle,
      showHeaderImage,
      skuEventBus,
      disableSoldoutSku,
    } = this;

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
        {slots["sku-header-origin-price"] ||
          (originPrice && <SkuHeaderItem>原价 ￥{originPrice}</SkuHeaderItem>)}
        {!this.hideStock && (
          <SkuHeaderItem>
            <span class="van-sku__stock">{this.stockText}</span>
          </SkuHeaderItem>
        )}

        {this.hasSkuOrAttr && !this.hideSelectedText && (
          <SkuHeaderItem>{this.selectedText}</SkuHeaderItem>
        )}

        {slots["sku-header-extra"]}
      </SkuHeader>
    );

    const Group =
      slots["sku-group"] ||
      (this.hasSkuOrAttr && (
        <div class={this.skuGroupClass}>
          {this.skuTree.map((skuTreeItem) => (
            <SkuRow skuRow={skuTreeItem} ref="skuRows">
              {skuTreeItem.v.map((skuValue: any) => (
                <SkuRowItem
                  skuList={skuList}
                  lazyLoad={lazyLoad}
                  skuValue={skuValue}
                  skuKeyStr={skuTreeItem.k_s}
                  selectedSku={selectedSku}
                  skuEventBus={skuEventBus}
                  disableSoldoutSku={disableSoldoutSku}
                  largeImageMode={skuTreeItem.largeImageMode}
                />
              ))}
            </SkuRow>
          ))}
          {this.propList.map((skuTreeItem) => (
            <SkuRow skuRow={skuTreeItem}>
              {skuTreeItem.v.map((skuValue: any) => (
                <SkuRowPropItem
                  skuValue={skuValue}
                  skuKeyStr={skuTreeItem.k_id + ""}
                  selectedProp={selectedProp}
                  skuEventBus={skuEventBus}
                  multiple={skuTreeItem.is_multiple}
                />
              ))}
            </SkuRow>
          ))}
        </div>
      ));

    const Stepper = slots["sku-stepper"] || (
      <SkuStepper
        ref="skuStepper"
        stock={this.stock}
        quota={this.quota}
        quotaUsed={this.quotaUsed}
        startSaleNum={this.startSaleNum}
        skuEventBus={skuEventBus}
        selectedNum={selectedNum}
        stepperTitle={stepperTitle}
        skuStockNum={sku!.stock_num}
        disableStepperInput={this.disableStepperInput}
        customStepperConfig={this.customStepperConfig}
        hideQuotaText={this.hideQuotaText}
        onChange={(event) => {
          this.$emit("stepper-change", event);
        }}
      />
    );

    const Messages = slots["sku-messages"] || (
      <SkuMessages
        ref="skuMessages"
        goodsId={this.goodsId}
        messageConfig={this.messageConfig}
        messages={sku!.messages}
      />
    );

    const Actions = slots["sku-actions"] || (
      <SkuActions
        buyText={this.buyText}
        skuEventBus={skuEventBus}
        addCartText={this.addCartText}
        showAddCartBtn={this.showAddCartBtn}
      />
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
          {Group}
          {slots["extra-sku-group"]}
          {Stepper}
          {Messages}
        </div>
        {slots["sku-actions-top"]}
        {Actions}
      </Popup>
    );
  },
});
