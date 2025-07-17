import { GlobalMask, MASK } from './components/global-mask';

const COMPONENTS = [GlobalMask];

const APIS = [MASK];

const install = (Vue) => {
  COMPONENTS.forEach((component) => {
    Vue.component(component.name, component);
  });

  APIS.forEach((api) => {
    Vue.prototype[api.name] = api;
  });
};

export default install;
export { GlobalMask };
export { MASK };
