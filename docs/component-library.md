# Component Library

这是给后续新增页面直接复用的组件层说明，配合 `styles.css` 里的 `--ds-*` token 一起用。

## 可直接复用的基础组件

- `topbar`：顶部导航条，默认白底，可加 `filled` / `green` / `red`。
- `bottom-nav`：底部导航，支持 4 项或 5 项。
- `card` / `soft-card`：常规卡片与轻卡片。
- `button` / `button-secondary` / `button-ghost`：主按钮、次按钮、幽灵按钮。
- `chip` / `tab` / `pill`：筛选、页签、胶囊选项。
- `ds-badge`：状态徽标。
- `ds-list-row`：列表行，支持左图标、中间文案、右侧箭头。
- `ds-field` / `ds-textarea-box`：输入框与多行输入区域。
- `ds-callout`：提示横幅。

## 新底座页面组件

这组组件是给 `station home`、`feedback`、`profile` 这些业务页直接拼装用的，走的是新的 `ab-*` 命名。

- `ab-page` / `ab-page-body`：页面外壳和内容区。
- `ab-topbar`：新页面顶部栏，左返回、中标题、右动作。
- `ab-home-hero`：首页站点头图区域。
- `ab-panel`：通用内容面板，适合表单、说明、记录。
- `ab-select-grid`：可选项网格，支持选中态。
- `ab-action-grid`：服务入口和快捷功能网格。
- `ab-info-list`：设置/联系信息列表。
- `ab-record-card`：反馈记录卡片。
- `ab-profile-card` / `ab-stat-grid`：个人中心头部和数据概览。
- `ab-map-shell` / `ab-station-map-tags`：司机站点地图预览和场区标签。
- `ab-queue-station-card` / `ab-station-area-card`：排队列表与场区信息卡。
- `ab-target-card` / `ab-meal-card` / `ab-reward-card`：短途复载目标、今日餐饮和积分兑换卡。
- `ab-review-card` / `ab-journey-card`：司机评价和行程记录卡。
- `ab-bottom-nav`：新页面底部导航。

## 组件使用规则

- 所有可点击条目都应保持至少 `44px` 的有效点击区。
- 主按钮只保留一个主动作，次动作用次按钮或幽灵按钮承接。
- 状态色只表达状态，不兼做装饰色。
- 需要继续延展的页面优先用卡片、列表和分区标题，不要直接堆大面积插画或大圆角气泡。
- 新增业务页优先从 `renderAppShell`、`renderAppTopbar`、`renderActionGrid`、`renderInfoRows` 和 `renderAbFooterNav` 这些底座函数开始，不再复用旧截图壳组件。

## 设计系统预览页

- 路由：`#/design-system`
- 内容：token、排版、按钮、徽标、列表、表单、提示横幅。
- 用途：后续新页面开发时先看这里，再决定要不要新增组件。

## 参考标准

- WCAG 2.2 Contrast Minimum: https://www.w3.org/TR/WCAG22/#contrast-minimum
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Material Design tokens overview: https://m3.material.io/foundations/design-tokens/overview
