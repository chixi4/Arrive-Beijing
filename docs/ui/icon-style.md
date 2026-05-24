# Icon System

本项目图标统一走 `ICON_LIBRARY / ICON_REPLICA_LIBRARY -> iconMarkup(name) / anchorIcon(name)`，最终在页面里渲染为 `currentColor` SVG。生图模型只作为风格校准和像素比对目标，不作为中文文案来源，也不从页面截图里扣图标。

## 当前结论

- 当前库：52 个手写 SVG 图标，第一批 9 个单图复刻 SVG mask，5 个语义别名。
- 当前使用：49 个语义图标，0 个缺失。
- 已替换的明显误用：`我的积分` 不再用扫码图标，`监督投诉邮箱` 不再用扫码图标，`场站接驳` 不再复用公交图标，`自驾停车` 不再复用小汽车图标，`退出登录` 不再用扫码图标。
- 已完成单图复刻的高频图标：`pin`、`map`、`route`、`megaphone/notice`、`search`、`user`、`taxi`、`car`、`transfer`。
- 仍需重点校准的高频图标：`home`、`feedback`、`parking`、`points`、`message`、`phone`、`mail`。

## 视觉规范

- 手写图标默认使用 `viewBox="0 0 24 24"`。
- 手写图标使用 `stroke="currentColor"`，`fill="none"`，`stroke-width: var(--ds-icon-stroke, 1.85)`。
- 单图复刻图标使用目标图真实黑色线条的 `inkBBox` 加少量 padding 生成自定义 viewBox，并使用 `fill="currentColor"`、`stroke="none"` 的 mask path。
- 线性图标保持 `stroke-linecap="round"`，`stroke-linejoin="round"`。
- 默认不要渐变、阴影、3D、彩色填充或装饰性光效。
- 页面级不直接改图标大小；优先使用 `--ds-icon-xs/sm/md/lg/xl/empty`。

## 尺寸 Token

| Token | Value | 用途 |
| --- | --- | --- |
| `--ds-icon-xs` | `12px` | 徽标、轻提示 |
| `--ds-icon-sm` | `16px` | cell 行内 |
| `--ds-icon-md` | `20px` | 常规按钮、正文旁 |
| `--ds-icon-lg` | `24px` | 底部导航 |
| `--ds-icon-xl` | `44px` | 功能入口色块 |
| `--ds-icon-empty` | `48px` | 空状态中心图标 |

## 3x3 生图校准流程

每次只生成一张 1:1 的 3x3 图标风格板，9 个图标为一组。生成图必须是白底、纯黑/深灰线性图标、无文字标签、无手机外框、无阴影、无渐变。

生成后执行三步：

1. 视觉检查：图标语义是否清楚、线宽是否一致、九宫格是否居中、是否有多余文字或装饰。
2. CSV 模拟：把 3x3 图切成 9 个 cell，按像素亮度生成 alpha CSV 和模拟 PNG。
3. 像素比对：目标 cell 与 CSV 模拟 PNG 的 `diffRatio <= 5%` 才能进入手写 SVG 复刻或组件库校准。
4. 单图复刻：把 9 个 cell 拆成独立 PNG 和 3 倍放大图，再生成 `currentColor` SVG mask。完整 cell 的目标图与复刻 PNG 必须 `diffRatio <= 5%`，实际页面 viewBox 使用 `inkBBox + padding` 裁边并由浏览器居中，避免白边导致图标过小。

注意：CSV 是像素校准中间产物，不直接作为页面文字或业务事实源。最终页面仍使用可维护的 SVG 组件。

## 第一批 3x3 图标组

第一批覆盖最高频且会影响主页面质感的图标：

1. `pin` 定位
2. `map` 导航地图
3. `route` 市内交通
4. `megaphone` 站区公告
5. `search` 搜索
6. `user` 身份/个人中心
7. `taxi` 出租/短途复载
8. `car` 网约车/小汽车
9. `transfer` 场站接驳

已完成第一批校准，记录见 `docs/ui/icon-calibration-log.md`。清理后的图标板位于 `assets/icons/calibration/board-01-high-frequency/board-clean.png`，CSV 模拟比对与单图 SVG mask 复刻都已通过，`maxDiffRatio = 0.0`。

第二批再覆盖设置、反馈、停车、积分、表单和司机端专属图标。
