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

### 进入组件库的结论

当前 `ICON_LIBRARY` 已经包含这 9 个语义，并且页面引用已经改为这些语义名。后续不再让页面临时手写图标；如果某个页面需要新语义，先更新 `ICON_LIBRARY` 和 `docs/ui/icon-inventory.json`。

### 下一批

第二批建议覆盖设置与表单类图标：`message`、`globe`、`accessibility`、`shield`、`lock`、`ear`、`feedback`、`phone`、`mail`。
