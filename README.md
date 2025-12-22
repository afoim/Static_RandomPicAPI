# 纯静态随机图 API 使用手册

本项目已从边缘函数（Edge Function）逻辑重构为纯静态实现。所有图片在构建时会被随机打乱并重命名，客户端通过预生成的 JavaScript 文件获取随机图片链接。

## 目录结构

```text
/
├── ri/                 # 原始图片资源
│   ├── h/              # 横屏图片
│   └── v/              # 竖屏图片
├── build.js            # 构建脚本
├── dist/               # [构建产物] 最终部署使用的文件夹
│   ├── index.html      # 演示页面
│   ├── random-h.js     # 横屏随机逻辑
│   ├── random-v.js     # 竖屏随机逻辑
│   └── ri/             # 处理后的图片（已重命名为 1.webp, 2.webp...）
└── MANUAL.md           # 本手册
```

## 1. 构建 (Build)

在部署之前，或者当你更新了 `ri` 文件夹中的图片后，需要运行构建脚本。

### 环境要求
- Node.js (建议 v14 或更高版本)

### 运行构建
在项目根目录下打开终端，运行：

```bash
node build.js
```

**构建脚本将会执行以下操作：**
1. 清空并重建 `dist` 目录。
2. 读取 `ri/h` 和 `ri/v` 中的所有图片。
3. **随机打乱** 图片顺序。
4. 将图片顺序重命名为 `1.webp`, `2.webp`, ... 并复制到 `dist/ri/` 目录。
5. 生成 `random-h.js` 和 `random-v.js`，其中包含了图片总数和随机逻辑。
6. 如果根目录下有 `index.html`，会将其复制到 `dist`；如果没有，会生成一个演示用的 `index.html`。

## 2. 部署 (Deploy)

构建完成后，**只需要部署 `dist` 文件夹** 中的内容。

你可以将 `dist` 文件夹内的所有文件上传到：
- GitHub Pages
- Vercel / Netlify
- Cloudflare Pages
- 任何静态 Web 服务器 (Nginx, Apache)

## 3. 使用方法 (Usage)

有两种方式使用本 API：

### 方法 A: 自动替换 HTML 元素 (推荐)

在你的 HTML 页面中引入生成的 JS 文件，并在 `src` 或 `href` 属性中使用特殊的占位符：`random:h` 或 `random:v`。脚本加载后会自动寻找并替换这些占位符。

**横屏图片 (Horizontal):**
- 引入: `<script src="random-h.js"></script>`
- 图片标签: `<img src="random:h" alt="随机图" />`
- 链接标签: `<a href="random:h" target="_blank">查看大图</a>`

**竖屏图片 (Vertical):**
- 引入: `<script src="random-v.js"></script>`
- 图片标签: `<img src="random:v" alt="随机图" />`
- 链接标签: `<a href="random:v" target="_blank">查看大图</a>`

### 方法 B: 使用全局函数 (高级)

JS 文件加载后会暴露全局函数，你可以在自己的脚本中调用它们。

```javascript
// 获取一个横屏随机图片 URL
var hUrl = window.getRandomPicH(); 
console.log(hUrl); // 输出例如: /ri/h/42.webp

// 获取一个竖屏随机图片 URL
var vUrl = window.getRandomPicV();
console.log(vUrl); // 输出例如: /ri/v/108.webp
```

## 注意事项

- **路径问题**: 默认生成的 URL 是绝对路径 (例如 `/ri/h/1.webp`)。确保你的网站部署在域名根目录下（如 `https://example.com`）。如果你部署在子目录（如 `https://example.com/my-app/`），你可能需要修改 `build.js` 中的 `return '/ri/' + ...` 为相对路径或加上子目录前缀。
- **缓存**: 为了性能，浏览器可能会缓存 JS 文件。如果你更新了图片并重新构建，用户可能需要清除缓存才能看到新的图片总数变化。
