---
title: tsconfig.json详解
tags:
  - 前端
  - TypeScript
  - tsconfig
  - 编译配置
created: 2026-04-29
---

# tsconfig.json 详解

## 一、tsconfig.json 概览

`tsconfig.json` 是 TypeScript 项目的**编译配置文件**，控制类型检查严格程度、编译目标、模块系统等一切编译行为。

```bash
# 生成默认配置
tsc --init
```

---

## 二、文件包含配置

```json
{
  // 指定要编译的文件（glob 模式）
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts"
  ],

  // 排除的文件/目录
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "**/*.spec.ts",
    "**/*.test.ts"
  ],

  // 精确指定要编译的文件（很少用）
  "files": [
    "src/main.ts",
    "src/types.d.ts"
  ]
}
```

> 💡 `exclude` 默认已包含 `node_modules`、`bower_components`、`jspm_packages`、`outDir`。

---

## 三、编译选项详解

### 3.1 基础编译目标

```json
{
  "compilerOptions": {

    // ==================== 目标环境 ====================

    // 编译产物的 JS 版本
    // ES3 | ES5 | ES2015~ES2022 | ESNext
    "target": "ES2020",

    // 编译时可用的内置库
    // 决定哪些全局类型（Array、Promise、DOM 等）可用
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // 模块系统
    // CommonJS | ESNext | NodeNext | AMD | UMD 等
    "module": "ESNext",

    // 模块解析策略
    // "node" | "node16" | "nodenext" | "bundler" | "classic"
    "moduleResolution": "bundler"
  }
}
```

---

### 3.2 输入输出配置

```json
{
  "compilerOptions": {

    // ==================== 输入 ====================

    // 根目录（用于计算输出文件路径）
    "rootDir": "src",

    // 允许多个根目录
    "rootDirs": ["src", "generated"],

    // ==================== 输出 ====================

    // 编译输出目录
    "outDir": "dist",

    // 将所有文件合并为一个（只用于 AMD/SystemJS）
    "outFile": "dist/bundle.js",

    // 是否移除注释
    "removeComments": true,

    // 是否生成 JS 文件（false = 仅做类型检查）
    "noEmit": false,

    // 仅做类型检查，不生成文件
    // "noEmit": true,

    // ==================== Source Map ====================

    // 生成 .js.map 文件
    "sourceMap": true,

    // 将 sourcemap 内联到 JS 文件中
    "inlineSourceMap": false,

    // 在 sourcemap 中包含源码内容
    "inlineSources": false,

    // ==================== 声明文件 ====================

    // 生成 .d.ts 声明文件
    "declaration": true,

    // 生成 .d.ts.map 文件
    "declarationMap": true,

    // 声明文件输出目录（默认和 outDir 相同）
    "declarationDir": "types"
  }
}
```

---

### 3.3 严格类型检查

这是最重要的一组配置：

```json
{
  "compilerOptions": {

    // ==================== 严格模式（开关总控制） ====================

    // 开启所有严格检查（相当于下面所有选项都设为 true）
    "strict": true,

    // ==================== 各项严格检查 ====================

    // 禁止隐式 any 类型
    // function foo(a) {}  ← a 会是隐式 any，报错
    "noImplicitAny": true,

    // 严格 null 检查
    // 让 null/undefined 不能赋值给其他类型
    "strictNullChecks": true,

    // 严格函数类型（逆变参数检查）
    "strictFunctionTypes": true,

    // 严格 bind/call/apply 类型检查
    "strictBindCallApply": true,

    // 类属性必须在构造函数中初始化
    "strictPropertyInitialization": true,

    // 禁止隐式 this 的 any 类型
    "noImplicitThis": true,

    // 始终使用严格模式（添加 "use strict"）
    "alwaysStrict": true,

    // ==================== 额外严格检查（不在 strict 中）====================

    // 检查 switch 语句 case 穿透
    "noFallthroughCasesInSwitch": true,

    // 检查未使用的局部变量
    "noUnusedLocals": true,

    // 检查未使用的函数参数
    "noUnusedParameters": true,

    // 函数必须有显式的返回语句
    "noImplicitReturns": true,

    // 禁止访问对象上未声明的属性
    "noUncheckedIndexedAccess": true,

    // 精确的可选属性类型
    "exactOptionalPropertyTypes": true
  }
}
```

---

### 3.4 模块导入配置

```json
{
  "compilerOptions": {

    // ==================== 路径解析 ====================

    // 基础 URL，用于非相对路径的根
    "baseUrl": ".",

    // 路径别名
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@hooks/*": ["src/hooks/*"]
    },

    // 声明文件的根目录（默认：node_modules/@types）
    "typeRoots": [
      "./src/types",
      "node_modules/@types"
    ],

    // 只包含指定的 @types 包（不指定则包含所有）
    "types": ["node", "jest", "vite/client"],

    // ==================== 兼容性 ====================

    // 允许从没有默认导出的模块默认导入
    "allowSyntheticDefaultImports": true,

    // 让 import/export 和 require 可以互操作
    "esModuleInterop": true,

    // 允许导入 JSON 文件
    "resolveJsonModule": true,

    // 允许同时编译 .ts 和 .js 文件
    "allowJs": true,

    // 对 .js 文件也做类型检查
    "checkJs": true
  }
}
```

---

### 3.5 代码生成与优化

```json
{
  "compilerOptions": {

    // 跳过所有 .d.ts 文件的类型检查（提升编译速度）
    "skipLibCheck": true,

    // 强制文件名大小写一致性（跨平台）
    "forceConsistentCasingInFileNames": true,

    // 使用增量编译（缓存上次的编译结果）
    "incremental": true,

    // 增量编译缓存文件路径
    "tsBuildInfoFile": ".tsbuildinfo",

    // 实验性装饰器支持
    "experimentalDecorators": true,

    // 生成装饰器元数据（需要 reflect-metadata）
    "emitDecoratorMetadata": true,

    // JSX 处理方式
    // "preserve" | "react" | "react-jsx" | "react-jsxdev" | "react-native"
    "jsx": "react-jsx",

    // JSX 工厂（用于自定义 JSX 转换）
    "jsxImportSource": "react"
  }
}
```

---

## 四、常见项目配置模板

### 4.1 Node.js 后端项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

### 4.2 Vite + React 前端项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 4.3 发布 npm 包

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2018"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "declaration": true,
    "declarationDir": "dist/types",
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

---

## 五、项目引用（Project References）

用于大型 monorepo 项目，支持增量构建：

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,  // 开启项目引用
    "outDir": "dist"
  }
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    "outDir": "dist"
  },
  "references": [
    { "path": "../core" }  // 引用 core 包
  ]
}
```

```bash
# 构建项目引用
tsc --build
tsc -b --clean  # 清除构建产物
tsc -b --watch  # 监听模式
```

---

## 六、配置继承（extends）

```json
// tsconfig.base.json（公共基础配置）
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

// tsconfig.json（项目配置，继承基础配置）
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "outDir": "dist"
  }
}

// 继承 @tsconfig 包
// npm install -D @tsconfig/node20
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

---

## 七、常见问题排查

### 7.1 为什么找不到模块？

```json
// 检查这些配置：
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // 或 "node"
    "paths": {
      "@/*": ["src/*"]  // 路径别名
    },
    "baseUrl": "."
  }
}
```

### 7.2 为什么 jsx 不生效？

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",      // React 17+
    // "jsx": "react",       // React 16
    "jsxImportSource": "react"
  }
}
```

### 7.3 类型检查太慢？

```json
{
  "compilerOptions": {
    "skipLibCheck": true,     // 跳过 .d.ts 检查
    "incremental": true,      // 增量编译
    "tsBuildInfoFile": ".cache/tsbuildinfo"
  },
  "exclude": [
    "node_modules",
    "dist",
    "**/__tests__/**"  // 排除测试文件
  ]
}
```

---

## 总结

常用配置速查：

| 选项 | 建议值 | 说明 |
|------|--------|------|
| `strict` | `true` | 开启所有严格检查 |
| `target` | `ES2020` | 现代环境推荐 |
| `module` | `ESNext` / `CommonJS` | 前端/Node |
| `moduleResolution` | `bundler` / `node` | 前端/Node |
| `esModuleInterop` | `true` | 兼容 CommonJS 默认导出 |
| `skipLibCheck` | `true` | 加速编译 |
| `declaration` | `true` | 发布库时开启 |
| `sourceMap` | `true` | 调试时开启 |
| `noEmit` | `true` | 只做类型检查时 |

下一篇：**[设计模式与TypeScript](./10-设计模式与TypeScript.md)**
