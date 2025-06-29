import { debounce, writeClipboard } from 'wsz-tools/script/browser';

const btn = document.getElementById('btn');
const canvas = document.getElementById('canvas');

// 设置 canvas
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'cornflowerblue';
ctx.fillRect(0, 0, 100, 100);

btn.addEventListener('click', () => {
  const text = 'Hello, World!';
  writeClipboard(canvas, (err) => {
    console.log('err --->', err);
  }).then((res) => {
    console.log('res --->', res);
  });
});
