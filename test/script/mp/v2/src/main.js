import Vue from 'vue';
import App from './App';
import './uni.promisify.adaptor';
import CommonUI from 'wsz-tools/framework/vue2';
import '../../../../../dist/framework/vue/v2/index.css';

Vue.use(CommonUI);
Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
});
app.$mount();
