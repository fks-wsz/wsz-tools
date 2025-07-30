import { theme } from '@script/common';

/** @description 日志等级 */
export type LogLevel = 'log' | 'error' | 'warn' | 'info';
const commonTagStyle = `font-weight: bold;border-radius: 5px`,
  commonTagScopeStyle = `font-weight: bold;border-radius: 5px 0 0 5px`,
  commonScopeStyle = `font-weight: bold;border-radius: 0 5px 5px 0`;
// 日志等级标签样式
const tagStyleRecord: Record<LogLevel, string> = {
  log: `background: ${theme.blue};color: ${theme.white};`,
  error: `background: ${theme.red};color: ${theme.white};`,
  warn: `background: ${theme.orange};color: ${theme.white};`,
  info: `background: ${theme.gray};color: ${theme.white};`,
};
// 作用域样式
const scopeStyleRecord: Record<LogLevel, string> = {
  log: `background: ${theme.lightBlue};color: ${theme.black};${commonScopeStyle}`,
  error: `background: ${theme.lightRed};color: ${theme.black};${commonScopeStyle}`,
  warn: `background: ${theme.lightOrange};color: ${theme.black};${commonScopeStyle}`,
  info: `background: ${theme.lightGray};color: ${theme.black};${commonScopeStyle}`,
};

export class Logger {
  private static instance: Logger;
  private static isDisabled = false;

  /**
   * @description 禁用格式化日志输出
   */
  static disabled(): void {
    Logger.isDisabled = true;
  }

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  private printf(logLevel: LogLevel, withScoped: boolean, ...args: any[]): void {
    if (Logger.isDisabled) {
      console[logLevel](args);
      return;
    }
    const { beFormatStr, formatArgs } = this.resolveLogLevelTag(logLevel, withScoped);
    // 如果有scope 默认args 剩余参数第一项为 scope 字符串
    console.log(beFormatStr, ...formatArgs, ...args);
  }

  /**
   * @description 解析日志等级和作用域
   * @param {LogLevel} logLevel 日志等级
   * @param {boolean} withScoped 是否带有作用域
   * @returns
   */
  private resolveLogLevelTag(logLevel: LogLevel, withScoped: boolean = false) {
    const tagStr = logLevel.charAt(0).toUpperCase() + logLevel.slice(1),
      formatArgs = [];
    let willFormatStr = '';

    // 处理日志等级
    willFormatStr += `%c ${tagStr} `;
    const additionalTagStyle = withScoped ? commonTagScopeStyle : commonTagStyle;
    formatArgs.push(tagStyleRecord[logLevel] + additionalTagStyle);

    // 处理作用域
    if (withScoped) {
      willFormatStr += `%c %s `;
      formatArgs.push(scopeStyleRecord[logLevel]);
    }
    return {
      beFormatStr: willFormatStr,
      formatArgs,
    };
  }

  log(...args: any[]): void {
    this.printf('log', false, ...args);
  }

  logScoped(scope: string, ...args: any[]): void {
    this.printf('log', true, scope, ...args);
  }

  error(...args: any[]): void {
    this.printf('error', false, ...args);
  }

  errorScoped(scope: string, ...args: any[]): void {
    this.printf('error', true, scope, ...args);
  }

  warn(...args: any[]): void {
    this.printf('warn', false, ...args);
  }

  warnScoped(scope: string, ...args: any[]): void {
    this.printf('warn', true, scope, ...args);
  }

  info(...args: any[]): void {
    this.printf('info', false, ...args);
  }

  infoScoped(scope: string, ...args: any[]): void {
    this.printf('info', true, scope, ...args);
  }
}

export default Logger;
