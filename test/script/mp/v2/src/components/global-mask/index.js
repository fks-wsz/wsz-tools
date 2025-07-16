import GlobalMask from './GlobalMask.vue';
import Vue from 'vue';

let vm = null;

const MASK = {
  show(component, props = {}, innerOptions = {}) {
    const MaskConstructor = Vue.extend({
      ...GlobalMask,
      ...props,
    });
    vm = new MaskConstructor();
    vm.$mount();
    document.body.appendChild(vm.$el);
    vm.$on('close', () => {
      this.hide();
    });
    vm.show(component, innerOptions);
  },
  hide() {
    if (vm) {
      document.body.removeChild(vm.$el);
      vm.$el = null;
      vm.$destroy();
      vm = null;
    } else {
      console.warn('[global-mask] 没有可关闭的遮罩层');
    }
  },
};

export default MASK;
