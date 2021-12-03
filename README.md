[![Version](https://img.shields.io/npm/dt/vant-next-sku-emiyagm.svg?style=flat-square)](https://www.npmjs.com/package/vant-next-sku-emiyagm)
[![Downloads](https://img.shields.io/npm/v/vant-next-sku-emiyagm.svg?style=flat-square)](https://www.npmjs.com/package/vant-next-sku-emiyagm)
[![GitHub stars](https://img.shields.io/github/stars/emiyagm/vant-next-sku.svg?style=flat-square)](https://github.com/emiyagm/vant-next-sku/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/emiyagm/vant-next-sku.svg?style=flat-square)](https://github.com/emiyagm/vant-next-sku/issues)
[![GitHub forks](https://img.shields.io/github/forks/emiyagm/vant-next-sku.svg?style=flat-square)](https://github.com/emiyagm/vant-next-sku/network)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/emiyagm/vant-next-sku)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/emiyagm/vant-next-sku)

[![NPM](https://nodei.co/npm/vant-next-sku-emiyagm.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vant-next-sku-emiyagm)
# vant-next-sku-emiyagm

源自于 Vant2.0 框架中的 Sku 商品规格组件，为了适配 Vue3.0 和 Vite，重新做了调整。源插件来自于 https://github.com/edram/vant-next-sku, 本插件是修复了其中的一些问题。

## Install

npm 安装：

```bash
npm i vant-next-sku-emiyagm --save
```

yarn 安装：

```bash
yarn add vant-next-sku-emiyagm --save
```

## Useage

### 组件内使用

```js
import VanSku from 'vant-next-sku-emiyagm';
export default {
  components: {
    VanSku,
  },
};
```

## 代码演示及相关配置

代码演示及相关配置请参考：https://youzan.github.io/vant/#/zh-CN/sku

## 近期更新 v0.0.2 🎉

- 修复: 步进器修改数量后，获取到的商品数量信息没有发生变化