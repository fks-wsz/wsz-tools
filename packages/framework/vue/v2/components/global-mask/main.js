import GlobalMask from './index.vue';
import Vue from 'vue';

/**
 * NOTE:
 * 1. 引入的.vue 组件为 Component extends Vue
 * 2. Vue.extend() 接收类型为 ComponentOptions<Vue, Data, Methods, Computed, Props, ...> 返回值为 ExtendedVue
 * 3. 定义Props 使用PropsDefinition
 * 4. 组件实例为 CombinedVueInstance<Instance, Data, Methods, Computed, Props>
 */

let vm = null;

export function initGlobalMaskState() {
  return {
    curContentKeyOrName: '',
    component: null,
  };
}

export const initialProps = {
  // 点击mask 是否关闭
  canCloseBySelfClick: {
    type: Boolean,
    default: true,
  },
  // 是否阻止滚动
  preventScroll: {
    type: Boolean,
    default: true,
  },
  // 是否使用过渡动画
  useTransition: {
    type: Boolean,
    default: true,
  },
  // 是否使用 flex 居中
  innerFlexCenter: {
    type: Boolean,
    default: true,
  },
  // mask 样式
  styleObj: {
    type: Object,
    default: () => ({}),
  },
};

function getPropsDefaults(propOption) {
  const keys = Object.keys(propOption);
  const defaults = keys.reduce((acc, key) => {
    const itemDefault = propOption[key].default;
    if (typeof itemDefault === 'function') {
      acc[key] = itemDefault();
    } else if (typeof itemDefault !== undefined) {
      acc[key] = itemDefault;
    }
    return acc;
  }, {});
  console.log('defaults --->', defaults);
  return defaults;
}

const MASK = {
  name: '$MASK',
  show(component, props = {}, innerOptions = {}) {
    const GlobalMaskConstructor = Vue.extend(GlobalMask);
    vm = new GlobalMaskConstructor({
      propsData: {
        ...getPropsDefaults(initialProps),
        ...props,
      },
    });
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
      vm.$destroy();
      vm = null;
    } else {
      console.warn('[global-mask] 没有可关闭的遮罩层');
    }
  },
};

export default MASK;
