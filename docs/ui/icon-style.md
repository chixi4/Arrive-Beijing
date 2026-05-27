# Icon System

本项目图标统一走 `ICON_LIBRARY / ICON_REPLICA_LIBRARY -> iconMarkup(name) / anchorIcon(name)`，最终在页面里渲染为 `currentColor` SVG。生图模型只作为风格校准和像素比对目标，不作为中文文案来源，也不从页面截图里扣图标。

## 当前结论

- 当前库：60 个手写 SVG 图标，十批共 79 个唯一单图复刻 SVG mask，8 个语义别名。
- 当前使用：页面和设计系统里所有已用语义均已进入复刻链路，0 个缺失。
- 已替换的明显误用：`我的积分` 不再用扫码图标，`监督投诉邮箱` 不再用扫码图标，`场站接驳` 不再复用公交图标，`自驾停车` 不再复用小汽车图标，`退出登录` 不再用扫码图标。
- 已完成单图复刻的高频图标：`pin`、`map`、`route`、`megaphone/notice`、`search`、`user`、`taxi`、`car`、`transfer`、`message`、`globe`、`accessibility`、`shield`、`lock`、`ear`、`feedback`、`phone`、`mail`、`home`、`parking`、`points`、`calendar`、`clock`、`back`、`train/station`、`people`、`history`、`lounge`、`dining`、`charger`、`wifi`、`tea`、`book`、`medical`、`restroom`、`gift/redeem`。
- 追加的三批覆盖 `check/more/question/refresh/settings/edit/scan/camera/id`、`angry/bike/bus/chat/cup/glove/leaf/logout/paper`、`pillow/plane/grid/handshake/qr/thumb` 等剩余库项，CSV 模拟与 SVG mask 复刻都已通过。
- 站点轮廓两批覆盖 10 个站点：`station_beijing/station_west/station_south/station_north/station_qinghe/station_chaoyang/station_fengtai/station_tongzhou/station_capital/station_daxing`，用于站点选择卡片左下角，不再使用旧 PNG。当前 `station_fengtai` 复用旧站点 mask，后续若单独校准丰台站轮廓，应重新走 3x3 图标板流程。
- 交通接驳补充批覆盖 `walk/metro/traffic_bus/traffic_taxi/ride_hailing/route_swap/filter_sliders/departure_time/route_recommend`，用于综合交通页后续搜索卡、路线方案和高德式步行胶囊重构。
- 最新视觉口径：基础业务图标 `board-01` 到 `board-07` 已重新从源生图生成粗一档 target，再进入像素复刻链路；`board-08`、`board-09` 站点图标本轮不重生。站点图标不能从站点图片直接算法提轮廓，必须先把站点图片作为视觉参考交给生图模型重绘为 3x3 icon target，再进入同一 CSV 与 SVG mask 复刻链路。所有批次都通过 `diffRatio <= 5%` 门槛。
- 仍需重点校准的图标：当前使用链路无缺失；下一轮只在新增页面出现新语义，或现有页面视觉检查发现具体图标不协调时再扩批。

## 视觉规范

- 手写图标默认使用 `viewBox="0 0 24 24"`。
- 手写图标使用 `stroke="currentColor"`，`fill="none"`，`stroke-width: var(--ds-icon-stroke, 1.85)`。
- 单图复刻图标使用目标图真实黑色线条的 `inkBBox` 加少量 padding 生成自定义 viewBox，并使用 `fill="currentColor"`、`stroke="none"` 的 mask path。
- 2026-05-27 起，基础业务图标的加粗只在源 target 生成阶段完成，`renderIcon()` 不再对复刻 mask 追加同色描边；不要在具体页面单独改 SVG 尺寸或线宽。
- 线性图标保持 `stroke-linecap="round"`，`stroke-linejoin="round"`。
- 允许少量语义级光学校正：例如 `search` 因斜柄导致小尺寸视觉偏左，统一右移 `1px`；`car` 因横向车身在方形盒中显小，统一放大 `1.18`。
- 默认不要渐变、阴影、3D、彩色填充或装饰性光效。
- 页面级不直接改图标大小；优先使用 `--ds-icon-xs/sm/md/lg/xl/empty`。

## 尺寸 Token

| Token | Value | 用途 |
| --- | --- | --- |
| `--ds-icon-xs` | `13px` | 徽标、轻提示 |
| `--ds-icon-sm` | `18px` | cell 行内 |
| `--ds-icon-md` | `22px` | 常规按钮、正文旁 |
| `--ds-icon-lg` | `26px` | 底部导航 |
| `--ds-icon-xl` | `48px` | 功能入口色块 |
| `--ds-icon-empty` | `52px` | 空状态中心图标 |

## 3x3 生图校准流程

每次只生成一张 1:1 的 3x3 图标风格板，9 个图标为一组。生成图必须是白底、纯黑线性图标、无文字标签、无手机外框、无阴影、无渐变。当前推荐提示词方向为“plain icon calibration target、sparse、geometric、low-detail、thick strokes around 26 px on 1024 px board”，再通过后期阈值化得到纯黑白 target。若模型被某个词带向复杂样式，优先通过不提及该触发词来回到简洁图标，而不是继续堆叠反向约束。

生成后执行三步：

1. 视觉检查：图标语义是否清楚、线宽是否一致、九宫格是否居中、是否有多余文字或装饰。
2. CSV 模拟：把 3x3 图切成 9 个 cell，按像素亮度生成 alpha CSV 和模拟 PNG。
3. 像素比对：目标 cell 与 CSV 模拟 PNG 的 `diffRatio <= 5%` 才能进入手写 SVG 复刻或组件库校准。
4. 单图复刻：把 9 个 cell 拆成独立 PNG 和 3 倍放大图，再生成 `currentColor` SVG mask。完整 cell 的目标图与复刻 PNG 必须 `diffRatio <= 5%`，实际页面 viewBox 使用 `inkBBox + padding` 裁边并由浏览器居中，避免白边导致图标过小。

注意：CSV 是像素校准中间产物，不直接作为页面文字或业务事实源。最终页面仍使用可维护的 SVG 组件。

## 已完成 3x3 图标组

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

第二批覆盖设置和反馈链路：

1. `message` 消息
2. `globe` 语言
3. `accessibility` 无障碍
4. `shield` 账号安全
5. `lock` 隐私
6. `ear` 辅助
7. `feedback` 反馈
8. `phone` 电话
9. `mail` 邮箱

第三批覆盖服务工具和司机端高频信息：

1. `home` 首页
2. `parking` 停车
3. `points` 积分
4. `calendar` 日期
5. `clock` 时间
6. `back` 返回
7. `train` 车站
8. `people` 人群
9. `history` 历史

第四批覆盖用户指出问题最明显的的士之家链路：

1. `lounge` 休息/的士之家
2. `dining` 餐饮
3. `charger` 充电
4. `wifi` 免费 WIFI
5. `tea` 茶水
6. `book` 阅读
7. `medical` 医疗急救箱
8. `restroom` 洗手间
9. `gift` 积分兑换

第五批覆盖控件补齐：

1. `check` 确认
2. `more` 更多
3. `question` 问号
4. `refresh` 刷新
5. `settings` 设置
6. `edit` 编辑
7. `scan` 扫码
8. `camera` 相机
9. `id` 证件

第六批覆盖出行反馈：

1. `angry` 情绪
2. `bike` 骑行
3. `bus` 公交
4. `chat` 沟通
5. `cup` 杯子
6. `glove` 手套
7. `leaf` 绿色
8. `logout` 退出
9. `paper` 文档

第七批覆盖剩余杂项：

1. `pillow` 枕头
2. `plane` 飞机
3. `grid` 九宫格
4. `handshake` 握手
5. `qr` 二维码
6. `thumb` 点赞
7. `grid` 九宫格（复用占位）
8. `qr` 二维码（复用占位）
9. `handshake` 握手（复用占位）

第八批覆盖站点轮廓 A：

1. `station_beijing` 北京站
2. `station_west` 北京西站
3. `station_south` 北京南站
4. `station_north` 北京北站
5. `station_chaoyang` 朝阳站
6. `station_qinghe` 清河站
7. `station_fengtai` 丰台站
8. `station_tongzhou` 通州站
9. `station_capital` 首都机场

第九批覆盖站点轮廓 B：

1. `station_daxing` 大兴机场
2. `station_beijing` 北京站（复用）
3. `station_west` 北京西站（复用）
4. `station_south` 北京南站（复用）
5. `station_north` 北京北站（复用）
6. `station_chaoyang` 朝阳站（复用）
7. `station_qinghe` 清河站（复用）
8. `station_fengtai` 丰台站（复用旧 mask）
9. `station_tongzhou` 通州站（复用）

第十批覆盖交通接驳补充图标：

1. `walk` 步行
2. `metro` 地铁
3. `traffic_bus` 公交
4. `traffic_taxi` 出租
5. `ride_hailing` 网约
6. `route_swap` 起终点交换
7. `filter_sliders` 偏好筛选
8. `departure_time` 出发时间
9. `route_recommend` 推荐

第二到第十批同样记录在 `docs/ui/icon-calibration-log.md`。当前运行时会按脚本加载顺序合并十批 `ICON_REPLICA_LIBRARY`，所以同一语义在页面、底栏、锚点页、站点选择卡片、交通接驳页和设计系统里都走同一套复刻结果。
