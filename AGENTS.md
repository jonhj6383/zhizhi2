# AGENTS.md

## 项目目标

本项目是 `Temu 全托选品利润计算器`，当前形态是纯前端静态网页。

部署目标：

- Cloudflare Pages
- GitHub Pages
- Vercel
- 其他任意静态站点托管

项目不应依赖 FastAPI、数据库、本地 `127.0.0.1` 服务、内网穿透或任何后端 API。

## 技术约定

- 技术栈：React + Vite + TypeScript
- 入口：`src/main.tsx`
- 主页面：`src/App.tsx`
- 计算逻辑：`src/utils/calculator.ts`
- 类型定义：`src/types.ts`
- 构建输出：`dist/`

必须保持所有利润计算在前端完成，不要新增后端服务调用。

## 维护要求

- 修改计算逻辑后必须运行 `npm run build`
- 不要恢复 `app/`、`requirements.txt`、FastAPI、uvicorn 或本地自启动脚本
- 部署前确认 `dist/` 可以由静态站点平台直接托管
