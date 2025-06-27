import { debounce } from 'wsz-tools/script/browser';

const btn = document.getElementById('btn');

btn.addEventListener(
  'click',
  debounce(() => {
    console.log('Button clicked!');
  }, 1000),
);
