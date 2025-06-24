import { exec } from 'child_process';
import { __DEV__, CWD } from '../constants';

function buildDts() {
  let command = `tsc --project ./packages/tsconfig.node.json && tsc --project ./packages/tsconfig.browser.json && tsc --project ./packages/tsconfig.mp.json && tsc --project ./packages/tsconfig.common.json`,
    cwd = CWD;
  exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log('类型声明生成成功！');
  });
}

buildDts();
