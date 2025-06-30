import { writeClipboard } from 'wsz-tools/script/browser';

const btn = document.getElementById('btn') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// 设置 canvas
const ctx = canvas.getContext('2d');
ctx!.fillStyle = 'cornflowerblue';
ctx!.fillRect(0, 0, 100, 100);

btn.addEventListener('click', () => {
  const text = 'Hello, World!';
  const a = { addresss: '123' };
  writeClipboard(a);
});
