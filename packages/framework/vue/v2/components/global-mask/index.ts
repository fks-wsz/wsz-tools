import { GlobalMaskConstructor, MASK } from './src/mask';
import Vue, { PluginObject } from 'vue';

const _Vue = Vue;

(GlobalMaskConstructor as unknown as PluginObject<void>).install = (Vue: typeof _Vue) => {
  Vue.component(GlobalMaskConstructor.name, GlobalMaskConstructor);
};

export { GlobalMaskConstructor as GlobalMask, MASK };
