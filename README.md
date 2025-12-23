# 静态随机图 API 使用手册 (Static Random Pic API Manual)

这是一个纯静态的随机图 API 解决方案。它不依赖任何后端逻辑（如 Cloudflare Workers 或 Python 服务器），完全依靠构建时生成的静态资源和客户端 JavaScript 实现随机图功能。

## 1. 原理
构建脚本 (`build.js`) 会扫描 `ri/h` (横屏) 和 `ri/v` (竖屏) 目录下的图片，将它们随机重命名为数字序列 (1.webp, 2.webp...) 并输出到 `dist` 目录。同时生成对应的 JavaScript 文件，包含图片总数和随机逻辑。客户端加载 JS 后，会自动在**全局范围**内寻找并替换特殊的占位符链接。

## 2. 构建 (Build)
在本地运行构建脚本以生成 `dist` 目录：

```bash
node build.js
```

构建完成后，`dist` 目录即为最终产物，可直接部署到任何静态托管服务 (GitHub Pages, Vercel, Cloudflare Pages, Nginx 等)。

## 3. 配置 (Configuration)
你可以配置生成的图片 URL 前缀（域名）。

### 方法 A: 配置文件 (推荐)
修改项目根目录下的 `config.json`：
```json
{
    "domain": "https://your-domain.com"
}
```

### 方法 B: 环境变量
构建时传入环境变量 `DOMAIN` (优先级高于 config.json)：
```bash
# Linux/Mac
export DOMAIN="https://cdn.example.com"
node build.js

# Windows (PowerShell)
$env:DOMAIN="https://cdn.example.com"
node build.js
```

如果不配置，默认为空，图片路径将是相对路径 (e.g. `/ri/h/1.webp`)。

## 4. 客户端使用 (Client-Side Usage)
在你的 HTML 页面中引入生成的 JS 文件即可。

### 引入脚本
```html
<!-- 引入横屏随机图脚本 -->
<script src="https://your-domain.com/random-h.js"></script>
<!-- 引入竖屏随机图脚本 -->
<script src="https://your-domain.com/random-v.js"></script>
```

### 自动全局替换功能
脚本加载后会自动在 **DOM 中的所有属性和文本** 中查找占位符，并将其替换为随机图片 URL。

**支持的占位符格式 (不区分协议)：**
*   `random:h`
*   `http://random:h`
*   `https://random:h`
*   (竖屏同理：`random:v`, `http://random:v`, `https://random:v`)

脚本会自动识别这些字符串，并将其统一替换为最终的图片链接。

#### 1. 常见用法 (img src, a href)
```html
<!-- 图片 -->
<img src="https://random:h" alt="Random Image">

<!-- 链接 (使用 http 也可以) -->
<a href="http://random:v" target="_blank">点击查看随机竖屏图</a>
```

#### 2. 样式属性 (style)
**普通用法：**
```html
<div style="background-image: url('random:h');">
    背景图区域
</div>
```

**高级用法 (推荐 - 避免 404 错误)：**
如果直接在 `style` 中使用 `url(random:h)`，浏览器可能会在 JS 运行前尝试加载该 URL 导致报错或放弃加载。
**解决方案：** 使用 `data-style` 属性。脚本会自动处理它并将其合并到 `style` 属性中。

```html
<!-- 浏览器一开始不会解析 data-style 中的 CSS，因此不会报错 -->
<div data-style="--bg-url: url(random:h); background-image: var(--bg-url);">
    背景图区域 (Lazy Applied Style)
</div>
```
脚本运行后，它会自动变为：
```html
<div style="--bg-url: url(https://.../1.webp); background-image: var(--bg-url);">
    背景图区域 (Lazy Applied Style)
</div>
```

#### 3. 任意属性 (Global Attribute Replacement)
任何属性中的占位符都会被替换。
```html
<!-- data 属性 -->
<div data-bg-url="https://random:h"></div>

<!-- meta 标签 -->
<meta property="og:image" content="http://random:h">
```

#### 4. 文本内容 (Text Content)
甚至页面上直接显示的文本也会被替换（只要包含该占位符）。
```html
<p>当前的随机图链接是：random:v</p>
<!-- 页面渲染后会变成：当前的随机图链接是：https://your-domain.com/ri/v/123.webp -->
```

### 手动调用 (高级)
JS 会暴露全局函数，你可以手动获取随机 URL：
```javascript
// 获取横屏随机图 URL
var urlH = window.getRandomPicH(); 
console.log(urlH);

// 获取竖屏随机图 URL
var urlV = window.getRandomPicV();
console.log(urlV);
```

## 5. 目录结构
*   `ri/` - 图片源目录
    *   `ri/h/` - 放入横屏图片
    *   `ri/v/` - 放入竖屏图片
*   `dist/` - 构建产物 (部署这个文件夹)
    *   `ri/` - 处理后的图片
    *   `random-h.js` - 横屏逻辑
    *   `random-v.js` - 竖屏逻辑
    *   `index.html` - 演示页面
*   `build.js` - 构建脚本
*   `config.json` - 配置文件

## 6. 注意事项
*   每次添加新图片后，都需要重新运行 `node build.js`。
*   构建会清空 `dist` 目录，请勿在 `dist` 中直接修改文件。
