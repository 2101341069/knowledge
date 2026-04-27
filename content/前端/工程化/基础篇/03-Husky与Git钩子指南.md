---
title: Husky与Git钩子指南
tags:
  - 前端
  - 工程化
  - Git
  - Husky
  - 代码规范
created: 2026-04-27
---

# Husky 与 Git 钩子完全指南

## 一、为什么需要 Git 钩子

### 代码规范落地的痛点

**问题场景：**
- ❌ 本地配置了 ESLint，但团队成员提交时忘记运行 lint
- ❌ CI 因为代码格式问题反复失败，浪费时间
- ❌ 提交信息混乱，无法自动化生成 Changelog
- ❌ 敏感信息（密钥、密码）不小心提交到代码库

**Git 钩子的价值：**

| 时机 | 检查项 | 收益 |
|------|--------|------|
| **提交前** | ESLint、Prettier、类型检查 | 在代码入库前发现问题，不污染仓库 |
| **提交时** | Commit Message 规范 | 统一提交信息格式，支持自动化 |
| **推送前** | 单元测试、构建检查 | 保障主分支代码质量 |

**核心原则：** 左移质量保障——问题发现越早，修复成本越低

---

## 二、Git 钩子基础

### Git 钩子类型

```bash
.git/hooks/
├── applypatch-msg.sample
├── commit-msg.sample
├── fsmonitor-watchman.sample
├── post-update.sample
├── pre-applypatch.sample
├── pre-commit.sample      # 提交前
├── pre-merge-commit.sample
├── pre-push.sample        # 推送前
├── pre-rebase.sample
├── pre-receive.sample
├── prepare-commit-msg.sample
└── update.sample
```

### 前端常用钩子

| 钩子 | 触发时机 | 用途 |
|------|---------|------|
| **pre-commit** | `git commit` 执行前，还没生成 commit | 代码检查、格式化、测试 |
| **commit-msg** | commit message 输入后，提交完成前 | 校验提交信息格式 |
| **pre-push** | `git push` 执行前，推送远程前 | 全量测试、构建检查 |
| **prepare-commit-msg** | 提交信息编辑器打开前 | 自动生成默认提交信息 |
| **post-merge** | 合并完成后 | 自动安装依赖、清理缓存 |
| **post-checkout** | 切换分支后 | 自动安装依赖、清理构建产物 |

### 原生 Git 钩子问题

1. **脚本放在 `.git/hooks/` 目录** - 无法纳入 Git 版本管理
2. **团队成员需要手动配置** - 难以保证所有人都启用
3. **脚本管理困难** - 没有统一的管理方式

**解决方案：Husky**

---

## 三、Husky 快速上手

### 安装配置

```bash
# 1. 安装 Husky
pnpm add -D husky

# 2. 初始化（创建 .husky 目录）
npx husky install

# 3. 添加 prepare 脚本（npm v7+ 自动执行）
npm set-script prepare "husky install"
# 或手动在 package.json 添加
```

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

> `prepare` 脚本会在 `npm install` 后自动执行，保证团队成员安装依赖后自动配置 Husky

### 添加第一个钩子

```bash
# 添加 pre-commit 钩子
npx husky add .husky/pre-commit "npm run lint"
```

生成的文件内容：
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

**工作流程：**
```
git commit
    ↓
pre-commit 钩子触发
    ↓
执行 npm run lint
    ↓
lint 通过？
    ├─ 是 → 继续提交
    └─ 否 → 中止提交，显示错误信息
```

### 验证配置

```bash
# 1. 查看钩子是否生效
ls -la .husky/

# 2. 测试钩子（故意写不符合规范的代码）
echo 'const a = 1;' >> test.js
git add test.js
git commit -m 'test husky'  # 应该被拦截

# 3. 手动运行钩子
.husky/pre-commit
```

---

## 四、lint-staged：只检查暂存的文件

### 为什么需要 lint-staged

**问题：**
- ❌ 每次提交都全量运行 lint，太慢
- ❌ 修改了不相关文件的格式，产生噪音
- ❌ 历史遗留代码没有 lint，新提交被牵连

**lint-staged 解决方案：**
- ✅ **只对 git add 的文件运行检查**
- ✅ **检查通过自动格式化并重新加入暂存**
- ✅ **提交速度快，不影响历史代码**

### 安装配置

```bash
pnpm add -D lint-staged
```

```bash
# 修改 pre-commit 钩子
npx husky add .husky/pre-commit "npx lint-staged"
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### lint-staged 配置

**方式一：package.json 配置（推荐）**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.vue": ["eslint --fix", "stylelint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**方式二：.lintstagedrc.json**

```json
{
  "*.{js,ts,vue}": ["eslint --cache --fix"],
  "*.{css,scss,vue}": ["stylelint --cache --fix"],
  "*": ["prettier --write --ignore-unknown"]
}
```

**方式三：lint-staged.config.js（动态配置）**

```javascript
export default {
  '*.{js,ts,tsx,vue}': (files) => {
    // 可以动态生成命令
    const eslintFiles = files.join(' ')
    return [
      `eslint --fix ${eslintFiles}`,
      `prettier --write ${eslintFiles}`
    ]
  },
  
  '*.{ts,tsx}': () => 'tsc --noEmit'
}
```

### lint-staged 工作流程

```
git commit
    ↓
pre-commit hook 触发
    ↓
lint-staged 获取暂存文件列表
    ↓
按文件类型匹配执行命令
    ↓
ESLint/Prettier 自动修复
    ↓
修复后的文件自动 git add
    ↓
✅ 所有检查通过 → 继续提交
❌ 检查失败 → 中止提交，显示错误
```

---

## 五、commitlint：提交信息规范

### 为什么需要规范 Commit Message

**优秀的提交信息价值：**
1. ✅ 自动生成 CHANGELOG
2. ✅ 快速定位历史问题
3. ✅ Code Review 快速理解变更
4. ✅ 触发自动化发布流程

### 安装配置

```bash
# 1. 安装 commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# 2. 配置文件
echo "{ extends: ['@commitlint/config-conventional'] }" > .commitlintrc

# 3. 添加 commit-msg 钩子
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \"$1\""
```

### Conventional Commits 规范

**格式：**
```
<type>(<scope>): <subject>
<空行>
<body>
<空行>
<footer>
```

#### 1. Type（类型）

| 值 | 说明 | 示例 |
|----|------|------|
| **feat** | 新功能 | feat(auth): 增加登录功能 |
| **fix** | 修复 bug | fix(api): 修复用户列表加载失败 |
| **docs** | 文档变更 | docs(readme): 更新安装说明 |
| **style** | 代码格式（不影响逻辑） | style: 格式化代码 |
| **refactor** | 重构（既不新增功能也不修 bug） | refactor(user): 抽离通用方法 |
| **perf** | 性能优化 | perf(list): 优化长列表渲染 |
| **test** | 测试相关 | test: 增加登录单元测试 |
| **build** | 构建系统、依赖变更 | build: 更新 vite 到 5.0 |
| **ci** | CI/CD 配置变更 | ci: 增加 GitHub Actions |
| **chore** | 杂项（工具升级、配置修改） | chore: 更新 .gitignore |
| **revert** | 回滚提交 | revert: 回滚 feat xxx |

#### 2. Scope（可选，影响范围）

**常见值：**
- 按模块：`auth`, `user`, `order`, `dashboard`
- 按组件：`Button`, `Table`, `Form`
- 按工具：`webpack`, `vite`, `eslint`

**示例：**
```
feat(auth): 增加短信验证码登录
fix(user): 修复用户头像上传失败
docs(readme): 更新安装说明
```

#### 3. Subject（简短描述）

**规则：**
- 动词开头，使用祈使句（add, fix, update...）
- 首字母小写（部分规范要求大写，团队统一即可）
- 末尾不要加句号

✅ 好的示例：
```
feat(auth): 增加密码重置功能
fix(api): 处理网络异常情况
docs: 补充 API 文档说明
style: 格式化登录页样式
```

❌ 不好的示例：
```
更新了一些东西              # 太模糊
feat: 新增登录功能啦啦啦    # 语气不专业
fix bug                    # 什么 bug？
feat(login) 新增登录功能    # 没有冒号
feat(login): 新增登录功能。 # 结尾有句号
```

#### 4. Body（可选，详细描述）

```
feat(auth): 增加密码重置功能

- 支持邮箱验证码重置密码
- 密码强度校验：至少8位，包含大小写和数字
- 1小时内最多发送3次验证码

Closes #123
```

#### 5. Footer（可选，关联 Issue）

```
修复 #42, #123
Closes #456
BREAKING CHANGE: API 签名方式变更，旧版本不兼容
```

### 完整示例

**简单提交：**
```
feat(search): 增加模糊搜索功能
```

**带详细说明的提交：**
```
feat(search): 增加模糊搜索功能

- 支持中文、拼音、首字母搜索
- 搜索结果高亮显示
- 最多显示 20 条结果
- 增加防抖优化，300ms 延迟请求

Closes #123, #124
```

### 常用辅助工具

#### 1. commitizen：交互式提交

```bash
# 安装
pnpm add -D commitizen cz-conventional-changelog

# 初始化
npx commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact

# 添加脚本
```

```json
{
  "scripts": {
    "commit": "cz"
  }
}
```

```bash
# 使用：代替 git commit
pnpm commit

# 进入交互式选择：
# ? Select the type of change that you're committing:
# ❯ feat:     A new feature
#   fix:      A bug fix
#   docs:     Documentation only changes
#   ...
```

#### 2. 自动生成 CHANGELOG

```bash
# 安装
pnpm add -D conventional-changelog-cli

# 添加脚本
```

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
  }
}
```

```bash
# 生成 changelog
pnpm run changelog
```

---

## 六、pre-push：推送前保障

### 配置 pre-push 钩子

```bash
npx husky add .husky/pre-push "npm run test"
```

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "=== 运行测试 ==="
npm run test:run

# 可选：运行类型检查
echo "=== 类型检查 ==="
npx tsc --noEmit

# 可选：运行构建检查（耗时较长，建议 CI 做）
# echo "=== 构建检查 ==="
# npm run build
```

### 跳过钩子（慎用）

```bash
# 跳过所有钩子
git commit --no-verify -m "..."
git push --no-verify

# 或简写
git commit -n -m "..."
```

> ⚠️ 警告：仅用于紧急情况！滥用会导致代码质量失控

---

## 七、完整工作流配置

### 标准工程化配置清单

✅ **Step 1: 代码规范**
- ESLint - 代码质量检查
- Prettier - 代码格式化
- Stylelint - 样式检查（可选）

✅ **Step 2: Git 钩子**
- `pre-commit` → lint-staged（只检查修改的文件）
- `commit-msg` → commitlint（检查提交信息）
- `pre-push` → 测试/类型检查（可选）

✅ **Step 3: 提交辅助**
- commitizen - 交互式提交选择

### 完整 package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "vue-tsc --noEmit",
    "commit": "cz",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "devDependencies": {
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "eslint": "^8.50.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 完整的钩子文件

**.husky/pre-commit**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 运行代码检查..."
npx lint-staged
```

**.husky/commit-msg**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

**.husky/pre-push**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 运行类型检查..."
npx tsc --noEmit

echo "🧪 运行单元测试..."
npm run test:run
```

---

## 八、进阶技巧

### 1. 检测秘钥泄露

```bash
# 安装 git-secret 或 tartufo
pnpm add -D @secretlint/quick-start
```

**添加 pre-commit 检查：**
```bash
npx secretlint --staged
```

### 2. 自动更新依赖后安装

```bash
npx husky add .husky/post-merge "pnpm install"
npx husky add .husky/post-checkout "pnpm install"
```

### 3. 提交前运行特定测试

```bash
# .husky/pre-commit
echo "🧪 运行受影响的测试..."

# 获取修改的文件列表
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.(test|spec)\.' | head -20)

if [ -n "$CHANGED_FILES" ]; then
  echo "检测到测试文件变更，运行相关测试..."
  npx vitest run $CHANGED_FILES
fi
```

### 4. 提交信息自动加前缀

```bash
# .husky/prepare-commit-msg

# 从分支名提取 JIRA 单号（如 feature/PROJ-123-login）
BRANCH_NAME=$(git symbolic-ref --short HEAD)
JIRA_TICKET=$(echo "$BRANCH_NAME" | grep -oE '[A-Z]+-[0-9]+')

if [ -n "$JIRA_TICKET" ]; then
  # 给 commit message 加上 jira 单号
  echo "[$JIRA_TICKET] $(cat "$1")" > "$1"
fi
```

### 5. Windows 兼容问题

**问题：** Windows 下 husky 钩子可能不执行

**解决方案：**
```bash
# 1. 确保 Git Bash 是默认终端
# 2. 设置换行符为 LF
git config core.autocrlf false

# 3. 手动设置 husky 脚本权限
chmod +x .husky/*

# 4. 或使用 PowerShell 版本脚本
```

---

## 九、常见问题

### 1. Husky 钩子不执行？

检查清单：
1. ✅ `.husky/` 目录存在
2. ✅ 脚本有执行权限：`ls -la .husky/` 看是否有 x 权限
3. ✅ `package.json` 有 `prepare` 脚本且已执行
4. ✅ Git 版本 >= 2.13.0
5. ✅ 不是在 VS Code 的 GUI 中提交（需要配置环境变量）

**修复：**
```bash
# 重新安装
pnpm add -D husky
npx husky install
```

### 2. lint-staged 太慢？

**优化方案：**
- ✅ 使用 `--cache` 参数：`eslint --cache`
- ✅ 减少检查的文件类型
- ✅ 复杂检查（如全量测试）放到 pre-push 或 CI
- ✅ 使用 `--quiet` 只输出错误

### 3. 提交信息检查太严格？

```javascript
// .commitlintrc.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 放宽 type 枚举，增加自定义类型
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert',
      'wip' // 增加 wip 类型
    ]],
    // 放宽长度限制
    'header-max-length': [2, 'always', 100],
    'subject-full-stop': [0, 'never', '.'] // 关闭句号检查
  }
}
```

### 4. 临时跳过某个检查

```bash
# 跳过所有钩子（不推荐）
git commit -n -m "..."

# 或者临时注释钩子中的命令
# .husky/pre-commit
# npx lint-staged
echo "临时跳过 lint"
```

---

## 十、版本升级注意事项

### Husky v4 → v8 重大变更

| 特性 | v4 及以前 | v8+ |
|------|-----------|-----|
| 配置方式 | package.json husky 字段 | .husky/ 目录 |
| 脚本管理 | 集中在 config | 独立 shell 脚本 |
| 安装方式 | 自动 | 需要 prepare 脚本 |

**迁移指南：**
```bash
# 1. 卸载旧版
npm uninstall husky
rm -rf .husky

# 2. 安装新版
pnpm add -D husky
npx husky install

# 3. 重新添加钩子
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## 总结

| 工具 | 职责 | 配置 |
|------|------|------|
| **Husky** | 管理 Git 钩子生命周期 | `.husky/` 目录 |
| **lint-staged** | 只检查提交的文件 | `lint-staged` 配置 |
| **commitlint** | 校验提交信息规范 | `.commitlintrc` |
| **commitizen** | 交互式提交辅助 | `cz` 命令 |

**完整提交流程：**
```
编写代码
    ↓
git add .
    ↓
git commit
    ↓
pre-commit 触发
    ↓
lint-staged 运行 ESLint/Prettier 检查
    ↓ 有问题自动修复并重新暂存
commit-msg 触发
    ↓
commitlint 校验提交信息格式
    ↓
✅ 完成提交
```

**下一篇：** [TypeScript工程配置](./04-TypeScript工程配置.md)
