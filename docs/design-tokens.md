# Design Tokens

本项目现在有两层 token：
- `--ds-*` 是全局设计系统 token，给后续新页面、组件库和开发预览页共用。
- `--a-*` 是 `#/style-anchor/02-list` 到 `#/style-anchor/08-modal` 的锚点复刻 token，保留给像素比对页。

## 全局设计系统 Token

### 颜色

| Token | Value | 用途 |
| --- | --- | --- |
| `--ds-color-bg` | `#f5f7fb` | 页面底色 |
| `--ds-color-surface` | `#ffffff` | 主卡片/面板底色 |
| `--ds-color-surface-soft` | `#f8fafc` | 次级表面 |
| `--ds-color-surface-quiet` | `#eef3f9` | 弱分区背景 |
| `--ds-color-border` | `#dfe6ef` | 常规边线 |
| `--ds-color-border-strong` | `#cfd8e4` | 输入框/强边线 |
| `--ds-color-text` | `#1d2733` | 主正文 |
| `--ds-color-text-strong` | `#090d14` | 强标题 |
| `--ds-color-text-muted` | `#5f6b78` | 次级文字 |
| `--ds-color-text-subtle` | `#6c7683` | 占位/弱提示 |
| `--ds-color-primary` | `#206fd8` | 主操作/选中态 |
| `--ds-color-primary-strong` | `#165ec6` | 强按钮/高对比主色 |
| `--ds-color-primary-soft` | `#eaf2ff` | 蓝色浅底 |
| `--ds-color-primary-soft-strong` | `#d8e8ff` | 描边浅蓝 |
| `--ds-color-success` | `#0b7a50` | 成功/畅通 |
| `--ds-color-success-soft` | `#e5f7ef` | 绿色浅底 |
| `--ds-color-warning` | `#a16207` | 提示/正常 |
| `--ds-color-warning-soft` | `#fff4d8` | 黄色浅底 |
| `--ds-color-danger` | `#d92d20` | 紧急/拥挤 |
| `--ds-color-danger-soft` | `#fdecef` | 红色浅底 |
| `--ds-color-overlay` | `rgba(9, 13, 20, 0.56)` | 蒙层 |
| `--ds-color-focus` | `#1c70ff` | 键盘焦点 |

### 间距

| Token | Value |
| --- | --- |
| `--ds-space-1` | `4px` |
| `--ds-space-2` | `8px` |
| `--ds-space-3` | `12px` |
| `--ds-space-4` | `16px` |
| `--ds-space-5` | `20px` |
| `--ds-space-6` | `24px` |
| `--ds-space-7` | `28px` |
| `--ds-space-8` | `32px` |
| `--ds-space-9` | `36px` |
| `--ds-space-10` | `40px` |
| `--ds-space-12` | `48px` |
| `--ds-space-14` | `56px` |
| `--ds-space-16` | `64px` |

### 密度

| Token | Value | 用途 |
| --- | --- | --- |
| `--ds-section-gap` | `12px` | 页面 section 之间的默认间距 |
| `--ds-section-title-gap` | `8px` | 分区标题到内容的距离 |
| `--ds-cell-h` | `56px` | 标准 cell 行高 |
| `--ds-cell-h-compact` | `52px` | 紧凑 cell 行高 |
| `--ds-cell-pad-x` | `14px` | cell 左右内边距 |
| `--ds-cell-icon` | `32px` | 标准 cell 图标底尺寸 |
| `--ds-cell-icon-compact` | `30px` | 紧凑 cell 图标底尺寸 |

### 圆角、阴影、字号

| Token | Value | 用途 |
| --- | --- | --- |
| `--ds-radius-xs` | `4px` | 极小内嵌控件 |
| `--ds-radius-sm` | `6px` | 小状态块 |
| `--ds-radius-md` | `8px` | 基础数值，控件圆角来源 |
| `--ds-radius-lg` | `10px` | 基础数值，小卡片来源 |
| `--ds-radius-xl` | `12px` | 基础数值，标准卡片来源 |
| `--ds-radius-2xl` | `14px` | 基础数值，头图/媒体来源 |
| `--ds-radius-control` | `8px` | 输入框、分段控件、主按钮 |
| `--ds-radius-card-sm` | `10px` | 内嵌卡片、列表内部统计格 |
| `--ds-radius-card` | `12px` | 标准卡片、面板、列表项 |
| `--ds-radius-media` | `14px` | 首页头图、地图图标、强调媒体块 |
| `--ds-radius-icon` | `10px` | 功能图标软方块 |
| `--ds-radius-icon-sm` | `8px` | 小尺寸行内图标底 |
| `--ds-radius-sheet` | `14px` | 弹层/底部面板 |
| `--ds-radius-pill` | `999px` | 胶囊按钮/标签 |
| `--ds-shadow-xs` | `0 1px 2px rgba(29, 39, 51, 0.04)` | 极轻边界 |
| `--ds-shadow-sm` | `0 4px 12px rgba(29, 39, 51, 0.05)` | 轻卡片 |
| `--ds-shadow-md` | `0 8px 24px rgba(29, 39, 51, 0.06)` | 默认卡片 |
| `--ds-shadow-lg` | `0 16px 40px rgba(29, 39, 51, 0.1)` | 悬浮层 |
| `--ds-font-xs` | `12px` | 辅助文字 |
| `--ds-font-sm` | `14px` | 正文 |
| `--ds-font-md` | `16px` | 重点正文 |
| `--ds-font-lg` | `18px` | 分区标题 |
| `--ds-font-xl` | `20px` | 页面标题 |
| `--ds-font-2xl` | `24px` | 强标题 |
| `--ds-font-3xl` | `28px` | 大标题 |
| `--ds-font-4xl` | `32px` | 首屏主标题 |
| `--ds-touch-target` | `44px` | 最小触控目标 |
| `--ds-icon-xs` | `12px` | 徽标、轻提示图标 |
| `--ds-icon-sm` | `16px` | cell 行内图标 |
| `--ds-icon-md` | `20px` | 常规按钮、正文旁图标 |
| `--ds-icon-lg` | `24px` | 底部导航图标 |
| `--ds-icon-xl` | `44px` | 功能入口图标容器 |
| `--ds-icon-empty` | `48px` | 空状态图标 |
| `--ds-icon-stroke` | `1.85` | 线性图标统一线宽 |

圆角已经按锚点页比例重算：18x9 风格锚点是 `864px` 宽，业务原型画布是 `430px` 宽，所以锚点里的 `24px` 卡片圆角在业务组件里约等于 `12px`。后续业务页优先使用语义 token，不再直接写 `16px`、`18px`、`20px`、`26px` 这类未换算旧值。

## 组件约定

- `button`、`button-secondary`、`button-ghost` 是基础按钮层。
- `card`、`soft-card`、`entry-card` 是卡片层。
- `chip`、`tab`、`pill`、`ds-badge` 是标签/状态层。
- `topbar`、`bottom-nav` 是全局导航层。
- `ab-info-list` 是业务页优先使用的 cell-group：多条信息放在同一个白色容器里，中间用 1px 分割线，不再默认“一条一个卡片”。
- `ds-list-row`、`ds-field`、`ds-callout` 是后续页面最常用的复用块。

## 锚点复刻 Token（保留）

来源：`#/style-anchor/02-list` 到 `#/style-anchor/08-modal` 的 18x9 复刻页。
这份记录是当前页面群的统一设计规范草稿，后续还会跟着页面细调。

## 颜色

| Token | Value | 用途 |
| --- | --- | --- |
| `--a-bg` | `#f5f7fb` | 页面底色 |
| `--a-surface` | `#ffffff` | 卡片/面板底色 |
| `--a-line` | `#dfe4ec` | 常规分割线 |
| `--a-line-strong` | `#d7dde6` | 输入框/容器边线 |
| `--a-text` | `#090d14` | 主标题/正文 |
| `--a-muted` | `#6d7480` | 次级文字 |
| `--a-soft` | `#9aa2ad` | 占位/弱提示 |
| `--a-blue` | `#2676e8` | 主操作/选中态 |
| `--a-blue-dark` | `#155fd4` | 深一点的蓝 |
| `--a-blue-soft` | `#eaf2ff` | 蓝色浅底 |
| `--a-green` | `#179b61` | 成功/畅通 |
| `--a-green-soft` | `#eaf8f1` | 绿色浅底 |
| `--a-amber` | `#ff8b10` | 提示/正常 |
| `--a-amber-soft` | `#fff4e5` | 橙色浅底 |
| `--a-red` | `#f03028` | 紧急/拥挤 |
| `--a-red-soft` | `#fff0f0` | 红色浅底 |

## 圆角

| Token | Value |
| --- | --- |
| `--a-radius-card` | `24px` |
| `--a-radius-control` | `17px` |
| `999px` | 胶囊按钮/标签 |

## 阴影

| Token | Value | 用途 |
| --- | --- | --- |
| `--a-shadow-card` | `0 8px 22px rgba(21, 34, 52, 0.06)` | 大卡片 |
| `--a-shadow-soft` | `0 4px 14px rgba(21, 34, 52, 0.05)` | 轻列表/轻按钮 |

## 间距

建议主尺度：

- `8px`
- `12px`
- `16px`
- `18px`
- `20px`
- `22px`
- `24px`
- `28px`
- `31px`
- `32px`
- `36px`
- `37px`
- `39px`
- `41px`
- `44px`
- `46px`

## 字体层级

| 层级 | 建议值 | 用途 |
| --- | --- | --- |
| 页面标题 | `34px - 38px` | 顶部栏、大标题 |
| 页面主标题 | `46px - 49px` | 站点详情、成功页主文案 |
| 分区标题 | `27px - 34px` | 表单分段、卡片标题 |
| 正文/列表 | `20px - 29px` | 列表、说明、设置项 |
| 辅助文字 | `18px - 23px` | 计数、说明、底部文案 |

## 组件约定

- 顶部栏：白底，1px 分割线，左返回，标题居中，右侧动作区。
- 卡片：白底、浅边框、轻阴影，圆角比控制项更大。
- 选中态：蓝色描边或蓝底，尽量不用纯填充大块色。
- 状态标签：畅通绿色、正常橙色、拥挤红色。
- 底部导航：固定在底部，图标线性，文字 20px 左右，选中态蓝色。
- 图标：统一线性 SVG，圆角端点和转角。

## 需要注意

- 02 和 03 页对字重和位置最敏感，后续改统一 token 时优先回看这两页。
- 复刻页的实际视觉目标是“生成锚点一致性”，不是复原业务真值。
- 当前 `scripts/style_anchor_check.py` 的 18x9 结果里，02 已低于 5%，03 仍是最高偏差页。
