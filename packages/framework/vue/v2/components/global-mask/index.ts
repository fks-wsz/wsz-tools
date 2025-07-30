import { GlobalMaskConstructor, MASK, GlobalMaskName } from './src/mask';
import Vue, { PluginObject } from 'vue';

const _Vue = Vue;

(GlobalMaskConstructor as unknown as PluginObject<void>).install = (Vue: typeof _Vue) => {
  Vue.component(GlobalMaskName, GlobalMaskConstructor);
};

export { GlobalMaskConstructor as GlobalMask, MASK };
