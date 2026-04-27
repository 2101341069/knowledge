---
title: ESLint代码规范指南
tags:
  - 前端
  - 工程化
  - ESLint
  - Prettier
  - 代码规范
created: 2026-04-27
---

# ESLint 代码规范完全指南

## 一、为什么需要代码规范

### 无规范的问题

```javascript
// ❌ 缩进混乱
function foo() {
let a=1
    if(a>0){
console.log(a)
}}

// ❌ 命名随意
let x = 10      // x 是什么？
let userData    // 驼峰？下划线？

// ❌ 魔法数字
if (status === 3) { /* 3 是什么意思？ */ }

// ❌ 潜在的 Bug
if (a = 10) { }  // 应该是 == 或 ===
a == undefined    // 边界情况判断
```

### 代码规范的价值

| 维度 | 收益 |
|------|------|
| **可读性** | 新成员快速理解代码，降低学习成本 |
| **可维护性** | 统一风格，减少无效沟通和争论 |
| **Bug 预防** | 静态检查发现潜在问题，减少调试时间 |
| **代码质量** | 最佳实践落地，长期质量有保障 |
| **团队效率** | Code Review 聚焦逻辑而非风格 |

---

## 二、ESLint 快速上手

### 安装与初始化

```bash
# 1. 安装 ESLint
npm install -D eslint
# 或
pnpm add -D eslint

# 2. 初始化配置（交互式）
npx eslint --init

# 按提示选择：
# ? How would you like to use ESLint?
#   > To check syntax, find problems, and enforce code style
# ? What type of modules does your project use?
#   > JavaScript modules (import/export)
# ? Which framework does your project use?
#   > Vue.js / React
# ? Does your project use TypeScript?
#   > Yes / No
# ? Where does your code run?
#   > Browser + Node
# ? How would you like to define a style for your project?
#   > Use a popular style guide
# ? Which style guide do you want to follow?
#   > Standard / Airbnb / XO
# ? What format do you want your config file to be in?
#   > JavaScript / YAML / JSON
```

### 基础配置文件

```javascript
// eslint.config.js（Flat Config 新格式，ESLint 8.21+）
import js from '@eslint/js'
import globals from 'globals'

export default [
  // 继承基础配置
  js.configs.recommended,
  
  // 全局变量
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        myGlobal: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  
  // 自定义规则
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2]
    }
  },
  
  // 忽略文件
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.config.js',
      '*.d.ts'
    ]
  }
]
```

### 新旧配置格式对比

| 特性 | 旧格式（.eslintrc.js） | 新格式（eslint.config.js） |
|------|----------------------|------------------------|
| 配置方式 | JSON/JS 对象 | 导出数组 |
| 继承方式 | extends: [] | 直接 import 配置对象 |
| 覆盖配置 | overrides | 多个配置对象按顺序 |
| 类型支持 | 差 | 原生支持 TypeScript |
| 插件加载 | plugins: [] | 插件对象 |
| 推荐 | 不推荐（兼容） | ✅ 官方推荐 |

### 添加脚本

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:vue": "eslint src/**/*.{js,vue}"
  }
}
```

```bash
# 运行检查
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 检查指定文件
npx eslint src/main.js src/App.vue

# 只报告错误（不输出警告）
npx eslint . --quiet
```

---

## 三、规则详解

### 规则严重程度

```javascript
rules: {
  // 'off' 或 0: 关闭规则
  'no-console': 'off',
  
  // 'warn' 或 1: 警告（不退出进程）
  'no-console': 'warn',
  
  // 'error' 或 2: 错误（退出进程，CI 失败）
  'no-console': 'error',
  
  // 带选项的规则
  'quotes': ['error', 'single', {
    avoidEscape: true,
    allowTemplateLiterals: true
  }]
}
```

### 常用核心规则

#### 1. 代码质量规则

```javascript
rules: {
  // ===== 错误预防 =====
  'no-undef': 'error',              // 禁止使用未声明的变量
  'no-unused-vars': 'error',         // 禁止未使用的变量
  'no-redeclare': 'error',           // 禁止重复声明
  'no-shadow': 'error',              // 禁止变量名与外层作用域相同
  'no-use-before-define': 'error',   // 禁止在定义前使用
  
  // ===== 最佳实践 =====
  'eqeqeq': ['error', 'always'],     // 必须使用 === 和 !==
  'curly': ['error', 'all'],         // if/for 必须有大括号
  'default-case': 'error',           // switch 必须有 default
  'no-eval': 'error',                // 禁止使用 eval
  'no-implied-eval': 'error',        // 禁止隐式 eval
  'no-new-func': 'error',            // 禁止 Function 构造函数
  'no-return-assign': 'error',       // 禁止 return 语句赋值
  'no-self-compare': 'error',        // 禁止自己和自己比较
  'no-sequences': 'error',           // 禁止逗号运算符
  'no-throw-literal': 'error',       // 只能抛 Error 对象
  'no-unused-expressions': 'error',  // 禁止无用表达式
  'no-useless-call': 'error',        // 禁止无用的 call/apply
  'no-useless-catch': 'error',       // 禁止无用的 catch
  'no-useless-return': 'error',      // 禁止无用的 return
  'no-with': 'error',                // 禁止 with
  'prefer-promise-reject-errors': 'error', // Promise reject 必须是 Error
  'require-await': 'error',          // async 函数必须有 await
  
  // ===== 复杂度控制 =====
  'complexity': ['warn', 15],        // 圈复杂度
  'max-depth': ['warn', 4],          // 最大嵌套深度
  'max-lines': ['warn', 500],        // 单文件最大行数
  'max-params': ['warn', 5],         // 函数最大参数
  'max-nested-callbacks': ['warn', 3] // 回调最大嵌套
}
```

#### 2. 代码风格规则

```javascript
rules: {
  // ===== 格式规范 =====
  'indent': ['error', 2],             // 缩进 2 空格
  'linebreak-style': ['error', 'unix'], // 换行符 LF
  'quotes': ['error', 'single'],      // 使用单引号
  'semi': ['error', 'never'],         // 不加分号
  'semi-spacing': ['error', {         // 分号前后空格
    before: false,
    after: true
  }],
  
  // ===== 空白字符 =====
  'comma-spacing': ['error', {         // 逗号前后空格
    before: false,
    after: true
  }],
  'key-spacing': ['error', {           // 对象键值冒号空格
    beforeColon: false,
    afterColon: true
  }],
  'keyword-spacing': ['error', {        // 关键字前后空格
    before: true,
    after: true
  }],
  'space-before-function-paren': ['error', { // 函数括号前空格
    anonymous: 'always',
    named: 'never',
    asyncArrow: 'always'
  }],
  'space-in-parens': ['error', 'never'],    // 括号内不加空格
  'array-bracket-spacing': ['error', 'never'], // 数组括号空格
  'object-curly-spacing': ['error', 'always'], // 对象大括号空格
  
  // ===== 逗号风格 =====
  'comma-style': ['error', 'last'],      // 逗号在行尾
  'comma-dangle': ['error', 'always-multiline'], // 多行尾逗号
  
  // ===== 命名规范 =====
  'camelcase': ['error', {               // 驼峰命名
    properties: 'always',
    ignoreDestructuring: false
  }],
  'new-cap': ['error', {                  // 构造函数首字母大写
    newIsCap: true,
    capIsNew: true
  }],
  
  // ===== 其他风格 =====
  'eol-last': ['error', 'always'],        // 文件末尾空行
  'no-trailing-spaces': 'error',          // 禁止行尾空格
  'no-multiple-empty-lines': ['error', {   // 禁止多行空行
    max: 2,
    maxBOF: 0,
    maxEOF: 1
  }],
  'one-var': ['error', 'never'],          // 每个声明单独一行
  'one-var-declaration-per-line': 'error',
  'padded-blocks': ['error', 'never'],     // 块首行/末行不空
  'spaced-comment': ['error', 'always'],    // 注释符号后空格
}
```

#### 3. ES6+ 相关规则

```javascript
rules: {
  // ===== 箭头函数 =====
  'arrow-spacing': ['error', {
    before: true,
    after: true
  }],
  'arrow-body-style': ['error', 'as-needed'], // 省略大括号
  'arrow-parens': ['error', 'as-needed'],     // 参数省略括号
  'no-confusing-arrow': 'error',             // 避免歧义箭头
  
  // ===== 解构 =====
  'prefer-destructuring': ['error', {        // 优先使用解构
    array: true,
    object: true
  }],
  'object-shorthand': ['error', 'always'],   // 对象简写
  
  // ===== 模板字符串 =====
  'prefer-template': 'error',                // 优先模板字符串
  'template-curly-spacing': ['error', 'never'], // ${ } 内无空格
  
  // ===== 其他 ES6+ =====
  'no-var': 'error',                         // 禁止 var
  'prefer-const': 'error',                   // 优先用 const
  'prefer-rest-params': 'error',             // 优先剩余参数
  'prefer-spread': 'error',                  // 优先展开运算符
  'generator-star-spacing': ['error', {      // generator 星号位置
    before: false,
    after: true
  }],
  'rest-spread-spacing': ['error', 'never'], // 剩余/展开运算符空格
  'no-duplicate-imports': 'error',           // 禁止重复 import
  'no-useless-computed-key': 'error',        // 禁止无用计算属性
  'no-useless-rename': 'error',              // 禁止无意义重命名
  'symbol-description': 'error',             // Symbol 必须有描述
}
```

---

## 四、Prettier 集成

### 为什么需要 Prettier

**ESLint 负责：**
- ✅ 代码质量问题（未使用变量、潜在 Bug）
- ✅ 部分风格问题（缩进、引号）

**Prettier 负责：**
- ✅ 完整的代码格式化（换行、空格、对齐等）
- ✅ 支持 JS/TS、CSS、HTML、Markdown 等
- ✅ 统一的格式化规则，零配置决策

### 安装配置

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

```javascript
// eslint.config.js
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  prettier,  // 放在最后（会禁用 ESLint 与 Prettier 冲突的规则）
  
  // 自定义 Prettier 规则
  {
    rules: {
      'prettier/prettier': ['error', {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
        trailingComma: 'es5',
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'avoid',
        printWidth: 100,
        endOfLine: 'lf'
      }]
    }
  }
]
```

### .prettierrc 独立配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "printWidth": 100,
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false,
  "overrides": [
    {
      "files": ["*.json", "*.md"],
      "options": {
        "printWidth": 120
      }
    }
  ]
}
```

### .prettierignore 忽略文件

```
node_modules/
dist/
build/
*.min.js
package.json
package-lock.json
pnpm-lock.yaml
```

---

## 五、TypeScript 支持

### 安装配置

```bash
pnpm add -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  
  // TypeScript 特定配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,        // 读取 tsconfig.json
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // 类型相关
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // 变量
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      
      // 函数
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      
      // 代码质量
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      
      // 统一数组类型
      '@typescript-eslint/array-type': ['error', {
        default: 'array-simple'
      }],
      
      // 导入
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports'
      }],
      '@typescript-eslint/no-import-type-side-effects': 'error'
    }
  }
)
```

---

## 六、Vue 项目集成

### eslint-plugin-vue

```bash
pnpm add -D vue-eslint-parser eslint-plugin-vue
```

```javascript
// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/recommended'],
  
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    rules: {
      // Vue 模板规则
      'vue/html-indent': ['error', 2],
      'vue/html-self-closing': ['error', {
        html: { void: 'always' },
        svg: 'always',
        math: 'always'
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1
      }],
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always'
      }],
      
      // Vue 脚本规则
      'vue/script-setup-uses-vars': 'error',
      'vue/no-setup-props-destructure': 'off',
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits', 'defineExpose']
      }],
      
      // API 顺序
      'vue/component-tags-order': ['error', {
        order: ['script', 'template', 'style']
      }],
      
      // 其他
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off' // TS 项目中可关闭
    }
  }
]
```

---

## 七、React 项目集成

```bash
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

```javascript
// eslint.config.js
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import a11y from 'eslint-plugin-jsx-a11y'

export default [
  js.configs.recommended,
  
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': a11y },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要
      'react/prop-types': 'off',          // 用 TS 替代
      'react/display-name': 'off',
      
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: { version: 'detect' }
    }
  }
]
```

---

## 八、代码规范体系推荐

### 1. 社区主流规范对比

| 规范 | 特点 | 适用场景 | 严格程度 |
|------|------|---------|---------|
| **Airbnb** | 最严格，规则最全，文档完善 | 大型团队、企业项目 | ⭐️⭐️⭐️⭐️⭐️ |
| **Standard** | 无分号风格，激进简约 | 小团队、追求极简 | ⭐️⭐️⭐️⭐️ |
| **XO** | Standard 的增强版 | 喜欢 Standard 风格 | ⭐️⭐️⭐️⭐️ |
| **ESLint Recommended** | 官方推荐，仅错误检查 | 基础配置，自定义 | ⭐️⭐️ |
| **@antfu/eslint-config** | 现代、简洁、TS/Vue 友好 | 现代前端项目 | ⭐️⭐️⭐️ |

### 2. 从零配置一套规范（推荐）

```bash
# 使用 @antfu/eslint-config，一站式配置
pnpm add -D eslint @antfu/eslint-config
```

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  // 启用 Stylistic 格式化规则（替代 Prettier）
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false
  },
  
  // TypeScript 自动检测
  typescript: true,
  vue: true,    // 启用 Vue 支持
  react: false, // 不需要关闭
  
  // 自定义规则覆盖
  rules: {
    'no-console': 'off',
    'vue/multi-word-component-names': 'off'
  }
})
```

### 3. 规则配置最佳实践

✅ **推荐做法：**
- 从 recommended 规则集开始
- 遇到不符合团队习惯的规则再逐个关闭
- 规则修改要在团队评审通过
- 解释每条自定义规则的原因

❌ **不推荐：**
- 全部规则关掉等于没配
- 配置一大堆互相冲突的规则
- 频繁修改规则引起混乱

---

## 九、VS Code 集成

### 1. 安装插件

- **ESLint** - Microsoft 官方
- **Prettier** - Prettier 官方

### 2. settings.json 配置

```json
{
  // 编辑器设置
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // 默认格式化工具
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[jsonc]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  
  // ESLint 配置
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "markdown",
    "json",
    "jsonc"
  ],
  "eslint.workingDirectories": [{ "mode": "auto" }],
  
  // 文件关联
  "files.associations": {
    "*.vue": "vue"
  }
}
```

### 3. .vscode/extensions.json 推荐插件

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vue.volar"
  ]
}
```

---

## 十、常见问题

### 1. ESLint 不生效？

检查清单：
1. ✅ VS Code 安装了 ESLint 插件
2. ✅ 项目根目录有 eslint.config.js / .eslintrc.js
3. ✅ 右下角 ESLint 图标是 ✓ 而不是 ⚠️
4. ✅ 重启 ESLint 服务：`Ctrl+Shift+P` → ESLint: Restart
5. ✅ 检查输出面板：`Ctrl+Shift+U` → 选择 ESLint

### 2. 规则冲突？

```bash
# 查看规则来源
npx eslint --print-config src/main.js

# Prettier 和 ESLint 冲突？
# 确保 eslint-config-prettier 在 extends 数组最后
```

### 3. 临时禁用规则

```javascript
// 禁用整行
// eslint-disable-next-line
const a = 10

// 禁用单个规则
// eslint-disable-next-line no-console
console.log('debug')

// 禁用多个规则
// eslint-disable-next-line no-console, no-unused-vars

// 禁用整个文件（放在文件开头）
/* eslint-disable */

// 禁用文件内特定规则
/* eslint-disable no-console */

// 重新启用
/* eslint-enable no-console */
```

### 4. 忽略特定文件

```javascript
// eslint.config.js
export default [
  // 方式一：全局 ignores 配置
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.config.*',
      '*.d.ts',
      '**/fixtures/**'
    ]
  }
]

// 方式二：.eslintignore 文件（旧格式）
node_modules/
dist/
*.min.js
```

---

## 总结

| 配置项 | 推荐方案 |
|--------|---------|
| **配置格式** | Flat Config (`eslint.config.js`) |
| **规则集** | 从 recommended 开始，按需调整 |
| **格式化** | Prettier 或 ESLint Stylistic |
| **VS Code** | 保存自动修复 |
| **Vue 项目** | eslint-plugin-vue |
| **TS 项目** | @typescript-eslint |
| **一站式** | @antfu/eslint-config（推荐） |

**下一篇：** [Husky与Git钩子指南](./03-Husky与Git钩子指南.md)
