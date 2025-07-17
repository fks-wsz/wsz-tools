<script>
import Vue from 'vue';
import { initialProps, initGlobalMaskState } from './main';

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

export default {
  name: 'GlobalMask',
  props: initialProps,
  data() {
    return initGlobalMaskState();
  },
  computed: {
    isShow() {
      return !!this.curContentKeyOrName || !!this.component;
    },
    __keysOrNamesToVNode() {
      const { $slots } = this;
      const defaultSlots = $slots.default || [];
      const keysOrNamesToVNode = defaultSlots.reduce((pre, cur) => {
        let key = cur && cur.key;
        if (key) {
          // 有 key 则直接使用
          pre[key] = cur;
        } else if (cur) {
          // 无 key 则尝试从组件的 name 中获取
          const { componentOptions, tag } = cur;
          let Ctor = null;
          if (componentOptions && (Ctor = componentOptions.Ctor)) {
            const { name } = Ctor.extendOptions || {};
            if ((key = name)) {
              pre[key] = cur;
            } else {
              console.error(`[global-mask] 每一个子组件都必须设置key 或 option.name 在 ${tag}未找到`);
            }
          }
        }
        return pre;
      }, {});
      return keysOrNamesToVNode;
    },
    __finalStyle() {
      return {
        ...(this.innerFlexCenter ? { display: 'flex', 'align-items': 'center', 'justify-content': 'center' } : {}),
        ...this.styleObj,
      };
    },
  },
  methods: {
    handleClickSelf() {
      if (this.canCloseBySelfClick && event.target === event.currentTarget) {
        this.hide();
      }
    },
    show(keyOrComponent, options = {}) {
      if (typeof keyOrComponent === 'string') {
        // 模板内组件或页面调用
        const keyOrName = keyOrComponent;
        this.curContentKeyOrName = keyOrName;
      } else if (typeof keyOrComponent === 'object' && keyOrComponent.render) {
        // 自定义组件 js 调用
        const component = keyOrComponent;
        this.component = Vue.extend({
          ...component,
          ...(options.inner ? options.inner : {}),
        });
      } else {
        console.error('[global-mask] 不支持的调用参数:', keyOrComponent);
      }
    },
    hide() {
      this.__resetState();
      this.$emit('close');
    },
    __resetState() {
      const initialState = initGlobalMaskState();
      const keys = Object.keys(initialState);
      for (const key of keys) {
        this[key] = initialState[key];
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
    __useTransition(vnode, h) {
      return h(
        'transition',
        {
          props: {
            appear: true,
            name: 'wsz-global-mask',
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
        this.console.error(`[global-mask] 未找到 key 或 name 为 ${this.curContentKeyOrName} 的组件`);
      }
      return h();
    } else {
      let VNode = h(
        'view',
        {
          class: 'wsz-global-mask',
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
};
</script>

<style lang="less">
@import '../../../../../style/less/mixin.less';

.wsz-global-mask {
  .fixed(0,0,0,0);
  background-color: rgba(0, 0, 0, 0.8);
}

.wsz-global-mask-enter,
.wsz-global-mask-leave-to {
  opacity: 0;
}
.wsz-global-mask-enter-to,
.wsz-global-mask-leave {
  opacity: 1;
}

.wsz-global-mask-enter-active,
.wsz-global-mask-leave-active {
  transition: opacity 0.3s ease-in-out;
}
</style>
