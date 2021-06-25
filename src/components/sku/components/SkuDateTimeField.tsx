import { defineComponent, PropType } from "vue";
import { createNamespace } from "vant/lib/utils";
const [name, bem] = createNamespace("sku-datetime-field");

import { stringToDate, dateToString } from "../utils/time-helper";

// Components
import Popup from "vant/lib/popup";
import DateTimePicker from "vant/lib/datetime-picker";
import Field from "vant/lib/field";

const format = {
  year: "年",
  month: "月",
  day: "日",
  hour: "时",
  minute: "分",
};

const title = {
  date: "选择年月日",
  time: "选择时间",
  datetime: "选择日期时间",
};

type FormatType = "year" | "month" | "day" | "hour" | "minute";

export default defineComponent({
  name,

  props: {
    value: String,
    label: String,
    required: Boolean,
    placeholder: String,
    type: {
      type: String as PropType<"date" | "time" | "datetime">,
      default: "date",
    },
  },

  data() {
    return {
      showDatePicker: false,
      currentDate: this.type === "time" ? "" : new Date(),
      minDate: new Date(new Date().getFullYear() - 60, 0, 1),
    };
  },

  watch: {
    value(val) {
      switch (this.type) {
        case "time":
          this.currentDate = val;
          break;
        case "date":
        case "datetime":
          this.currentDate = stringToDate(val) || new Date();
          break;
      }
    },
  },

  computed: {
    title(): string {
      return title[this.type];
    },
  },

  methods: {
    onClick() {
      this.showDatePicker = true;
    },
    onConfirm(val: Date | string) {
      let data = val;
      if (this.type !== "time") {
        data = dateToString(val, this.type) as string;
      }
      this.$emit("input", data);
      this.showDatePicker = false;
    },
    onCancel() {
      this.showDatePicker = false;
    },
    formatter(type: FormatType, val: string): string {
      const word = format[type];
      return `${val}${word}`;
    },
  },

  render() {
    return (
      <Field
        readonly
        is-link
        center
        value={this.value}
        label={this.label}
        required={this.required}
        placeholder={this.placeholder}
        onClick={this.onClick}
        v-slots={{
          extra: () => (
            <Popup
              v-model={[this.showDatePicker, "show"]}
              round
              position="bottom"
              teleport="body"
            >
              <DateTimePicker
                type={this.type}
                title={this.title}
                value={this.currentDate}
                minDate={this.minDate}
                formatter={this.formatter}
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
              />
            </Popup>
          ),
        }}
      ></Field>
    );
  },
});
