# AI Kangaroo / VitaRay — Nuxt

本项目从 Bootstrap HTML 单页站点迁移至 Nuxt 4，保留原有设计、英文文案、图片、响应式布局及外部链接。Bootstrap CSS 保留为样式依赖，交互由 Vue 组件负责，不再加载 jQuery、Owl Carousel 或旧页面脚本。

## 环境与启动

需要 Node.js `22.22.3` 或满足 `package.json` 中 `engines` 的版本；`.nvmrc` 固定开发基线。推荐 npm 11：原系统 npm 10.9.3 在当前依赖解析中出现内部错误。

```sh
npm ci
```

将 `.env.example` 复制为 `.env`，填写原联系表单的提交地址：

```dotenv
NUXT_PUBLIC_CONTACT_ENDPOINT=https://your-existing-form-endpoint
```

```sh
npm run dev
```

开发地址为 `http://127.0.0.1:3000`。本次迁移已将原有表单地址写入本机 `.env`，该文件被 Git 忽略。此地址属于浏览器公开配置，请勿放入密码、邮件凭据等私密数据。

若使用本次为项目安装的独立 Node，无需切换系统版本，可在 PowerShell 执行：

```powershell
& .\.tools\node_modules\node\bin\node.exe node_modules/nuxt/bin/nuxt.mjs dev --host 127.0.0.1
```

`.tools` 为本机临时工具目录，不纳入版本管理。其他电脑按 Node 版本要求安装即可。

## 目录

- `app/app.vue`：页面组合及原有样式加载顺序。
- `app/components/`：导航、首页介绍、健康信号、场景轮播、公司介绍、团队、联系表单、FAQ、页脚、问卷邀请及返回顶部。
- `app/composables/`：弹窗状态、事件清理及支持部署前缀的静态资源地址。
- `public/`：原始样式、图片、保留的第三方 CSS/字体及 Google 验证文件。
- `public/css/nuxt.css`：Vue 交互所需的少量样式适配。
- `tests/`：基于 Chrome DevTools Protocol 的浏览器检查，无需另装浏览器测试库。

原始副本位于相邻的 `../IT-Company-Website-Refactoring`，仅用作迁移和验收参照。应用运行及部署不依赖该副本。

## 构建与部署

```sh
npm run typecheck
npm run build
npm run preview
```

Node 服务部署：上传 `.output`，在运行环境设置 `NUXT_PUBLIC_CONTACT_ENDPOINT`，然后运行 `node .output/server/index.mjs`。生产服务默认不读取开发用的 `.env` 文件。可设置 `HOST`、`PORT`，并在反向代理上配置 HTTPS。

静态托管：设置表单环境变量后执行 `npm run generate`，发布 `.output/public`。静态构建中的公开环境变量在构建时确定，修改后需重新生成。表单仍调用原有外部接口，不要求为此单独建立数据库或 PHP 环境。

现有 Google Fonts、Font Awesome 和部分 Bootstrap CDN 链接继续保留，以维持原始呈现；运行浏览器对照检查时需要能访问这些资源。

## 回归验证

先构建，再运行：

```sh
npm run test:e2e
```

需要本机已安装 Chrome、Edge 或 Chromium。可用 `CHROME_PATH` 指定浏览器路径，用 `REFERENCE_DIR` 指定原站副本。仅在存在原站副本时执行文案与几何对照。

检查桌面、平板和手机宽度（1440、768、390、320），包括 SSR 内容、静态资源、菜单、轮播、FAQ、问卷邀请、返回顶部及表单成功/失败/校验状态。表单通过模拟响应测试，不发送真实留言。截图与报告保存在被 Git 忽略的 `test-results/`。

本次保留旧 CSS 顺序及原站已有视觉特点，没有同时重新设计页面。外部表单服务的真实可用性与邮件送达，仍需在受控上线验收中确认。
