import Vue, { VNode } from 'vue';
import { CreateElement, ExtendedVue, VueConstructor } from 'vue/types/vue';
import { isMiniProgram, EMPTY_OBJ } from '@script/common';

/**
 * GlobalMask 组件
 *
 * 1. 作为模板组件使用
 * 1.1 在组件或页面中使用时 使用<GlobalMask></GlobalMask>标签包裹内容
 * 1.2 其内容展示写在<GlobalMask>xxx</GlobalMask>标签内 并必须有 key
 * 1.3 在组件中使用时 直接导入 GlobalMask 组件即可, 使用 实例上show('keyOrName') 和 hide() 方法来控制显示和隐藏
 *
 * 2. 作为 API 调用
 * 2.1 使用MASK.show(component[, maskProps, innerOptions]) 来显示内容
 * 2.2 使用MASK.hide() 来隐藏内容
 */

const initialProps = {
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
    default: () => EMPTY_OBJ,
  },
};

function getInitialGlobalMaskData(): {
  curContentKeyOrName: string;
  component: null | ExtendedVue<any, any, any, any, any>;
  innerOptions: {
    inner?: Record<keyof any, any>;
    props?: Record<keyof any, any>;
    listeners?: Record<string, Function>;
  };
} {
  return {
    curContentKeyOrName: '',
    component: null,
    innerOptions: EMPTY_OBJ,
  };
}

const GlobalMaskConstructor = Vue.extend({
  name: 'GlobalMask',
  props: initialProps,
  data() {
    return getInitialGlobalMaskData();
  },
  computed: {
    isShow(): boolean {
      return !!this.curContentKeyOrName || !!this.component;
    },
    __keysOrNamesToVNode(): Record<string, VNode> {
      const { $slots } = this;
      const defaultSlots = $slots.default || [];
      const keysOrNamesToVNode = defaultSlots.reduce(
        (pre: Record<string, VNode>, cur) => {
          let key = cur && cur.key;
          if (key && typeof key === 'string') {
            // 有 key 则直接使用
            pre[key] = cur;
          } else if (cur) {
            // 无 key 则尝试从组件的 name 中获取
            const { componentOptions, tag } = cur;
            let Ctor = null;
            if (componentOptions && (Ctor = componentOptions.Ctor)) {
              const { name } = (Ctor as any).extendOptions || EMPTY_OBJ;
              if ((key = name) && typeof key === 'string') {
                pre[key] = cur;
              } else {
                console.error(`[global-mask] 每一个子组件都必须设置key 或 option.name 在 ${tag}未找到`);
              }
            }
          }
          return pre;
        },
        {} as Record<string, any>,
      );
      return keysOrNamesToVNode;
    },
    __finalStyle(): Record<string, string> {
      return {
        ...(this.innerFlexCenter
          ? { display: 'flex', 'align-items': 'center', 'justify-content': 'center' }
          : EMPTY_OBJ),
        ...this.styleObj,
      };
    },
  },
  methods: {
    handleClickSelf(event: MouseEvent): void {
      if (this.canCloseBySelfClick && event.target === event.currentTarget) {
        this.hide();
      }
    },
    show<Component extends VueConstructor<Vue>>(keyOrComponent: string | Component, options: any = EMPTY_OBJ): void {
      if (typeof keyOrComponent === 'string') {
        // 模板内组件或页面调用
        const keyOrName = keyOrComponent;
        this.curContentKeyOrName = keyOrName;
      } else if (typeof keyOrComponent === 'object' && (keyOrComponent as any).render) {
        // 自定义组件 js 调用
        const component = keyOrComponent as Component;
        this.component = Vue.extend({
          ...component,
          ...(options.inner ? options.inner : EMPTY_OBJ),
        });
        this.innerOptions = options;
      } else {
        console.error('[global-mask] 不支持的调用参数:', keyOrComponent);
      }
    },
    hide(): void {
      this.__resetState();
      this.$emit('close');
    },
    __resetState() {
      const initialState = getInitialGlobalMaskData() as Record<string, any>;
      const keys = Object.keys(initialState);
      for (const key of keys) {
        (this as Record<string, any>)[key] = initialState[key];
      }
    },
    __setPreventScroll() {
      if (this.preventScroll) {
        if (this.isShow) {
          document.body.setAttribute('memory-overflow', document.body.style.overflow);
          document.body.style.overflow = 'hidden';
        } else {
          // 首次渲染或隐藏
          document.body.style.overflow = document.body.getAttribute('memory-overflow') || document.body.style.overflow;
          document.body.removeAttribute('memory-overflow');
        }
      }
    },
    __useTransition(vnode: VNode, h: CreateElement): VNode {
      return h(
        'transition',
        {
          props: {
            appear: true,
            name: 'common-global-mask',
          },
        },
        [vnode],
      );
    },
  },
  render(h) {
    this.__setPreventScroll();
    let target = null;
    if (this.component) {
      // 自定义组件 js 调用
      target = h(this.component, {
        on: {
          close: this.hide,
          ...(this.innerOptions.listeners || EMPTY_OBJ),
        },
        props: {
          ...this.innerOptions.props,
        },
      });
    } else if (this.curContentKeyOrName) {
      // 模板组件或页面调用
      target = this.__keysOrNamesToVNode[this.curContentKeyOrName];
    }
    if (!target) {
      // 既没有自定义组件, 也没有子组件标识
      if (this.curContentKeyOrName) {
        this.__resetState();
        console.error(`[global-mask] 未找到 key 或 name 为 ${this.curContentKeyOrName} 的组件`);
      }
      return h();
    } else {
      let VNode = h(
        isMiniProgram() ? 'view' : 'div',
        {
          class: 'common-global-mask',
          style: this.__finalStyle,
          on: {
            click: this.handleClickSelf,
          },
        },
        [target],
      );
      VNode = this.useTransition ? this.__useTransition(VNode, h) : VNode;
      return VNode;
    }
  },
});

let vm: InstanceType<typeof GlobalMaskConstructor> | null = null;

function getPropsDefaults(propOption: any): Record<string, any> {
  const keys = Object.keys(propOption);
  const defaults = keys.reduce((acc: any, key) => {
    const itemDefault = propOption[key].default;
    if (typeof itemDefault === 'function') {
      acc[key] = itemDefault();
    } else if (typeof itemDefault !== undefined) {
      acc[key] = itemDefault;
    }
    return acc;
  }, {});
  return defaults;
}

const MASK = {
  name: '$MASK',
  show<Component extends VueConstructor<Vue>>(component: Component, props = EMPTY_OBJ, innerOptions = EMPTY_OBJ) {
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
    vm.show<Component>(component, innerOptions);
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

export { GlobalMaskConstructor, MASK };
