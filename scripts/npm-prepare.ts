import { exec } from 'child_process';

/**
 * @description 配置项目git
 * @returns {void}
 */
function setRepoGit(): void {
  // 关闭外部git 编辑器 设置husky
  const command = 'git config core.editor true && husky || true';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error when exec npm prepare hook in: setRepoGit`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
    console.log('Invoke setRepoGit success!');
  });
}

setRepoGit();
