# Chan Meng CLI - 完整使用指南

## 📋 目录

1. [快速开始](#快速开始)
2. [安装方式详解](#安装方式详解)
3. [运行方式对比](#运行方式对比)
4. [使用教程](#使用教程)
5. [常见问题](#常见问题)
6. [故障排除](#故障排除)

---

## 🚀 快速开始

### 方式一：使用 NPX（推荐，无需安装）

这是**最简单**的方式，无需安装任何东西：

```bash
npx chan-meng
```

✅ **优点**：
- 无需安装，直接运行
- 每次运行都是最新版本
- 不占用磁盘空间
- 适合偶尔使用

---

## 📦 安装方式详解

### 方式二：全局安装（命令行直接可用）

如果您经常使用，可以全局安装：

```bash
# 全局安装
npm install -g chan-meng

# 之后可以直接运行
chan-meng
```

✅ **优点**：
- 安装后可直接使用 `chan-meng` 命令
- 运行速度快（已安装在本地）
- 适合频繁使用

❌ **缺点**：
- 占用全局空间
- 需要手动更新版本

**卸载方式**：
```bash
npm uninstall -g chan-meng
```

---

### 方式三：本地安装 + npx 运行

如果您已经使用 `npm i chan-meng` 安装了（就是您当前的情况）：

```bash
# 您已经执行过这一步
npm install chan-meng

# 运行方式（两种选择）：

# 选择 1: 使用 npx
npx chan-meng

# 选择 2: 使用完整路径
./node_modules/.bin/chan-meng
```

---

## 🔄 运行方式对比

| 方式 | 安装命令 | 运行命令 | 适用场景 |
|------|---------|---------|---------|
| **NPX（推荐）** | 无需安装 | `npx chan-meng` | 偶尔使用、试用 |
| **全局安装** | `npm install -g chan-meng` | `chan-meng` | 频繁使用 |
| **本地安装** | `npm install chan-meng` | `npx chan-meng` | 项目依赖 |

---

## 📖 使用教程

### 第一次运行

当您第一次运行时，会看到欢迎界面：

```
==================================================
           CHAN MENG
==================================================

Welcome! This interactive experience introduces Chan Meng—
a minimalist who lives with only what fits in one backpack.

? How would you like to proceed?
  ❯ ⚡ Quick Tour (3 minutes - recommended for first-timers)
    📚 Full Experience (explore at your own pace)
    Exit
```

### 选项说明

#### 1️⃣ **Quick Tour（快速之旅）**
- ⏱️ **时长**：约 3 分钟
- 📝 **内容**：精选的 6 个核心片段
- 👥 **适合**：首次体验、时间有限

**体验内容**：
- Chan 的突破点（2018年）
- 新西兰新生活
- 核心极简主义原则
- 泡沫垫生活
- 社交清理
- 联系方式

#### 2️⃣ **Full Experience（完整体验）**
- ⏱️ **时长**：按需探索，约 10-15 分钟
- 📝 **内容**：4 个完整模块
- 👥 **适合**：深度了解、反复访问

**包含模块**：

1. **🗺️ The Journey（旅程）** - 约 7 分钟
   - 成长背景与家庭约束
   - 2018 年的突破点
   - 空房间生活（2020-2023）
   - 新西兰新篇章

2. **💭 Philosophy（哲学）** - 约 4 分钟
   - 核心原则："此时此刻没用，就应该扔掉"
   - 当下时刻聚焦
   - 关系观与自给自足

3. **✂️ Practical Minimalism（实践）** - 约 5 分钟
   - 泡沫垫生活方式
   - 社交清理
   - 剃光头的自由
   - City Walk 与钓鱼背心

4. **📧 Connect（联系）** - 约 1 分钟
   - 联系方式
   - 社交媒体
   - GitHub 主页

---

## 🎮 交互操作

### 导航控制

- **↑/↓ 方向键**：选择选项
- **Enter/回车键**：确认选择
- **Ctrl+C**：随时退出（进度会自动保存）

### 进度保存

您的浏览进度会自动保存到：
- **Linux/macOS**: `~/.config/chan-meng-cli/`
- **Windows**: `%APPDATA%\chan-meng-cli\`

**保存内容**：
- 访问过的模块
- 浏览历史
- 会话统计
- 完成状态

### 再次访问

第二次运行时，会看到：

```
Welcome back!
ℹ Last visit: 5 minutes ago (viewing: journey)

? How would you like to proceed?
  ❯ ⚡ Quick Tour (3 minutes - recommended for first-timers)
    📚 Full Experience (explore at your own pace)
    ↩  Resume (continue from journey)
    Exit
```

---

## ❓ 常见问题

### Q1: 我已经用 `npm i chan-meng` 安装了，为什么运行 `chan-meng` 提示找不到命令？

**原因**：`npm i`（或 `npm install`）默认是**本地安装**，不会添加到系统 PATH。

**解决方案**（三选一）：

```bash
# 方案 1: 使用 npx 运行（推荐）
npx chan-meng

# 方案 2: 卸载本地安装，改用全局安装
npm uninstall chan-meng
npm install -g chan-meng
chan-meng

# 方案 3: 使用完整路径
./node_modules/.bin/chan-meng
```

---

### Q2: NPX 和全局安装有什么区别？

| 特性 | NPX | 全局安装 |
|------|-----|---------|
| 是否需要安装 | ❌ 不需要 | ✅ 需要 |
| 运行命令 | `npx chan-meng` | `chan-meng` |
| 占用空间 | 临时缓存 | 永久占用 |
| 版本更新 | 自动使用最新 | 需手动更新 |
| 适用场景 | 偶尔使用 | 频繁使用 |

---

### Q3: 如何更新到最新版本？

```bash
# NPX 方式（自动使用最新版）
npx chan-meng

# 全局安装方式
npm update -g chan-meng

# 查看当前版本
npm list -g chan-meng
```

---

### Q4: 如何重置进度/清除数据？

```bash
# Linux/macOS
rm -rf ~/.config/chan-meng-cli

# Windows PowerShell
Remove-Item -Recurse -Force $env:APPDATA\chan-meng-cli
```

---

### Q5: 终端显示乱码或没有颜色？

**检查终端支持**：
```bash
# 检查颜色支持
echo $TERM

# 如果终端不支持颜色，设置环境变量
NO_COLOR=1 npx chan-meng
```

**推荐终端**：
- **macOS**: iTerm2, Terminal.app
- **Linux**: GNOME Terminal, Konsole, Terminator
- **Windows**: Windows Terminal, Git Bash

---

### Q6: 最低系统要求是什么？

- **Node.js**: 18.0.0 或更高版本
- **终端尺寸**: 最小 80x24 字符
- **网络**: 仅首次运行需要（下载依赖）

**检查 Node.js 版本**：
```bash
node --version
```

如果版本低于 18，请更新：
```bash
# 使用 nvm（推荐）
nvm install 18
nvm use 18

# 或访问官网下载
# https://nodejs.org
```

---

## 🛠️ 故障排除

### 问题 1: `npx chan-meng` 报错 "command not found"

**可能原因**：NPM 全局 bin 目录不在 PATH 中

**解决方法**：
```bash
# 1. 查看 npm 全局 bin 目录
npm config get prefix

# 2. 将输出路径添加到 PATH（示例）
# 对于 bash/zsh，编辑 ~/.bashrc 或 ~/.zshrc
export PATH="$PATH:/home/chanmeng/.npm-global/bin"

# 3. 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

---

### 问题 2: 安装时网络超时

**解决方法**：使用国内镜像源
```bash
# 临时使用淘宝镜像
npm install -g chan-meng --registry=https://registry.npmmirror.com

# 或永久配置
npm config set registry https://registry.npmmirror.com
```

---

### 问题 3: 权限错误（Permission denied）

**Linux/macOS 解决方法**：
```bash
# 方法 1: 使用 sudo（不推荐）
sudo npm install -g chan-meng

# 方法 2: 修改 npm 全局目录（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g chan-meng
```

---

### 问题 4: 终端太窄，显示不正常

**检查终端尺寸**：
```bash
# 查看当前终端大小
echo "宽度: $COLUMNS, 高度: $LINES"
```

**最小要求**：80 列 x 24 行

**解决方法**：
- 调整终端窗口大小
- 使用全屏模式
- 减小字体大小

---

## 🎯 最佳实践

### 推荐使用方式

```bash
# 🥇 首选：NPX（无需安装）
npx chan-meng

# 🥈 次选：全局安装（频繁使用）
npm install -g chan-meng
chan-meng
```

### 完整体验流程

1. **首次体验**：选择 Quick Tour（3分钟）
2. **深度探索**：选择 Full Experience
3. **按需浏览**：从主菜单选择感兴趣的模块
4. **随时退出**：Ctrl+C（进度自动保存）
5. **继续探索**：再次运行，选择 Resume

---

## 📞 获取帮助

### 在线资源

- **NPM 主页**: https://www.npmjs.com/package/chan-meng
- **GitHub 仓库**: https://github.com/ChanMeng666/chan-meng
- **问题反馈**: https://github.com/ChanMeng666/chan-meng/issues

### 联系作者

**Chan Meng** - Senior AI/ML Infrastructure Engineer

- 💼 **LinkedIn**: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- 🐙 **GitHub**: [ChanMeng666](https://github.com/ChanMeng666)
- 📧 **Email**: chanmeng.dev@gmail.com

### 技术支持

如果遇到技术问题：
1. 查看本指南的[故障排除](#故障排除)部分
2. 在 GitHub 提交 Issue
3. 包含以下信息：
   - 操作系统版本
   - Node.js 版本（`node --version`）
   - 错误信息截图
   - 复现步骤

---

## 🎨 终端优化建议

### 获得最佳体验

1. **使用支持 Unicode 的终端**
   - ✅ 推荐：iTerm2, Windows Terminal, GNOME Terminal
   - ❌ 避免：老旧的 CMD, 纯文本终端

2. **启用颜色支持**
   ```bash
   # 检查颜色支持
   tput colors  # 应该显示 256
   ```

3. **调整终端大小**
   - 最小：80x24
   - 推荐：100x30 或更大

4. **选择合适的字体**
   - 推荐：Fira Code, Source Code Pro, Consolas
   - 确保支持 Unicode 字符

---

## 📝 示例会话

### 完整运行示例

```bash
# 1. 运行程序
$ npx chan-meng

# 2. 欢迎界面
Welcome! This interactive experience introduces Chan Meng...

? How would you like to proceed?
❯ ⚡ Quick Tour (3 minutes)
  📚 Full Experience
  Exit

# 3. 选择 Quick Tour，开始体验...

# 4. 完成后选择
✓ Quick Tour Complete!

? What would you like to do next?
❯ Explore Full Experience
  Exit (you can return anytime)

# 5. 继续探索或退出
```

---

## 🌟 小贴士

1. **首次使用**：建议从 Quick Tour 开始，了解整体结构
2. **深度探索**：使用 Full Experience，按兴趣浏览各模块
3. **随时暂停**：进度自动保存，可随时退出和继续
4. **多次访问**：每个模块都值得反复品味
5. **分享体验**：可以推荐给对极简主义感兴趣的朋友

---

**祝您体验愉快！**

_"此时此刻没用，就应该扔掉" - Chan Meng_
