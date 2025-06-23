# 开发标准汇总

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> [warning]
> 注明 peer dependencies

## 1. 样式类

### 1.1 通用样式(基于 less, scss, stylus(?))

> [warning]
> 注意预编译器版本

#### 1.1.1 mixin

#### 1.1.2 变量(多数据类型)

---

## 2. Javascript 类

> [!warning]
> 不受框架限制

### 2.1 常用工具函数

> [warning]
>
> 1.  多环境支持, 尽量使用适配器模式与复用
> 2.  注意类型检查与错误捕获
> 3.  注释与 example
> 4.  禁止重写关键字或全局函数 API
> 5.  函数重载(?)

#### 2.1.1 Nodejs 环境

#### 2.1.2 浏览器环境

#### 2.1.3 小程序环境(uniapp)

---

## 3. 框架类

### 3.1 Vue2.6.14/3(?)

#### 3.1.1 directive

### 3.2 Nestjs(?)

#### 3.2.1 Middlewares

#### 3.2.2 Guards

#### 3.2.3 Pipes

---

## 4. 代码风格类

### 4.1 css(stylelint 15.11.0)

### 4.2 js/ts(eslint 8.57.0)

### 4.3 git(commitlint 18.6.1 + commitizen 4.2.6 + commitlint-config-cz 0.13.3 + cz-customizable 7.4.0 + lint-staged 15.5.2)

### 4.4 code(prettier 3.5.3)
