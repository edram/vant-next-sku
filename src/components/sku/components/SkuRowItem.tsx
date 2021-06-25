import { defineComponent } from "vue";
import { createNamespace } from "vant/lib/utils";
import { isSkuChoosable } from "../utils/sku-helper";

import Icon from "vant/lib/icon";
import Image from "vant/lib/image";

const [name, bem] = createNamespace("sku-row");

export default defineComponent({
  name,

  props: {
    lazyLoad: Boolean,
    skuValue: Object,
    skuKeyStr: String,
    skuEventBus: Object,
    selectedSku: Object,
    largeImageMode: Boolean,
    disableSoldoutSku: Boolean,
    skuList: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    imgUrl(): string {
      const url = this.skuValue!.imgUrl || this.skuValue!.img_url;
      return this.largeImageMode
        ? url ||
            "https://img01.yzcdn.cn/upload_files/2020/06/24/FmKWDg0bN9rMcTp9ne8MXiQWGtLn.png"
        : url;
    },

    choosable(): boolean {
      if (!this.disableSoldoutSku) {
        return true;
      }

      return isSkuChoosable(this.skuList, this.selectedSku, {
        key: this.skuKeyStr,
        valueId: this.skuValue!.id,
      });
    },
  },

  methods: {
    onSelect() {
      if (this.choosable) {
        this.skuEventBus!.emit("sku:select", {
          ...this.skuValue,
          skuKeyStr: this.skuKeyStr,
        });
      }
    },

    onPreviewImg(event: Event) {
      event.stopPropagation();
      const { skuValue, skuKeyStr } = this;
      this.skuEventBus!.emit("sku:previewImage", {
        ...skuValue,
        ks: skuKeyStr,
        imgUrl: skuValue!.imgUrl || skuValue!.img_url,
      });
    },

    genImage(classPrefix: string) {
      if (this.imgUrl) {
        return (
          <Image
            fit="cover"
            src={this.imgUrl}
            class={`${classPrefix}-img`}
            lazyLoad={this.lazyLoad}
          />
        );
      }
    },
  },

  render() {
    const choosed = this.skuValue!.id === this.selectedSku![this.skuKeyStr!];
    const classPrefix = (
      this.largeImageMode ? bem("image-item") : bem("item")
    ) as string;

    return (
      <span
        class={[
          classPrefix,
          choosed ? `${classPrefix}--active` : "",
          !this.choosable ? `${classPrefix}--disabled` : "",
        ]}
        onClick={this.onSelect}
      >
        {this.genImage(classPrefix)}
        <div class={`${classPrefix}-name`}>
          {this.largeImageMode ? (
            <span class={{ "van-multi-ellipsis--l2": this.largeImageMode }}>
              {this.skuValue!.name}
            </span>
          ) : (
            this.skuValue!.name
          )}
        </div>
        {this.largeImageMode && (
          <Icon
            name="enlarge"
            class={`${classPrefix}-img-icon`}
            onClick={this.onPreviewImg}
          />
        )}
      </span>
    );
  },
});
