# Icon Calibration Log

本文件记录图标生图、视觉检查、CSV 模拟和像素比对结果。这里只处理图标形状，不处理页面中文文案；页面文字仍遵守“不用 OCR / 不用位图自动识别”的规则。

## Board 01 - 高频服务图标

![board-01](../../assets/icons/calibration/board-01-high-frequency/board-clean.png)

### 覆盖图标

第一批覆盖首页、底栏、设置页和交通页里最常出现的 9 个语义：

1. `pin` 定位
2. `map` 导航地图
3. `route` 市内交通路线
4. `megaphone` 站区公告
5. `search` 搜索
6. `user` 身份/个人中心
7. `taxi` 出租/短途复载
8. `car` 网约车/小汽车
9. `transfer` 场站接驳

### 生成与修复

- 第一轮提示词的问题：整体方向正确，但仍有软阴影和轻微灰色渲染，不适合作为可复用图标库的最终风格参考。
- 第二轮提示词加强了“纯白背景、严格扁平、无阴影、无灰色光晕、无 3D、无文字标签”，图标语义和九宫格构图可用。
- 后期修复：保留第二轮生图的语义和构图，把背景统一成纯白，把图标线条阈值化成纯黑，得到最终校准板。

### 文件

- 原始生图：`assets/icons/calibration/board-01-high-frequency/generated-raw.png`
- 清理后校准板：`assets/icons/calibration/board-01-high-frequency/board-clean.png`
- CSV 与切片结果：`assets/icons/calibration/board-01-high-frequency/csv-check/`
- 比对报告：`assets/icons/calibration/board-01-high-frequency/csv-check/manifest.json`
- 单图放大与 SVG mask 复刻：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/`

### 像素检查

使用命令：

```bash
python3 scripts/icon_sheet_tools.py extract \
  --input assets/icons/calibration/board-01-high-frequency/board-clean.png \
  --out assets/icons/calibration/board-01-high-frequency/csv-check \
  --names pin,map,route,megaphone,search,user,taxi,car,transfer
```

结果：

```json
{
  "pass": true,
  "maxDiffRatio": 0.0
}
```

这里的 `0.0` 表示 CSV alpha 模拟图与清理后的目标图完全一致，满足 `diffRatio <= 5%` 的门槛。

### 单图拆分与页面图标复刻

之前的 CSV 检查只能证明“切出的目标图”和“CSV 模拟图”一致，不能证明页面里正在用的 SVG 也贴近目标。按新的检查口径，已经把 3x3 图标板拆成 9 张独立目标图，并为每张图生成 3 倍放大图，便于看清轮廓：

- 单图目标：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/targets/`
- 3 倍放大：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/enlarged-3x/`
- SVG mask：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/svg/`
- 页面加载脚本：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/icon-replicas-board-01.js`
- 新比对报告：`assets/icons/calibration/board-01-high-frequency/single-svg-replica/manifest.json`

使用命令：

```bash
python3 scripts/icon_svg_replica.py \
  --input assets/icons/calibration/board-01-high-frequency/board-clean.png \
  --out assets/icons/calibration/board-01-high-frequency/single-svg-replica \
  --names pin,map,route,megaphone,search,user,taxi,car,transfer
```

结果：

```json
{
  "pass": true,
  "maxDiffRatio": 0.0
}
```

页面里的第一批 9 个高频图标现在优先使用这份单图复刻结果。复刻用完整 cell 做像素 diff，同时把每个图标真实黑色线条的 `inkBBox` 裁出来，加 6% padding 后写成页面显示用 viewBox。这个 viewBox 不再强行做成统一方形，而是让浏览器把裁出的图标矩形居中放进方形 icon 盒子里，避免九宫格白边导致图标过小。

### 进入组件库的结论

当前 `ICON_LIBRARY` 已经包含这 9 个语义，并且页面引用已经改为这些语义名。运行时渲染顺序为：第一批单图复刻 `ICON_REPLICA_LIBRARY` 优先，其次回落到手写 `ICON_LIBRARY`。后续不再让页面临时手写图标；如果某个页面需要新语义，先更新 `ICON_LIBRARY`、`docs/ui/icon-inventory.json`，并按需要生成新的单图复刻批次。

### 当前可见页面

这批图标已经应用到真实页面和设计系统预览页。最集中查看的位置是：

- `http://127.0.0.1:4174/#/design-system`：新增“图标系统 / 第一批校准”区块，一次能看到 9 个图标。
- `http://127.0.0.1:4174/#/station/home`：首页首屏能看到 `pin`、`megaphone`、`search`、`map`、`route`、`transfer`、`user`、`taxi`、`car`，是当前最完整的业务页验证入口。

按图标拆开看：

| 图标 | 主要可见页面 |
| --- | --- |
| `pin` | `#/station/home`、`#/traffic/taxi`、`#/driver/short-haul/booking`、`#/driver/taxi-house/info`、`#/style-anchor/03-detail`、`#/style-anchor/05-completion` |
| `map` | `#/station/home`、`#/nav/map`、`#/traffic/mixed`、`#/design-system` |
| `route` | `#/station/home`、旅客端底栏的“交通”入口、`#/profile`、`#/design-system` |
| `megaphone` | `#/station/home`、旅客端底栏的“公告”入口、`#/announcements`、`#/design-system` |
| `search` | `#/station/home`、`#/driver/queue`、`#/design-system`、`#/style-anchor/02-list` |
| `user` | `#/station/home`、`#/profile`、`#/driver/profile`、`#/driver/station/beijing`、`#/design-system` |
| `taxi` | `#/station/home`、`#/traffic/taxi`、`#/driver/short-haul/booking`、司机端底栏“短途复载”入口 |
| `car` | `#/station/home`、`#/traffic/ride`、`#/traffic/mixed`、`#/style-anchor/03-detail` |
| `transfer` | `#/station/home` 的“场站接驳”入口、`#/design-system` |

### 下一批

第二批建议覆盖设置与表单类图标：`message`、`globe`、`accessibility`、`shield`、`lock`、`ear`、`feedback`、`phone`、`mail`。
