import GlobalMask from './index.vue';
import MASK from './main';

GlobalMask.install = (Vue) => {
  Vue.component(GlobalMask.name, GlobalMask);
};

export { GlobalMask, MASK };
