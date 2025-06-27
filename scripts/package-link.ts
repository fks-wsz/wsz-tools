import { exec } from 'child_process';
import path from 'path';
import { CWD, TEST_PATH } from '../constants';

/**
 * @description 本地链接包
 * @param {string} cwd - 工作目录
 * @param {string} packagePath - 包路径(相对于cwd 或绝对路径)
 */
function linkPackage(cwd: string, packagePath: string) {
  const command = `npm link ${packagePath}`;
  exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error linking package in ${cwd}:`, error);
      return;
    }
    if (stderr) {
      console.error(`Error output from linking in ${cwd}:`, stderr);
    }
    if (stdout) {
      console.log(`Output from linking in ${cwd}:`, stdout);
      return;
    }
    console.log('npm 包链接成功');
  });
}

linkPackage(TEST_PATH, path.join(CWD, '../', 'wsz-tools'));
