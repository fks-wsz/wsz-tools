import { getDOM, print } from '../../dist/script/browser/index.js';
import { callAndCatch, debounce, throttle } from '../../dist/script/common/index.js';

const btnEl = document.getElementById('btn');

window.addEventListener(
  'scroll',
  debounce(
    () => {
      console.log('执行');
      throw Error('测试错误');
    },
    1000,
    {
      immediate: true,
      maxDelay: 3000,
    },
  ),
);
