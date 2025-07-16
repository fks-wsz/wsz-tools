import { CombinedVueInstance, VueConstructor } from 'vue/types/vue';
import GlobalMask from './index.vue';
import Vue from 'vue';

let vm: CombinedVueInstance<
  GlobalMask,
  object,
  {
    show<Component extends Vue = Vue>(keyOrComponent: VueConstructor<Component> | string, options?: object): void;
    hide(): void;
  },
  object,
  object
> | null = null;

const MASK = {
  show(component: VueConstructor<GlobalMask>, props = {}, innerOptions = {}): void {
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
  hide(): void {
    if (vm) {
      document.body.removeChild(vm.$el);
      vm.$destroy();
      vm = null;
    } else {
      console.warn('[global-mask] 没有可关闭的遮罩层');
    }
  },
};

export default MASK;
