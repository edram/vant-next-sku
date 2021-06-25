import { defineComponent, PropType } from "vue";
import { createNamespace } from "vant/lib/utils";

import { isNumeric } from "vant/lib/utils/validate";
import { isEmail } from "../utils/validate";

// Components
import Cell from "vant/lib/cell";
import Field from "vant/lib/field";
// import SkuImgUploader from "./SkuImgUploader";
import SkuDateTimeField from "./SkuDateTimeField";

const [name, bem] = createNamespace("sku-messages");

const placeholder = {
  id_no: "请填写身份证号",
  text: "请填写留言",
  tel: "请填写数字",
  email: "请填写邮箱",
  date: "请选择日期",
  time: "请选择时间",
  textarea: "请填写留言",
  mobile: "请填写手机号",
};

type PlaceholderType =
  | "id_no"
  | "text"
  | "tel"
  | "email"
  | "time"
  | "textarea"
  | "mobile";

export default defineComponent({
  name,

  props: {
    messageConfig: Object,
    goodsId: [Number, String],
    messages: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },

  data() {
    return {
      messageValues: this.resetMessageValues(this.messages) as any[],
    };
  },

  watch: {
    messages(val) {
      this.messageValues = this.resetMessageValues(val);
    },
  },

  methods: {
    resetMessageValues(messages: any): any[] {
      const { messageConfig } = this;
      const { initialMessages = {} } = messageConfig!;
      return (messages || []).map((message: any) => ({
        value: initialMessages[message.name] || "",
      }));
    },

    getType(message: any) {
      if (+message.multiple === 1) {
        return "textarea";
      }
      if (message.type === "id_no") {
        return "text";
      }
      return message.datetime > 0 ? "datetime" : message.type;
    },

    getMessages(): Record<string, string> {
      const messages: Record<string, any> = {};

      this.messageValues.forEach(
        (item: Record<string, string>, index: number) => {
          messages[`message_${index}`] = item.value;
        }
      );

      return messages;
    },

    getCartMessages() {
      const messages: Record<string, any> = {};

      this.messageValues.forEach((item, index) => {
        const message = this.messages[index];
        messages[message.name] = item.value;
      });

      return messages;
    },

    getPlaceholder(message: any): string {
      const type: PlaceholderType =
        +message.multiple === 1 ? "textarea" : message.type;
      const map = this.messageConfig!.placeholderMap || {};
      return message.placeholder || map[type] || placeholder[type];
    },

    validateMessages() {
      const values = this.messageValues;

      for (let i = 0; i < values.length; i++) {
        const { value } = values[i];
        const message = this.messages[i];

        if (value === "") {
          // 必填字段的校验
          if (String(message.required) === "1") {
            const textType = message.type === "image" ? "请上传" : "请填写";
            return textType + message.name;
          }
        } else {
          if (message.type === "tel" && !isNumeric(value)) {
            return "请填写正确的数字格式留言";
          }
          if (message.type === "mobile" && !/^\d{6,20}$/.test(value)) {
            return "手机号长度为6-20位数字";
          }
          if (message.type === "email" && !isEmail(value)) {
            return "请填写正确的邮箱";
          }
          if (
            message.type === "id_no" &&
            (value.length < 15 || value.length > 18)
          ) {
            return "请填写正确的身份证号码";
          }
        }
      }
    },
    /**
     * The phone number copied from IOS mobile phone address book
     * will add spaces and invisible Unicode characters
     * which cannot pass the /^\d+$/ verification
     * so keep numbers and dots
     */
    getFormatter(message: any): (value: string) => string {
      return function formatter(value: string) {
        if (message.type === "mobile" || message.type === "tel") {
          return value.replace(/[^\d.]/g, "");
        }

        return value;
      };
    },

    genMessage(message: any, index: number) {
      if (message.type === "image") {
        return (
          <Cell
            key={`${this.goodsId}-${index}`}
            title={message.name}
            class={bem("image-cell")}
            required={String(message.required) === "1"}
            valueClass={bem("image-cell-value")}
          >
            {/* <SkuImgUploader
              vModel={this.messageValues[index].value}
              maxSize={this.messageConfig.uploadMaxSize}
              uploadImg={this.messageConfig.uploadImg}
            /> */}
            <div class={bem("image-cell-label")}>仅限一张</div>
          </Cell>
        );
      }

      // 时间和日期使用的vant选择器
      const isDateOrTime = ["date", "time"].indexOf(message.type) > -1;
      if (isDateOrTime) {
        return (
          <SkuDateTimeField
            v-model={[this.messageValues[index].value]}
            label={message.name}
            key={`${this.goodsId}-${index}`}
            required={String(message.required) === "1"}
            placeholder={this.getPlaceholder(message)}
            type={this.getType(message)}
          />
        );
      }

      return (
        <Field
          v-model={[this.messageValues[index].value]}
          maxlength="200"
          center={!message.multiple}
          label={message.name}
          key={`${this.goodsId}-${index}`}
          required={String(message.required) === "1"}
          placeholder={this.getPlaceholder(message)}
          type={this.getType(message)}
          formatter={this.getFormatter(message)}
        />
      );
    },
  },

  render() {
    return <div class={bem()}>{this.messages.map(this.genMessage)}</div>;
  },
});
