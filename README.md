# Temu 全托选品利润计算器

纯前端静态网页，用 React + Vite + TypeScript 构建。所有计算逻辑都在浏览器端完成，不依赖 FastAPI、数据库、本地 `127.0.0.1` 服务或任何后端 API。

## 功能

- 单品验证
- 批量 SKU 选品
- 模型参数设置
- 外币 Temu 售价按汇率换算人民币
- 估算 Temu 结算价
- 反推最大安全 1688 进货价
- 计算预计单件利润
- 输出 `YES / WARNING / NO` 风险建议

## 本地运行

```bash
npm install
npm run dev
```

构建静态文件：

```bash
npm run build
```

构建产物会生成在：

```text
dist/
```

本地预览构建结果：

```bash
npm run preview
```

## 默认参数

```text
platform_take_rate = 0.60
logistics_cost = 1.5
target_profit = 1.0
category_multiplier = 1.0
volume_penalty = 0.3
exchange_rate = 7.2
```

## 计算公式

```text
retail_price_rmb = retail_price_foreign * exchange_rate
payout = retail_price_rmb * (1 - platform_take_rate)
max_allowed_purchase_price = payout - logistics_cost - volume_penalty - target_profit
profit = payout - logistics_cost - volume_penalty - purchase_cost
```

风险判断：

```text
profit >= target_profit       => YES
0 <= profit < target_profit   => WARNING
profit < 0                    => NO
```

## 部署到 Cloudflare Pages

1. 将项目推送到 GitHub。
2. 在 Cloudflare Pages 新建项目并连接仓库。
3. 构建命令填写：

```bash
npm run build
```

4. 输出目录填写：

```text
dist
```

5. 部署完成后，Cloudflare 会提供公网访问网址。

## 部署到 GitHub Pages

推荐使用 GitHub Actions。新建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

然后在仓库 `Settings > Pages` 中选择 GitHub Actions 作为部署来源。

## 部署到 Vercel

1. 在 Vercel 导入 GitHub 仓库。
2. Framework Preset 选择 `Vite`。
3. Build Command 使用：

```bash
npm run build
```

4. Output Directory 使用：

```text
dist
```

5. 点击 Deploy。

## 说明

本工具为估算模型，Temu实际核价、履约成本、退货损耗、平台调价可能导致结果变化，仅用于选品初筛。
