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

## 组件使用规则

- 所有可点击条目都应保持至少 `44px` 的有效点击区。
- 主按钮只保留一个主动作，次动作用次按钮或幽灵按钮承接。
- 状态色只表达状态，不兼做装饰色。
- 需要继续延展的页面优先用卡片、列表和分区标题，不要直接堆大面积插画或大圆角气泡。

## 设计系统预览页

- 路由：`#/design-system`
- 内容：token、排版、按钮、徽标、列表、表单、提示横幅。
- 用途：后续新页面开发时先看这里，再决定要不要新增组件。

## 参考标准

- WCAG 2.2 Contrast Minimum: https://www.w3.org/TR/WCAG22/#contrast-minimum
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Material Design tokens overview: https://m3.material.io/foundations/design-tokens/overview
