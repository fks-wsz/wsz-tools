import { exec } from 'child_process';
import { __DEV__, CWD } from '../constants';

function buildDts() {
  let command = '',
    cwd = CWD;
  if (__DEV__) {
    command = `tsc --project ./packages/tsconfig.node.json --declarationDir ./test/dist/types/node && tsc --project ./packages/tsconfig.browser.json --declarationDir ./test/dist/types/browser && tsc --project ./packages/tsconfig.mp.json --declarationDir ./test/dist/types/mp && tsc --project ./packages/tsconfig.common.json --declarationDir ./test/dist/types/common`;
  } else {
    command = `tsc --project ./packages/tsconfig.node.json && tsc --project ./packages/tsconfig.browser.json && tsc --project ./packages/tsconfig.mp.json && tsc --project ./packages/tsconfig.common.json`;
  }
  exec(command, { cwd }, (error, stdout, stderr) => {});
}

buildDts();
