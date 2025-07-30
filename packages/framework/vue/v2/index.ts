import { PluginObject } from 'vue';
import { GlobalMask, MASK } from './components/global-mask';

const COMPONENTS = [GlobalMask];

const APIS = [MASK];

const install = (Vue: any) => {
  COMPONENTS.forEach((component) => {
    (component as unknown as PluginObject<void>).install(Vue);
  });

  APIS.forEach((api) => {
    Vue.prototype[api.name] = api;
  });
};

export default install;
export { GlobalMask };
export { MASK };
