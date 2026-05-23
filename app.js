const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const IMG = "extracted_screenshots/";
const ICON = "extracted_page04_station_icons/";

const stations = [
  ["beijing", "北京站", `${ICON}P04_icon_北京站.png`],
  ["west", "北京西站", `${ICON}P04_icon_北京西站.png`],
  ["south", "北京南站", `${ICON}P04_icon_北京南站.png`],
  ["north", "北京北站", `${ICON}P04_icon_北京北站.png`],
  ["chaoyang", "朝阳站", `${ICON}P04_icon_朝阳站.png`],
  ["qinghe", "清河站", `${ICON}P04_icon_清河站.png`],
  ["yizhuang", "亦庄站", `${ICON}P04_icon_亦庄站.png`],
  ["tongzhou", "通州站", `${ICON}P04_icon_通州站.png`],
  ["capital", "首都机场", `${ICON}P04_icon_首都机场.png`],
  ["daxing", "大兴机场", `${ICON}P04_icon_大兴机场.png`],
];

const stationHeroAssets = {
  beijing: "assets/bitmap/stations/beijing-station.png",
  west: "assets/bitmap/stations/beijing-west-station.png",
  south: "assets/bitmap/stations/beijing-south-station.png",
  north: "assets/bitmap/stations/beijing-north-station.png",
  chaoyang: "assets/bitmap/stations/chaoyang-station.png",
  qinghe: "assets/bitmap/stations/qinghe-station.png",
  yizhuang: "assets/bitmap/stations/yizhuang-station.png",
  tongzhou: "assets/bitmap/stations/tongzhou-station.png",
  capital: "assets/bitmap/stations/capital-airport.png",
  daxing: "assets/bitmap/stations/daxing-airport.png",
};

const state = {
  station: localStorage.getItem("arrive-beijing.station") || "west",
  draftStation: localStorage.getItem("arrive-beijing.station") || "west",
  currentSurface: null,
    selected: {
      navFloor: "F1",
      announcementCategory: "全部",
      feedbackType: "投诉",
      feedbackCategory: "出租车",
      bookingDate: "今天",
      bookingTime: "09:00",
      queueFilter: "all",
      servicesCategory: "vehicle",
      servicesSection: "traffic",
    },
  counters: {
    braisedRice: 0,
    tomatoNoodles: 0,
    porkRice: 0,
    steamedEgg: 0,
  },
};

const travelerBottomNavItems = [
  { key: "home", label: "首页", icon: "home", to: "#/station/home" },
  { key: "announcements", label: "公告", icon: "notice", to: "#/announcements" },
  { key: "nav", label: "导航", icon: "map", to: "#/nav/map" },
  { key: "traffic", label: "交通", icon: "bus", to: "#/traffic/taxi" },
  { key: "profile", label: "身份", icon: "user", to: "#/profile" },
];

const stationHomeAnnouncements = [
  { tag: "紧急", text: "北京西站南广场施工，请绕行南广场进站", to: "#/announcements" },
  { tag: "通知", text: "春运期间地铁2号线延时至次日02:00", to: "#/announcements" },
  { tag: "提醒", text: "12306实名核验通道升级，请提前准备证件", to: "#/announcements" },
];

const stationHomeServices = [
  { label: "导航指引", icon: "map", to: "#/nav/map", bg: "#dceeff", fg: "#2e7de1" },
  { label: "站区公告", icon: "notice", to: "#/announcements", bg: "#ffe8b8", fg: "#f0a423" },
  { label: "市内交通", icon: "bus", to: "#/traffic/taxi", bg: "#efddff", fg: "#a24ac2" },
  { label: "场站接驳", icon: "bus", to: "#/traffic/ride", bg: "#e6eb9f", fg: "#8f9f1b" },
  { label: "投诉建议", icon: "chat", to: "#/feedback/submit", bg: "#f6ddd9", fg: "#e5474d" },
  { label: "自驾停车", icon: "car", to: "#/parking/list", bg: "#e4f2d6", fg: "#6aa84f" },
  { label: "个人中心", icon: "user", to: "#/profile", bg: "#fdeacc", fg: "#f08a24" },
  { label: "短途复载", icon: "taxi", to: "#/driver/short-haul/booking", bg: "#d7f3f9", fg: "#1fa7c2" },
];

const feedbackTypeOptions = [
  { key: "投诉", icon: "angry", tone: "danger" },
  { key: "建议", icon: "edit", tone: "primary" },
  { key: "咨询", icon: "question", tone: "warning" },
  { key: "表扬", icon: "thumb", tone: "success" },
];

const feedbackCategoryOptions = [
  "站内设施",
  "出租车",
  "网约车",
  "地铁",
  "停车场",
  "工作人员",
  "安全问题",
  "其他",
];

const feedbackSummary = [
  { value: "2", label: "已提交", tone: "primary" },
  { value: "1", label: "已处理", tone: "success" },
  { value: "1", label: "处理中", tone: "warning" },
];

const feedbackRecords = [
  {
    title: "候车室座位不足问题",
    tag: "已处理",
    tone: "success",
    meta: "提交时间 2026-05-22 10:18",
    reply: "官方回复：已加派现场巡查，后续将根据客流变化增设临时座位。",
  },
  {
    title: "建议增加自助存包柜",
    tag: "处理中",
    tone: "warning",
    meta: "提交时间 2026-05-22 14:02",
    reply: "官方回复：已转交站区服务部门评估安装位置与投放数量。",
  },
];

const travelerProfileSections = [
  {
    title: "基础设置",
    rows: [
      { icon: "message", label: "消息通知", value: "", to: "#/announcements" },
      { icon: "globe", label: "语言 / Language", value: "简体中文" },
      { icon: "accessibility", label: "无障碍模式", value: "", toast: "无障碍模式（原型演示）" },
    ],
  },
  {
    title: "安全",
    rows: [
      { icon: "shield", label: "账号安全", value: "", toast: "账号安全（原型演示）" },
      { icon: "lock", label: "隐私设置", value: "", toast: "隐私设置（原型演示）" },
    ],
  },
  {
    title: "辅助",
    rows: [{ icon: "ear", label: "无障碍辅助", value: "", toast: "无障碍辅助（原型演示）" }],
  },
];

const driverProfileStats = [
  { value: "4.9", label: "综合评分", tone: "primary" },
  { value: "48", label: "当前积分", tone: "success" },
  { value: "3,852", label: "累计接单", tone: "warning" },
  { value: "48.6万", label: "累计里程km", tone: "danger" },
];

const driverProfileSections = [
  {
    title: "常用功能",
    rows: [
      { icon: "message", label: "消息通知", value: "", toast: "消息通知（原型演示）" },
      { icon: "scan", label: "我的积分", value: "", to: "#/driver/short-haul/points" },
      { icon: "home", label: "行程历史", value: "", to: "#/driver/short-haul/history" },
      { icon: "calendar", label: "预约记录", value: "", to: "#/driver/short-haul/booking" },
    ],
  },
  {
    title: "身份信息",
    rows: [
      { icon: "id", label: "驾驶证信息", value: "", toast: "驾驶证信息（原型演示）" },
      { icon: "question", label: "帮助中心", value: "", toast: "帮助中心（原型演示）" },
    ],
  },
];

const servicesSidebarItems = [
  { key: "traffic", label: "交通出行", section: "traffic" },
  { key: "entry", label: "进京证办...", section: "traffic" },
  { key: "police", label: "交警随手...", section: "traffic" },
  { key: "drive", label: "驾车出行", section: "traffic" },
  { key: "small-car", label: "小客车指...", section: "traffic" },
  { key: "12123", label: "交管12...", section: "traffic" },
  { key: "public", label: "公共出行", section: "traffic" },
  { key: "passenger", label: "客运服务", section: "traffic" },
  { key: "vehicle", label: "机动车业...", section: "traffic" },
  { key: "airport", label: "机场服务", section: "airport" },
  { key: "freight", label: "货运服务", section: "airport" },
  { key: "household", label: "户政档案", section: "station" },
  { key: "housing", label: "住房服务", section: "station" },
];

const servicesSections = [
  {
    key: "traffic",
    title: "交通出行",
    links: [
      { label: "机动车检测收费计算器", toast: "机动车检测收费计算器（原型演示）" },
      { label: "机动车检测场地图查询", toast: "机动车检测场地图查询（原型演示）" },
      { label: "机动车检验机构详情查询", toast: "机动车检验机构详情查询（原型演示）" },
    ],
  },
  {
    key: "airport",
    title: "机场服务",
    links: [
      { label: "大兴机场地铁信息", toast: "大兴机场地铁信息（原型演示）" },
      { label: "大兴机场出租车信息", toast: "大兴机场出租车信息（原型演示）" },
      { label: "大兴机场网约车信息", toast: "大兴机场网约车信息（原型演示）" },
      { label: "大兴机场城市航站楼", toast: "大兴机场城市航站楼（原型演示）" },
      { label: "大兴机场公交信息", toast: "大兴机场公交信息（原型演示）" },
      { label: "大兴机场展览·景点·花园", toast: "大兴机场展览·景点·花园（原型演示）" },
      { label: "首都机场礼迎礼送风景线", toast: "首都机场礼迎礼送风景线（原型演示）" },
    ],
  },
  {
    key: "station",
    title: "到站北京畅行服务",
    links: [
      { label: "到站北京（旅客端）", to: "#/splash" },
      { label: "短途复载（司机端）", to: "#/driver/splash" },
    ],
  },
];

const styleAnchorRoutes = {
  "#/style-anchor/02-list": "list",
  "#/style-anchor/03-detail": "detail",
  "#/style-anchor/04-form": "form",
  "#/style-anchor/05-completion": "completion",
  "#/style-anchor/06-loading": "loading",
  "#/style-anchor/07-profile": "profile",
  "#/style-anchor/08-modal": "modal",
};

const designSystemRoute = "#/design-system";

const anchorQueueStations = [
  { type: "train", name: "北京站", status: "畅通", tone: "green", passengers: "128 人", vehicles: "2,350 人", wait: "12 分钟" },
  { type: "train", name: "北京西站", status: "正常", tone: "amber", passengers: "356 人", vehicles: "4,120 人", wait: "25 分钟" },
  { type: "train", name: "北京南站", status: "正常", tone: "amber", passengers: "482 人", vehicles: "5,630 人", wait: "28 分钟" },
  { type: "train", name: "北京北站", status: "畅通", tone: "green", passengers: "82 人", vehicles: "1,680 人", wait: "8 分钟" },
  { type: "train", name: "朝阳站", status: "拥挤", tone: "red", passengers: "692 人", vehicles: "6,980 人", wait: "45 分钟" },
  { type: "train", name: "清河站", status: "正常", tone: "amber", passengers: "215 人", vehicles: "3,210 人", wait: "18 分钟" },
  { type: "train", name: "亦庄站", status: "畅通", tone: "green", passengers: "96 人", vehicles: "1,450 人", wait: "9 分钟" },
  { type: "train", name: "通州站", status: "正常", tone: "amber", passengers: "243 人", vehicles: "2,980 人", wait: "20 分钟" },
  { type: "plane", name: "首都机场", status: "正常", tone: "amber", passengers: "378 人", vehicles: "4,850 人", wait: "30 分钟" },
  { type: "plane", name: "大兴机场", status: "畅通", tone: "green", passengers: "154 人", vehicles: "2,120 人", wait: "15 分钟" },
];

const ANCHOR_ICONS = {
  back: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5 7.5 12l8 7.5"></path></svg>`,
  refresh: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5"></path><path d="M19 11a7 7 0 1 0-2 5"></path></svg>`,
  search: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"></circle><path d="m16 16 4 4"></path></svg>`,
  people: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle><circle cx="16" cy="8" r="3"></circle><path d="M3 19c.6-3.4 2.7-5 5-5s4.4 1.6 5 5"></path><path d="M11 19c.6-3.4 2.7-5 5-5s4.4 1.6 5 5"></path></svg>`,
  train: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="15" rx="3"></rect><path d="M8 8h8"></path><path d="M8 12h3"></path><path d="M13 12h3"></path><circle cx="9" cy="16" r="1.2"></circle><circle cx="15" cy="16" r="1.2"></circle><path d="m8 21 2-2.5"></path><path d="m16 21-2-2.5"></path></svg>`,
  plane: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 15 18-9-7 14-3-6-8 1z"></path><path d="m11 14-4 6"></path></svg>`,
  car: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13h14l-1.2-4.4A2.3 2.3 0 0 0 15.6 7H8.4a2.3 2.3 0 0 0-2.2 1.6L5 13z"></path><path d="M4.5 13v5"></path><path d="M19.5 13v5"></path><circle cx="8" cy="17.5" r="1.4"></circle><circle cx="16" cy="17.5" r="1.4"></circle></svg>`,
  clock: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3 2"></path></svg>`,
  pin: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12z"></path><circle cx="12" cy="9" r="2.3"></circle></svg>`,
  calendar: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2"></rect><path d="M8 3.5v4"></path><path d="M16 3.5v4"></path><path d="M4 10h16"></path></svg>`,
  check: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12.5 4 4L18.5 8"></path></svg>`,
  home: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.5 12 4l8.5 7.5"></path><path d="M6 10.5V20h12v-9.5"></path></svg>`,
  taxi: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 13.5h12l-1-4.5a2 2 0 0 0-2-1.5H9a2 2 0 0 0-2 1.5z"></path><path d="M8 5.5h8"></path><circle cx="8" cy="17.5" r="1.4"></circle><circle cx="16" cy="17.5" r="1.4"></circle></svg>`,
  handshake: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 12 3-3 3 3 3-3 4 4-5 5-5-5-2 2-4-4 3-3"></path></svg>`,
  user: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.5 20c1.2-4.2 4-6 7.5-6s6.3 1.8 7.5 6"></path></svg>`,
  settings: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a7 7 0 0 0-1.8 1L5 6.1l-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a7 7 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"></path></svg>`,
  megaphone: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h4l9-6v12l-9-6H4z"></path><path d="M8 13l2 6"></path></svg>`,
  map: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 20 4 18V5l5 2 6-2 5 2v13l-5-2-6 2V7"></path><path d="M15 5v13"></path></svg>`,
  bus: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="13" rx="2"></rect><path d="M8 9h8"></path><path d="M8 13h8"></path><circle cx="8.5" cy="16" r="1"></circle><circle cx="15.5" cy="16" r="1"></circle></svg>`,
  message: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v9H9l-4 4z"></path><path d="M8 10h.1M12 10h.1M16 10h.1"></path></svg>`,
  globe: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4a12 12 0 0 1 0 16"></path><path d="M12 4a12 12 0 0 0 0 16"></path></svg>`,
  accessibility: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"></circle><path d="M5 10h14"></path><path d="M12 7v7"></path><path d="m8 21 4-7 4 7"></path></svg>`,
  shield: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z"></path><path d="m9 12 2 2 4-5"></path></svg>`,
  lock: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V8a4 4 0 0 1 8 0v2"></path></svg>`,
  ear: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 11a6 6 0 1 1 10 4.5c-1.2 1-1.8 2-1.8 3.2A2.3 2.3 0 0 1 12 21c-1.7 0-2.4-1.4-3.2-2.4"></path><path d="M9 11a3 3 0 1 1 5 2.2"></path></svg>`,
  angry: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="m8 9 2 1"></path><path d="m16 9-2 1"></path><path d="M8.5 16c1.8-1.4 5.2-1.4 7 0"></path></svg>`,
  edit: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"></path><path d="m6 16 2-6 7-7 4 4-7 7z"></path></svg>`,
  question: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M9.5 9a2.7 2.7 0 0 1 5 1.5c0 2-2.5 2-2.5 4"></path><path d="M12 17.6h.1"></path></svg>`,
  thumb: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21H5a2 2 0 0 1-2-2v-7h5"></path><path d="M8 12 12 3c1.8.4 2.3 1.8 1.8 4l-.5 2H19a2 2 0 0 1 2 2.4l-1.2 6A3 3 0 0 1 16.8 20H8z"></path></svg>`,
  scan: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H4v4"></path><path d="M17 3h3v4"></path><path d="M7 21H4v-4"></path><path d="M17 21h3v-4"></path><path d="M7 12h10"></path></svg>`,
  id: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v10l7 5 7-5V6z"></path><circle cx="12" cy="10" r="2.5"></circle><path d="M8.5 16a4.5 4.5 0 0 1 7 0"></path></svg>`,
  qr: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"></path><path d="M14 14h2v2h-2zM18 14h2v6h-4v-2"></path></svg>`,
  chat: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v10H9l-4 4z"></path><path d="M8 11h.1M12 11h.1M16 11h.1"></path></svg>`,
  grid: `<svg class="anchor-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect></svg>`,
};

const ICONS = {
  back: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"></path></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-3.5-3.5"></path></svg>`,
  pin: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>`,
  more: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4"></circle><circle cx="12" cy="12" r="1.4"></circle><circle cx="19" cy="12" r="1.4"></circle></svg>`,
  home: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V21h14v-10.5"></path></svg>`,
  notice: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13l9-7v14z"></path><path d="M13 7h5l2-2v14l-2-2h-5"></path></svg>`,
  map: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 20 3 18V4l6 2 6-2 6 2v14l-6-2-6 2V6"></path><path d="M9 6v14"></path><path d="M15 4v14"></path></svg>`,
  bus: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12v9H6z"></path><path d="M8 16v2"></path><path d="M16 16v2"></path><path d="M8 4h8v3H8z"></path><path d="M6 11h12"></path></svg>`,
  user: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg>`,
  car: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14h14l-1.2-5.2a2 2 0 0 0-1.9-1.4H8.1a2 2 0 0 0-1.9 1.4z"></path><path d="M4 14v4"></path><path d="M20 14v4"></path><circle cx="7.5" cy="18.5" r="1.5"></circle><circle cx="16.5" cy="18.5" r="1.5"></circle></svg>`,
  chat: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v9H9l-4 4z"></path></svg>`,
  taxi: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 13.5h12l-1-4.5a2 2 0 0 0-2-1.5H9a2 2 0 0 0-2 1.5z"></path><path d="M4.5 13.5H19.5"></path><circle cx="7.5" cy="17.5" r="1.5"></circle><circle cx="16.5" cy="17.5" r="1.5"></circle></svg>`,
  cup: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"></path><path d="M16 10h2a2 2 0 0 1 0 4h-2"></path><path d="M7 21h8"></path></svg>`,
  paper: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v4h4"></path><path d="M10 11h4"></path><path d="M10 15h4"></path></svg>`,
  glove: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v-2a2 2 0 0 1 4 0v2"></path><path d="M11 10V7a2 2 0 0 1 4 0v3"></path><path d="M15 11V9a2 2 0 0 1 4 0v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4v-5a2 2 0 0 1 4 0v2"></path></svg>`,
  leaf: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-7 0-12 4-14 10 1 3 4 6 8 6 4 0 8-3 8-10V4z"></path><path d="M6 18c4-4 7-7 13-10"></path></svg>`,
  pillow: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="3"></rect><path d="M8 7v10"></path></svg>`,
  camera: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="11" rx="2"></rect><path d="M9 7l1.5-2h3L15 7"></path><circle cx="12" cy="12.5" r="3"></circle></svg>`,
};

function iconMarkup(name) {
  if (ICONS[name]) return ICONS[name];
  return (ANCHOR_ICONS[name] || ANCHOR_ICONS.grid).replace(/anchor-icon/g, "icon");
}

function anchorIcon(name, className = "") {
  const svg = ANCHOR_ICONS[name] || ANCHOR_ICONS.grid;
  if (!className) return svg;
  return svg.replace('class="anchor-icon"', `class="anchor-icon ${className}"`);
}

function stationHeroImage(id) {
  return stationHeroAssets[id] || stationHeroAssets.west;
}

const travelerNav = [
  { x: 0, y: 90.4, w: 20, h: 9.6, to: "#/station/home" },
  { x: 20, y: 90.4, w: 20, h: 9.6, to: "#/announcements" },
  { x: 40, y: 90.4, w: 20, h: 9.6, to: "#/nav/map" },
  { x: 60, y: 90.4, w: 20, h: 9.6, to: "#/traffic/taxi" },
  { x: 80, y: 90.4, w: 20, h: 9.6, to: "#/profile" },
];

const driverNav = [
  { x: 0, y: 90.4, w: 25, h: 9.6, to: "#/driver/queue" },
  { x: 25, y: 90.4, w: 25, h: 9.6, to: "#/driver/short-haul/booking" },
  { x: 50, y: 90.4, w: 25, h: 9.6, to: "#/driver/taxi-house/info" },
  { x: 75, y: 90.4, w: 25, h: 9.6, to: "#/driver/profile" },
];

const pages = {
  "#/portal": {
    src: "P02-01_京通首页.png",
    hotspots: [
      { x: 78, y: 50, w: 17, h: 10, to: "#/services" },
      { x: 0, y: 64, w: 100, h: 18, to: "#/services" },
    ],
  },
  "#/splash": {
    src: "P04-01_开屏页.png",
    hotspots: [{ x: 0, y: 0, w: 100, h: 100, to: "#/station/select" }],
  },
  "#/station/home": {
    src: "P05-01_首页.png",
    overlays: [{ kind: "stationBadge" }],
    hotspots: [
      { x: 4, y: 2, w: 29, h: 6, to: "#/station/switch" },
      { x: 76, y: 29, w: 19, h: 7, to: "#/announcements" },
      { x: 6, y: 64, w: 22, h: 14, to: "#/nav/map" },
      { x: 29, y: 64, w: 22, h: 14, to: "#/announcements" },
      { x: 52, y: 64, w: 22, h: 14, to: "#/traffic/taxi" },
      { x: 75, y: 64, w: 22, h: 14, to: "#/driver/queue" },
      { x: 6, y: 78, w: 22, h: 12, to: "#/feedback/submit" },
      { x: 29, y: 78, w: 22, h: 12, to: "#/parking/list" },
      { x: 52, y: 78, w: 22, h: 12, to: "#/profile" },
      { x: 75, y: 78, w: 22, h: 12, to: "#/driver/short-haul/booking" },
      ...travelerNav,
    ],
  },
  "#/nav/map": {
    src: "P07-01_导航指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 50, y: 14, w: 45, h: 6, to: "#/nav/route" },
      { x: 76, y: 82, w: 14, h: 8, to: "#/nav/map3d" },
      ...travelerNav,
    ],
  },
  "#/nav/map3d": {
    src: "P07-02_导航指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 50, y: 14, w: 45, h: 6, to: "#/nav/route" },
      { x: 4, y: 82, w: 15, h: 8, to: "#/nav/map" },
      { x: 74, y: 82, w: 16, h: 8, to: "#/nav/ar" },
      ...travelerNav,
    ],
  },
  "#/nav/ar": {
    src: "P08-01_导航指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 50, y: 14, w: 45, h: 6, to: "#/nav/route" },
      { x: 4, y: 82, w: 15, h: 8, to: "#/nav/map" },
      ...travelerNav,
    ],
  },
  "#/nav/route": {
    src: "P08-02_导航指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 5, y: 14, w: 45, h: 6, to: "#/nav/map" },
      { x: 84, y: 38, w: 12, h: 6, selectKey: "navFloor", selectValue: "B1" },
      { x: 84, y: 44, w: 12, h: 6, selectKey: "navFloor", selectValue: "F1" },
      { x: 84, y: 50, w: 12, h: 6, selectKey: "navFloor", selectValue: "F2" },
      { x: 84, y: 56, w: 12, h: 6, selectKey: "navFloor", selectValue: "F3" },
      ...travelerNav,
    ],
  },
  "#/announcements": {
    src: "P09-01_站区公告页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 3, y: 10, w: 16, h: 5, selectKey: "announcementCategory", selectValue: "全部" },
      { x: 23, y: 10, w: 16, h: 5, selectKey: "announcementCategory", selectValue: "紧急" },
      { x: 43, y: 10, w: 16, h: 5, selectKey: "announcementCategory", selectValue: "通知" },
      { x: 63, y: 10, w: 16, h: 5, selectKey: "announcementCategory", selectValue: "提示" },
      { x: 83, y: 10, w: 16, h: 5, selectKey: "announcementCategory", selectValue: "活动" },
      { x: 6, y: 71, w: 88, h: 17, to: "#/announcements/more" },
      ...travelerNav,
    ],
  },
  "#/announcements/more": {
    src: "P09-02_站区公告页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/announcements" },
      ...travelerNav,
    ],
  },
  "#/traffic/taxi": {
    src: "P10-01_出租接驳页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 2, y: 11, w: 17, h: 7, to: "#/traffic/metro" },
      { x: 21, y: 11, w: 17, h: 7, to: "#/traffic/bus" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 59, y: 11, w: 17, h: 7, to: "#/traffic/ride" },
      { x: 78, y: 11, w: 19, h: 7, to: "#/traffic/mixed" },
      { x: 5, y: 84, w: 90, h: 7, to: "#/traffic/other" },
      ...travelerNav,
    ],
  },
  "#/traffic/ride": {
    src: "P10-02_网约接驳页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 2, y: 11, w: 17, h: 7, to: "#/traffic/metro" },
      { x: 21, y: 11, w: 17, h: 7, to: "#/traffic/bus" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 78, y: 11, w: 19, h: 7, to: "#/traffic/mixed" },
      ...travelerNav,
    ],
  },
  "#/traffic/metro": {
    src: "P11-01_地铁接驳页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 21, y: 11, w: 17, h: 7, to: "#/traffic/bus" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 59, y: 11, w: 17, h: 7, to: "#/traffic/ride" },
      { x: 78, y: 11, w: 19, h: 7, to: "#/traffic/mixed" },
      ...travelerNav,
    ],
  },
  "#/traffic/bus": {
    src: "P11-02_公交接驳页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 2, y: 11, w: 17, h: 7, to: "#/traffic/metro" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 59, y: 11, w: 17, h: 7, to: "#/traffic/ride" },
      { x: 78, y: 11, w: 19, h: 7, to: "#/traffic/mixed" },
      ...travelerNav,
    ],
  },
  "#/traffic/mixed": {
    src: "P12-01_综合推荐页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 2, y: 11, w: 17, h: 7, to: "#/traffic/metro" },
      { x: 21, y: 11, w: 17, h: 7, to: "#/traffic/bus" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 59, y: 11, w: 17, h: 7, to: "#/traffic/ride" },
      { x: 5, y: 79, w: 90, h: 10, to: "#/traffic/other" },
      ...travelerNav,
    ],
  },
  "#/traffic/other": {
    src: "P12-02_其他交通页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 2, y: 11, w: 17, h: 7, to: "#/traffic/metro" },
      { x: 21, y: 11, w: 17, h: 7, to: "#/traffic/bus" },
      { x: 40, y: 11, w: 17, h: 7, to: "#/traffic/taxi" },
      { x: 59, y: 11, w: 17, h: 7, to: "#/traffic/ride" },
      { x: 78, y: 11, w: 19, h: 7, to: "#/traffic/mixed" },
      ...travelerNav,
    ],
  },
  "#/parking/list": {
    src: "P13-01_停车指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 52, y: 10, w: 43, h: 7, to: "#/parking/price" },
      { x: 0, y: 80, w: 100, h: 10, to: "#/parking/list-more" },
      ...travelerNav,
    ],
  },
  "#/parking/list-more": {
    src: "P13-02_停车指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/parking/list" },
      { x: 52, y: 10, w: 43, h: 7, to: "#/parking/price" },
      ...travelerNav,
    ],
  },
  "#/parking/price": {
    src: "P14-01_停车指引页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 4, y: 10, w: 43, h: 7, to: "#/parking/list" },
      ...travelerNav,
    ],
  },
  "#/feedback/submit": {
    src: "P15-01_投诉建议页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 52, y: 10, w: 43, h: 7, to: "#/feedback/mine" },
      { x: 10, y: 25, w: 19, h: 5, selectKey: "feedbackType", selectValue: "投诉" },
      { x: 31, y: 25, w: 18, h: 5, selectKey: "feedbackType", selectValue: "建议" },
      { x: 51, y: 25, w: 18, h: 5, selectKey: "feedbackType", selectValue: "咨询" },
      { x: 71, y: 25, w: 18, h: 5, selectKey: "feedbackType", selectValue: "表扬" },
      { x: 10, y: 41, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "站内设施" },
      { x: 31, y: 41, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "出租车" },
      { x: 51, y: 41, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "网约车" },
      { x: 70, y: 41, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "地铁" },
      { x: 10, y: 48, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "停车场" },
      { x: 31, y: 48, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "工作人员" },
      { x: 51, y: 48, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "安全问题" },
      { x: 70, y: 48, w: 18, h: 5, selectKey: "feedbackCategory", selectValue: "其他" },
      { x: 5, y: 82, w: 90, h: 8, to: "#/feedback/submit-more" },
      ...travelerNav,
    ],
  },
  "#/feedback/submit-more": {
    src: "P15-02_投诉建议页.png",
    overlays: [{ kind: "singleUploadCard" }],
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/feedback/submit" },
      { x: 52, y: 10, w: 43, h: 7, to: "#/feedback/mine" },
      ...travelerNav,
    ],
  },
  "#/feedback/mine": {
    src: "P16-01_投诉建议页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 4, y: 10, w: 43, h: 7, to: "#/feedback/submit" },
      { x: 5, y: 82, w: 90, h: 8, to: "#/feedback/mine-more" },
      ...travelerNav,
    ],
  },
  "#/feedback/mine-more": {
    src: "P16-02_投诉建议页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/feedback/mine" },
      { x: 4, y: 10, w: 43, h: 7, to: "#/feedback/submit" },
      ...travelerNav,
    ],
  },
  "#/profile": {
    src: "P17-01_旅客设置页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/station/home" },
      { x: 0, y: 80, w: 100, h: 10, to: "#/profile-more" },
      ...travelerNav,
    ],
  },
  "#/profile-more": {
    src: "P17-02_旅客设置页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/profile" },
      ...travelerNav,
    ],
  },
  "#/driver/splash": {
    src: "P04-01_开屏页.png",
    hotspots: [{ x: 0, y: 0, w: 100, h: 100, to: "#/driver/short-haul/booking" }],
  },
  "#/driver/queue": {
    src: "P19-01_车站排队情况-左.png",
    hotspots: [
      { x: 4, y: 34, w: 90, h: 17, to: "#/driver/station/beijing" },
      { x: 4, y: 52, w: 90, h: 17, to: "#/driver/station/west" },
      { x: 0, y: 80, w: 100, h: 10, to: "#/driver/queue/mid" },
      ...driverNav,
    ],
  },
  "#/driver/queue/mid": {
    src: "P19-02_车站排队情况-中.png",
    hotspots: [
      { x: 4, y: 34, w: 90, h: 17, to: "#/driver/station/west" },
      { x: 0, y: 80, w: 100, h: 10, to: "#/driver/queue/right" },
      ...driverNav,
    ],
  },
  "#/driver/queue/right": {
    src: "P19-03_车站排队情况-右.png",
    hotspots: [
      { x: 4, y: 34, w: 90, h: 17, to: "#/driver/station/west" },
      { x: 0, y: 0, w: 100, h: 18, to: "#/driver/queue" },
      ...driverNav,
    ],
  },
  "#/driver/station/beijing": {
    src: "P20-01_场站详情页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 50, y: 22, w: 48, h: 7, to: "#/driver/station/beijing-map" },
      { x: 5, y: 72, w: 90, h: 8, to: "#/driver/short-haul/booking" },
      { x: 5, y: 82, w: 90, h: 8, to: "#/driver/taxi-house/info" },
      ...driverNav,
    ],
  },
  "#/driver/station/beijing-map": {
    src: "P20-02_场站详情页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/station/beijing" },
      { x: 0, y: 22, w: 50, h: 7, to: "#/driver/station/beijing" },
      ...driverNav,
    ],
  },
  "#/driver/station/west": {
    src: "P21-01_场站详情页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 50, y: 22, w: 48, h: 7, to: "#/driver/station/beijing-map" },
      { x: 5, y: 72, w: 90, h: 8, to: "#/driver/short-haul/booking" },
      ...driverNav,
    ],
  },
  "#/driver/short-haul/booking": {
    src: "P21-02_短途复载页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 33, y: 23, w: 34, h: 7, to: "#/driver/short-haul/history" },
      { x: 67, y: 23, w: 33, h: 7, to: "#/driver/short-haul/points" },
      { x: 9, y: 67, w: 26, h: 6, selectKey: "bookingDate", selectValue: "今天" },
      { x: 38, y: 67, w: 26, h: 6, selectKey: "bookingDate", selectValue: "明天" },
      { x: 67, y: 67, w: 26, h: 6, selectKey: "bookingDate", selectValue: "后天" },
      { x: 8, y: 80, w: 16, h: 4, selectKey: "bookingTime", selectValue: "09:00" },
      { x: 27, y: 80, w: 16, h: 4, selectKey: "bookingTime", selectValue: "09:30" },
      { x: 45, y: 80, w: 16, h: 4, selectKey: "bookingTime", selectValue: "10:00" },
      { x: 64, y: 80, w: 16, h: 4, selectKey: "bookingTime", selectValue: "10:30" },
      { x: 27, y: 85, w: 16, h: 4, selectKey: "bookingTime", selectValue: "11:30" },
      { x: 45, y: 85, w: 16, h: 4, selectKey: "bookingTime", selectValue: "13:00" },
      { x: 64, y: 85, w: 16, h: 4, selectKey: "bookingTime", selectValue: "13:30" },
      { x: 0, y: 88.5, w: 100, h: 2, to: "#/driver/short-haul/booking-more" },
      ...driverNav,
    ],
  },
  "#/driver/short-haul/booking-more": {
    src: "P22-01_短途复载页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/short-haul/booking" },
      { x: 33, y: 23, w: 34, h: 7, to: "#/driver/short-haul/history" },
      { x: 67, y: 23, w: 33, h: 7, to: "#/driver/short-haul/points" },
      { x: 12, y: 28, w: 25, h: 5, selectKey: "bookingDate", selectValue: "今天" },
      { x: 40, y: 28, w: 25, h: 5, selectKey: "bookingDate", selectValue: "明天" },
      { x: 68, y: 28, w: 25, h: 5, selectKey: "bookingDate", selectValue: "后天" },
      { x: 12, y: 42, w: 15, h: 4, selectKey: "bookingTime", selectValue: "09:00" },
      { x: 30, y: 42, w: 15, h: 4, selectKey: "bookingTime", selectValue: "09:30" },
      { x: 48, y: 42, w: 15, h: 4, selectKey: "bookingTime", selectValue: "10:00" },
      { x: 66, y: 42, w: 15, h: 4, selectKey: "bookingTime", selectValue: "10:30" },
      { x: 30, y: 47, w: 15, h: 4, selectKey: "bookingTime", selectValue: "11:30" },
      { x: 48, y: 47, w: 15, h: 4, selectKey: "bookingTime", selectValue: "13:00" },
      { x: 66, y: 47, w: 15, h: 4, selectKey: "bookingTime", selectValue: "13:30" },
      { x: 12, y: 52, w: 15, h: 4, selectKey: "bookingTime", selectValue: "14:00" },
      { x: 48, y: 52, w: 15, h: 4, selectKey: "bookingTime", selectValue: "15:00" },
      { x: 66, y: 52, w: 15, h: 4, selectKey: "bookingTime", selectValue: "15:30" },
      ...driverNav,
    ],
  },
  "#/driver/short-haul/history": {
    src: "P22-02_短途复载页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 0, y: 23, w: 33, h: 7, to: "#/driver/short-haul/booking" },
      { x: 67, y: 23, w: 33, h: 7, to: "#/driver/short-haul/points" },
      ...driverNav,
    ],
  },
  "#/driver/short-haul/points": {
    src: "P23-01_短途复载页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 0, y: 23, w: 33, h: 7, to: "#/driver/short-haul/booking" },
      { x: 33, y: 23, w: 34, h: 7, to: "#/driver/short-haul/history" },
      { x: 0, y: 82, w: 100, h: 8, to: "#/driver/short-haul/points-more" },
      ...driverNav,
    ],
  },
  "#/driver/short-haul/points-more": {
    src: "P23-02_短途复载页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/short-haul/points" },
      ...driverNav,
    ],
  },
  "#/driver/taxi-house/info": {
    src: "P24-01_的士之家页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 33, y: 24, w: 34, h: 7, to: "#/driver/taxi-house/meal" },
      { x: 67, y: 24, w: 33, h: 7, to: "#/driver/taxi-house/redeem" },
      { x: 0, y: 82, w: 100, h: 8, to: "#/driver/taxi-house/info-more" },
      ...driverNav,
    ],
  },
  "#/driver/taxi-house/info-more": {
    src: "P24-02_的士之家页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/taxi-house/info" },
      { x: 33, y: 24, w: 34, h: 7, to: "#/driver/taxi-house/meal" },
      { x: 67, y: 24, w: 33, h: 7, to: "#/driver/taxi-house/redeem" },
      ...driverNav,
    ],
  },
  "#/driver/taxi-house/meal": {
    src: "P25-01_的士之家页.png",
    counterMarkers: [
      { key: "braisedRice", x: 78.8, y: 38.4, w: 5.5, h: 3.2 },
      { key: "tomatoNoodles", x: 78.8, y: 54.3, w: 5.5, h: 3.2 },
      { key: "porkRice", x: 78.8, y: 70.5, w: 5.5, h: 3.2 },
      { key: "steamedEgg", x: 78.8, y: 86.8, w: 5.5, h: 3.2 },
    ],
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 0, y: 24, w: 33, h: 7, to: "#/driver/taxi-house/info" },
      { x: 67, y: 24, w: 33, h: 7, to: "#/driver/taxi-house/redeem" },
      { x: 71, y: 38, w: 7, h: 4, counterKey: "braisedRice", counterDelta: -1 },
      { x: 84, y: 38, w: 8, h: 4, counterKey: "braisedRice", counterDelta: 1 },
      { x: 71, y: 54, w: 7, h: 4, counterKey: "tomatoNoodles", counterDelta: -1 },
      { x: 84, y: 54, w: 8, h: 4, counterKey: "tomatoNoodles", counterDelta: 1 },
      { x: 71, y: 70, w: 7, h: 4, counterKey: "porkRice", counterDelta: -1 },
      { x: 84, y: 70, w: 8, h: 4, counterKey: "porkRice", counterDelta: 1 },
      { x: 71, y: 86, w: 7, h: 4, counterKey: "steamedEgg", counterDelta: -1 },
      { x: 84, y: 86, w: 8, h: 4, counterKey: "steamedEgg", counterDelta: 1 },
      ...driverNav,
    ],
  },
  "#/driver/taxi-house/redeem": {
    src: "P25-02_的士之家页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 0, y: 24, w: 33, h: 7, to: "#/driver/taxi-house/info" },
      { x: 33, y: 24, w: 34, h: 7, to: "#/driver/taxi-house/meal" },
      { x: 0, y: 82, w: 100, h: 8, to: "#/driver/taxi-house/redeem-more" },
      ...driverNav,
    ],
  },
  "#/driver/taxi-house/redeem-more": {
    src: "P26-01_的士之家页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/taxi-house/redeem" },
      ...driverNav,
    ],
  },
  "#/driver/profile": {
    src: "P26-02_个人中心页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/queue" },
      { x: 0, y: 82, w: 100, h: 8, to: "#/driver/profile-more" },
      ...driverNav,
    ],
  },
  "#/driver/profile-more": {
    src: "P27-01_个人中心页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/profile" },
      { x: 0, y: 82, w: 100, h: 8, to: "#/driver/profile-bottom" },
      ...driverNav,
    ],
  },
  "#/driver/profile-bottom": {
    src: "P27-02_个人中心页.png",
    hotspots: [
      { x: 0, y: 0, w: 12, h: 9, to: "#/driver/profile-more" },
      ...driverNav,
    ],
  },
};

function stationById(id) {
  return stations.find((station) => station[0] === id) || stations[1];
}

function route() {
  return location.hash || "#/portal";
}

function go(to) {
  location.hash = to;
}

function syncDesktopPreviewFrame() {
  const isAnchorPreview = app.classList.contains("anchor-app");
  const isMobilePreview = app.classList.contains("mobile-preview-app");
  const isDesktopPreview = (isAnchorPreview || isMobilePreview) && window.innerWidth >= 1000;
  const baseWidth = isAnchorPreview ? 864 : 430;
  const baseHeight = isAnchorPreview ? 1728 : 860;
  const scale = isDesktopPreview ? Math.min((window.innerWidth - 32) / baseWidth, (window.innerHeight - 32) / baseHeight) : 1;
  app.style.setProperty("--desktop-preview-scale", String(scale));
  document.body.classList.toggle("desktop-preview", isDesktopPreview);
}

function boxStyle(box) {
  return `left:${box.x}%;top:${box.y}%;width:${box.w}%;height:${box.h}%`;
}

function renderHotspot(hotspot) {
  const attrs = [
    'class="hotspot"',
    'aria-label="跳转"',
    `style="${boxStyle(hotspot)}"`,
  ];
  if (hotspot.to) attrs.push(`data-to="${hotspot.to}"`);
  if (hotspot.selectKey) {
    attrs.push(`data-select-key="${hotspot.selectKey}"`);
    attrs.push(`data-select-value="${hotspot.selectValue}"`);
  }
  if (hotspot.counterKey) {
    attrs.push(`data-counter-key="${hotspot.counterKey}"`);
    attrs.push(`data-counter-delta="${hotspot.counterDelta}"`);
  }
  return `<button ${attrs.join(" ")}></button>`;
}

function renderSelectionMarkers(page) {
  return (page.hotspots || [])
    .filter((hotspot) => hotspot.selectKey && state.selected[hotspot.selectKey] === hotspot.selectValue)
    .map((hotspot) => `<span class="selection-marker" style="${boxStyle(hotspot)}"></span>`)
    .join("");
}

function renderCounterMarkers(page) {
  return (page.counterMarkers || [])
    .map((marker) => {
      const count = state.counters[marker.key] || 0;
      return `<span class="counter-marker" style="${boxStyle(marker)}">${count}</span>`;
    })
    .join("");
}

function renderOverlays(page) {
  return (page.overlays || [])
    .map((overlay) => {
      if (overlay.kind === "stationBadge") {
        if (state.station === "west") return "";
        const [, name] = stationById(state.station);
        return `
          <span class="dynamic-station-badge">
            <span class="station-badge-pin" aria-hidden="true"></span>
            <span>${name}</span>
          </span>
        `;
      }
      if (overlay.kind === "singleUploadCard") {
        return `
          <span class="upload-mask"></span>
          <span class="single-upload-card">
            <span class="upload-icon" aria-hidden="true"></span>
            <span>添加</span>
          </span>
        `;
      }
      return "";
    })
    .join("");
}

function renderBottomNav(activeKey) {
  return `
    <nav class="bottom-nav five" aria-label="底部导航">
      ${travelerBottomNavItems
        .map((item) => {
          const active = item.key === activeKey ? "active" : "";
          return `
            <button class="nav-item ${active}" data-to="${item.to}" aria-label="${item.label}">
              ${iconMarkup(item.icon)}
              <span>${item.label}</span>
            </button>
          `;
        })
        .join("")}
    </nav>
  `;
}

let toastTimer = null;

function showToast(message) {
  if (!modalRoot) return;
  window.clearTimeout(toastTimer);
  modalRoot.classList.remove("open");
  modalRoot.innerHTML = `<div class="toast">${message}</div>`;
  toastTimer = window.setTimeout(() => {
    modalRoot.innerHTML = "";
    modalRoot.classList.remove("open");
  }, 1800);
}

function scrollServicesSection(sectionKey) {
  const target = document.querySelector(`[data-services-section="${sectionKey}"]`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderServices() {
  const activeCategory = state.selected.servicesCategory || "vehicle";
  return `
    <div class="services-shell">
      <header class="services-header">
        <div class="services-topline">
          <button class="services-back" data-to="#/portal" aria-label="返回上一页">‹</button>
          <button class="services-search" data-toast="搜索功能暂未接入" aria-label="搜索服务">
            ${iconMarkup("search")}
            <span>请输入关键字搜索</span>
          </button>
          <div class="services-actions">
            <button class="services-action" data-toast="更多功能暂未接入" aria-label="更多功能">
              ${iconMarkup("more")}
            </button>
            <span class="services-action ring" aria-hidden="true"></span>
          </div>
        </div>
      </header>

      <section class="services-title-band">
        <h1>全部服务</h1>
      </section>

      <section class="services-layout" aria-label="服务目录">
        <aside class="services-sidebar">
          ${servicesSidebarItems
            .map(
              (item) => `
                <button
                  class="services-sidebar-item ${item.key === activeCategory ? "active" : ""}"
                  data-service-category="${item.key}"
                  data-service-section="${item.section}"
                >
                  <span>${item.label}</span>
                </button>
              `
            )
            .join("")}
        </aside>

        <div class="services-main">
          ${servicesSections
            .map(
              (section) => `
                <section class="services-section" data-services-section="${section.key}">
                  <div class="services-section-head">
                    <span class="services-section-bar"></span>
                    <h2>${section.title}</h2>
                  </div>
                  <div class="services-link-list">
                    ${section.links
                      .map((link) => {
                        if (link.to) {
                          return `
                            <button class="services-link" data-to="${link.to}">
                              ${link.label}
                            </button>
                          `;
                        }
                        return `
                          <button class="services-link" data-toast="${link.toast || link.label}">
                            ${link.label}
                          </button>
                        `;
                      })
                      .join("")}
                  </div>
                </section>
              `
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function renderDesignSystem() {
  const colorTokens = [
    ["页面背景", "--ds-color-bg", "#f5f7fb"],
    ["表面底色", "--ds-color-surface", "#ffffff"],
    ["次级表面", "--ds-color-surface-soft", "#f8fafc"],
    ["主文字", "--ds-color-text", "#1d2733"],
    ["强调文字", "--ds-color-text-strong", "#090d14"],
    ["主色", "--ds-color-primary", "#206fd8"],
    ["成功", "--ds-color-success", "#0b7a50"],
    ["警示", "--ds-color-warning", "#a16207"],
    ["危险", "--ds-color-danger", "#d92d20"],
    ["边线", "--ds-color-border", "#dfe6ef"],
    ["强边线", "--ds-color-border-strong", "#cfd8e4"],
    ["悬浮阴影", "--ds-shadow-md", "0 8px 24px rgba(29, 39, 51, 0.06)"],
  ];

  const typeRows = [
    ["页面标题", "38px / 1.12 / 800", "设计系统"],
    ["分区标题", "18px / 1.12 / 850", "组件库"],
    ["正文", "14px / 1.42 / 400", "这些组件可以直接用于新页面"],
    ["辅助文字", "12px / 1.6 / 700", "用于说明、计数和弱提示"],
  ];

  const buttons = [
    ["button", "主按钮", ""],
    ["button-secondary", "次按钮", ""],
    ["button-ghost", "幽灵按钮", ""],
    ["button green", "成功操作", ""],
    ["button red", "危险操作", ""],
    ["button-secondary", "带图标", "search"],
  ];

  const badges = [
    ["primary", "进行中"],
    ["success", "畅通"],
    ["warning", "正常"],
    ["danger", "拥挤"],
  ];

  const rows = [
    ["bus", "列表行组件", "标题 + 说明 + 右侧动作"],
    ["map", "信息条目", "可放在设置、反馈、公告页"],
    ["user", "个人资料", "支持图标、文字、右箭头"],
  ];

  return `
    <div class="screen ds-page no-nav">
      <header class="topbar filled">
        <button class="icon-btn" data-to="#/portal" aria-label="返回">${iconMarkup("back")}</button>
        <div class="topbar-title">设计系统</div>
        <button class="icon-btn" data-toast="设计系统预览" aria-label="更多">${iconMarkup("more")}</button>
      </header>

      <div class="page ds-shell">
        <section class="ds-section">
          <div class="ds-section-title">
            <h2>颜色 Token</h2>
            <span>基础色</span>
          </div>
          <div class="ds-token-grid">
            ${colorTokens
              .map(
                ([label, token, value]) => `
                  <article class="card padded ds-swatch" style="--swatch:${token.includes("--ds-shadow") ? "#ffffff" : value}">
                    <span class="ds-swatch-chip ${token.includes("--ds-shadow") ? "shadow" : ""}" aria-hidden="true"></span>
                    <div>
                      <strong>${label}</strong>
                      <code>${token}</code>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="ds-section">
          <div class="ds-section-title">
            <h2>排版</h2>
            <span>字号 / 行高</span>
          </div>
          <div class="card padded ds-type-card">
            ${typeRows
              .map(([label, spec, sample]) => {
                const [size, lineHeight, weight] = spec.split(" / ");
                return `
                  <div class="ds-type-line">
                    <strong style="font-size:${size}; line-height:${lineHeight}; font-weight:${weight};">${sample}</strong>
                    <span>${label} · ${spec}</span>
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>

        <section class="ds-section">
          <div class="ds-section-title">
            <h2>组件</h2>
            <span>按钮 / 徽标</span>
          </div>
          <div class="card padded ds-component-panel">
            <div class="ds-button-grid">
              ${buttons
                .map(([cls, label, icon]) => `<button class="${cls}" data-toast="${label}（原型演示）">${icon ? iconMarkup(icon) : ""}<span>${label}</span></button>`)
                .join("")}
            </div>

            <div class="ds-badge-row">
              ${badges
                .map(([tone, label]) => `<span class="ds-badge ${tone}">${label}</span>`)
                .join("")}
            </div>

            <div class="ds-callout">
              <span class="ds-callout-icon">${iconMarkup("notice")}</span>
              <div>
                <h3>信息提示组件</h3>
                <p>适合公告、说明、引导文案和状态提醒，后续新页面可以直接复用。</p>
              </div>
            </div>

            <div class="ds-field" data-toast="搜索框（原型演示）">
              ${iconMarkup("search")}
              <span>搜索服务、事项、站点名称</span>
            </div>

            <div class="ds-textarea-box">多行文本输入区域示例。这里会沿用统一的边框、圆角、字色和空白节奏。</div>
          </div>
        </section>

        <section class="ds-section">
          <div class="ds-section-title">
            <h2>列表</h2>
            <span>条目 / 图标</span>
          </div>
          <div class="ds-list-card">
            ${rows
              .map(
                ([icon, title, meta]) => `
                  <button class="ds-list-row" data-toast="${title}（原型演示）">
                    <span class="ds-list-row-icon">${iconMarkup(icon)}</span>
                    <span>
                      <strong>${title}</strong>
                      <em>${meta}</em>
                    </span>
                    <i>›</i>
                  </button>
                `
              )
              .join("")}
          </div>
        </section>
      </div>
    </div>
  `;
}

const routeScrollTargets = {
  "#/announcements/more": "announcements-lower",
  "#/feedback/submit-more": "feedback-submit-support",
  "#/feedback/mine-more": "feedback-mine-contact",
  "#/parking/list-more": "parking-lower",
  "#/profile-more": "traveler-profile-security",
  "#/driver/queue/mid": "driver-queue-mid",
  "#/driver/queue/right": "driver-queue-right",
  "#/driver/station/beijing-map": "driver-station-map",
  "#/driver/short-haul/booking-more": "short-haul-more",
  "#/driver/short-haul/points-more": "short-haul-records",
  "#/driver/taxi-house/info-more": "taxi-house-review",
  "#/driver/taxi-house/redeem-more": "taxi-house-notes",
  "#/driver/profile-more": "driver-profile-middle",
  "#/driver/profile-bottom": "driver-profile-footer",
};

function renderAppShell({ className = "", topbar = "", footer = "", body = "" }) {
  return `
    <div class="ab-page ${className}">
      ${topbar}
      <main class="ab-page-body">
        ${body}
      </main>
      ${footer}
    </div>
  `;
}

function renderAppTopbar({ title, backTo = "#/station/home", action = "", subtitle = "" }) {
  return `
    <header class="ab-topbar">
      <button class="ab-icon-btn" data-to="${backTo}" aria-label="返回">${iconMarkup("back")}</button>
      <div class="ab-topbar-copy">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      <div class="ab-topbar-actions">
        ${action || `<span class="ab-topbar-spacer" aria-hidden="true"></span>`}
      </div>
    </header>
  `;
}

function renderAbFooterNav(kind, activeKey) {
  const items =
    kind === "driver"
      ? [
          { key: "home", label: "首页", icon: "home", to: "#/driver/queue" },
          { key: "short", label: "短途复载", icon: "taxi", to: "#/driver/short-haul/booking" },
          { key: "house", label: "的士之家", icon: "handshake", to: "#/driver/taxi-house/info" },
          { key: "profile", label: "身份", icon: "user", to: "#/driver/profile" },
        ]
      : [
          { key: "home", label: "首页", icon: "home", to: "#/station/home" },
          { key: "notice", label: "公告", icon: "notice", to: "#/announcements" },
          { key: "nav", label: "导航", icon: "map", to: "#/nav/map" },
          { key: "traffic", label: "交通", icon: "bus", to: "#/traffic/taxi" },
          { key: "profile", label: "身份", icon: "user", to: "#/profile" },
        ];

  return `
    <nav class="ab-bottom-nav ${kind === "traveler" ? "five" : "four"}" aria-label="底部导航">
      ${items
        .map(
          (item) => `
            <button class="ab-bottom-nav-item ${item.key === activeKey ? "active" : ""}" data-to="${item.to}" aria-label="${item.label}">
              ${iconMarkup(item.icon)}
              <span>${item.label}</span>
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderSectionTitle(title, action = "") {
  return `
    <div class="ab-section-title">
      <h2>${title}</h2>
      ${action}
    </div>
  `;
}

function renderStatGrid(items) {
  return `
    <div class="ab-stat-grid">
      ${items
        .map(
          (item) => `
            <div class="ab-stat-card ${item.tone || ""}">
              <strong>${item.value}</strong>
              <span>${item.label}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSelectableGrid(items, { activeValue, selectKey, className = "", cols = "" }) {
  return `
    <div class="ab-select-grid ${className} ${cols ? `cols-${cols}` : ""}">
      ${items
        .map((item) => {
          const key = typeof item === "string" ? item : item.key;
          const label = typeof item === "string" ? item : item.label || item.key;
          const icon = typeof item === "string" ? "" : item.icon ? iconMarkup(item.icon) : "";
          const to = typeof item === "string" ? "" : item.to || "";
          const toast = typeof item === "string" ? label : item.toast || label;
          const disabled = typeof item === "object" && item && item.disabled;
          const active = activeValue === key || activeValue === to;
          const attrs = disabled
            ? 'disabled aria-disabled="true"'
            : to
            ? `data-to="${to}"`
            : selectKey
            ? `data-select-key="${selectKey}" data-select-value="${key}" aria-pressed="${active ? "true" : "false"}"`
            : `data-toast="${toast}"`;
          return `
            <button class="ab-select-chip ${active ? "active" : ""} ${disabled ? "disabled" : ""}" ${attrs}>
              ${icon}
              <span>${label}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderActionGrid(items, className = "") {
  return `
    <div class="ab-action-grid ${className}">
      ${items
        .map(
          (item) => `
            <button class="ab-action-tile" ${item.to ? `data-to="${item.to}"` : `data-toast="${item.toast || item.label}（原型演示）"`}>
              <span class="ab-action-tile-icon" style="--ab-tile-bg:${item.bg || "var(--ds-color-primary-soft)"};--ab-tile-fg:${item.fg || "var(--ds-color-primary)"}">
                ${iconMarkup(item.icon)}
              </span>
              <strong>${item.label}</strong>
              ${item.meta ? `<em>${item.meta}</em>` : ""}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderInfoRows(rows, { className = "", compact = false } = {}) {
  return `
    <div class="ab-info-list ${className} ${compact ? "compact" : ""}">
      ${rows
        .map(
          (row) => `
            <button class="ab-info-row" ${row.to ? `data-to="${row.to}"` : `data-toast="${row.toast || row.label}（原型演示）"`}>
              <span class="ab-info-row-left">
                <span class="ab-info-icon">${iconMarkup(row.icon || "more")}</span>
                <span>
                  <strong>${row.label}</strong>
                  ${row.note ? `<em>${row.note}</em>` : ""}
                </span>
              </span>
              <span class="ab-info-row-right">
                ${row.value ? `<b>${row.value}</b>` : ""}
                <i>›</i>
              </span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderRecordCard(record) {
  return `
    <button class="ab-record-card" data-toast="${record.title}（原型演示）">
      <div class="ab-record-head">
        <div>
          <span class="ab-record-tag ${record.tone}">${record.tag}</span>
          <strong>${record.title}</strong>
        </div>
        <i>›</i>
      </div>
      ${record.meta ? `<p>${record.meta}</p>` : ""}
      ${record.reply ? `<div class="ab-record-reply">${record.reply}</div>` : ""}
    </button>
  `;
}

function renderFormPanel(title, note, body, action = "") {
  return `
    <section class="ab-panel">
      <div class="ab-panel-head">
        <div>
          <h2>${title}</h2>
          ${note ? `<p>${note}</p>` : ""}
        </div>
        ${action}
      </div>
      <div class="ab-panel-body">
        ${body}
      </div>
    </section>
  `;
}

function renderTextArea(label, placeholder, counter = "0/500") {
  return `
    <div class="ab-textarea-field">
      <div class="ab-field-label">${label}</div>
      <div class="ab-textarea-box">
        <span>${placeholder}</span>
        <em>${counter}</em>
      </div>
    </div>
  `;
}

function renderUploadTile(label = "添加") {
  return `
    <button class="ab-upload-tile" data-toast="图片上传（原型演示）">
      <span class="ab-upload-plus">+</span>
      <strong>${label}</strong>
    </button>
  `;
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ block: "start", behavior: "auto" });
  window.scrollBy(0, -68);
}

function renderStationHome() {
  const [, stationName] = stationById(state.station);
  const stationSrc = stationHeroImage(state.station);
  const announcements = [
    "北京西站南广场施工，请绕行南广场进站",
    "春运期间地铁2号线延时至次日02:00",
    "12306实名核验通道升级，请提前准备证件",
  ];
  const trafficCards = [
    { icon: "taxi", label: "出租车", meta: "南广场出口 · 8-12分钟", to: "#/traffic/taxi" },
    { icon: "bus", label: "网约车", meta: "推荐上车点 · 200m", to: "#/traffic/ride" },
    { icon: "map", label: "地铁", meta: "2号线 · 延时至次日02:00", to: "#/traffic/metro" },
  ];
  const serviceTiles = [
    { label: "导航指引", icon: "map", to: "#/nav/map", bg: "#dceeff", fg: "#2e7de1" },
    { label: "站区公告", icon: "notice", to: "#/announcements", bg: "#ffe8b8", fg: "#f0a423" },
    { label: "市内交通", icon: "bus", to: "#/traffic/taxi", bg: "#efddff", fg: "#a24ac2" },
    { label: "场站接驳", icon: "bus", to: "#/traffic/ride", bg: "#e6eb9f", fg: "#8f9f1b" },
    { label: "投诉建议", icon: "chat", to: "#/feedback/submit", bg: "#f6ddd9", fg: "#e5474d" },
    { label: "自驾停车", icon: "car", to: "#/parking/list", bg: "#e4f2d6", fg: "#6aa84f" },
    { label: "个人中心", icon: "user", to: "#/profile", bg: "#fdeacc", fg: "#f08a24" },
    { label: "短途复载", icon: "taxi", to: "#/driver/short-haul/booking", bg: "#d7f3f9", fg: "#1fa7c2" },
  ];

  return renderAppShell({
    className: "ab-home-page",
    body: `
      <section class="ab-home-hero" style="--ab-home-image:url('${stationSrc}')">
        <div class="ab-home-hero-cover">
          <div class="ab-home-hero-top">
            <button class="ab-station-chip" data-to="#/station/switch">
              <span class="ab-station-chip-pin">${iconMarkup("pin")}</span>
              <span>${stationName}</span>
            </button>
            <div class="ab-home-hero-actions">
              <button class="ab-icon-btn ab-icon-btn--soft" data-to="#/announcements" aria-label="站区公告">${iconMarkup("notice")}</button>
              <button class="ab-icon-btn ab-icon-btn--soft" data-toast="搜索功能暂未接入" aria-label="搜索">${iconMarkup("search")}</button>
            </div>
          </div>
          <div class="ab-home-hero-copy">
            <p>站区畅行服务</p>
            <h1>${stationName}</h1>
            <div class="ab-home-hero-flow">实时客流：<strong>正常</strong></div>
          </div>
          <div class="ab-home-hero-meta">
            <div class="ab-home-weather">
              <strong>31°C</strong>
              <span>晴</span>
            </div>
            <span class="ab-home-badge">今日更新 14:32</span>
          </div>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("站区公告", `<button class="ab-section-link" data-to="#/announcements">更多 ></button>`)}
        <div class="ab-info-list ab-announcement-list">
          ${announcements
            .map(
              (text, index) => `
                <button class="ab-info-row ab-announcement-row" data-to="#/announcements">
                  <span class="ab-info-row-left">
                    <span class="ab-info-icon tag ${index === 0 ? "danger" : index === 1 ? "warning" : "primary"}">${index === 0 ? "紧急" : index === 1 ? "通知" : "提醒"}</span>
                    <span>
                      <strong>${text}</strong>
                      <em>点击查看公告详情</em>
                    </span>
                  </span>
                  <span class="ab-info-row-right"><i>›</i></span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("站区服务")}
        ${renderActionGrid(serviceTiles, "ab-service-grid")}
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("出行参考")}
        <div class="ab-traffic-preview">
          ${trafficCards
            .map(
              (item) => `
                <button class="ab-preview-card" data-to="${item.to}">
                  <span class="ab-preview-card-icon">${iconMarkup(item.icon)}</span>
                  <strong>${item.label}</strong>
                  <em>${item.meta}</em>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "home"),
  });
}

function renderFeedbackSubmitPage(variant = "top") {
  const supportId = "feedback-submit-support";
  const body = `
    <section class="ab-page-section">
      <div class="ab-segment-strip">
        <button class="ab-segment active" data-to="#/feedback/submit">提交反馈</button>
        <button class="ab-segment" data-to="#/feedback/mine">我的反馈</button>
      </div>
    </section>

    ${renderFormPanel(
      "反馈类型",
      "请选择最接近的问题类型",
      renderSelectableGrid(feedbackTypeOptions, {
        activeValue: state.selected.feedbackType || "投诉",
        selectKey: "feedbackType",
        cols: 4,
      })
    )}

    ${renderFormPanel(
      "问题分类",
      "用于快速分流到对应服务",
      renderSelectableGrid(feedbackCategoryOptions, {
        activeValue: state.selected.feedbackCategory || "出租车",
        selectKey: "feedbackCategory",
        cols: 2,
      })
    )}

    ${renderFormPanel(
      "反馈内容",
      "请详细描述您遇到的问题或建议（必填，至少20字）",
      renderTextArea("反馈内容", "请详细描述您遇到的问题或建议（必填，至少20字）")
    )}

    ${renderFormPanel(
      "请上传图片",
      "最多4张",
      `
        <div class="ab-upload-grid">
          ${renderUploadTile("添加图片")}
        </div>
      `
    )}

    <section class="ab-page-section" id="${supportId}">
      ${renderSectionTitle("提交说明")}
      <div class="ab-tip-card">
        <strong>提交后会由人工跟进处理。</strong>
        <p>如果问题涉及紧急安全情况，请先联系现场工作人员或拨打站区服务热线。</p>
      </div>
      <div class="ab-tip-card soft">
        <strong>建议尽量补充定位、时间和现场照片。</strong>
        <p>这样可以更快匹配到站区设施、出租车、网约车或地铁相关问题。</p>
      </div>
    </section>

    <section class="ab-page-section">
      ${renderSectionTitle("联系信息")}
      <div class="ab-info-list">
        ${[
          { icon: "message", label: "旅客服务热线", value: "12328", toast: "旅客服务热线" },
          { icon: "message", label: "投诉举报电话", value: "010-12345", toast: "投诉举报电话" },
          { icon: "scan", label: "监督投诉邮箱", value: "service@arrive-beijing.cn", toast: "监督投诉邮箱" },
        ]
          .map(
            (row) => `
              <button class="ab-info-row" data-toast="${row.label}">
                <span class="ab-info-row-left">
                  <span class="ab-info-icon">${iconMarkup(row.icon)}</span>
                  <span>
                    <strong>${row.label}</strong>
                  </span>
                </span>
                <span class="ab-info-row-right">
                  <b>${row.value}</b>
                  <i>›</i>
                </span>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;

  return renderAppShell({
    className: "ab-feedback-page",
    topbar: renderAppTopbar({
      title: "投诉建议",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-to="#/feedback/mine">我的反馈</button>`,
    }),
    body: body,
    footer: `
      <div class="ab-page-footer">
        <button class="ab-primary-button" data-toast="提交反馈（原型演示）">提交反馈</button>
      </div>
      ${renderAbFooterNav("traveler", "home")}
    `,
  });
}

function renderFeedbackMinePage() {
  const contactId = "feedback-mine-contact";
  return renderAppShell({
    className: "ab-feedback-page",
    topbar: renderAppTopbar({
      title: "投诉建议",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-to="#/feedback/submit">提交反馈</button>`,
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-segment-strip">
          <button class="ab-segment" data-to="#/feedback/submit">提交反馈</button>
          <button class="ab-segment active" data-to="#/feedback/mine">我的反馈</button>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("反馈概览")}
        ${renderStatGrid(feedbackSummary)}
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("反馈记录")}
        <div class="ab-record-list">
          ${feedbackRecords.map(renderRecordCard).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="${contactId}">
        ${renderSectionTitle("联系信息")}
        <div class="ab-tip-card">
          <strong>官方回复</strong>
          <p>如果反馈已处理，页面会显示回复说明与后续建议。</p>
        </div>
        <div class="ab-info-list">
          ${[
            { icon: "message", label: "旅客服务热线", value: "12328", toast: "旅客服务热线" },
            { icon: "shield", label: "投诉举报电话", value: "010-12345", toast: "投诉举报电话" },
            { icon: "scan", label: "监督投诉邮箱", value: "service@arrive-beijing.cn", toast: "监督投诉邮箱" },
          ]
            .map(
              (row) => `
                <button class="ab-info-row" data-toast="${row.label}">
                  <span class="ab-info-row-left">
                    <span class="ab-info-icon">${iconMarkup(row.icon)}</span>
                    <span><strong>${row.label}</strong></span>
                  </span>
                  <span class="ab-info-row-right">
                    <b>${row.value}</b>
                    <i>›</i>
                  </span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "home"),
  });
}

function renderTravelerProfilePage() {
  return renderAppShell({
    className: "ab-profile-page",
    topbar: renderAppTopbar({
      title: "个人中心",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-toast="设置功能暂未接入">设置</button>`,
    }),
    body: `
      <section class="ab-profile-hero">
        <button class="ab-profile-card" data-toast="个人资料（原型演示）">
          <span class="ab-avatar">杜</span>
          <span class="ab-profile-card-copy">
            <strong>杜**</strong>
            <em>138****5678</em>
          </span>
          <i>›</i>
        </button>
      </section>

      ${travelerProfileSections
        .map(
          (section, index) => `
            <section class="ab-page-section ${index === 1 ? "ab-page-section--anchor" : ""}"${index === 1 ? ' id="traveler-profile-security"' : ""}>
              ${renderSectionTitle(section.title)}
              ${renderInfoRows(section.rows, { compact: index === 0 })}
            </section>
          `
        )
        .join("")}

      <section class="ab-page-section">
        ${renderSectionTitle("退出登录")}
        <button class="ab-danger-button" data-toast="退出登录（原型演示）">退出登录</button>
      </section>

      <section class="ab-page-section" id="traveler-profile-footer">
        <p class="ab-footer-copy">到站北京 · 旅客端 v1.1.0<br>北京市重点站区管委会</p>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "profile"),
  });
}

function renderDriverProfilePage() {
  return renderAppShell({
    className: "ab-profile-page ab-profile-page--driver",
    topbar: renderAppTopbar({
      title: "个人中心",
      backTo: "#/driver/queue",
      action: `<button class="ab-topbar-action" data-toast="帮助中心（原型演示）">帮助</button>`,
    }),
    body: `
      <section class="ab-profile-hero ab-profile-hero--driver">
        <button class="ab-profile-card" data-toast="司机资料（原型演示）">
          <span class="ab-avatar ab-avatar--driver">张</span>
          <span class="ab-profile-card-copy">
            <strong>张伟</strong>
            <em>金牌司机 · 京A 58832 · 从业6年</em>
          </span>
          <i>›</i>
        </button>
        ${renderStatGrid(driverProfileStats)}
      </section>

      <section class="ab-page-section" id="driver-profile-middle">
        ${renderSectionTitle("服务数据", `<button class="ab-section-link" data-to="#/driver/short-haul/points">短途复载积分 ></button>`)}
        <div class="ab-profile-summary">
          ${renderActionGrid(
            [
              { label: "消息通知", icon: "message", toast: "消息通知（原型演示）", bg: "#eaf2ff", fg: "#206fd8" },
              { label: "我的积分", icon: "scan", to: "#/driver/short-haul/points", bg: "#e5f7ef", fg: "#0b7a50" },
              { label: "行程历史", icon: "home", to: "#/driver/short-haul/history", bg: "#fff4d8", fg: "#a16207" },
              { label: "预约记录", icon: "calendar", to: "#/driver/short-haul/booking", bg: "#fdecef", fg: "#d92d20" },
            ],
            "ab-driver-quick-grid"
          )}
        </div>
      </section>

      ${driverProfileSections
        .map(
          (section, index) => `
            <section class="ab-page-section ${index === 0 ? "" : "ab-page-section--anchor"}">
              ${renderSectionTitle(section.title)}
              ${renderInfoRows(section.rows, { compact: true })}
            </section>
          `
        )
        .join("")}

      <section class="ab-page-section" id="driver-profile-footer">
        ${renderSectionTitle("退出登录")}
        <button class="ab-danger-button" data-toast="退出登录（原型演示）">退出登录</button>
        <p class="ab-footer-copy">到站北京 · 司机端 v2.1.0<br>北京市重点站区管委会</p>
      </section>
    `,
    footer: renderAbFooterNav("driver", "profile"),
  });
}

const announcementItems = [
  { tag: "紧急", tone: "danger", title: "北京西站北广场临时施工通告", meta: "2025-01-20 10:30" },
  { tag: "通知", tone: "primary", title: "春运期间候车室延时开放公告", meta: "2025-01-19 14:00" },
  { tag: "提醒", tone: "warning", title: "12306实名核验系统升级提醒", meta: "2025-01-18 09:00" },
  { tag: "活动", tone: "primary", title: "春节期间文化展览活动预告", meta: "2025-01-17 16:00" },
  { tag: "通知", tone: "primary", title: "自助售票机系统维护通知", meta: "2025-01-16 11:20" },
  {
    tag: "提醒",
    tone: "warning",
    title: "行李托运服务操作流程更新",
    meta: "2025-01-15 08:00",
    reply:
      "即日起，行李托运需在出发前3小时办理，托运标准为每人不超过50公斤。请于各站行李房窗口办理，携带有效证件及车票。",
  },
];

const announcementTabs = [
  { key: "全部", label: "全部", to: "#/announcements" },
  { key: "紧急", label: "紧急", to: "#/announcements" },
  { key: "通知", label: "通知", to: "#/announcements" },
  { key: "提示", label: "提示", to: "#/announcements" },
  { key: "活动", label: "活动", to: "#/announcements" },
];

const trafficTabs = [
  { key: "metro", label: "地铁", to: "#/traffic/metro" },
  { key: "bus", label: "公交", to: "#/traffic/bus" },
  { key: "taxi", label: "出租", to: "#/traffic/taxi" },
  { key: "ride", label: "网约", to: "#/traffic/ride" },
  { key: "mixed", label: "综合", to: "#/traffic/mixed" },
];

const navModeTabs = [
  { key: "map3d", label: "3D", to: "#/nav/map3d" },
  { key: "map", label: "平面", to: "#/nav/map" },
  { key: "ar", label: "AR", to: "#/nav/ar" },
];

const trafficTaxiStops = [
  { name: "南广场出口", note: "排队 85 人", status: "可排队", tone: "success", action: "导航" },
  { name: "北广场出口", note: "排队 42 人", status: "可排队", tone: "success", action: "导航" },
  { name: "东广场出口", note: "排队 0 人", status: "已关闭", tone: "muted" },
];

const trafficRideOffers = [
  { name: "滴滴出行 · 快车", eta: "预计到达 4 分钟", demand: "候车低", price: "¥28-35", recommended: true },
  { name: "滴滴出行 · 优享", eta: "预计到达 6 分钟", demand: "候车低", price: "¥45-58" },
  { name: "高德打车 · 快车", eta: "预计到达 5 分钟", demand: "候车中", price: "¥25-32", demandTone: "warning" },
  { name: "美团打车 · 快车", eta: "预计到达 7 分钟", demand: "候车低", price: "¥27-34" },
];

const trafficMetroLines = [
  { line: "2号线", tone: "primary", from: "北京西站", to: "东四十条", next: "1:30", trip: "8站约 22 分钟", load: "78%", price: "¥4" },
  { line: "7号线", tone: "success", recommended: true, from: "北京西站", to: "达仁里东", next: "3:45", trip: "6站约 18 分钟", load: "42%", price: "¥4" },
];

const trafficBusRoutes = [
  { line: "9路", dest: "木樨地", meta: "5站台 · 12站", eta: "3分钟", tone: "primary" },
  { line: "特15", dest: "公主坟", meta: "2站台 · 8站", eta: "即将发车", tone: "success" },
  { line: "122路", dest: "北京南站", meta: "3站台 · 15站", eta: "7分钟", tone: "primary" },
  { line: "快速公交1", dest: "天通苑", meta: "6站台 · 20站", eta: "12分钟", tone: "primary" },
];

const trafficMixedRows = [
  { label: "地铁 7号线", note: "舒适度：中", value: "18分钟 · ¥4", tone: "primary", tag: "最优选" },
  { label: "网约车快车", note: "舒适度：高", value: "25分钟 · ¥28-35", tone: "primary" },
  { label: "出租车", note: "舒适度：中", value: "12-20分钟 · ¥25-40", tone: "warning" },
  { label: "公共汽车", note: "舒适度：低", value: "35分钟 · ¥2", tone: "primary" },
];

const trafficOtherOptions = [
  { icon: "bus", label: "公共汽车", toast: "公共汽车（原型演示）" },
  { icon: "map", label: "共享单车", toast: "共享单车（原型演示）" },
  { icon: "taxi", label: "机场巴士", toast: "机场巴士（原型演示）" },
  { icon: "car", label: "出租车", toast: "出租车（原型演示）" },
];

const parkingTabs = [
  { key: "list", label: "停车场列表", to: "#/parking/list" },
  { key: "price", label: "价格对比", to: "#/parking/price" },
];

const parkingStats = [
  { value: "4个", label: "停车场数量" },
  { value: "312", label: "总空余车位" },
  { value: "14:35", label: "更新时间" },
];

const parkingListTop = [
  {
    title: "北京西站北广场停车场",
    tone: "success",
    status: "充裕",
    use: "87 / 600 空余",
    distance: "步行 3 分钟",
    price: "¥5/小时，封顶¥50/天",
    note: "新能源车位",
    progress: 14,
  },
  {
    title: "北京西站南广场地面停车场",
    tone: "warning",
    status: "紧张",
    use: "15 / 320 空余",
    distance: "步行 1 分钟",
    price: "¥6/小时，封顶¥60/天",
    note: "",
    progress: 95,
  },
];

const parkingListMore = [
  {
    title: "莲花池东路配套停车楼",
    tone: "success",
    status: "充裕",
    use: "210 / 450 空余",
    distance: "步行 8 分钟",
    price: "¥4/小时，封顶¥40/天",
    note: "新能源车位",
    progress: 53,
  },
  {
    title: "锦州街临时停车区",
    tone: "danger",
    status: "已满",
    use: "0 / 80 空余",
    distance: "步行 12 分钟",
    price: "¥3/小时",
    note: "",
    progress: 100,
  },
];

const parkingPriceRows = [
  { label: "1小时以内", north: "¥5", south: "¥6", lianhua: "¥4" },
  { label: "3小时", north: "¥15", south: "¥18", lianhua: "¥12" },
  { label: "全天封顶", north: "¥50", south: "¥60", lianhua: "¥40" },
];

const parkingNotes = [
  "支持微信、支付宝、ETC免费离场，无需停车缴费",
  "节假日及春运期间高峰时段价格可能上浮20%",
  "残疾人专用车位免费停车，需出示残疾人证",
  "超高车辆（>2.2m）请停至南广场地面停车区",
];

const driverQueueFilters = [
  { key: "all", label: "全部" },
  { key: "train", label: "火车站" },
  { key: "plane", label: "机场" },
];

const driverQueueStations = [
  { id: "beijing", type: "train", name: "北京站", distance: "3.2km", status: "正常", tone: "warning", passengers: "209", vehicles: "79", wait: "12", to: "#/driver/station/beijing" },
  { id: "west", type: "train", name: "北京西站", distance: "5.8km", status: "拥挤", tone: "danger", passengers: "457", vehicles: "147", wait: "28", to: "#/driver/station/west" },
  { id: "south", type: "train", name: "北京南站", distance: "8.1km", status: "拥挤", tone: "danger", passengers: "354", vehicles: "124", wait: "22", to: "#/driver/station/beijing" },
  { id: "north", type: "train", name: "北京北站", distance: "4.5km", status: "畅通", tone: "success", passengers: "42", vehicles: "18", wait: "5", to: "#/driver/station/beijing" },
  { id: "chaoyang", type: "train", name: "朝阳站", distance: "6.3km", status: "正常", tone: "warning", passengers: "267", vehicles: "98", wait: "18", to: "#/driver/station/west" },
  { id: "qinghe", type: "train", name: "清河站", distance: "12.4km", status: "畅通", tone: "success", passengers: "138", vehicles: "52", wait: "11", to: "#/driver/station/beijing" },
  { id: "yizhuang", type: "train", name: "亦庄站", distance: "18.6km", status: "畅通", tone: "success", passengers: "96", vehicles: "31", wait: "9", to: "#/driver/station/beijing" },
  { id: "tongzhou", type: "train", name: "通州站", distance: "20.8km", status: "正常", tone: "warning", passengers: "183", vehicles: "74", wait: "16", to: "#/driver/station/west" },
  { id: "capital", type: "plane", name: "首都机场", distance: "25.6km", status: "拥挤", tone: "danger", passengers: "1000", vehicles: "333", wait: "48", to: "#/driver/station/beijing" },
  { id: "daxing", type: "plane", name: "大兴机场", distance: "42.3km", status: "正常", tone: "warning", passengers: "413", vehicles: "150", wait: "24", to: "#/driver/station/beijing" },
];

const driverStationData = {
  beijing: {
    title: "北京站",
    address: "东城区毛家湾胡同甲13号",
    heroStats: [
      { value: "209", label: "候乘旅客", tone: "primary" },
      { value: "79", label: "排队车辆", tone: "success" },
      { value: "12", label: "最长等候", tone: "warning" },
    ],
    areas: [
      { title: "出租车蓄车区A", tone: "warning", status: "正常", passengers: "126", vehicles: "48", wait: "12" },
      { title: "出租车蓄车区B", tone: "success", status: "畅通", passengers: "83", vehicles: "31", wait: "8" },
    ],
    mapNote: "点击区域标签可查看详细候车信息，蓝色路线为引导路径",
    mapAreas: [
      { label: "出租车蓄车区A", tone: "warning", position: "left" },
      { label: "出租车蓄车区B", tone: "success", position: "right" },
    ],
  },
  west: {
    title: "北京西站",
    address: "丰台区莲花池东路118号",
    heroStats: [
      { value: "457", label: "候乘旅客", tone: "primary" },
      { value: "147", label: "排队车辆", tone: "success" },
      { value: "28", label: "最长等候", tone: "warning" },
    ],
    areas: [
      { title: "南广场出租车区", tone: "danger", status: "拥挤", passengers: "312", vehicles: "95", wait: "28" },
      { title: "北广场出租车区", tone: "warning", status: "正常", passengers: "145", vehicles: "52", wait: "15" },
    ],
  },
};

const shortHaulTabs = [
  { key: "booking", label: "预约进场", to: "#/driver/short-haul/booking" },
  { key: "history", label: "行程记录", to: "#/driver/short-haul/history" },
  { key: "points", label: "积分明细", to: "#/driver/short-haul/points" },
];

const shortHaulHistory = [
  { title: "北京南站", meta: "今天 14:32 · 行程里程 3.2km", value: "+3分", tone: "success", tag: "短途" },
  { title: "北京西站", meta: "今天 11:15 · 行程里程 12.5km", value: "-2分", tone: "danger", tag: "普通" },
  { title: "首都机场T3", meta: "昨天 18:40 · 行程里程 4.8km", value: "+3分", tone: "success", tag: "短途" },
  { title: "北京站", meta: "昨天 09:22 · 行程里程 8.1km", value: "-2分", tone: "danger", tag: "普通" },
];

const shortHaulPoints = [
  { title: "短途赋分", meta: "今天 14:32 · 北京南站", value: "+3", tone: "success", tag: "积分" },
  { title: "复载消分", meta: "今天 11:15 · 北京西站", value: "-2", tone: "danger", tag: "积分" },
  { title: "短途赋分", meta: "昨天 18:40 · 首都机场T3", value: "+3", tone: "success", tag: "积分" },
  { title: "复载消分", meta: "昨天 09:22 · 北京站", value: "-2", tone: "danger", tag: "积分" },
  { title: "短途赋分", meta: "前天 16:05 · 朝阳站", value: "+3", tone: "success", tag: "积分" },
];

const taxiHouseTabs = [
  { key: "info", label: "基本信息", to: "#/driver/taxi-house/info" },
  { key: "meal", label: "今日餐饮", to: "#/driver/taxi-house/meal" },
  { key: "redeem", label: "积分兑换", to: "#/driver/taxi-house/redeem" },
];

const taxiHouseServices = [
  { key: "免费休息区", label: "免费休息区", toast: "免费休息区（原型演示）" },
  { key: "餐饮服务", label: "餐饮服务", toast: "餐饮服务（原型演示）" },
  { key: "充电桩", label: "充电桩", toast: "充电桩（原型演示）" },
  { key: "免费WIFI", label: "免费WIFI", toast: "免费WIFI（原型演示）" },
  { key: "茶水供应", label: "茶水供应", toast: "茶水供应（原型演示）" },
  { key: "阅读角", label: "阅读角", toast: "阅读角（原型演示）" },
  { key: "医疗急救箱", label: "医疗急救箱", toast: "医疗急救箱（原型演示）" },
  { key: "洗手间", label: "洗手间", toast: "洗手间（原型演示）" },
];

const taxiHouseReviews = [
  { avatar: "张", name: "张师傅", time: "昨天", comment: "环境干净整洁，饭菜实惠好吃，每次来这里休息都很舒服。" },
  { avatar: "王", name: "王师傅", time: "3天前", comment: "充电设备很方便，工作人员态度也很好，赞一个。" },
];

const taxiHouseMeals = [
  { name: "红烧猪蹄饭", tag: "今日特供", price: "¥18", desc: "猪蹄+米饭+时蔬，丰富实惠", key: "braisedRice" },
  { name: "番茄鸡蛋面", tag: "热门", price: "¥12", desc: "清淡营养，汤底鲜美", key: "tomatoNoodles" },
  { name: "卤肉盖浇饭", tag: "", price: "¥16", desc: "秘制卤肉，香而不腻", key: "porkRice" },
  { name: "蒸蛋羹套餐", tag: "推荐", price: "¥10", desc: "蒸蛋+小菜+粥，养胃暖身", key: "steamedEgg" },
];

const taxiHouseRewards = [
  { icon: "cup", name: "保温水杯", points: "30积分", stock: "库存50件" },
  { icon: "paper", name: "车用纸巾（3包）", points: "10积分", stock: "库存200件" },
  { icon: "glove", name: "驾驶员手套", points: "20积分", stock: "库存80件" },
  { icon: "leaf", name: "车载空气清新剂", points: "15积分", stock: "库存120件" },
  { icon: "pillow", name: "颈部枕头", points: "25积分", stock: "库存40件" },
  { icon: "camera", name: "行车记录仪贴纸", points: "5积分", stock: "库存300件" },
];

function renderStatusPill(tone, label) {
  return `<span class="ab-status-pill ${tone}">${label}</span>`;
}

function renderProgressBar(value, tone = "primary") {
  return `
    <div class="ab-progress ${tone}">
      <span style="width:${Math.max(0, Math.min(100, value))}%"></span>
    </div>
  `;
}

function renderTrafficStopCard(item) {
  return `
    <button class="ab-traffic-stop-card" data-toast="${item.name}（原型演示）">
      <span class="ab-traffic-stop-left">
        <span class="ab-traffic-stop-icon">${iconMarkup("pin")}</span>
        <span>
          <strong>${item.name}</strong>
          <em>${item.note}</em>
        </span>
      </span>
      <span class="ab-traffic-stop-right">
        ${renderStatusPill(item.tone || "primary", item.status)}
        ${item.action ? `<b>${item.action}</b>` : ""}
      </span>
    </button>
  `;
}

function renderTrafficRideCard(item) {
  return `
    <button class="ab-traffic-ride-card" data-toast="${item.name}（原型演示）">
      <span class="ab-traffic-ride-icon">${iconMarkup("taxi")}</span>
      <span class="ab-traffic-ride-copy">
        <strong>${item.name}${item.recommended ? ` <span class="ab-small-badge">推荐</span>` : ""}</strong>
        <em>${item.eta} · <b class="${item.demandTone || ""}">${item.demand}</b></em>
      </span>
      <span class="ab-traffic-ride-price">${item.price}</span>
      <span class="ab-traffic-ride-action">叫车</span>
    </button>
  `;
}

function renderTrafficMetroCard(item) {
  return `
    <article class="ab-traffic-metro-card">
      <div class="ab-traffic-metro-head">
        <span class="ab-line-badge ${item.tone}">${item.line}</span>
        <strong>${item.from} > ${item.to}</strong>
        ${item.recommended ? renderStatusPill("success", "推荐") : ""}
      </div>
      <div class="ab-traffic-metro-grid">
        <div><span>下一班</span><strong>${item.next}</strong></div>
        <div><span>行程</span><strong>${item.trip}</strong></div>
        <div><span>满载率</span><strong>${item.load}</strong></div>
      </div>
      <div class="ab-traffic-metro-foot">
        <span>${item.price}</span>
        <button data-toast="${item.line}购票（原型演示）">购票</button>
      </div>
    </article>
  `;
}

function renderTrafficBusCard(item) {
  return `
    <button class="ab-traffic-bus-card" data-toast="${item.line}（原型演示）">
      <span class="ab-traffic-bus-icon">${item.line}</span>
      <span class="ab-traffic-bus-copy">
        <strong>${item.dest}</strong>
        <em>${item.meta}</em>
      </span>
      <span class="ab-traffic-bus-right">
        ${renderStatusPill(item.tone || "primary", item.eta)}
        <i>›</i>
      </span>
    </button>
  `;
}

function renderParkingCard(item) {
  return `
    <button class="ab-parking-card" data-toast="${item.title}（原型演示）">
      <div class="ab-parking-card-head">
        <strong>${item.title}</strong>
        ${renderStatusPill(item.tone, item.status)}
      </div>
      <div class="ab-parking-card-usage">
        <span>车位使用率</span>
        <b>${item.use}</b>
      </div>
      ${renderProgressBar(item.progress, item.tone)}
      <div class="ab-parking-card-foot">
        <span>${item.distance}</span>
        <span>${item.price}</span>
      </div>
      ${item.note ? `<div class="ab-parking-card-note">${item.note}</div>` : ""}
    </button>
  `;
}

function renderQueueStationCard(item) {
  return `
    <button class="ab-queue-station-card" data-to="${item.to}">
      <div class="ab-queue-station-top">
        <span class="ab-queue-station-icon ${item.type}">${iconMarkup(item.type)}</span>
        <span class="ab-queue-station-copy">
          <strong>${item.name}</strong>
          <em>${item.distance}</em>
        </span>
        ${renderStatusPill(item.tone, item.status)}
        <i>›</i>
      </div>
      <div class="ab-queue-station-grid">
        <div><span>排队旅客</span><strong>${item.passengers}</strong><em>人</em></div>
        <div><span>候车数量</span><strong>${item.vehicles}</strong><em>辆</em></div>
        <div><span>预计等候</span><strong>${item.wait}</strong><em>分钟</em></div>
      </div>
    </button>
  `;
}

function renderStationAreaCard(area) {
  return `
    <button class="ab-station-area-card" data-toast="${area.title}（原型演示）">
      <div class="ab-station-area-head">
        <div>
          <span class="ab-station-area-dot ${area.tone}"></span>
          <strong>${area.title}</strong>
        </div>
        ${renderStatusPill(area.tone, area.status)}
      </div>
      <div class="ab-station-area-grid">
        <div><span>候乘旅客</span><strong>${area.passengers}</strong><em>人</em></div>
        <div><span>排队车辆</span><strong>${area.vehicles}</strong><em>辆</em></div>
        <div><span>预计等候</span><strong>${area.wait}</strong><em>分钟</em></div>
      </div>
    </button>
  `;
}

function renderJourneyCard(item) {
  return `
    <button class="ab-journey-card" data-toast="${item.title}（原型演示）">
      <div class="ab-journey-card-main">
        <strong>${item.title}</strong>
        <span>${item.meta}</span>
      </div>
      <div class="ab-journey-card-tail">
        ${renderStatusPill(item.tone, item.tag)}
        <b>${item.value}</b>
      </div>
    </button>
  `;
}

function renderTaxiHouseMealCard(item) {
  return `
    <div class="ab-meal-card">
      <div class="ab-meal-card-copy">
        <div class="ab-meal-card-head">
          <strong>${item.name}</strong>
          ${item.tag ? `<span class="ab-small-badge">${item.tag}</span>` : ""}
        </div>
        <em>${item.desc}</em>
      </div>
      <div class="ab-meal-card-price">${item.price}</div>
      <div class="ab-meal-card-counter">
        <button data-counter-key="${item.key}" data-counter-delta="-1" aria-label="减少">−</button>
        <span>${state.counters[item.key] || 0}</span>
        <button data-counter-key="${item.key}" data-counter-delta="1" aria-label="增加">+</button>
      </div>
    </div>
  `;
}

function renderTaxiHouseRewardCard(item) {
  return `
    <article class="ab-reward-card">
      <div class="ab-reward-icon">${iconMarkup(item.icon)}</div>
      <strong>${item.name}</strong>
      <em>${item.stock}</em>
      <div class="ab-reward-foot">
        <b>${item.points}</b>
        <button data-toast="${item.name}兑换（原型演示）">兑换</button>
      </div>
    </article>
  `;
}

function renderTaxiHouseReviewCard(item) {
  return `
    <article class="ab-review-card">
      <span class="ab-review-avatar">${item.avatar}</span>
      <div class="ab-review-copy">
        <div class="ab-review-head">
          <strong>${item.name}</strong>
          <span>${item.time}</span>
        </div>
        <p>${item.comment}</p>
      </div>
    </article>
  `;
}

function renderNavigationPage(mode) {
  const activeRoute = `#/nav/${mode}`;
  const activeModeRoute = mode === "route" ? "#/nav/map" : activeRoute;
  const floorPlans = {
    B1: { title: "B1 地下层", note: "地铁换乘 / 停车接驳 / 出站通道", value: "步行 6 分钟" },
    F1: { title: "F1 地面层", note: "到站大厅 / 站区服务 / 出租车引导", value: "步行 4 分钟" },
    F2: { title: "F2 连廊层", note: "候车休息 / 站内通道 / 无障碍路线", value: "步行 5 分钟" },
    F3: { title: "F3 观景层", note: "高位导向 / 服务窗口 / 站区标识", value: "步行 7 分钟" },
  };
  const currentFloor = floorPlans[state.selected.navFloor] || floorPlans.F1;

  return renderAppShell({
    className: "ab-navigation-page",
    topbar: renderAppTopbar({
      title: "导航指引",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-to="#/nav/route">路线规划</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderSelectableGrid(navModeTabs, { activeValue: activeModeRoute, cols: 3 })}
      </section>

      <section class="ab-page-section">
        <div class="ab-map-shell">
          <div class="ab-map-shell-grid" aria-hidden="true"></div>
          <div class="ab-map-shell-main">
            <span class="ab-map-shell-icon">${iconMarkup("map")}</span>
            <strong>地图预览</strong>
            <em>平面 / 3D / AR 示例</em>
          </div>
          <div class="ab-map-shell-tags">
            <span>B1</span>
            <span>F1</span>
            <span>F2</span>
            <span>F3</span>
          </div>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("路线规划", `<button class="ab-section-link" data-to="#/nav/route">查看详情 ></button>`)}
        <div class="ab-panel">
          ${renderSelectableGrid([
            { key: "B1", label: "B1" },
            { key: "F1", label: "F1" },
            { key: "F2", label: "F2" },
            { key: "F3", label: "F3" },
          ], {
            activeValue: state.selected.navFloor || "F1",
            selectKey: "navFloor",
            cols: 4,
          })}
          <div class="ab-route-plan-card">
            <strong>${currentFloor.title}</strong>
            <em>${currentFloor.note}</em>
            <span>${currentFloor.value}</span>
          </div>
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "nav"),
  });
}

function renderAnnouncementsPage(variant = "top") {
  return renderAppShell({
    className: "ab-announcements-page",
    topbar: renderAppTopbar({
      title: "站区公告",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-toast="通知中心（原型演示）">通知中心</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderSelectableGrid(announcementTabs, { activeValue: state.selected.announcementCategory || "全部", selectKey: "announcementCategory", cols: 5 })}
      </section>

      <section class="ab-page-section">
        <div class="ab-tip-card ab-tip-card--alert">
          <strong>当前有1条紧急公告</strong>
          <p>请旅客注意查看并遵守相关规定</p>
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-record-list">
          ${announcementItems.slice(0, 4).map((item) => renderRecordCard(item)).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="announcements-lower">
        <div class="ab-record-list">
          ${announcementItems
            .slice(4)
            .map((item) => renderRecordCard(item))
            .join("")}
        </div>
        <div class="ab-tip-card soft">
          <strong>已显示最近30天公告</strong>
          <p>所有公告卡片均可点击查看原型反馈，展开项保留公告详情说明。</p>
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "notice"),
  });
}

function renderTrafficPage(mode) {
  const activeRoute = `#/traffic/${mode}`;
  const titleMap = {
    taxi: "市内交通指引",
    ride: "市内交通指引",
    metro: "市内交通指引",
    bus: "市内交通指引",
    mixed: "市内交通指引",
    other: "其他交通方式",
  };
  const taxiSummary = `
    <div class="ab-panel">
      <div class="ab-panel-head">
        <div>
          <h2>出租车实时状态</h2>
          <p>高峰期排队需等候约 10 分钟</p>
        </div>
      </div>
      ${renderStatGrid([
        { value: "85人", label: "排队人数", tone: "danger" },
        { value: "8-12分钟", label: "等候时间", tone: "warning" },
        { value: "12辆", label: "候车辆数", tone: "success" },
      ])}
      <div class="ab-tip-card ab-tip-card--warn">
        <strong>高峰期排队需等候约 10 分钟</strong>
      </div>
    </div>
  `;
  const taxiBody = `
    ${taxiSummary}

    <section class="ab-page-section">
      ${renderSectionTitle("上车地点")}
      <div class="ab-traffic-stop-list">
        ${trafficTaxiStops.map(renderTrafficStopCard).join("")}
      </div>
    </section>

    <section class="ab-page-section">
      ${renderSectionTitle("智能推荐")}
      <div class="ab-tip-card soft">
        <strong>推荐前往南广场一号网约车点</strong>
        <p>距离您 200m · 客流中等 · 接驾 3-5 分钟</p>
      </div>
    </section>
  `;
  const rideBody = `
    <section class="ab-page-section">
      <div class="ab-tip-card soft">
        <strong>推荐上车点：南广场一号网约车点</strong>
        <p>距离您 200m · 客流中等 · 接驾 3-5 分钟</p>
      </div>
    </section>
    <section class="ab-page-section">
      <div class="ab-traffic-ride-list">
        ${trafficRideOffers.map(renderTrafficRideCard).join("")}
      </div>
    </section>
  `;
  const metroBody = `
    <section class="ab-page-section">
      <div class="ab-traffic-metro-list">
        ${trafficMetroLines.map(renderTrafficMetroCard).join("")}
      </div>
    </section>
  `;
  const busBody = `
    <section class="ab-page-section">
      <div class="ab-tip-card soft">
        <strong>附近站点：北京站东口</strong>
        <p>100m</p>
      </div>
    </section>
    <section class="ab-page-section">
      <div class="ab-traffic-bus-list">
        ${trafficBusRoutes.map(renderTrafficBusCard).join("")}
      </div>
    </section>
  `;
  const mixedBody = `
    <section class="ab-page-section">
      <div class="ab-panel">
        <div class="ab-panel-head">
          <div>
            <h2>交通方式综合对比</h2>
            <p>北京西站 → 天安门广场</p>
          </div>
        </div>
        <div class="ab-traffic-compare-list">
          ${trafficMixedRows
            .map(
              (row, index) => `
                <button class="ab-traffic-compare-row ${index === 0 ? "active" : ""}" data-toast="${row.label}（原型演示）">
                  <span class="ab-traffic-compare-copy">
                    <strong>${row.label}${row.tag ? `<b class="ab-small-badge">${row.tag}</b>` : ""}</strong>
                    <em>${row.note}</em>
                  </span>
                  <span class="ab-traffic-compare-value">
                    <b>${row.value}</b>
                    <i>›</i>
                  </span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="ab-page-section">
      <div class="ab-tip-card ab-tip-card--green">
        <strong>AI 推荐方案</strong>
        <p>当前高峰期，地铁 7 号线满载率仅 42%，行程约 18 分钟，票价低廉。如需省时可选择网约车，预计 25 分钟，费用约 ¥28-35。</p>
      </div>
      ${renderActionGrid([
        { label: "查看路线", icon: "map", toast: "查看路线（原型演示）" },
        { label: "继续比价", icon: "car", toast: "继续比价（原型演示）" },
      ], "ab-traffic-action-grid")}
    </section>
  `;
  const otherBody = `
    <section class="ab-page-section">
      ${renderActionGrid(trafficOtherOptions, "ab-traffic-other-grid")}
    </section>
  `;
  const bodyMap = {
    taxi: taxiBody,
    ride: rideBody,
    metro: metroBody,
    bus: busBody,
    mixed: mixedBody,
    other: otherBody,
  };

  return renderAppShell({
    className: "ab-traffic-page",
    topbar: renderAppTopbar({
      title: titleMap[mode] || "市内交通指引",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-toast="数据实时（原型演示）">数据实时</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderSelectableGrid(trafficTabs, { activeValue: activeRoute, cols: 5 })}
      </section>
      <section class="ab-page-section">
        <div class="ab-traffic-meta">
          <span>最后更新 14:32:18</span>
          <b>数据实时</b>
        </div>
      </section>
      ${bodyMap[mode] || taxiBody}
    `,
    footer: renderAbFooterNav("traveler", "traffic"),
  });
}

function renderParkingPage(mode) {
  const activeRoute = `#/parking/${mode}`;
  const bodyMap = {
    list: `
      <section class="ab-page-section">
        ${renderStatGrid(parkingStats)}
      </section>

      <section class="ab-page-section">
        <div class="ab-tip-card ab-tip-card--green">
          <strong>智能推荐</strong>
          <p>莲花池东路配套停车楼空余210位，价格最低（¥4/时），推荐停车后步行8分钟进站，或乘免费摆渡车。</p>
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-parking-list">
          ${parkingListTop.map(renderParkingCard).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="parking-lower">
        <div class="ab-parking-list">
          ${parkingListMore.map(renderParkingCard).join("")}
        </div>
      </section>
    `,
    price: `
      <section class="ab-page-section">
        ${renderStatGrid(parkingStats)}
      </section>

      <section class="ab-page-section">
        <div class="ab-table-card">
          <div class="ab-table-head">
            <span>停车时长</span>
            <span>北广场</span>
            <span>南广场</span>
            <span>莲花池</span>
          </div>
          ${parkingPriceRows
            .map(
              (row) => `
                <div class="ab-table-row">
                  <strong>${row.label}</strong>
                  <span>${row.north}</span>
                  <span>${row.south}</span>
                  <span>${row.lianhua}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-tip-card soft">
          <strong>注意事项</strong>
          <ul class="ab-note-list">
            ${parkingNotes.map((note) => `<li>${note}</li>`).join("")}
          </ul>
        </div>
      </section>
    `,
  };

  return renderAppShell({
    className: "ab-parking-page",
    topbar: renderAppTopbar({
      title: "停车场指引",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-toast="停车信息（原型演示）">停车信息</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderSelectableGrid(parkingTabs, { activeValue: activeRoute, cols: 2 })}
      </section>
      ${bodyMap[mode] || bodyMap.list}
    `,
    footer: renderAbFooterNav("traveler", "traffic"),
  });
}

function renderDriverQueuePage(variant = "top") {
  const filter = state.selected.queueFilter || "all";
  const filteredStations =
    filter === "all" ? driverQueueStations : driverQueueStations.filter((station) => station.type === filter);
  const statusCounts = driverQueueStations.reduce(
    (acc, station) => {
      if (station.status === "畅通") acc.green += 1;
      else if (station.status === "拥挤") acc.red += 1;
      else acc.amber += 1;
      return acc;
    },
    { green: 0, amber: 0, red: 0 }
  );

  return renderAppShell({
    className: "ab-driver-queue-page",
    topbar: renderAppTopbar({
      title: "车站排队情况",
      backTo: "#/services",
      action: `<button class="ab-topbar-action" data-toast="已刷新">刷新</button>`,
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-queue-search">
          ${iconMarkup("search")}
          <span>搜索车站名称</span>
          <button data-toast="刷新（原型演示）">${iconMarkup("refresh")}</button>
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-queue-status-line">
          <span><b class="green">${statusCounts.green}</b> 畅通</span>
          <span><b class="amber">${statusCounts.amber}</b> 正常</span>
          <span><b class="red">${statusCounts.red}</b> 拥挤</span>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSelectableGrid(driverQueueFilters, { activeValue: filter, selectKey: "queueFilter", cols: 3, className: "ab-driver-filter-row" })}
        <div class="ab-queue-count">10个站点</div>
      </section>

      <section class="ab-page-section" id="driver-queue-top">
        <div class="ab-queue-list">
          ${filteredStations.slice(0, 3).map(renderQueueStationCard).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="driver-queue-mid">
        <div class="ab-queue-list">
          ${filteredStations.slice(3, 7).map(renderQueueStationCard).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="driver-queue-right">
        <div class="ab-queue-list">
          ${filteredStations.slice(7).map(renderQueueStationCard).join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("driver", "home"),
  });
}

function renderDriverStationPage(stationKey, variant = "queue") {
  const station = driverStationData[stationKey] || driverStationData.beijing;
  const isBeijing = stationKey === "beijing";
  return renderAppShell({
    className: "ab-driver-station-page",
    topbar: renderAppTopbar({
      title: station.title,
      backTo: "#/driver/queue",
      action: `<button class="ab-topbar-action" data-toast="导航功能暂未接入">导航</button>`,
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-station-hero">
          <p>${station.address}</p>
          ${renderStatGrid(station.heroStats)}
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSelectableGrid(
          [
            { key: "queue", label: "实时排队", to: `#/driver/station/${stationKey}` },
            {
              key: "map",
              label: "场区地图",
              to: isBeijing ? "#/driver/station/beijing-map" : "",
              toast: `${station.title}场区地图（原型演示）`,
            },
          ],
          { activeValue: variant === "map" ? "map" : "queue", cols: 2 }
        )}
      </section>

      ${
        variant === "map"
          ? `
            <section class="ab-page-section" id="driver-station-map">
              <div class="ab-map-shell ab-map-shell--driver">
                <div class="ab-map-shell-grid" aria-hidden="true"></div>
                <div class="ab-map-shell-main">
                  <span class="ab-map-shell-icon">${iconMarkup("train")}</span>
                  <strong>${station.title}</strong>
                  <em>${station.mapNote || "点击区域标签可查看详细候车信息，蓝色路线为引导路径"}</em>
                </div>
                <div class="ab-station-map-tags">
                  ${
                    (station.mapAreas || station.areas || [])
                      .map(
                        (area, index) => `
                          <span class="ab-station-map-tag ${area.tone || "primary"} ${area.position || index === 0 ? "left" : "right"}">
                            ${area.label || area.title}
                          </span>
                        `
                      )
                      .join("")
                  }
                </div>
              </div>
            </section>
          `
          : `
            <section class="ab-page-section">
              ${renderSectionTitle("候车区列表（2个区域）", `<button class="ab-section-link" data-toast="更新于刚刚">更新于刚刚</button>`)}
              <div class="ab-station-area-list">
                ${station.areas.map(renderStationAreaCard).join("")}
              </div>
            </section>

            <section class="ab-page-section">
              <button class="ab-station-banner" data-to="#/driver/short-haul/booking">
                <span class="ab-station-banner-copy">
                  <strong>短途复载免排队</strong>
                  <em>距离本站5km内送客可预约免排队再次进场</em>
                </span>
                <b>立即预约</b>
                <i>›</i>
              </button>
            </section>

            <section class="ab-page-section">
              <button class="ab-station-house" data-to="#/driver/taxi-house/info">
                <span class="ab-station-house-icon">${iconMarkup("home")}</span>
                <span class="ab-station-house-copy">
                  <strong>的士之家</strong>
                  <em>当前密度 适中 · 今日供应午餐</em>
                </span>
                <i>›</i>
              </button>
            </section>
          `
      }
    `,
    footer: renderAbFooterNav("driver", "home"),
  });
}

function renderShortHaulPage(variant = "booking") {
  const activeRoute = `#/driver/short-haul/${variant}`;
  const bookingDates = [
    { key: "今天", label: "今天" },
    { key: "明天", label: "明天" },
    { key: "后天", label: "后天" },
  ];
  const bookingTimes = [
    { key: "09:00", label: "09:00" },
    { key: "09:30", label: "09:30" },
    { key: "10:00", label: "10:00" },
    { key: "10:30", label: "10:30" },
    { key: "11:00", label: "11:00(满)", disabled: true },
    { key: "11:30", label: "11:30" },
    { key: "13:00", label: "13:00" },
    { key: "13:30", label: "13:30" },
    { key: "14:00", label: "14:00" },
    { key: "15:00", label: "15:00" },
    { key: "15:30", label: "15:30" },
  ];
  const pointsRules = [
    "短途送客赋分",
    "复载进场消分",
    "月度奖励积分",
    "违规扣分",
  ];

  const bodyMap = {
    booking: `
      <section class="ab-page-section">
        <div class="ab-tip-card soft">
          <strong>短途复载规则</strong>
          <p>1 送客至车站5km范围内 · 2 获得+3复载积分 · 3 预约时段免排队进场</p>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("目标车站")}
        <button class="ab-target-card" data-toast="北京西站（原型演示）">
          <span class="ab-target-icon">${iconMarkup("pin")}</span>
          <span class="ab-target-copy">
            <strong>北京西站</strong>
            <em>丰台区莲花池东路118号</em>
          </span>
          <i>›</i>
        </button>
      </section>

      <section class="ab-page-section">
        <div class="ab-panel">
          ${renderSectionTitle("选择预约日期")}
          ${renderSelectableGrid(bookingDates, { activeValue: state.selected.bookingDate || "今天", selectKey: "bookingDate", cols: 3 })}
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-panel">
          ${renderSectionTitle("选择进场时段")}
          ${renderSelectableGrid(bookingTimes, { activeValue: state.selected.bookingTime || "09:00", selectKey: "bookingTime", cols: 4 })}
        </div>
      </section>

      <section class="ab-page-section" id="short-haul-more">
        <button class="ab-primary-button" data-toast="确认预约（消耗2分）">确认预约（消耗2分）</button>
      </section>
    `,
    history: `
      <section class="ab-page-section">
        <div class="ab-record-list">
          ${shortHaulHistory.map(renderJourneyCard).join("")}
        </div>
      </section>
    `,
    points: `
      <section class="ab-page-section">
        <div class="ab-tip-card soft">
          <strong>积分规则说明</strong>
          <p>短途送客赋分、复载进场消分、月度奖励积分、违规扣分。</p>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("累计积分")}
        ${renderStatGrid([{ value: "48", label: "当前积分", tone: "primary" }, { value: "+27", label: "本月获得", tone: "success" }, { value: "24次", label: "可复载次数", tone: "warning" }])}
      </section>

      <section class="ab-page-section">
        <div class="ab-info-list">
          ${pointsRules
            .map(
              (label) => `
                <button class="ab-info-row" data-toast="${label}（原型演示）">
                  <span class="ab-info-row-left">
                    <span class="ab-info-icon">${iconMarkup("scan")}</span>
                    <span><strong>${label}</strong></span>
                  </span>
                  <span class="ab-info-row-right"><i>›</i></span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="ab-page-section" id="short-haul-records">
        ${renderSectionTitle("最近积分记录")}
        <div class="ab-record-list">
          ${shortHaulPoints.map(renderJourneyCard).join("")}
        </div>
      </section>
    `,
  };

  return renderAppShell({
    className: "ab-short-haul-page",
    topbar: renderAppTopbar({
      title: "短途复载",
      backTo: "#/driver/queue",
      action: `<button class="ab-topbar-action" data-toast="规则说明（原型演示）">规则</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderStatGrid([
          { value: "+3分", label: "短途赋分", tone: "success" },
          { value: "-2分", label: "复载消分", tone: "danger" },
          { value: "48分", label: "当前积分", tone: "primary" },
        ])}
      </section>

      <section class="ab-page-section">
        ${renderSelectableGrid(shortHaulTabs, { activeValue: activeRoute, cols: 3 })}
      </section>

      ${bodyMap[variant] || bodyMap.booking}
    `,
    footer: renderAbFooterNav("driver", "short"),
  });
}

function renderTaxiHousePage(variant = "info") {
  const activeRoute = `#/driver/taxi-house/${variant}`;
  const bodyMap = {
    info: `
      <section class="ab-page-section">
        ${renderSectionTitle("基本信息")}
        <div class="ab-panel">
          <button class="ab-house-location-card" data-toast="北京西站的士之家（原型演示）">
            <span class="ab-house-location-icon">${iconMarkup("pin")}</span>
            <span class="ab-house-location-copy">
              <strong>北京西站的士之家</strong>
              <em>出租车候客区服务楼2层</em>
            </span>
            <i>›</i>
          </button>
          ${renderInfoRows([
            { icon: "pin", label: "地址：北京西站出租车候客区服务楼2F", toast: "地址" },
            { icon: "clock", label: "开放时间：06:00 - 22:00（全年无休）", toast: "开放时间" },
            { icon: "user", label: "可容纳：约50名司机同时休息", toast: "容纳量" },
          ])}
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("提供服务")}
        ${renderSelectableGrid(taxiHouseServices, { cols: 3 })}
      </section>

      <section class="ab-page-section" id="taxi-house-review">
        ${renderSectionTitle("司机评价", `<span class="ab-section-link">4.8（328评价）</span>`)}
        <div class="ab-review-list">
          ${taxiHouseReviews.map(renderTaxiHouseReviewCard).join("")}
        </div>
      </section>
    `,
    meal: `
      <section class="ab-page-section">
        <div class="ab-tip-card soft">
          <strong>今日菜单 · 供应至 20:30</strong>
          <p>营业中</p>
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-meal-list">
          ${taxiHouseMeals.map(renderTaxiHouseMealCard).join("")}
        </div>
      </section>
    `,
    redeem: `
      <section class="ab-page-section">
        <div class="ab-redeem-summary">
          <div>
            <strong>我的积分</strong>
            <b>48</b>
          </div>
          <p>积分来源：短途复载赋分<br>本月获得 +27 积分</p>
        </div>
      </section>

      <section class="ab-page-section">
        <div class="ab-reward-grid">
          ${taxiHouseRewards.map(renderTaxiHouseRewardCard).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="taxi-house-notes">
        ${renderSectionTitle("兑换须知")}
        <div class="ab-tip-card soft">
          <ul class="ab-note-list">
            <li>积分兑换商品须在的士之家现场提货</li>
            <li>每位司机每月可兑换同类商品不超过3次</li>
            <li>兑换后积分立即扣除，不支持退换</li>
          </ul>
        </div>
      </section>
    `,
  };

  return renderAppShell({
    className: "ab-taxi-house-page",
    topbar: renderAppTopbar({
      title: "的士之家",
      backTo: "#/driver/queue",
      action: `<button class="ab-topbar-action" data-toast="48积分（原型演示）">48积分</button>`,
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-house-hero">
          <div class="ab-house-hero-copy">
            <strong>北京西站 · 司机专属服务中心</strong>
            <div class="ab-house-density">
              <span>当前休息司机密度</span>
              <b>78%</b>
              <em>较多 · 容量约128人</em>
            </div>
          </div>
          <div class="ab-house-progress">
            <span></span>
          </div>
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSelectableGrid(taxiHouseTabs, { activeValue: activeRoute, cols: 3 })}
      </section>

      ${bodyMap[variant] || bodyMap.info}
    `,
    footer: renderAbFooterNav("driver", "house"),
  });
}

function renderFeatureRoute(current) {
  if (current === "#/station/home") return renderStationHome();
  if (current === "#/nav/map") return renderNavigationPage("map");
  if (current === "#/nav/map3d") return renderNavigationPage("map3d");
  if (current === "#/nav/ar") return renderNavigationPage("ar");
  if (current === "#/nav/route") return renderNavigationPage("route");
  if (current === "#/announcements") return renderAnnouncementsPage("top");
  if (current === "#/announcements/more") return renderAnnouncementsPage("more");
  if (current === "#/traffic/taxi") return renderTrafficPage("taxi");
  if (current === "#/traffic/ride") return renderTrafficPage("ride");
  if (current === "#/traffic/metro") return renderTrafficPage("metro");
  if (current === "#/traffic/bus") return renderTrafficPage("bus");
  if (current === "#/traffic/mixed") return renderTrafficPage("mixed");
  if (current === "#/traffic/other") return renderTrafficPage("other");
  if (current === "#/parking/list") return renderParkingPage("list");
  if (current === "#/parking/list-more") return renderParkingPage("list");
  if (current === "#/parking/price") return renderParkingPage("price");
  if (current === "#/driver/queue") return renderDriverQueuePage("top");
  if (current === "#/driver/queue/mid") return renderDriverQueuePage("mid");
  if (current === "#/driver/queue/right") return renderDriverQueuePage("right");
  if (current === "#/driver/station/beijing") return renderDriverStationPage("beijing", "queue");
  if (current === "#/driver/station/beijing-map") return renderDriverStationPage("beijing", "map");
  if (current === "#/driver/station/west") return renderDriverStationPage("west", "queue");
  if (current === "#/driver/short-haul/booking") return renderShortHaulPage("booking");
  if (current === "#/driver/short-haul/booking-more") return renderShortHaulPage("booking");
  if (current === "#/driver/short-haul/history") return renderShortHaulPage("history");
  if (current === "#/driver/short-haul/points") return renderShortHaulPage("points");
  if (current === "#/driver/short-haul/points-more") return renderShortHaulPage("points");
  if (current === "#/driver/taxi-house/info") return renderTaxiHousePage("info");
  if (current === "#/driver/taxi-house/info-more") return renderTaxiHousePage("info");
  if (current === "#/driver/taxi-house/meal") return renderTaxiHousePage("meal");
  if (current === "#/driver/taxi-house/redeem") return renderTaxiHousePage("redeem");
  if (current === "#/driver/taxi-house/redeem-more") return renderTaxiHousePage("redeem");
  if (current === "#/feedback/submit") return renderFeedbackSubmitPage("top");
  if (current === "#/feedback/submit-more") return renderFeedbackSubmitPage("more");
  if (current === "#/feedback/mine") return renderFeedbackMinePage();
  if (current === "#/feedback/mine-more") return renderFeedbackMinePage();
  if (current === "#/profile") return renderTravelerProfilePage();
  if (current === "#/profile-more") return renderTravelerProfilePage();
  if (current === "#/driver/profile") return renderDriverProfilePage();
  if (current === "#/driver/profile-more") return renderDriverProfilePage();
  if (current === "#/driver/profile-bottom") return renderDriverProfilePage();
  return null;
}

function renderSplash() {
  return `
    <div class="splash-shell">
      <button class="splash-trigger" data-to="#/station/select" aria-label="进入站区选择">
        <img class="splash-full-image" src="${IMG}P04-01_开屏页.png" alt="到站北京">
      </button>
    </div>
  `;
}

function renderSourcePage(page) {
  const source = `${IMG}${page.src}`;
  return `
    <div class="source-screen">
      <div class="source-phone">
        <img class="source-img" src="${source}" alt="${page.src}">
        ${renderOverlays(page)}
        ${(page.hotspots || []).map(renderHotspot).join("")}
        ${renderSelectionMarkers(page)}
        ${renderCounterMarkers(page)}
      </div>
    </div>
  `;
}

function renderStationSelect(kind) {
  const isSwitch = kind === "switch";
  const title = "选择出行站点";
  const buttonText = isSwitch ? "确认更改" : "确认选择";
  const selected = stationById(state.draftStation);
  const orderedStations = [selected, ...stations.filter((station) => station[0] !== selected[0])];

  if (!isSwitch) {
    return `
      <div class="source-screen custom-station-screen">
        <div class="custom-topbar">
          <button class="plain-back" data-to="#/splash">‹</button>
          <strong>${title}</strong>
          <span></span>
        </div>
        <div class="station-grid-source">
          ${stations
            .map(
              ([id, name, src]) => `
                <button class="station-tile ${state.draftStation === id ? "active" : ""}" data-station="${id}">
                  <img src="${src}" alt="${name}">
                  <span>${name}</span>
                </button>`
            )
            .join("")}
        </div>
        <div class="confirm-bar">
          <button class="confirm-button" data-confirm-station>${buttonText}</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="source-screen custom-station-screen">
      <div class="custom-topbar">
        <button class="plain-back" data-to="#/station/home">‹</button>
        <strong>${title}</strong>
        <span></span>
      </div>
      <div class="station-carousel" aria-label="左右滑动选择站点">
        ${orderedStations
          .map(
            ([id, name, src]) => `
              <button class="station-slide ${state.draftStation === id ? "active" : ""}" data-station="${id}">
                <img src="${src}" alt="${name}">
                <strong>${name}</strong>
              </button>`
          )
          .join("")}
      </div>
      <div class="confirm-bar">
        <button class="confirm-button" data-confirm-station>${buttonText}</button>
      </div>
    </div>
  `;
}

function renderAnchorTopbar({ title, refresh = false, settings = false, backTo = "#/driver/queue" }) {
  return `
    <header class="anchor-topbar">
      <button class="anchor-back" data-to="${backTo}" aria-label="返回">${anchorIcon("back")}</button>
      <h1>${title}</h1>
      ${
        refresh
          ? `<button class="anchor-refresh" data-toast="已刷新">${anchorIcon("refresh")}<span>刷新</span></button>`
          : settings
          ? `<button class="anchor-settings" data-toast="设置功能暂未接入" aria-label="设置">${anchorIcon("settings")}</button>`
          : `<span class="anchor-topbar-spacer"></span>`
      }
    </header>
  `;
}

function renderAnchorBottomNav(kind, activeKey) {
  const items =
    kind === "driver"
      ? [
          ["home", "首页", "home"],
          ["short", "短途复载", "taxi"],
          ["house", "的士之家", "handshake"],
          ["profile", "身份", "user"],
        ]
      : [
          ["home", "首页", "home"],
          ["notice", "公告", "megaphone"],
          ["nav", "导航", "map"],
          ["traffic", "交通", "bus"],
          ["profile", "身份", "user"],
        ];

  return `
    <nav class="anchor-bottom-nav ${kind === "traveler" ? "five" : "four"}" aria-label="底部导航">
      ${items
        .map(
          ([key, label, icon]) => `
            <button class="anchor-nav-item ${activeKey === key ? "active" : ""}" data-toast="${label}（原型演示）">
              ${anchorIcon(icon)}
              <span>${label}</span>
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderAnchorStatus(status, tone) {
  return `<span class="anchor-status ${tone}">${status}</span>`;
}

function renderStyleAnchorList() {
  return `
    <div class="anchor-page anchor-list-page with-nav">
      ${renderAnchorTopbar({ title: "车站排队情况", refresh: true })}
      <section class="anchor-search-box">${anchorIcon("search")}<span>搜索车站名称</span></section>
      <section class="anchor-status-grid" aria-label="拥堵状态">
        <button class="anchor-status-filter green">${anchorIcon("people")}<span>畅通</span></button>
        <button class="anchor-status-filter amber">${anchorIcon("people")}<span>正常</span></button>
        <button class="anchor-status-filter red">${anchorIcon("people")}<span>拥挤</span></button>
      </section>
      <section class="anchor-segment-grid" aria-label="站点类型">
        <button class="anchor-segment active">全部</button>
        <button class="anchor-segment">火车站</button>
        <button class="anchor-segment">机场</button>
      </section>
      <section class="anchor-table-head">
        <strong>10个站点</strong>
        <span>排队旅客</span>
        <span>候车数量</span>
        <span>预计等候</span>
      </section>
      <section class="anchor-list-card">
        ${anchorQueueStations
          .map(
            (item) => `
              <button class="anchor-queue-row" data-to="#/style-anchor/03-detail">
                <span class="anchor-station-icon ${item.type}">${anchorIcon(item.type)}</span>
                <strong>${item.name}</strong>
                ${renderAnchorStatus(item.status, item.tone)}
                <span>${item.passengers}</span>
                <span>${item.vehicles}</span>
                <span>${item.wait}</span>
                <span class="anchor-chevron">›</span>
              </button>
            `
          )
          .join("")}
      </section>
      ${renderAnchorBottomNav("driver", "home")}
    </div>
  `;
}

function renderQueueBlock({ title, tone, amount, wait, filled }) {
  return `
    <button class="anchor-yard-card" data-toast="${title}（原型演示）">
      <div class="anchor-yard-top">
        <div>
          <h3>${title}</h3>
          <p><span class="anchor-dot ${tone}"></span>排队中</p>
        </div>
        <div class="anchor-yard-metric ${tone}">
          <strong>${amount}</strong><span>辆</span>
          <small>预计等候 ${wait}</small>
        </div>
      </div>
      <div class="anchor-car-meter ${tone}">
        ${Array.from({ length: 12 })
          .map((_, index) => `<span class="${index < filled ? "filled" : ""}"></span>`)
          .join("")}
      </div>
      <div class="anchor-yard-foot">
        <span>${anchorIcon("car")}</span>
        <p>排队车辆较多，请耐心等候</p>
        <strong>›</strong>
      </div>
    </button>
  `;
}

function renderStyleAnchorDetail() {
  return `
    <div class="anchor-page anchor-detail-page with-nav">
      <header class="anchor-detail-hero">
        <button class="anchor-back detail-back" data-to="#/style-anchor/02-list" aria-label="返回">${anchorIcon("back")}</button>
        <div>
          <h1>北京站</h1>
          <p>${anchorIcon("pin")}<span>东城区毛家湾胡同甲13号</span></p>
        </div>
        <button class="anchor-nav-button" data-toast="导航功能暂未接入">${anchorIcon("pin")}<span>导航</span></button>
      </header>

      <section class="anchor-stat-card">
        <div class="anchor-stat-item blue">
          <div class="anchor-stat-head">${anchorIcon("user")}<span>候乘旅客</span></div>
          <div class="anchor-stat-value"><strong>286</strong><em>人</em></div>
        </div>
        <div class="anchor-stat-item green">
          <div class="anchor-stat-head">${anchorIcon("car")}<span>排队车辆</span></div>
          <div class="anchor-stat-value"><strong>48</strong><em>辆</em></div>
        </div>
        <div class="anchor-stat-item amber">
          <div class="anchor-stat-head">${anchorIcon("clock")}<span>最长等候</span></div>
          <div class="anchor-stat-value"><strong>28</strong><em>分钟</em></div>
        </div>
      </section>

      <section class="anchor-tabs-card">
        <div class="anchor-large-tabs">
          <button class="active">实时排队</button>
          <button data-toast="场区地图（原型演示）">场区地图</button>
        </div>
        <div class="anchor-yard-list">
          ${renderQueueBlock({ title: "出租车蓄车区A", tone: "green", amount: "18", wait: "22 分钟", filled: 8 })}
          ${renderQueueBlock({ title: "出租车蓄车区B", tone: "amber", amount: "30", wait: "35 分钟", filled: 8 })}
          <button class="anchor-booking-banner" data-to="#/style-anchor/05-completion">
            <span class="anchor-calendar-badge">${anchorIcon("calendar")}</span>
            <span><strong>短途复载免排队</strong><em>提前预约，免排队快速进场</em></span>
            <b>立即预约</b>
            <i>›</i>
          </button>
          <button class="anchor-house-row" data-toast="的士之家（原型演示）">
            <span>${anchorIcon("home")}</span>
            <span><strong>的士之家</strong><em>休息、餐饮、积分兑换</em></span>
            <i>›</i>
          </button>
        </div>
      </section>
      ${renderAnchorBottomNav("driver", "home")}
    </div>
  `;
}

function renderStyleAnchorForm() {
  const feedbackTypes = [
    ["angry", "投诉", "active"],
    ["edit", "建议", ""],
    ["question", "咨询", ""],
    ["thumb", "表扬", ""],
  ];
  const categories = ["站内设施", "出租车", "网约车", "地铁", "停车场", "工作人员", "安全问题", "其他"];
  return `
    <div class="anchor-page anchor-form-page with-nav">
      ${renderAnchorTopbar({ title: "投诉与建议", backTo: "#/station/home" })}
      <section class="anchor-two-tabs">
        <button class="active">提交反馈</button>
        <button data-toast="我的反馈（原型演示）">我的反馈</button>
      </section>
      <section class="anchor-form-card">
        <div class="anchor-form-block">
          <h2>反馈类型</h2>
          <div class="anchor-type-grid">
            ${feedbackTypes
              .map(
                ([icon, label, active]) => `
                  <button class="${active}" data-toast="${label}（原型演示）">${anchorIcon(icon)}<span>${label}</span></button>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="anchor-form-block">
          <h2>问题分类</h2>
          <div class="anchor-category-grid">
            ${categories
              .map((label) => `<button class="${label === "出租车" ? "active" : ""}" data-toast="${label}（原型演示）">${label}</button>`)
              .join("")}
          </div>
        </div>
        <div class="anchor-form-block">
          <h2>反馈内容</h2>
          <div class="anchor-textarea">
            <span>请详细描述您遇到的问题或建议（必填，至少20字）</span>
            <em>0/500</em>
          </div>
        </div>
        <div class="anchor-upload-head">
          <h2>请上传图片</h2>
          <span>最多4张</span>
        </div>
        <button class="anchor-upload-box" data-toast="图片上传（原型演示）">+</button>
      </section>
      <button class="anchor-submit-button" data-toast="提交反馈（原型演示）">提交反馈</button>
      ${renderAnchorBottomNav("traveler", "home")}
    </div>
  `;
}

function renderStyleAnchorCompletion() {
  return `
    <div class="anchor-page anchor-success-page with-nav">
      <section class="anchor-success-card">
        <span class="anchor-success-icon">${anchorIcon("check")}</span>
        <h1>预约成功</h1>
        <div class="anchor-success-list">
          <button>${anchorIcon("pin")}<span>北京西站</span><i>›</i></button>
          <button>${anchorIcon("calendar")}<span>今天</span><i>›</i></button>
          <button>${anchorIcon("clock")}<span>09:00</span><i>›</i></button>
        </div>
        <p class="anchor-consume">${anchorIcon("check")}<span>已消耗2分</span></p>
        <div class="anchor-success-actions">
          <button class="outline" data-to="#/style-anchor/02-list">返回首页</button>
          <button class="primary" data-to="#/style-anchor/03-detail">继续预约</button>
        </div>
      </section>
      ${renderAnchorBottomNav("driver", "home")}
    </div>
  `;
}

function renderStyleAnchorLoading() {
  return `
    <div class="anchor-page anchor-loading-page with-nav">
      <section class="anchor-loader-brand">
        <span class="anchor-app-logo">${anchorIcon("plane")}${anchorIcon("train")}</span>
        <h1>到站北京</h1>
        <p>站区畅行服务</p>
        <div class="anchor-loading-state">
          <span></span>
          <strong>加载中</strong>
          <em>请稍候</em>
        </div>
      </section>
      <section class="anchor-skeleton-card" aria-label="加载骨架屏">
        <div class="sk-line long"></div>
        <div class="sk-mini-grid">
          ${Array.from({ length: 4 })
            .map(() => `<div class="sk-mini"><span></span><i></i><b></b></div>`)
            .join("")}
        </div>
        <div class="sk-banner"><span></span><i></i><b></b></div>
        <div class="sk-title"></div>
        <div class="sk-list">
          ${Array.from({ length: 3 })
            .map(() => `<div class="sk-row"><span></span><i></i><b></b></div>`)
            .join("")}
        </div>
        <div class="sk-foot"></div>
      </section>
      ${renderAnchorBottomNav("traveler", "home")}
    </div>
  `;
}

function renderStyleAnchorProfile() {
  const groups = [
    [
      ["message", "消息通知", ""],
      ["globe", "语言 / Language", "简体中文"],
      ["accessibility", "无障碍模式", ""],
    ],
    [["shield", "账号安全", ""]],
    [["lock", "隐私设置", ""]],
    [["ear", "无障碍辅助", ""]],
  ];

  return `
    <div class="anchor-page anchor-profile-page with-nav">
      ${renderAnchorTopbar({ title: "个人中心", settings: true, backTo: "#/station/home" })}
      <button class="anchor-user-card" data-toast="个人资料（原型演示）">
        <span class="anchor-avatar"></span>
        <span><strong>杜**</strong><em>138****5678</em></span>
        <i>›</i>
      </button>
      ${groups
        .map(
          (group, groupIndex) => `
            <section class="anchor-menu-card">
              ${groupIndex > 0 ? `<h2>${groupIndex === 1 ? "安全" : groupIndex === 2 ? "隐私设置" : "无障碍辅助"}</h2>` : ""}
              ${group
                .map(
                  ([icon, label, value]) => `
                    <button class="anchor-menu-row" data-toast="${label}（原型演示）">
                      <span class="anchor-menu-left">${anchorIcon(icon)}<b>${label}</b></span>
                      <span class="anchor-menu-right">${value ? `<em>${value}</em>` : ""}<i>›</i></span>
                    </button>
                  `
                )
                .join("")}
            </section>
          `
        )
        .join("")}
      <button class="anchor-logout" data-toast="退出登录（原型演示）">${anchorIcon("scan")}<span>退出登录</span></button>
      <p class="anchor-version">到站北京 · 旅客端 v1.1.0<br>北京市重点站区管委会</p>
      ${renderAnchorBottomNav("traveler", "profile")}
    </div>
  `;
}

function renderStyleAnchorModal() {
  return `
    <div class="anchor-page anchor-modal-page">
      <section class="anchor-modal-underlay">
        <header>
          <h1>杜**，您好！</h1>
          <button>${anchorIcon("pin")}<span>选择地区</span><i>⌄</i></button>
        </header>
        <div class="anchor-modal-search">
          <span>${anchorIcon("search")}<em>搜索服务、事项</em></span>
          <button>${anchorIcon("scan")}<b>扫一扫</b></button>
        </div>
        <div class="anchor-modal-shortcuts">
          ${[
            ["id", "亮证"],
            ["qr", "京通码"],
            ["chat", "消息"],
            ["grid", "全部服务"],
          ]
            .map(([icon, label]) => `<span>${anchorIcon(icon)}<b>${label}</b></span>`)
            .join("")}
        </div>
        <div class="anchor-modal-recommend">
          <h2>为您推荐</h2><span>我的定制 ›</span>
          <div></div><div></div><div></div>
        </div>
      </section>
      <section class="anchor-station-sheet">
        <span class="anchor-sheet-handle"></span>
        <h1>选择出行站点</h1>
        <div class="anchor-sheet-grid">
          ${anchorQueueStations
            .map(
              (item, index) => `
                <button class="${index === 0 ? "active" : ""}" data-toast="${item.name}（原型演示）">
                  ${anchorIcon(item.type)}
                  <span>${item.name}</span>
                  ${index === 0 ? `<i>${anchorIcon("check")}</i>` : ""}
                </button>
              `
            )
            .join("")}
        </div>
        <button class="anchor-sheet-confirm" data-toast="确认更改（原型演示）">确认更改</button>
        <button class="anchor-sheet-cancel" data-toast="取消（原型演示）">取消</button>
      </section>
    </div>
  `;
}

function renderStyleAnchorPage(kind) {
  if (kind === "list") return renderStyleAnchorList();
  if (kind === "detail") return renderStyleAnchorDetail();
  if (kind === "form") return renderStyleAnchorForm();
  if (kind === "completion") return renderStyleAnchorCompletion();
  if (kind === "loading") return renderStyleAnchorLoading();
  if (kind === "profile") return renderStyleAnchorProfile();
  if (kind === "modal") return renderStyleAnchorModal();
  return renderStyleAnchorList();
}

function render() {
  const current = route();
  const styleAnchorKind = styleAnchorRoutes[current];
  app.className = styleAnchorKind
    ? "app-shell anchor-app"
    : current === designSystemRoute
    ? "app-shell design-system-app"
    : "app-shell";
  if (styleAnchorKind) {
    state.currentSurface = current;
    app.innerHTML = renderStyleAnchorPage(styleAnchorKind);
    syncDesktopPreviewFrame();
    requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  if (current === designSystemRoute) {
    state.currentSurface = current;
    app.innerHTML = renderDesignSystem();
    syncDesktopPreviewFrame();
    requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  const featurePage = renderFeatureRoute(current);
  if (featurePage) {
    state.currentSurface = current;
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = featurePage;
    syncDesktopPreviewFrame();
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        const anchor = routeScrollTargets[current];
        if (anchor) scrollToSection(anchor);
      }, 0);
    });
    return;
  }
  if (current === "#/splash") {
    state.currentSurface = current;
    app.innerHTML = renderSplash();
    syncDesktopPreviewFrame();
    return;
  }
  if (current === "#/services") {
    state.currentSurface = current;
    app.innerHTML = renderServices();
    syncDesktopPreviewFrame();
    requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  if (current === "#/station/select") {
    state.currentSurface = current;
    app.innerHTML = renderStationSelect("select");
    syncDesktopPreviewFrame();
    return;
  }
  if (current === "#/station/switch") {
    if (state.currentSurface !== current) {
      state.draftStation = state.station;
    }
    state.currentSurface = current;
    app.innerHTML = renderStationSelect("switch");
    syncDesktopPreviewFrame();
    return;
  }
  state.currentSurface = current;
  const page = pages[current] || pages["#/portal"];
  app.innerHTML = renderSourcePage(page);
  syncDesktopPreviewFrame();
}

document.addEventListener("click", (event) => {
  const selectionButton = event.target.closest("[data-select-key]");
  if (selectionButton) {
    event.preventDefault();
    state.selected[selectionButton.dataset.selectKey] = selectionButton.dataset.selectValue;
    render();
    return;
  }

  const serviceCategoryButton = event.target.closest("[data-service-category]");
  if (serviceCategoryButton) {
    event.preventDefault();
    state.selected.servicesCategory = serviceCategoryButton.dataset.serviceCategory;
    state.selected.servicesSection = serviceCategoryButton.dataset.serviceSection || "traffic";
    render();
    requestAnimationFrame(() => scrollServicesSection(state.selected.servicesSection || "traffic"));
    return;
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) {
    event.preventDefault();
    showToast(toastButton.dataset.toast || "原型功能暂未接入");
    return;
  }

  const counterButton = event.target.closest("[data-counter-key]");
  if (counterButton) {
    event.preventDefault();
    const key = counterButton.dataset.counterKey;
    const delta = Number(counterButton.dataset.counterDelta);
    state.counters[key] = Math.max(0, Math.min(9, (state.counters[key] || 0) + delta));
    render();
    return;
  }

  const to = event.target.closest("[data-to]");
  if (to) {
    event.preventDefault();
    go(to.dataset.to);
    return;
  }

  const stationButton = event.target.closest("[data-station]");
  if (stationButton) {
    event.preventDefault();
    state.draftStation = stationButton.dataset.station;
    render();
    return;
  }

  if (event.target.closest("[data-confirm-station]")) {
    state.station = state.draftStation;
    localStorage.setItem("arrive-beijing.station", state.station);
    go("#/station/home");
  }
});

window.addEventListener("hashchange", render);
window.addEventListener("resize", syncDesktopPreviewFrame);
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/portal";
  render();
});
