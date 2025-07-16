<script lang="ts">
import Vue from 'vue';

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
  props: {
    canCloseBySelfClick: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    curContentKeyOrName: '',
    component: null,
  }),
  computed: {
    keysOrNamesToVNode() {
      const { $slots } = this;
      const defaultSlots = $slots.default || [];
      const keysOrNamesToVNode = defaultSlots.reduce((pre, cur) => {
        let key = cur && cur.key;
        if (!key && cur) {
          // 无 key 则尝试从组件的 name 中获取
          const {
            componentOptions: { Ctor = {} },
            tag,
          } = cur;
          const { name } = Ctor.extendOptions || {};
          if ((key = name)) {
            pre[key] = cur;
          } else {
            console.error(`[global-mask] 每一个子组件都必须设置key 或 option.name 在 ${tag}未找到`);
          }
        }
        return pre;
      }, {});
      return keysOrNamesToVNode;
    },
  },
  methods: {
    handleClickSelf(event) {
      if (this.canCloseBySelfClick && event.target === event.currentTarget) {
        this.hide();
      }
    },
    show(keyOrComponent, innerOptions = {}) {
      if (typeof keyOrComponent === 'string') {
        // 模板内组件或页面调用
        const keyOrName = keyOrComponent;
        this.curContentKeyOrName = keyOrName;
      } else if (typeof keyOrComponent === 'object' && keyOrComponent.render) {
        // 自定义组件 js 调用
        const component = keyOrComponent;
        this.component = Vue.extend({
          ...component,
          ...innerOptions,
        });
      } else {
        console.error('[global-mask] 不支持的调用参数:', keyOrComponent);
      }
    },
    hide() {
      if (this.curContentKeyOrName) {
        this.curContentKeyOrName = '';
      } else {
        this.$emit('close');
      }
    },
  },
  render(h) {
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
      target = this.keysOrNamesToVNode[this.curContentKeyOrName];
    }
    if (!target) {
      if (this.curContentKeyOrName) {
        console.error(`[global-mask] 未找到 key 或 name 为 ${this.curContentKeyOrName} 的组件`);
      }
      return h();
    } else {
      return h(
        'view',
        {
          class: 'global-mask',
          on: {
            click: this.handleClickSelf,
          },
        },
        [target],
      );
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../../../../style/less/mixin.less';

.global-mask {
  .fixed(0,0,0,0);
  .flex(center, center);
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
