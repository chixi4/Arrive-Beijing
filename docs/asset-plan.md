# Bitmap Asset Plan

本计划用于区分“需要位图生成”的业务素材和“应由 HTML/CSS/SVG 实现”的界面元素。目标是给后续真实 HTML 原型提供可直接使用的 PNG 资产，不把所有视觉都压到整页截图里。

## 补充页面锚点

这些是整页风格参考，用于补齐当前 8 张主锚点没有充分覆盖的业务页面。

- `assets/page-anchors-extra/01-station-select.png`：站点选择/站区切换。
- `assets/page-anchors-extra/02-navigation-map.png`：导航指引、地图/3D/平面/AR。
- `assets/page-anchors-extra/03-traffic-tabs.png`：市内交通、地铁/公交/出租/网约/综合。
- `assets/page-anchors-extra/04-parking.png`：停车场指引、价格对比。
- `assets/page-anchors-extra/05-short-haul-booking.png`：短途复载预约。

已落地的参考源保存在：

- `assets/reference/generated-sheets/station-board.png`
- `assets/reference/generated-sheets/navigation-sheet.png`
- `assets/reference/generated-sheets/traffic-sheet.png`
- `assets/reference/generated-sheets/parking-sheet.png`
- `assets/reference/generated-sheets/driver-sheet.png`
- `assets/reference/generated-sheets/empty-success-sheet.png`

## 业务位图资产

这些资产后续可以嵌入真实 HTML 页面。

### 站点建筑图

统一生成蓝白低饱和建筑卡图，保留原稿里“站点建筑轮廓识别”的方向，但不要直接复刻粗糙蓝底。

- 北京站
- 北京西站
- 北京南站
- 北京北站
- 朝阳站
- 清河站
- 亦庄站
- 通州站
- 首都机场
- 大兴机场

第一版成品（保留作历史资产）：

- `assets/bitmap/stations/beijing-station.png`
- `assets/bitmap/stations/beijing-west-station.png`
- `assets/bitmap/stations/beijing-south-station.png`
- `assets/bitmap/stations/beijing-north-station.png`
- `assets/bitmap/stations/chaoyang-station.png`
- `assets/bitmap/stations/qinghe-station.png`
- `assets/bitmap/stations/yizhuang-station.png`
- `assets/bitmap/stations/tongzhou-station.png`
- `assets/bitmap/stations/capital-airport.png`
- `assets/bitmap/stations/daxing-airport.png`

二次校准成品：

- `assets/bitmap/stations-v2/master/*.png`：每个站点的生图主图，保留用于后续重切。
- `assets/bitmap/stations-v2/landscape/*.png`：`960 × 540` 横版图，供首页头图使用。
- `assets/bitmap/stations-v2/portrait/*.png`：`720 × 900` 竖版图，供站点选择/切换卡片使用。

### 场景与演示图

- `assets/bitmap/hero/splash-hero.png`：开屏主视觉。
- `assets/bitmap/navigation/map-preview.png`：地图预览。
- `assets/bitmap/navigation/three-d-map.png`：3D 室内地图演示。
- `assets/bitmap/navigation/flat-map.png`：平面地图演示。
- `assets/bitmap/navigation/ar-demo.png`：AR 导航演示。
- `assets/bitmap/navigation/crops/map-preview-crop.png`：路线规划页面内嵌用裁切图。
- `assets/bitmap/navigation/crops/three-d-map-crop.png`：3D 导览页面内嵌用裁切图。
- `assets/bitmap/navigation/crops/flat-map-crop.png`：平面地图页面内嵌用裁切图。
- `assets/bitmap/navigation/crops/ar-demo-crop.png`：AR 指引页面内嵌用裁切图。
- `assets/bitmap/splash/passenger-01.png`、`assets/bitmap/splash/passenger-02.png`：旅客端随机开屏图池。
- `assets/bitmap/splash/driver-01.png`、`assets/bitmap/splash/driver-02.png`：司机端随机开屏图池。
- `assets/bitmap/traffic/taxi-pickup.png`：出租车上车点。
- `assets/bitmap/traffic/ride-hailing-pickup.png`：网约车上车点。
- `assets/bitmap/traffic/bus-transfer.png`：公交换乘。
- `assets/bitmap/traffic/metro-transfer.png`：地铁换乘。
- `assets/bitmap/parking/parking-lot.png`：停车场示意。
- `assets/bitmap/parking/price-compare.png`：停车价格对比示意。
- `assets/bitmap/driver/short-haul.png`：短途复载。
- `assets/bitmap/driver/taxi-house.png`：的士之家休息区。
- `assets/bitmap/driver/meal.png`：今日餐饮。
- `assets/bitmap/driver/redeem.png`：积分兑换。
- `assets/bitmap/states/empty.png`：空状态小插图。
- `assets/bitmap/states/success.png`：成功状态小插图。

最终成品：

- `assets/bitmap/hero/splash-hero.png`
- `assets/bitmap/navigation/map-preview.png`
- `assets/bitmap/navigation/three-d-map.png`
- `assets/bitmap/navigation/flat-map.png`
- `assets/bitmap/navigation/ar-demo.png`
- `assets/bitmap/navigation/crops/map-preview-crop.png`
- `assets/bitmap/navigation/crops/three-d-map-crop.png`
- `assets/bitmap/navigation/crops/flat-map-crop.png`
- `assets/bitmap/navigation/crops/ar-demo-crop.png`
- `assets/bitmap/splash/passenger-01.png`
- `assets/bitmap/splash/passenger-02.png`
- `assets/bitmap/splash/driver-01.png`
- `assets/bitmap/splash/driver-02.png`
- `assets/bitmap/traffic/taxi-pickup.png`
- `assets/bitmap/traffic/ride-hailing-pickup.png`
- `assets/bitmap/traffic/bus-transfer.png`
- `assets/bitmap/traffic/metro-transfer.png`
- `assets/bitmap/parking/parking-lot.png`
- `assets/bitmap/parking/price-compare.png`
- `assets/bitmap/driver/short-haul.png`
- `assets/bitmap/driver/taxi-house.png`
- `assets/bitmap/driver/meal.png`
- `assets/bitmap/driver/redeem.png`
- `assets/bitmap/states/empty.png`
- `assets/bitmap/states/success.png`

## 不做位图的元素

- 返回、搜索、筛选、加减号、上传、设置等功能 icon。
- 底部导航 icon。
- 按钮、卡片、tab、表单、徽章、列表、弹窗容器。
- 普通页面背景。

这些应由 HTML/CSS/SVG 或图标库实现，保证清晰、可维护、可响应式。
