import { writeClipboard, Logger } from 'wsz-tools/script/browser';

const btn = document.getElementById('btn') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const logger = new Logger();

logger.log('This is an error log message', { key: 1 });
logger.logScoped('MAYBE FE', 'This is an error log message', { key: 1 });
logger.error('This is an error log message', { key: 1 });
logger.errorScoped('MAYBE BE', 'This is an error log message', { key: 1 });
logger.warn('This is an error log message', { key: 1 });
logger.warnScoped('123', 'This is an error log message', { key: 1 });
logger.info('This is an error log message', { key: 1 });
logger.infoScoped('FKS', 'This is an error log message', { key: 1 });

// 设置 canvas
const ctx = canvas.getContext('2d');
ctx!.fillStyle = 'cornflowerblue';
ctx!.fillRect(0, 0, 100, 100);

btn.addEventListener('click', () => {
  const text = 'Hello, World!';
  const a = { addresss: '123' };
  writeClipboard(a);
});
