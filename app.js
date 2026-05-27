const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const IMG = "extracted_screenshots/";

const stations = [
  ["beijing", "北京站"],
  ["west", "北京西站"],
  ["south", "北京南站"],
  ["north", "北京北站"],
  ["qinghe", "清河站"],
  ["chaoyang", "朝阳站"],
  ["fengtai", "丰台站"],
  ["tongzhou", "通州站"],
  ["capital", "首都机场"],
  ["daxing", "大兴机场"],
];

const stationHeroAssets = {
  beijing: "assets/bitmap/stations-v3/beijing.webp",
  west: "assets/bitmap/stations-v3/west.webp",
  south: "assets/bitmap/stations-v3/south.webp",
  north: "assets/bitmap/stations-v3/north.webp",
  qinghe: "assets/bitmap/stations-v3/qinghe.webp",
  chaoyang: "assets/bitmap/stations-v3/chaoyang.webp",
  fengtai: "assets/bitmap/stations-v3/fengtai.webp",
  tongzhou: "assets/bitmap/stations-v3/tongzhou.webp",
  capital: "assets/bitmap/stations-v3/capital.webp",
  daxing: "assets/bitmap/stations-v3/daxing.webp",
};

const stationPortraitAssets = {
  beijing: "assets/bitmap/stations-v3/beijing.webp",
  west: "assets/bitmap/stations-v3/west.webp",
  south: "assets/bitmap/stations-v3/south.webp",
  north: "assets/bitmap/stations-v3/north.webp",
  qinghe: "assets/bitmap/stations-v3/qinghe.webp",
  chaoyang: "assets/bitmap/stations-v3/chaoyang.webp",
  fengtai: "assets/bitmap/stations-v3/fengtai.webp",
  tongzhou: "assets/bitmap/stations-v3/tongzhou.webp",
  capital: "assets/bitmap/stations-v3/capital.webp",
  daxing: "assets/bitmap/stations-v3/daxing.webp",
};

const stationIconNames = {
  beijing: "station_beijing",
  west: "station_west",
  south: "station_south",
  north: "station_north",
  qinghe: "station_qinghe",
  chaoyang: "station_chaoyang",
  fengtai: "station_fengtai",
  tongzhou: "station_tongzhou",
  capital: "station_capital",
  daxing: "station_daxing",
};

const storedStation = localStorage.getItem("arrive-beijing.station");
const initialStation = storedStation === "yizhuang" ? "fengtai" : storedStation || "west";
if (storedStation === "yizhuang") {
  localStorage.setItem("arrive-beijing.station", initialStation);
}

const navigationVisualAssets = {
  map: "assets/bitmap/navigation/v4/nav-flat-base.webp",
  map3d: "assets/bitmap/navigation/v4/nav-3d-overview.webp",
  ar: "assets/bitmap/navigation/v4/nav-ar-guide.webp",
  floors: {
    B1: "assets/bitmap/navigation/v4/nav-flat-b1.webp",
    F1: "assets/bitmap/navigation/v4/nav-flat-f1.webp",
    F2: "assets/bitmap/navigation/v4/nav-flat-f2.webp",
    F3: "assets/bitmap/navigation/v4/nav-flat-f3.webp",
  },
};

const splashImageSets = {
  traveler: ["assets/bitmap/splash/passenger-01.webp", "assets/bitmap/splash/passenger-02.webp"],
  driver: ["assets/bitmap/splash/driver-01.webp", "assets/bitmap/splash/driver-02.webp"],
};

const state = {
  station: initialStation,
  draftStation: initialStation,
  currentSurface: null,
  previousRoute: null,
  shortHaulBackTo: "#/driver/queue",
    selected: {
      navFloor: "F1",
      navFocus: "restroom",
      nav3dLayer: "overview",
      announcementCategory: "全部",
      trafficSearchResult: false,
      trafficQuery: "北京大学",
      feedbackType: "投诉",
      feedbackCategory: "出租车",
      bookingDate: "今天",
      bookingTime: "09:00",
      shortHaulStation: "south",
      shortHaulArea: "",
      shortHaulDispatch: "",
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

let stationScrollTimer = null;

const travelerBottomNavItems = [
  { key: "home", label: "首页", icon: "home", to: "#/station/home" },
  { key: "nav", label: "导航", icon: "map", to: "#/nav/map" },
  { key: "traffic", label: "交通", icon: "route", to: "#/traffic/mixed" },
  { key: "announcements", label: "公告", icon: "notice", to: "#/announcements" },
  { key: "profile", label: "个人", icon: "user", to: "#/profile" },
];

const stationHomeAnnouncements = [
  { tag: "紧急", text: "北京西站南广场施工，请绕行南广场进站", to: "#/announcements" },
  { tag: "提示", text: "今日有暴雨蓝色预警，出门请注意带伞", to: "#/announcements" },
  { tag: "通知", text: "今明两日大风橙色预警，出行请注意安全", to: "#/announcements" },
];

const stationAnnouncementOverrides = {
  south: [
    { tag: "紧急", text: "北京南站北广场施工，请绕行南广场进站", to: "#/announcements" },
    { tag: "提示", text: "今日有暴雨蓝色预警，出门请注意带伞", to: "#/announcements" },
    { tag: "通知", text: "今明两日大风橙色预警，出行请注意安全", to: "#/announcements" },
  ],
};

const stationHomeServices = [
  { label: "站内导航", icon: "map", to: "#/nav/map", bg: "#dceeff", fg: "#2e7de1" },
  { label: "交通接驳", icon: "route", to: "#/traffic/mixed", bg: "#efddff", fg: "#a24ac2" },
  { label: "场站换乘", icon: "transfer", to: "#/station-transfer/select", bg: "#e6eb9f", fg: "#8f9f1b" },
  { label: "自驾停车", icon: "parking", to: "#/parking/list", bg: "#e4f2d6", fg: "#6aa84f" },
  { label: "站区公告", icon: "notice", to: "#/announcements", bg: "#ffe8b8", fg: "#f0a423" },
  { label: "站内服务", icon: "grid", to: "#/station/services", bg: "#eef0ff", fg: "#5261d6" },
  { label: "短途复载", icon: "taxi", to: "#/driver/short-haul/booking", bg: "#d7f3f9", fg: "#1fa7c2" },
  { label: "投诉建议", icon: "feedback", to: "#/feedback/submit", bg: "#f6ddd9", fg: "#e5474d" },
];

const stationServiceItems = [
  { label: "站内引导", icon: "map", toast: "站内引导（原型演示）" },
  { label: "进出站须知", icon: "book", toast: "进出站须知（原型演示）" },
  { label: "候车室引导", icon: "lounge", toast: "候车室引导（原型演示）" },
  { label: "售票机自助取票", icon: "paper", toast: "售票机自助取票（原型演示）" },
  { label: "行包托运、提取、寄存", icon: "gift", toast: "行包托运、提取、寄存（原型演示）" },
  { label: "志愿服务", icon: "handshake", toast: "志愿服务（原型演示）" },
  { label: "预约服务", icon: "calendar", toast: "预约服务（原型演示）" },
  { label: "警务站", icon: "shield", toast: "警务站（原型演示）" },
  { label: "医疗站", icon: "medical", toast: "医疗站（原型演示）" },
  { label: "献血站", icon: "medical", toast: "献血站（原型演示）" },
  { label: "餐饮服务", icon: "dining", toast: "餐饮服务（原型演示）" },
  { label: "问询服务", icon: "phone", to: "#/station/services/inquiry" },
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

const supportContactRows = [
  { icon: "phone", label: "旅客服务热线", value: "010-51849000", toast: "旅客服务热线" },
  { icon: "feedback", label: "投诉举报电话", value: "12306", toast: "投诉举报电话" },
  { icon: "phone", label: "指挥中心电话", value: "51867132", toast: "指挥中心电话" },
  { icon: "mail", label: "监督投诉邮箱", value: "service@bjstation.com", toast: "监督投诉邮箱" },
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
  { value: "50", label: "当前积分", tone: "success" },
  { value: "3,852", label: "累计接单", tone: "warning" },
  { value: "48.6万", label: "累计里程", tone: "danger" },
];

const driverProfileSections = [
  {
    title: "常用功能",
    rows: [
      { icon: "message", label: "消息通知", value: "", toast: "消息通知（原型演示）" },
      { icon: "points", label: "我的积分", value: "", to: "#/driver/short-haul/points" },
      { icon: "history", label: "行程历史", value: "", to: "#/driver/short-haul/history" },
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
  { type: "train", name: "清河站", status: "正常", tone: "amber", passengers: "215 人", vehicles: "3,210 人", wait: "18 分钟" },
  { type: "train", name: "朝阳站", status: "拥挤", tone: "red", passengers: "692 人", vehicles: "6,980 人", wait: "45 分钟" },
  { type: "train", name: "丰台站", status: "畅通", tone: "green", passengers: "96 人", vehicles: "1,450 人", wait: "9 分钟" },
  { type: "train", name: "通州站", status: "正常", tone: "amber", passengers: "243 人", vehicles: "2,980 人", wait: "20 分钟" },
  { type: "plane", name: "首都机场", status: "正常", tone: "amber", passengers: "378 人", vehicles: "4,850 人", wait: "30 分钟" },
  { type: "plane", name: "大兴机场", status: "畅通", tone: "green", passengers: "154 人", vehicles: "2,120 人", wait: "15 分钟" },
];

const ICON_LIBRARY = {
  accessibility: `<circle cx="12" cy="5" r="1.8"></circle><path d="M5 9.4h14"></path><path d="M12 7v6.2"></path><path d="m8.2 20.5 3.8-7.3 3.8 7.3"></path>`,
  angry: `<circle cx="12" cy="12" r="8"></circle><path d="m8.2 8.6 2.2 1.1"></path><path d="m15.8 8.6-2.2 1.1"></path><path d="M8.4 16.4c2.1-1.5 5.1-1.5 7.2 0"></path>`,
  back: `<path d="M15.5 5 8.5 12l7 7"></path>`,
  bike: `<circle cx="6.5" cy="17" r="3"></circle><circle cx="17.5" cy="17" r="3"></circle><path d="m9.5 17 2.5-6 2.5 6"></path><path d="M10 11h4.8l2.7 6"></path><path d="M8.5 8.5h3"></path>`,
  book: `<path d="M5 5.5h6.2c1.1 0 2 .9 2 2v12.2c-.6-.8-1.4-1.2-2.4-1.2H5z"></path><path d="M19 5.5h-5.8c-1.1 0-2 .9-2 2v12.2c.6-.8 1.4-1.2 2.4-1.2H19z"></path><path d="M11.2 7.5v12"></path>`,
  bus: `<rect x="5" y="4.8" width="14" height="13.5" rx="2.2"></rect><path d="M8 8.6h8"></path><path d="M8 12.2h8"></path><path d="M7.8 18.3v1.5"></path><path d="M16.2 18.3v1.5"></path>`,
  calendar: `<rect x="4.5" y="5.5" width="15" height="14" rx="2.2"></rect><path d="M8.2 3.8v4"></path><path d="M15.8 3.8v4"></path><path d="M4.5 10h15"></path><path d="M8 14h3"></path><path d="M13 14h3"></path>`,
  camera: `<rect x="4" y="7" width="16" height="11" rx="2.2"></rect><path d="M8.6 7 10 4.8h4l1.4 2.2"></path><circle cx="12" cy="12.7" r="3"></circle>`,
  car: `<path d="M5.2 13.5h13.6l-1.1-4.3a2.3 2.3 0 0 0-2.2-1.7h-7a2.3 2.3 0 0 0-2.2 1.7z"></path><path d="M4.5 13.5v4.3"></path><path d="M19.5 13.5v4.3"></path><circle cx="8" cy="17.5" r="1.35"></circle><circle cx="16" cy="17.5" r="1.35"></circle>`,
  chat: `<path d="M5 6h14v9.2H9.2L5 19z"></path><path d="M8.2 10.6h.1"></path><path d="M12 10.6h.1"></path><path d="M15.8 10.6h.1"></path>`,
  check: `<path d="m5.8 12.5 4.1 4.1 8.3-8.6"></path>`,
  chevron_left: `<path d="m14.5 6-6 6 6 6"></path>`,
  charger: `<rect x="7.5" y="3.8" width="9" height="16.4" rx="2.4"></rect><path d="M10.2 7h3.6"></path><path d="m12.8 10-2.2 3.2h2.1l-1.4 3.3 3.4-4.5h-2.3z"></path>`,
  clock: `<circle cx="12" cy="12" r="8"></circle><path d="M12 7.5v4.8l3.2 1.9"></path>`,
  cup: `<path d="M6.2 8.8h9.5v5.4a4.1 4.1 0 0 1-4.1 4.1H10a3.8 3.8 0 0 1-3.8-3.8z"></path><path d="M15.7 10h2a2.1 2.1 0 0 1 0 4.2h-2"></path><path d="M7.5 21h7"></path>`,
  dining: `<path d="M7 4.5v7.2"></path><path d="M4.8 4.5v7.2"></path><path d="M9.2 4.5v7.2"></path><path d="M4.8 11.7h4.4"></path><path d="M7 11.7v7.8"></path><path d="M16.8 4.5c-2.3 1.8-3.2 4-3.2 7.4h4.6"></path><path d="M18.2 4.5v15"></path>`,
  edit: `<path d="M4.5 19.5h15"></path><path d="m6.5 16 2-5.8 7-7 4 4-7 7z"></path><path d="m14.4 4.3 4 4"></path>`,
  ear: `<path d="M6.4 11a5.6 5.6 0 1 1 9.4 4.1c-1.3 1.2-1.9 2.1-1.9 3.4a2.4 2.4 0 0 1-2.4 2.4c-1.6 0-2.3-1.2-3.1-2.3"></path><path d="M9 11.2a3 3 0 1 1 4.9 2.2"></path>`,
  feedback: `<path d="M5 6h14v9.5H9.6L5 19.5z"></path><path d="M8.5 9.7h7"></path><path d="M8.5 13h4.7"></path>`,
  gift: `<rect x="4.5" y="9" width="15" height="10.5" rx="1.8"></rect><path d="M4.5 12.2h15"></path><path d="M12 9v10.5"></path><path d="M12 9s-3.7-.2-3.7-2.2c0-1 .8-1.7 1.8-1.7 1.5 0 1.9 1.5 1.9 3.9z"></path><path d="M12 9s3.7-.2 3.7-2.2c0-1-.8-1.7-1.8-1.7-1.5 0-1.9 1.5-1.9 3.9z"></path>`,
  globe: `<circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8"></path><path d="M12 4c-2 2.2-3 4.9-3 8s1 5.8 3 8"></path>`,
  glove: `<path d="M6.4 11V8.5a1.8 1.8 0 0 1 3.6 0V11"></path><path d="M10 10V7.3a1.8 1.8 0 0 1 3.6 0V11"></path><path d="M13.6 11V8.8a1.8 1.8 0 0 1 3.6 0v5.6a4.8 4.8 0 0 1-4.8 4.8H9.8a4.1 4.1 0 0 1-4.1-4.1v-4a1.7 1.7 0 0 1 3.4 0v1.4"></path>`,
  grid: `<rect x="4.5" y="4.5" width="5.8" height="5.8" rx="1.5"></rect><rect x="13.7" y="4.5" width="5.8" height="5.8" rx="1.5"></rect><rect x="4.5" y="13.7" width="5.8" height="5.8" rx="1.5"></rect><rect x="13.7" y="13.7" width="5.8" height="5.8" rx="1.5"></rect>`,
  handshake: `<path d="m7.2 12 2.8-2.8 3.2 3.2 2.8-2.8 4.1 4.1-5.4 5.4-4.7-4.7-2 2-4.1-4.1z"></path><path d="m13.2 12.4 3.4 3.4"></path><path d="m10 14.4 3.2 3.2"></path>`,
  history: `<path d="M4.5 12a7.5 7.5 0 1 0 2-5.1"></path><path d="M4.5 5.2v4h4"></path><path d="M12 8v4.4l3 1.8"></path>`,
  home: `<path d="M3.8 11.6 12 4.5l8.2 7.1"></path><path d="M6.2 10.4v9.1h11.6v-9.1"></path><path d="M10 19.5v-5.2h4v5.2"></path>`,
  id: `<rect x="4.5" y="5.5" width="15" height="13" rx="2.2"></rect><circle cx="10" cy="11" r="2.2"></circle><path d="M7.2 16c1.2-1.8 4.3-1.8 5.6 0"></path><path d="M14.5 10h2.5"></path><path d="M14.5 14h2.5"></path>`,
  leaf: `<path d="M20 4.5c-7.2 0-12.2 3.6-14 9.6 1.3 3.5 4.2 5.4 7.6 5.4 4.2 0 7.2-3.2 7.2-8.4V4.5z"></path><path d="M6 18c3.8-4.2 7.5-7 13.2-9.8"></path>`,
  lock: `<rect x="5" y="10" width="14" height="10" rx="2.2"></rect><path d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2"></path><path d="M12 14v2.4"></path>`,
  logout: `<path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"></path><path d="M13 8l4 4-4 4"></path><path d="M17 12H9"></path>`,
  lounge: `<path d="M4.8 9.2v10.3"></path><path d="M19.2 13.8v5.7"></path><path d="M4.8 15.5h14.4"></path><path d="M7.2 10.2h4.6a1.6 1.6 0 0 1 1.6 1.6v3.7H7.2z"></path><path d="M13.4 12.2h3.8a2 2 0 0 1 2 2v1.3h-5.8z"></path><path d="M7 19.5v1.2"></path><path d="M17 19.5v1.2"></path>`,
  mail: `<rect x="4.5" y="6.5" width="15" height="11" rx="2.2"></rect><path d="m5.4 8 6.6 5 6.6-5"></path>`,
  map: `<path d="M9 19.5 4.2 17.6V5l4.8 1.9 6-1.9 4.8 1.9v12.6L15 17.6z"></path><path d="M9 6.9v12.6"></path><path d="M15 5v12.6"></path>`,
  megaphone: `<path d="M4.5 13.2h4l8.7-6v11.6l-8.7-5.6h-4z"></path><path d="M8.5 13.2 10.2 19"></path><path d="M19.5 10.4c.8.7 1.2 1.6 1.2 2.6s-.4 1.9-1.2 2.6"></path>`,
  medical: `<rect x="4.8" y="7.5" width="14.4" height="11" rx="2.2"></rect><path d="M9.2 7.5V5.8c0-.8.6-1.4 1.4-1.4h2.8c.8 0 1.4.6 1.4 1.4v1.7"></path><path d="M12 10.5v5"></path><path d="M9.5 13h5"></path>`,
  message: `<path d="M5 6.2h14v9.3H9.2L5 19.4z"></path><path d="M8.4 10.8h7.2"></path><path d="M8.4 13.4h4.5"></path>`,
  more: `<circle cx="5.2" cy="12" r="1.2"></circle><circle cx="12" cy="12" r="1.2"></circle><circle cx="18.8" cy="12" r="1.2"></circle>`,
  paper: `<path d="M7 3.8h8l4 4v12.4H7z"></path><path d="M15 3.8v4h4"></path><path d="M10 12h4.5"></path><path d="M10 15.5h4.5"></path>`,
  parking: `<rect x="5" y="4.5" width="14" height="15" rx="2.6"></rect><path d="M9.2 17V8h4a2.8 2.8 0 0 1 0 5.6h-4"></path>`,
  people: `<circle cx="8.4" cy="8.2" r="2.6"></circle><circle cx="15.8" cy="8.4" r="2.4"></circle><path d="M3.8 19c.7-3.4 2.8-5.1 5.1-5.1 2.2 0 4.3 1.7 5 5.1"></path><path d="M13.2 14.4c2.8-.6 5.6 1 6.5 4.6"></path>`,
  phone: `<path d="M7.4 4.5 10 7.1 8.2 9.3c.9 1.9 2.6 3.6 4.5 4.5L15 12l2.6 2.6-1.3 3.3c-.2.5-.8.9-1.4.8-5.2-.7-9.4-4.8-10.1-10.1-.1-.6.3-1.2.8-1.4z"></path>`,
  pin: `<path d="M12 21s6.5-5.7 6.5-11.3a6.5 6.5 0 0 0-13 0C5.5 15.3 12 21 12 21z"></path><circle cx="12" cy="9.8" r="2.2"></circle>`,
  pillow: `<rect x="4.5" y="7.2" width="15" height="9.6" rx="3"></rect><path d="M8.2 7.2v9.6"></path><path d="M15.8 7.2v9.6"></path>`,
  plane: `<path d="m3.8 14.8 16.4-8-6.2 13-3-5.7z"></path><path d="m11 14.1-4 5.1"></path>`,
  points: `<circle cx="12" cy="12" r="8"></circle><path d="M12 7.5v9"></path><path d="M8.8 10.2c1.4-1.4 5-1.4 6.4 0"></path><path d="M8.8 13.8c1.4 1.4 5 1.4 6.4 0"></path>`,
  qr: `<path d="M4.5 4.5h5v5h-5z"></path><path d="M14.5 4.5h5v5h-5z"></path><path d="M4.5 14.5h5v5h-5z"></path><path d="M14.5 14.5h2v2h-2z"></path><path d="M18.5 14.5v5h-4"></path>`,
  question: `<circle cx="12" cy="12" r="8"></circle><path d="M9.5 9.2A2.8 2.8 0 0 1 12 7.8c1.7 0 3 1 3 2.6 0 2-2.7 2.1-2.7 4.1"></path><path d="M12.3 17.2h.1"></path>`,
  refresh: `<path d="M20 6.5v5h-5"></path><path d="M19 11.5a7 7 0 1 0-2.1 5"></path>`,
  restroom: `<circle cx="8" cy="6.4" r="1.8"></circle><circle cx="16" cy="6.4" r="1.8"></circle><path d="M6.5 10h3L11 16H9.4v4H6.6v-4H5z"></path><path d="M14.8 10h2.4l1.3 10h-2.8l-.5-4.2-.5 4.2h-2.8z"></path>`,
  route: `<path d="M6 18.5c2.5-3 9.5-.7 12-3.8 1.3-1.6.8-4-1.2-5"></path><circle cx="5.5" cy="18.5" r="2"></circle><circle cx="16.8" cy="7.5" r="2"></circle>`,
  scan: `<path d="M7.2 3.8H4v3.4"></path><path d="M16.8 3.8H20v3.4"></path><path d="M7.2 20.2H4v-3.4"></path><path d="M16.8 20.2H20v-3.4"></path><path d="M7.5 12h9"></path>`,
  search: `<circle cx="10.8" cy="10.8" r="5.9"></circle><path d="m15.2 15.2 4.4 4.4"></path>`,
  settings: `<circle cx="12" cy="12" r="2.8"></circle><path d="M19.2 12.8a7.8 7.8 0 0 0 0-1.6l1.8-1.4-2-3.4-2.2.9a7.1 7.1 0 0 0-1.4-.8L15 4h-6l-.4 2.5c-.5.2-1 .5-1.4.8L5 6.4l-2 3.4 1.8 1.4a7.8 7.8 0 0 0 0 1.6L3 14.2l2 3.4 2.2-.9c.4.3.9.6 1.4.8L9 20h6l.4-2.5c.5-.2 1-.5 1.4-.8l2.2.9 2-3.4z"></path>`,
  shield: `<path d="M12 3.8 5.5 6.6v4.7c0 4.3 2.7 7.4 6.5 9 3.8-1.6 6.5-4.7 6.5-9V6.6z"></path><path d="m9.2 12 2 2 4-4.6"></path>`,
  taxi: `<path d="M5.7 13.5h12.6l-1-4a2.2 2.2 0 0 0-2.1-1.6H8.8a2.2 2.2 0 0 0-2.1 1.6z"></path><path d="M8.8 5.7h6.4"></path><path d="M4.8 13.5h14.4"></path><circle cx="8" cy="17.4" r="1.3"></circle><circle cx="16" cy="17.4" r="1.3"></circle>`,
  thumb: `<path d="M8.2 20.2H5.5a2 2 0 0 1-2-2v-6.4h4.7"></path><path d="M8.2 11.8 12.1 3.7c1.8.4 2.4 1.7 1.9 3.8l-.4 1.8h5.2a2 2 0 0 1 2 2.4l-1.1 5.1a3.2 3.2 0 0 1-3.1 2.5H8.2z"></path>`,
  train: `<rect x="5.5" y="4" width="13" height="14.2" rx="2.6"></rect><path d="M8.4 8.2h7.2"></path><path d="M8.4 12h2.7"></path><path d="M12.9 12h2.7"></path><circle cx="9" cy="15.6" r="1"></circle><circle cx="15" cy="15.6" r="1"></circle><path d="m8.8 21 2-2.8"></path><path d="m15.2 18.2 2 2.8"></path>`,
  transfer: `<path d="M6 8h10.5"></path><path d="m13.8 5.2 2.8 2.8-2.8 2.8"></path><path d="M18 16H7.5"></path><path d="m10.2 13.2-2.8 2.8 2.8 2.8"></path>`,
  tea: `<path d="M6.3 9.2h9.4v5.1a3.9 3.9 0 0 1-3.9 3.9H10a3.7 3.7 0 0 1-3.7-3.7z"></path><path d="M15.7 10.2h1.8a2 2 0 0 1 0 4h-1.8"></path><path d="M8 20.2h7"></path><path d="M8.2 5.2c-.8.9-.8 1.8 0 2.7"></path><path d="M12 4.6c-.8 1-.8 2 0 3"></path><path d="M15.8 5.2c-.8.9-.8 1.8 0 2.7"></path>`,
  user: `<circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c1.2-4.3 4-6.2 7-6.2s5.8 1.9 7 6.2"></path>`,
  walk_solid: {
    viewBox: "5 2 14 21",
    body: `<circle cx="12" cy="4.5" r="2.1" fill="currentColor" stroke="none"></circle><path fill="currentColor" stroke="none" d="M10.6 7.4c.7-.5 1.6-.4 2.2.2l2.7 2.5c.4.4.5 1.1.1 1.5-.4.5-1.1.5-1.6.1l-1.4-1.2-.6 3 2.3 2.2c.3.3.5.7.5 1.1v4.1c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2v-3.5l-1.9-1.6-1 2.5c-.1.3-.3.6-.5.8l-2.2 2c-.5.4-1.2.4-1.7-.1-.4-.5-.4-1.2.1-1.7l2-1.9 1.1-3.1.8-4.1-1.1.7-.8 2c-.2.6-.9.9-1.5.6-.6-.2-.9-.9-.6-1.5l1-2.5c.1-.3.3-.5.6-.7z"></path>`,
  },
  wifi: `<path d="M5 10.2c4.4-3.8 9.6-3.8 14 0"></path><path d="M8 13.2c2.5-2.1 5.5-2.1 8 0"></path><path d="M10.8 16.2c.8-.7 1.6-.7 2.4 0"></path><circle cx="12" cy="19" r="1"></circle>`,
};

const ICON_ALIASES = {
  airport: "plane",
  announcement: "megaphone",
  house: "lounge",
  license: "id",
  meal: "dining",
  notice: "megaphone",
  redeem: "gift",
  ride_hailing: "car",
  station: "train",
  station_fengtai: "station_yizhuang",
};

const STATION_ICON_REPLICA_LIBRARY = {
  "station_beijing": {
    "viewBox": "33 167 341 238",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M96 185H97V186H96ZM310 185H311V186H310ZM95 186H98V187H95ZM309 186H312V188H309ZM309 188H313V189H309ZM95 187H99V191H95ZM94 191H99V195H94ZM308 189H313V196H308ZM94 195H100V197H94ZM93 197H100V198H93ZM307 196H314V198H307ZM93 198H101V199H93ZM306 198H315V199H306ZM92 199H102V200H92ZM91 200H103V201H91ZM305 199H316V201H305ZM90 201H103V202H90ZM304 201H317V202H304ZM89 202H104V203H89ZM303 202H318V203H303ZM88 203H105V204H88ZM302 203H319V204H302ZM87 204H106V205H87ZM301 204H320V205H301ZM86 205H107V206H86ZM300 205H321V206H300ZM85 206H108V207H85ZM299 206H322V207H299ZM84 207H110V208H84ZM298 207H323V208H298ZM83 208H111V209H83ZM296 208H325V209H296ZM81 209H112V210H81ZM295 209H326V210H295ZM69 210H72V211H69ZM80 210H114V211H80ZM122 210H125V211H122ZM283 210H285V211H283ZM293 210H328V211H293ZM336 210H338V211H336ZM69 211H74V212H69ZM77 211H116V212H77ZM120 211H125V212H120ZM282 211H287V212H282ZM291 211H330V212H291ZM334 211H339V212H334ZM69 212H125V214H69ZM69 214H124V215H69ZM283 212H338V215H283ZM284 215H338V216H284ZM70 215H124V217H70ZM284 216H337V217H284ZM71 217H123V218H71ZM285 217H337V218H285ZM71 218H122V219H71ZM285 218H336V219H285ZM72 219H122V220H72ZM73 220H121V221H73ZM286 219H335V221H286ZM73 221H82V222H73ZM90 221H108V222H90ZM112 221H120V222H112ZM287 221H307V222H287ZM311 221H318V222H311ZM322 221H334V222H322ZM331 223H332V224H331ZM288 224H333V225H288ZM74 224H120V227H74ZM288 225H334V227H288ZM73 227H121V228H73ZM287 227H335V228H287ZM72 228H122V229H72ZM286 228H336V229H286ZM70 229H124V230H70ZM284 229H337V230H284ZM60 230H135V232H60ZM273 230H348V232H273ZM60 232H134V233H60ZM274 232H347V234H274ZM61 233H133V235H61ZM275 234H346V235H275ZM62 235H132V236H62ZM276 235H345V236H276ZM63 236H131V237H63ZM277 236H344V237H277ZM64 237H130V238H64ZM278 237H343V238H278ZM65 238H129V239H65ZM279 238H342V239H279ZM67 239H73V240H67ZM121 239H127V240H121ZM280 239H287V240H280ZM334 239H340V240H334ZM68 240H77V241H68ZM117 240H126V241H117ZM282 240H290V241H282ZM331 240H339V241H331ZM331 241H336V242H331ZM82 243H112V247H82ZM295 243H326V247H295ZM82 247H96V248H82ZM98 247H112V248H98ZM295 247H310V248H295ZM312 247H326V248H312ZM82 248H92V249H82ZM102 248H112V249H102ZM295 248H306V249H295ZM315 248H326V249H315ZM82 249H91V250H82ZM94 249H100V250H94ZM103 249H112V250H103ZM295 249H304V250H295ZM307 249H314V250H307ZM317 249H326V250H317ZM82 250H90V251H82ZM92 250H102V251H92ZM105 250H112V251H105ZM295 250H303V251H295ZM305 250H316V251H305ZM318 250H326V251H318ZM330 242H336V251H330ZM82 251H89V252H82ZM90 251H104V252H90ZM295 251H302V252H295ZM304 251H317V252H304ZM319 251H326V252H319ZM82 252H88V253H82ZM89 252H105V253H89ZM106 251H112V253H106ZM303 252H318V253H303ZM89 253H96V254H89ZM97 253H105V254H97ZM295 252H301V254H295ZM302 253H319V254H302ZM320 252H326V254H320ZM302 254H310V255H302ZM311 254H319V255H311ZM88 254H106V256H88ZM82 253H87V257H82ZM88 256H97V257H88ZM98 256H106V257H98ZM107 253H112V257H107ZM311 255H320V257H311ZM82 257H86V259H82ZM88 257H96V259H88ZM99 257H106V259H99ZM301 255H310V259H301ZM312 257H320V259H312ZM108 257H112V260H108ZM301 259H320V260H301ZM301 260H319V261H301ZM321 254H326V261H321ZM331 251H336V261H331ZM88 259H106V262H88ZM295 254H300V262H295ZM82 259H87V263H82ZM107 260H112V263H107ZM302 261H319V263H302ZM89 262H105V264H89ZM295 262H301V264H295ZM303 263H318V264H303ZM320 261H326V264H320ZM82 263H88V265H82ZM90 264H104V265H90ZM106 263H112V265H106ZM295 264H302V265H295ZM303 264H317V265H303ZM319 264H326V265H319ZM82 265H89V266H82ZM91 265H103V266H91ZM105 265H112V266H105ZM295 265H303V266H295ZM305 265H316V266H305ZM318 265H326V266H318ZM82 266H90V267H82ZM93 266H101V267H93ZM104 266H112V267H104ZM295 266H304V267H295ZM306 266H314V267H306ZM317 266H326V267H317ZM82 267H92V268H82ZM102 267H112V268H102ZM295 267H306V268H295ZM315 267H326V268H315ZM82 268H94V269H82ZM99 268H112V269H99ZM295 268H308V269H295ZM313 268H326V269H313ZM330 261H336V269H330ZM295 269H326V272H295ZM82 269H112V273H82ZM295 272H325V273H295ZM71 241H77V275H71ZM285 241H291V275H285ZM72 275H77V276H72ZM117 241H123V276H117ZM285 275H290V276H285ZM331 269H336V276H331ZM67 276H127V277H67ZM195 276H212V277H195ZM281 276H340V277H281ZM183 277H223V278H183ZM177 278H230V279H177ZM172 279H235V280H172ZM167 280H240V281H167ZM67 277H128V282H67ZM163 281H244V282H163ZM280 277H341V282H280ZM67 282H127V283H67ZM160 282H247V283H160ZM280 282H340V283H280ZM70 283H125V284H70ZM156 283H251V284H156ZM153 284H254V285H153ZM150 285H257V286H150ZM70 284H124V287H70ZM147 286H199V287H147ZM202 286H260V287H202ZM283 283H338V287H283ZM103 287H124V288H103ZM145 287H187V288H145ZM220 287H262V288H220ZM142 288H179V289H142ZM228 288H265V289H228ZM140 289H174V290H140ZM234 289H267V290H234ZM138 290H169V291H138ZM187 290H220V291H187ZM239 290H269V291H239ZM135 291H164V292H135ZM179 291H227V292H179ZM243 291H272V292H243ZM133 292H161V293H133ZM173 292H233V293H173ZM246 292H274V293H246ZM131 293H157V294H131ZM168 293H238V294H168ZM250 293H276V294H250ZM129 294H154V295H129ZM164 294H242V295H164ZM253 294H278V295H253ZM127 295H151V296H127ZM161 295H246V296H161ZM256 295H280V296H256ZM127 296H148V297H127ZM157 296H250V297H157ZM259 296H281V297H259ZM127 297H145V298H127ZM154 297H253V298H154ZM261 297H281V298H261ZM127 298H143V299H127ZM151 298H256V299H151ZM264 298H281V299H264ZM127 299H141V300H127ZM149 299H258V300H149ZM266 299H281V300H266ZM127 300H138V301H127ZM146 300H261V301H146ZM269 300H281V301H269ZM127 301H136V302H127ZM144 301H263V302H144ZM271 301H281V302H271ZM127 302H134V303H127ZM141 302H266V303H141ZM273 302H281V303H273ZM127 303H132V304H127ZM139 303H268V304H139ZM275 303H281V304H275ZM127 304H130V305H127ZM137 304H271V305H137ZM277 304H281V305H277ZM127 305H128V306H127ZM134 305H192V306H134ZM216 305H273V306H216ZM279 305H281V306H279ZM132 306H182V307H132ZM202 305H205V307H202ZM225 306H275V307H225ZM130 307H176V308H130ZM202 307H206V308H202ZM231 307H277V308H231ZM129 308H174V309H129ZM234 308H278V309H234ZM127 309H168V310H127ZM239 309H280V310H239ZM127 310H163V311H127ZM244 310H281V311H244ZM127 311H160V312H127ZM247 311H281V312H247ZM127 312H158V314H127ZM186 306H189V314H186ZM250 312H281V314H250ZM127 314H152V315H127ZM170 309H174V315H170ZM186 314H190V315H186ZM250 314H253V315H250ZM255 314H281V315H255ZM127 315H149V316H127ZM170 315H173V316H170ZM186 315H189V316H186ZM258 315H281V316H258ZM127 316H147V317H127ZM154 314H158V317H154ZM170 316H174V317H170ZM186 316H190V317H186ZM202 308H205V317H202ZM218 306H222V317H218ZM234 309H238V317H234ZM250 315H254V317H250ZM260 316H281V317H260ZM127 317H281V320H127ZM126 320H142V321H126ZM170 320H174V321H170ZM186 320H190V321H186ZM202 320H206V321H202ZM234 320H238V321H234ZM264 320H265V321H264ZM126 321H137V322H126ZM138 321H141V322H138ZM234 321H237V322H234ZM266 320H281V322H266ZM126 322H136V323H126ZM138 322H142V323H138ZM271 322H281V323H271ZM126 323H134V324H126ZM273 323H281V324H273ZM126 324H133V325H126ZM274 324H281V325H274ZM127 325H132V326H127ZM276 325H281V326H276ZM127 326H131V327H127ZM127 327H130V328H127ZM170 321H173V328H170ZM127 328H131V329H127ZM127 329H130V330H127ZM138 323H141V330H138ZM202 321H205V330H202ZM127 330H131V331H127ZM138 330H142V331H138ZM154 320H158V331H154ZM170 328H174V331H170ZM186 321H189V331H186ZM202 330H206V331H202ZM218 320H222V331H218ZM234 322H238V331H234ZM250 320H254V331H250ZM266 322H270V331H266ZM277 326H281V331H277ZM127 331H281V334H127ZM127 334H131V335H127ZM138 334H142V335H138ZM154 334H158V335H154ZM170 334H174V335H170ZM186 334H190V335H186ZM202 334H206V335H202ZM127 335H130V336H127ZM154 335H157V336H154ZM170 335H173V336H170ZM127 336H131V337H127ZM170 336H174V338H170ZM138 335H141V339H138ZM70 287H91V342H70ZM138 339H142V342H138ZM154 336H158V342H154ZM250 334H254V342H250ZM70 342H90V343H70ZM104 288H124V343H104ZM127 337H130V343H127ZM138 342H141V343H138ZM154 342H157V343H154ZM170 338H173V343H170ZM186 335H189V343H186ZM202 335H205V343H202ZM218 334H222V343H218ZM234 334H238V343H234ZM250 342H253V343H250ZM266 334H270V343H266ZM277 334H281V343H277ZM283 287H304V343H283ZM317 287H338V343H317ZM51 346H356V357H51ZM173 357H181V358H173ZM224 357H232V358H224ZM275 357H356V358H275ZM134 360H170V361H134ZM235 360H272V361H235ZM235 361H273V362H235ZM234 362H273V368H234ZM133 361H171V369H133ZM184 360H222V369H184ZM235 368H273V369H235ZM184 369H193V370H184ZM184 370H192V371H184ZM184 371H193V372H184ZM235 369H243V375H235ZM51 357H130V387H51ZM133 369H143V387H133ZM151 369H154V387H151ZM162 369H171V387H162ZM174 358H181V387H174ZM184 372H192V387H184ZM201 369H204V387H201ZM213 369H222V387H213ZM225 358H232V387H225ZM234 375H243V387H234ZM251 369H254V387H251ZM262 369H273V387H262ZM276 358H356V387H276Z\"></path>"
  },
  "station_west": {
    "viewBox": "4 155 377 252",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M148 175H152V176H148ZM233 175H237V176H233ZM147 176H153V177H147ZM232 176H238V177H232ZM146 177H153V180H146ZM232 177H239V180H232ZM146 180H239V186H146ZM145 186H240V188H145ZM144 188H241V190H144ZM143 190H242V191H143ZM142 191H243V192H142ZM141 192H244V193H141ZM140 193H245V194H140ZM138 194H248V195H138ZM123 195H126V196H123ZM135 195H251V196H135ZM258 195H262V196H258ZM123 196H262V199H123ZM123 199H261V200H123ZM124 200H131V201H124ZM254 200H261V201H254ZM125 201H132V202H125ZM252 201H260V202H252ZM125 202H259V203H125ZM126 203H259V204H126ZM127 204H258V205H127ZM127 205H257V206H127ZM128 206H257V207H128ZM129 207H256V208H129ZM130 208H255V209H130ZM131 209H254V211H131ZM132 211H253V212H132ZM131 212H254V213H131ZM131 213H137V215H131ZM248 213H254V215H248ZM131 215H254V217H131ZM131 217H255V218H131ZM129 218H256V219H129ZM127 219H258V220H127ZM125 220H260V221H125ZM114 221H271V222H114ZM113 222H272V226H113ZM114 226H121V227H114ZM263 226H271V227H263ZM115 227H123V228H115ZM262 227H270V228H262ZM59 228H62V229H59ZM115 228H270V229H115ZM323 228H326V229H323ZM58 229H64V230H58ZM116 229H269V230H116ZM321 229H327V230H321ZM57 230H64V231H57ZM117 230H268V231H117ZM321 230H328V231H321ZM56 231H65V232H56ZM118 231H267V232H118ZM320 231H328V232H320ZM55 232H66V233H55ZM119 232H266V233H119ZM319 232H330V233H319ZM54 233H67V234H54ZM120 233H265V234H120ZM317 233H331V234H317ZM52 234H69V235H52ZM121 234H264V235H121ZM316 234H332V235H316ZM51 235H70V236H51ZM122 235H263V236H122ZM315 235H334V236H315ZM39 236H41V237H39ZM49 236H72V237H49ZM79 236H81V237H79ZM123 236H263V237H123ZM304 236H306V237H304ZM313 236H336V237H313ZM343 236H346V237H343ZM38 237H81V238H38ZM124 237H261V239H124ZM303 237H346V239H303ZM39 238H81V241H39ZM304 239H346V241H304ZM305 241H345V242H305ZM40 241H80V243H40ZM305 242H344V243H305ZM41 243H79V244H41ZM306 243H344V244H306ZM41 244H78V245H41ZM307 244H343V245H307ZM43 245H47V246H43ZM338 245H342V246H338ZM43 246H46V247H43ZM73 245H77V247H73ZM308 245H312V247H308ZM339 246H341V247H339ZM42 247H78V248H42ZM124 239H130V248H124ZM202 239H207V248H202ZM255 239H261V248H255ZM307 247H343V248H307ZM201 248H207V249H201ZM237 239H243V249H237ZM142 239H148V250H142ZM160 239H166V250H160ZM177 239H183V250H177ZM202 249H207V250H202ZM219 239H225V250H219ZM237 249H242V250H237ZM34 248H84V251H34ZM301 248H351V251H301ZM35 251H83V252H35ZM301 251H350V252H301ZM35 252H82V253H35ZM302 252H349V253H302ZM36 253H82V254H36ZM303 253H349V254H303ZM37 254H81V255H37ZM304 254H348V255H304ZM38 255H80V256H38ZM305 255H347V256H305ZM39 256H41V257H39ZM39 258H82V259H39ZM303 258H346V259H303ZM33 259H83V260H33ZM302 259H352V260H302ZM105 250H280V261H105ZM33 260H84V262H33ZM105 261H117V262H105ZM118 261H280V262H118ZM301 260H352V262H301ZM33 262H83V263H33ZM302 262H352V263H302ZM33 263H102V264H33ZM283 263H352V264H283ZM33 264H39V265H33ZM77 264H103V265H77ZM282 264H305V265H282ZM346 264H352V265H346ZM81 265H103V266H81ZM282 265H304V266H282ZM37 266H74V267H37ZM282 266H308V267H282ZM310 266H348V267H310ZM310 267H349V269H310ZM76 266H103V270H76ZM76 270H102V271H76ZM282 267H309V271H282ZM98 271H102V272H98ZM141 271H160V272H141ZM178 271H183V272H178ZM207 271H227V272H207ZM245 271H256V272H245ZM257 271H258V272H257ZM310 269H348V273H310ZM36 267H75V275H36ZM310 273H349V275H310ZM63 275H75V276H63ZM76 271H81V276H76ZM98 272H103V276H98ZM282 271H287V276H282ZM303 271H309V276H303ZM332 275H349V276H332ZM332 276H348V277H332ZM76 276H103V282H76ZM282 276H309V282H282ZM64 276H75V283H64ZM76 282H87V283H76ZM95 282H103V283H95ZM282 282H290V283H282ZM299 282H309V283H299ZM126 272H259V286H126ZM126 286H186V287H126ZM199 286H259V287H199ZM126 287H181V288H126ZM205 287H259V288H205ZM126 288H177V289H126ZM208 288H259V289H208ZM126 289H174V290H126ZM211 289H259V290H211ZM332 277H349V290H332ZM76 283H103V291H76ZM126 290H172V291H126ZM214 290H259V291H214ZM282 283H309V291H282ZM76 291H83V292H76ZM84 291H86V292H84ZM93 291H96V292H93ZM126 291H170V292H126ZM216 291H259V292H216ZM292 291H298V292H292ZM126 292H168V293H126ZM217 292H259V293H217ZM293 292H297V293H293ZM126 293H166V294H126ZM219 293H259V294H219ZM126 294H164V295H126ZM221 294H259V295H221ZM126 295H163V296H126ZM222 295H259V296H222ZM64 283H74V297H64ZM126 296H161V297H126ZM223 296H259V297H223ZM292 293H297V297H292ZM126 297H160V298H126ZM225 297H259V298H225ZM293 297H297V298H293ZM76 292H82V299H76ZM87 291H92V299H87ZM97 291H103V299H97ZM126 298H159V299H126ZM188 298H197V299H188ZM226 298H259V299H226ZM282 291H288V299H282ZM292 298H297V299H292ZM302 291H309V299H302ZM126 299H158V300H126ZM182 299H203V300H182ZM227 299H259V300H227ZM126 300H157V301H126ZM178 300H207V301H178ZM228 300H259V301H228ZM126 301H156V302H126ZM176 301H210V302H176ZM229 301H259V302H229ZM76 299H103V303H76ZM126 302H155V303H126ZM173 302H212V303H173ZM230 302H259V303H230ZM282 299H309V303H282ZM126 303H154V304H126ZM171 303H214V304H171ZM231 303H259V304H231ZM293 303H297V304H293ZM170 304H216V305H170ZM126 304H153V306H126ZM168 305H217V306H168ZM232 304H259V306H232ZM332 290H348V306H332ZM126 306H152V307H126ZM166 306H219V307H166ZM233 306H259V307H233ZM126 307H151V308H126ZM165 307H220V308H165ZM164 308H193V309H164ZM195 308H221V309H195ZM234 307H259V309H234ZM292 304H297V309H292ZM76 303H82V310H76ZM87 303H92V310H87ZM97 303H103V310H97ZM126 308H150V310H126ZM163 309H183V310H163ZM190 309H192V310H190ZM202 309H222V310H202ZM235 309H259V310H235ZM282 303H288V310H282ZM293 309H297V310H293ZM302 303H309V310H302ZM161 310H180V311H161ZM206 310H223V311H206ZM126 310H149V312H126ZM160 311H180V312H160ZM208 311H224V312H208ZM236 310H259V312H236ZM160 312H174V313H160ZM177 312H180V313H177ZM211 312H225V313H211ZM64 297H75V314H64ZM76 310H103V314H76ZM126 312H148V314H126ZM159 313H172V314H159ZM212 313H226V314H212ZM237 312H259V314H237ZM282 310H309V314H282ZM158 314H170V315H158ZM214 314H227V315H214ZM126 314H147V316H126ZM157 315H169V316H157ZM176 313H180V316H176ZM215 315H228V316H215ZM238 314H259V316H238ZM156 316H168V317H156ZM215 316H229V317H215ZM189 310H193V318H189ZM332 306H349V318H332ZM126 316H146V319H126ZM155 317H167V319H155ZM190 318H193V319H190ZM219 317H230V319H219ZM239 316H259V319H239ZM154 319H167V320H154ZM177 316H180V320H177ZM189 319H193V320H189ZM202 310H205V320H202ZM215 317H218V320H215ZM221 319H231V320H221ZM76 314H82V321H76ZM87 314H92V321H87ZM97 314H103V321H97ZM154 320H231V321H154ZM282 314H288V321H282ZM293 314H297V321H293ZM302 314H309V321H302ZM153 321H232V322H153ZM332 318H348V322H332ZM126 319H145V323H126ZM152 322H233V323H152ZM240 319H259V323H240ZM152 323H161V324H152ZM163 323H167V324H163ZM223 323H233V324H223ZM76 321H103V325H76ZM224 324H234V325H224ZM282 321H309V325H282ZM332 322H349V325H332ZM105 262H116V326H105ZM151 324H160V326H151ZM225 325H234V326H225ZM292 325H297V326H292ZM332 325H348V326H332ZM64 314H74V327H64ZM151 326H159V327H151ZM226 326H234V327H226ZM64 327H75V328H64ZM150 327H159V328H150ZM226 327H235V328H226ZM332 326H349V328H332ZM64 328H74V329H64ZM126 323H144V330H126ZM150 328H158V330H150ZM227 328H235V330H227ZM241 323H259V331H241ZM282 325H288V331H282ZM76 325H82V332H76ZM149 330H157V332H149ZM228 330H236V332H228ZM282 331H287V332H282ZM293 326H297V332H293ZM332 328H348V332H332ZM76 332H83V333H76ZM87 325H92V333H87ZM97 325H103V333H97ZM104 326H116V333H104ZM149 332H156V333H149ZM164 324H167V333H164ZM176 323H180V333H176ZM189 323H193V333H189ZM202 323H205V333H202ZM215 323H218V333H215ZM282 332H288V333H282ZM292 332H298V333H292ZM302 325H309V333H302ZM64 329H75V334H64ZM148 333H160V334H148ZM163 333H195V334H163ZM202 333H223V334H202ZM229 332H236V334H229ZM148 334H237V337H148ZM242 331H259V337H242ZM332 332H349V337H332ZM64 334H74V342H64ZM148 337H155V342H148ZM76 333H103V343H76ZM282 333H309V343H282ZM100 343H101V344H100ZM176 337H180V345H176ZM77 345H102V346H77ZM164 337H167V346H164ZM177 345H180V346H177ZM283 345H308V346H283ZM36 275H53V347H36ZM148 342H154V347H148ZM163 346H167V347H163ZM176 346H180V347H176ZM189 337H193V347H189ZM202 337H205V347H202ZM215 337H218V347H215ZM230 337H237V347H230ZM241 337H259V347H241ZM36 347H52V348H36ZM64 342H75V348H64ZM310 275H321V348H310ZM332 337H348V348H332ZM37 348H45V349H37ZM311 348H320V349H311ZM333 348H345V349H333ZM346 348H347V349H346ZM148 347H237V350H148ZM25 350H26V351H25ZM27 350H51V351H27ZM64 350H74V351H64ZM77 346H103V351H77ZM282 346H308V351H282ZM311 350H323V351H311ZM327 350H360V351H327ZM242 347H259V355H242ZM176 350H180V358H176ZM189 350H193V358H189ZM241 355H259V358H241ZM148 350H154V359H148ZM177 358H180V359H177ZM190 358H193V359H190ZM148 359H155V360H148ZM164 350H167V360H164ZM176 359H180V360H176ZM189 359H193V360H189ZM202 350H205V360H202ZM215 350H218V360H215ZM230 350H237V360H230ZM148 360H237V364H148ZM148 364H167V365H148ZM171 364H172V365H171ZM174 364H193V365H174ZM194 364H198V365H194ZM214 364H237V365H214ZM148 365H153V368H148ZM147 368H153V369H147ZM232 365H237V369H232ZM147 369H165V370H147ZM170 369H192V370H170ZM194 369H215V370H194ZM219 369H237V370H219ZM105 333H116V371H105ZM242 358H259V371H242ZM169 370H216V372H169ZM218 370H237V372H218ZM147 370H166V373H147ZM219 372H237V373H219ZM194 372H216V376H194ZM170 372H191V378H170ZM194 376H215V378H194ZM104 371H116V379H104ZM170 378H215V380H170ZM170 380H216V385H170ZM147 373H154V386H147ZM219 373H228V386H219ZM231 373H237V386H231ZM24 351H75V387H24ZM77 351H89V387H77ZM91 351H103V387H91ZM105 379H116V387H105ZM126 330H143V387H126ZM148 386H154V387H148ZM157 373H166V387H157ZM170 385H215V387H170ZM219 386H227V387H219ZM232 386H237V387H232ZM241 371H259V387H241ZM269 262H280V387H269ZM282 351H294V387H282ZM296 351H308V387H296ZM310 351H361V387H310Z\"></path>"
  },
  "station_south": {
    "viewBox": "35 141 371 178",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M184 161H258V162H184ZM167 162H275V163H167ZM154 163H288V164H154ZM144 164H298V165H144ZM135 165H306V166H135ZM128 166H315V167H128ZM121 167H321V168H121ZM115 168H327V169H115ZM109 169H333V170H109ZM104 170H338V171H104ZM100 171H342V172H100ZM95 172H347V173H95ZM91 173H351V174H91ZM88 174H354V175H88ZM84 175H358V176H84ZM81 176H361V177H81ZM79 177H364V178H79ZM76 178H366V179H76ZM73 179H369V180H73ZM71 180H186V181H71ZM256 180H371V181H256ZM69 181H166V182H69ZM276 181H373V182H276ZM67 182H151V183H67ZM292 182H375V183H292ZM65 183H140V184H65ZM303 183H376V184H303ZM64 184H129V185H64ZM212 184H235V185H212ZM313 184H378V185H313ZM63 185H119V186H63ZM174 185H268V186H174ZM322 185H379V186H322ZM61 186H111V187H61ZM157 186H284V187H157ZM330 186H381V187H330ZM60 187H104V188H60ZM142 187H299V188H142ZM337 187H382V188H337ZM59 188H98V189H59ZM132 188H310V189H132ZM343 188H383V189H343ZM58 189H93V190H58ZM123 189H319V190H123ZM349 189H384V190H349ZM57 190H87V191H57ZM114 190H327V191H114ZM355 190H384V191H355ZM57 191H82V192H57ZM107 191H335V192H107ZM360 191H385V192H360ZM56 192H78V193H56ZM100 192H341V193H100ZM364 192H385V193H364ZM56 193H73V194H56ZM94 193H192V194H94ZM250 193H348V194H250ZM368 193H386V194H368ZM56 194H70V195H56ZM89 194H169V195H89ZM250 194H268V195H250ZM273 194H353V195H273ZM372 194H386V195H372ZM56 195H66V196H56ZM83 195H169V196H83ZM197 193H245V196H197ZM251 195H268V196H251ZM273 195H358V196H273ZM376 195H386V196H376ZM56 196H63V197H56ZM79 196H169V197H79ZM174 194H191V197H174ZM273 196H363V197H273ZM379 196H386V197H379ZM56 197H60V198H56ZM74 197H128V198H74ZM133 197H169V198H133ZM175 197H191V198H175ZM251 196H267V198H251ZM314 197H367V198H314ZM382 197H386V198H382ZM56 198H58V199H56ZM71 198H127V199H71ZM175 198H190V199H175ZM251 198H266V199H251ZM314 198H371V199H314ZM384 198H386V199H384ZM67 199H127V200H67ZM196 196H246V200H196ZM272 197H309V200H272ZM314 199H374V200H314ZM64 200H106V201H64ZM132 198H170V201H132ZM176 199H190V201H176ZM252 199H266V201H252ZM336 200H378V201H336ZM61 201H106V202H61ZM111 200H127V202H111ZM176 201H189V202H176ZM252 201H265V202H252ZM315 200H331V202H315ZM336 201H380V202H336ZM59 202H107V203H59ZM112 202H127V203H112ZM132 201H171V203H132ZM271 200H310V203H271ZM335 202H383V203H335ZM57 203H107V204H57ZM131 203H171V204H131ZM177 202H189V204H177ZM195 200H247V204H195ZM253 202H265V204H253ZM315 202H330V204H315ZM335 203H384V204H335ZM56 204H107V205H56ZM112 203H126V205H112ZM178 204H189V205H178ZM253 204H264V205H253ZM315 204H329V205H315ZM335 204H385V205H335ZM254 205H264V206H254ZM270 203H310V206H270ZM113 205H126V207H113ZM131 204H172V207H131ZM178 205H188V207H178ZM194 204H248V207H194ZM316 205H329V207H316ZM334 205H386V207H334ZM55 205H108V208H55ZM114 207H126V208H114ZM131 207H173V208H131ZM193 207H248V208H193ZM254 206H263V208H254ZM55 208H109V209H55ZM255 208H263V209H255ZM269 206H311V209H269ZM316 207H328V209H316ZM56 209H109V210H56ZM114 208H125V210H114ZM130 208H173V210H130ZM179 207H187V210H179ZM316 209H327V210H316ZM333 207H386V210H333ZM57 210H110V211H57ZM180 210H187V211H180ZM193 208H249V211H193ZM255 209H262V211H255ZM268 209H311V211H268ZM317 210H327V211H317ZM332 210H385V211H332ZM58 211H77V212H58ZM115 210H125V212H115ZM130 210H174V212H130ZM180 211H186V212H180ZM192 211H249V212H192ZM256 211H262V212H256ZM268 211H312V212H268ZM365 211H384V212H365ZM59 212H77V213H59ZM81 211H110V213H81ZM116 212H125V213H116ZM332 211H361V213H332ZM365 212H383V213H365ZM60 213H77V214H60ZM116 213H124V214H116ZM130 212H175V214H130ZM181 212H186V214H181ZM256 212H261V214H256ZM267 212H312V214H267ZM317 211H326V214H317ZM365 213H382V214H365ZM61 214H77V215H61ZM129 214H159V215H129ZM170 214H175V215H170ZM181 214H185V215H181ZM192 212H198V215H192ZM256 214H260V215H256ZM267 214H272V215H267ZM283 214H312V215H283ZM331 213H360V215H331ZM365 214H380V215H365ZM63 215H78V216H63ZM82 213H111V216H82ZM129 215H148V216H129ZM244 212H250V216H244ZM294 215H312V216H294ZM318 214H325V216H318ZM364 215H379V216H364ZM64 216H78V217H64ZM117 214H124V217H117ZM129 216H138V217H129ZM170 215H176V217H170ZM182 215H185V217H182ZM257 215H260V217H257ZM266 215H272V217H266ZM303 216H312V217H303ZM364 216H377V217H364ZM66 217H78V218H66ZM83 216H112V218H83ZM171 217H176V218H171ZM183 217H184V218H183ZM307 217H312V218H307ZM318 216H324V218H318ZM330 215H359V218H330ZM364 217H376V218H364ZM67 218H78V219H67ZM118 217H123V219H118ZM191 215H197V219H191ZM318 218H323V219H318ZM363 218H374V219H363ZM69 219H79V220H69ZM245 216H251V220H245ZM265 217H271V220H265ZM319 219H323V220H319ZM329 218H358V220H329ZM363 219H373V220H363ZM71 220H79V221H71ZM84 218H113V221H84ZM119 219H123V221H119ZM171 218H177V221H171ZM246 220H251V221H246ZM329 220H357V221H329ZM363 220H371V221H363ZM73 221H79V222H73ZM85 221H103V222H85ZM120 221H122V222H120ZM129 217H135V222H129ZM172 221H177V222H172ZM319 220H322V222H319ZM338 221H357V222H338ZM362 221H369V222H362ZM73 222H80V223H73ZM85 222H99V223H85ZM190 219H196V223H190ZM307 218H313V223H307ZM320 222H321V223H320ZM328 221H334V223H328ZM343 222H357V223H343ZM108 221H114V224H108ZM172 222H178V224H172ZM190 223H195V224H190ZM219 212H222V224H219ZM246 221H252V224H246ZM264 220H270V224H264ZM74 223H80V225H74ZM173 224H178V225H173ZM189 224H252V225H189ZM263 224H269V225H263ZM347 223H356V225H347ZM362 222H368V225H362ZM86 223H95V226H86ZM171 225H179V226H171ZM263 225H273V226H263ZM327 223H333V226H327ZM361 225H368V226H361ZM74 225H81V227H74ZM109 224H115V227H109ZM150 215H154V227H150ZM155 226H179V227H155ZM189 225H253V227H189ZM263 226H286V227H263ZM288 215H291V227H288ZM347 225H355V227H347ZM87 226H95V228H87ZM128 222H134V228H128ZM143 227H179V228H143ZM189 227H209V228H189ZM212 227H223V228H212ZM224 227H225V228H224ZM226 227H253V228H226ZM263 227H299V228H263ZM308 223H314V228H308ZM361 226H367V228H361ZM75 227H81V229H75ZM110 227H116V229H110ZM128 228H179V229H128ZM263 228H314V229H263ZM326 226H332V229H326ZM360 228H367V229H360ZM75 229H82V230H75ZM110 229H117V230H110ZM127 229H160V230H127ZM281 229H315V230H281ZM347 227H354V230H347ZM88 228H95V231H88ZM111 230H117V231H111ZM127 230H146V231H127ZM296 230H315V231H296ZM325 229H331V231H325ZM76 230H82V232H76ZM108 231H117V232H108ZM127 231H134V232H127ZM308 231H315V232H308ZM324 231H333V232H324ZM347 230H353V232H347ZM360 229H366V232H360ZM89 231H95V233H89ZM103 232H117V233H103ZM324 232H338V233H324ZM76 232H83V234H76ZM90 233H95V234H90ZM97 233H117V234H97ZM324 233H343V234H324ZM347 232H352V234H347ZM359 232H366V234H359ZM90 234H109V235H90ZM263 229H269V235H263ZM332 234H352V235H332ZM77 234H83V236H77ZM90 235H104V236H90ZM337 235H351V236H337ZM359 234H365V236H359ZM90 236H98V237H90ZM342 236H351V237H342ZM150 230H154V239H150ZM151 239H154V240H151ZM288 230H291V240H288ZM150 240H154V241H150ZM189 228H195V241H189ZM219 228H222V241H219ZM247 228H253V241H247ZM263 235H268V241H263ZM151 241H154V242H151ZM173 229H179V242H173ZM263 241H269V242H263ZM150 242H154V243H150ZM155 242H179V243H155ZM263 242H287V243H263ZM288 240H292V243H288ZM127 232H133V244H127ZM138 243H179V244H138ZM263 243H303V244H263ZM309 232H315V244H309ZM111 234H117V246H111ZM324 234H331V246H324ZM110 246H117V247H110ZM324 246H332V247H324ZM103 247H117V248H103ZM324 247H339V248H324ZM90 237H95V249H90ZM97 248H117V249H97ZM324 248H345V249H324ZM347 237H351V249H347ZM324 249H351V251H324ZM127 244H179V258H127ZM189 241H253V258H189ZM263 244H315V258H263ZM127 258H168V259H127ZM271 258H315V259H271ZM325 251H351V259H325ZM127 259H142V260H127ZM301 259H315V260H301ZM324 259H351V260H324ZM90 249H117V261H90ZM325 260H351V261H325ZM90 261H109V262H90ZM333 261H351V262H333ZM77 236H84V263H77ZM91 262H97V263H91ZM189 262H256V263H189ZM345 262H351V263H345ZM77 263H83V264H77ZM150 263H294V264H150ZM358 236H365V264H358ZM77 264H81V265H77ZM124 264H317V265H124ZM361 264H365V265H361ZM107 265H334V266H107ZM95 266H346V267H95ZM86 267H356V268H86ZM79 268H364V269H79ZM73 269H368V270H73ZM70 270H179V271H70ZM263 270H372V271H263ZM69 271H120V272H69ZM319 271H373V272H319ZM325 272H373V273H325ZM68 272H117V274H68ZM324 273H373V274H324ZM68 274H87V275H68ZM90 274H117V275H90ZM325 274H352V275H325ZM353 274H373V275H353ZM69 275H84V276H69ZM91 275H117V276H91ZM189 270H253V276H189ZM358 275H373V276H358ZM70 276H84V277H70ZM127 271H179V277H127ZM263 271H315V277H263ZM358 276H371V277H358ZM73 277H84V278H73ZM127 277H139V278H127ZM358 277H369V278H358ZM90 276H117V279H90ZM127 278H138V280H127ZM173 277H179V280H173ZM203 279H238V280H203ZM263 277H269V280H263ZM303 277H315V280H303ZM203 280H239V281H203ZM325 275H351V281H325ZM203 281H238V282H203ZM127 280H179V284H127ZM203 282H239V284H203ZM263 280H315V284H263ZM142 284H179V285H142ZM263 284H300V285H263ZM156 285H170V286H156ZM91 279H117V291H91ZM173 285H179V293H173ZM271 285H285V295H271ZM286 285H300V295H286ZM271 295H284V296H271ZM287 295H300V296H287ZM77 278H84V297H77ZM90 291H117V297H90ZM228 284H239V297H228ZM271 296H285V297H271ZM286 296H300V297H286ZM302 284H315V297H302ZM324 281H351V297H324ZM77 297H83V298H77ZM91 297H117V298H91ZM127 284H139V298H127ZM142 285H154V298H142ZM156 286H164V298H156ZM165 286H170V298H165ZM172 293H179V298H172ZM189 276H200V298H189ZM203 284H214V298H203ZM216 284H226V298H216ZM228 297H238V298H228ZM241 276H253V298H241ZM263 285H269V298H263ZM271 297H284V298H271ZM287 297H300V298H287ZM302 297H314V298H302ZM325 297H351V298H325ZM358 278H365V298H358ZM92 298H93V299H92ZM167 298H169V299H167ZM173 298H174V299H173ZM359 298H360V299H359Z\"></path>"
  },
  "station_north": {
    "viewBox": "13 143 405 179",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M41 166H365V167H41ZM40 167H366V173H40ZM41 173H365V174H41ZM44 177H362V179H44ZM45 179H361V180H45ZM46 180H360V181H46ZM47 181H359V182H47ZM48 182H358V183H48ZM49 183H357V184H49ZM50 184H355V185H50ZM51 185H354V186H51ZM52 186H353V187H52ZM53 187H352V188H53ZM54 188H352V189H54ZM55 189H351V190H55ZM56 190H86V191H56ZM92 190H125V191H92ZM131 190H277V191H131ZM284 190H315V191H284ZM321 190H350V191H321ZM57 191H85V192H57ZM285 191H315V192H285ZM321 191H349V192H321ZM58 192H85V193H58ZM321 192H347V193H321ZM59 193H85V194H59ZM321 193H346V194H321ZM60 194H85V195H60ZM321 194H345V195H321ZM61 195H85V196H61ZM321 195H344V196H321ZM62 196H85V197H62ZM321 196H343V197H321ZM63 197H85V198H63ZM321 197H342V198H321ZM64 198H85V199H64ZM321 198H341V199H321ZM65 199H85V200H65ZM321 199H340V200H321ZM66 200H85V201H66ZM321 200H339V201H321ZM67 201H85V202H67ZM321 201H338V202H321ZM69 202H85V203H69ZM92 191H124V203H92ZM132 191H277V203H132ZM284 192H315V203H284ZM321 202H337V203H321ZM79 203H85V204H79ZM92 203H96V204H92ZM119 203H124V204H119ZM132 203H136V204H132ZM272 203H277V204H272ZM284 203H289V204H284ZM311 203H315V204H311ZM321 203H327V204H321ZM321 204H329V205H321ZM321 205H330V206H321ZM132 204H277V208H132ZM92 204H124V209H92ZM138 208H277V209H138ZM284 204H315V209H284ZM92 209H97V218H92ZM106 209H109V218H106ZM119 209H124V218H119ZM132 208H137V218H132ZM147 209H150V218H147ZM161 209H164V218H161ZM175 209H178V218H175ZM189 209H192V218H189ZM203 209H206V218H203ZM217 209H220V218H217ZM231 209H234V218H231ZM245 209H248V218H245ZM258 209H261V218H258ZM272 209H277V218H272ZM284 209H289V218H284ZM298 209H301V218H298ZM309 209H315V218H309ZM284 218H315V220H284ZM92 218H124V221H92ZM132 218H277V221H132ZM285 220H315V221H285ZM297 221H301V222H297ZM285 221H289V223H285ZM284 223H289V229H284ZM92 221H97V231H92ZM106 221H109V231H106ZM119 221H124V231H119ZM132 221H137V231H132ZM147 221H150V231H147ZM161 221H164V231H161ZM175 221H178V231H175ZM189 221H192V231H189ZM203 221H206V231H203ZM217 221H220V231H217ZM231 221H234V231H231ZM245 221H248V231H245ZM258 221H261V231H258ZM272 221H277V231H272ZM285 229H289V231H285ZM298 222H301V231H298ZM309 221H315V231H309ZM92 231H124V234H92ZM132 231H277V234H132ZM285 231H315V234H285ZM77 204H85V235H77ZM76 235H85V237H76ZM285 234H289V240H285ZM309 234H315V241H309ZM92 234H97V243H92ZM106 234H109V243H106ZM119 234H124V243H119ZM132 234H137V243H132ZM147 234H150V243H147ZM161 234H164V243H161ZM175 234H178V243H175ZM189 234H192V243H189ZM203 234H206V243H203ZM217 234H220V243H217ZM231 234H234V243H231ZM245 234H248V243H245ZM258 234H261V243H258ZM272 234H277V243H272ZM284 240H289V243H284ZM298 234H301V243H298ZM309 241H314V243H309ZM92 243H124V246H92ZM132 243H277V246H132ZM284 243H314V246H284ZM244 246H248V247H244ZM297 246H301V247H297ZM309 246H314V252H309ZM322 206H330V252H322ZM132 246H137V254H132ZM147 246H150V254H147ZM161 246H164V254H161ZM175 246H178V254H175ZM189 246H192V254H189ZM203 246H206V254H203ZM217 246H220V254H217ZM231 246H234V254H231ZM245 247H248V254H245ZM258 246H261V254H258ZM272 246H277V254H272ZM92 246H97V255H92ZM106 246H109V255H106ZM119 246H124V255H119ZM284 246H289V255H284ZM298 247H301V255H298ZM309 252H315V255H309ZM321 252H330V256H321ZM77 237H85V257H77ZM321 256H329V257H321ZM76 257H85V258H76ZM92 255H124V258H92ZM284 255H315V258H284ZM321 257H330V258H321ZM415 257H418V258H415ZM106 258H110V259H106ZM36 258H85V264H36ZM106 259H109V264H106ZM321 258H370V264H321ZM106 264H110V265H106ZM106 265H109V266H106ZM298 258H301V266H298ZM78 264H85V267H78ZM92 258H97V267H92ZM106 266H110V267H106ZM119 258H124V267H119ZM284 258H289V267H284ZM297 266H301V267H297ZM309 258H315V267H309ZM321 264H328V267H321ZM132 254H277V268H132ZM132 268H139V270H132ZM144 273H264V276H144ZM167 276H189V277H167ZM218 276H240V277H218ZM36 267H85V279H36ZM131 270H139V279H131ZM321 267H370V279H321ZM36 279H50V280H36ZM51 279H52V280H51ZM53 279H66V280H53ZM68 279H85V280H68ZM321 279H338V280H321ZM340 279H353V280H340ZM354 279H355V280H354ZM356 279H370V280H356ZM321 280H337V282H321ZM322 282H337V284H322ZM132 279H139V293H132ZM284 267H315V293H284ZM131 293H139V295H131ZM132 295H139V296H132ZM285 293H315V296H285ZM131 296H139V297H131ZM284 296H315V297H284ZM321 284H337V297H321ZM36 280H49V298H36ZM53 280H65V298H53ZM69 280H85V298H69ZM92 267H124V298H92ZM132 297H139V298H132ZM144 276H164V298H144ZM168 277H189V298H168ZM193 276H215V298H193ZM219 277H240V298H219ZM244 276H264V298H244ZM269 268H277V298H269ZM285 297H314V298H285ZM322 297H337V298H322ZM341 280H353V298H341ZM357 280H370V298H357ZM414 258H418V298H414ZM417 298H418V299H417Z\"></path>"
  },
  "station_chaoyang": {
    "viewBox": "0 142 401 180",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M178 165H196V166H178ZM172 166H203V167H172ZM168 167H207V168H168ZM164 168H210V169H164ZM161 169H213V170H161ZM159 170H215V171H159ZM156 171H218V172H156ZM154 172H220V173H154ZM152 173H222V174H152ZM150 174H224V175H150ZM148 175H226V176H148ZM146 176H180V177H146ZM195 176H228V177H195ZM144 177H174V178H144ZM201 177H230V178H201ZM142 178H169V179H142ZM206 178H232V179H206ZM141 179H165V180H141ZM209 179H233V180H209ZM139 180H162V181H139ZM177 180H197V181H177ZM212 180H235V181H212ZM138 181H159V182H138ZM172 181H203V182H172ZM215 181H236V182H215ZM136 182H157V183H136ZM168 182H207V183H168ZM217 182H238V183H217ZM135 183H155V184H135ZM165 183H210V184H165ZM219 183H239V184H219ZM133 184H153V185H133ZM162 184H212V185H162ZM222 184H241V185H222ZM132 185H151V186H132ZM159 185H215V186H159ZM224 185H242V186H224ZM130 186H149V187H130ZM157 186H217V187H157ZM225 186H243V187H225ZM129 187H147V188H129ZM155 187H219V188H155ZM227 187H245V188H227ZM127 188H145V189H127ZM153 188H222V189H153ZM229 188H246V189H229ZM126 189H143V190H126ZM151 189H223V190H151ZM231 189H248V190H231ZM124 190H142V191H124ZM149 190H225V191H149ZM232 190H249V191H232ZM123 191H140V192H123ZM147 191H227V192H147ZM234 191H251V192H234ZM122 192H139V193H122ZM146 192H177V193H146ZM198 192H229V193H198ZM236 192H252V193H236ZM120 193H137V194H120ZM144 193H172V194H144ZM203 193H230V194H203ZM237 193H254V194H237ZM119 194H136V195H119ZM142 194H168V195H142ZM206 194H232V195H206ZM239 194H255V195H239ZM117 195H134V196H117ZM140 195H165V196H140ZM182 195H193V196H182ZM210 195H234V196H210ZM240 195H257V196H240ZM116 196H133V197H116ZM139 196H162V197H139ZM175 196H199V197H175ZM212 196H235V197H212ZM242 196H258V197H242ZM114 197H131V198H114ZM137 197H159V198H137ZM170 197H204V198H170ZM215 197H237V198H215ZM243 197H259V198H243ZM113 198H130V199H113ZM136 198H156V199H136ZM167 198H207V199H167ZM217 198H238V199H217ZM244 198H261V199H244ZM111 199H128V200H111ZM135 199H154V200H135ZM164 199H210V200H164ZM220 199H240V200H220ZM246 199H263V200H246ZM110 200H127V201H110ZM133 200H152V201H133ZM161 200H213V201H161ZM222 200H241V201H222ZM247 200H264V201H247ZM108 201H126V202H108ZM132 201H151V202H132ZM159 201H215V202H159ZM224 201H242V202H224ZM249 201H266V202H249ZM106 202H124V203H106ZM130 202H149V203H130ZM156 202H218V203H156ZM225 202H244V203H225ZM250 202H268V203H250ZM105 203H123V204H105ZM129 203H147V204H129ZM154 203H180V204H154ZM194 203H220V204H194ZM227 203H245V204H227ZM251 203H269V204H251ZM103 204H121V205H103ZM128 204H145V205H128ZM152 204H173V205H152ZM201 204H222V205H201ZM229 204H247V205H229ZM253 204H271V205H253ZM101 205H120V206H101ZM126 205H143V206H126ZM150 205H168V206H150ZM205 205H223V206H205ZM231 205H248V206H231ZM254 205H273V206H254ZM99 206H119V207H99ZM125 206H142V207H125ZM149 206H166V207H149ZM208 206H225V207H208ZM232 206H250V207H232ZM256 206H275V207H256ZM97 207H117V208H97ZM123 207H140V208H123ZM147 207H166V208H147ZM208 207H227V208H208ZM233 207H251V208H233ZM257 207H277V208H257ZM95 208H116V209H95ZM122 208H139V209H122ZM145 208H159V209H145ZM214 208H229V209H214ZM235 208H252V209H235ZM259 208H279V209H259ZM16 209H18V210H16ZM93 209H114V210H93ZM120 209H137V210H120ZM144 209H157V210H144ZM217 209H230V210H217ZM236 209H254V210H236ZM260 209H281V210H260ZM356 209H357V210H356ZM12 210H22V211H12ZM90 210H112V211H90ZM119 210H136V211H119ZM142 210H155V211H142ZM219 210H232V211H219ZM238 210H255V211H238ZM262 210H284V211H262ZM351 210H361V211H351ZM10 211H25V212H10ZM87 211H111V212H87ZM117 211H134V212H117ZM141 211H153V212H141ZM221 211H233V212H221ZM239 211H257V212H239ZM263 211H286V212H263ZM347 211H364V212H347ZM8 212H29V213H8ZM85 212H109V213H85ZM116 212H133V213H116ZM139 212H152V213H139ZM222 212H235V213H222ZM241 212H258V213H241ZM265 212H289V213H265ZM343 212H365V213H343ZM6 213H33V214H6ZM81 213H107V214H81ZM114 213H132V214H114ZM138 213H152V214H138ZM222 213H236V214H222ZM242 213H260V214H242ZM267 213H292V214H267ZM339 213H367V214H339ZM5 214H38V215H5ZM78 214H106V215H78ZM113 214H131V215H113ZM136 214H147V215H136ZM222 214H238V215H222ZM243 214H261V215H243ZM268 214H296V215H268ZM335 214H368V215H335ZM4 215H43V216H4ZM73 215H104V216H73ZM111 215H129V216H111ZM135 215H145V216H135ZM228 215H239V216H228ZM245 215H263V216H245ZM270 215H300V216H270ZM329 215H370V216H329ZM3 216H51V217H3ZM66 216H102V217H66ZM110 216H128V217H110ZM134 216H144V217H134ZM230 216H240V217H230ZM246 216H264V217H246ZM272 216H309V217H272ZM321 216H370V217H321ZM3 217H5V218H3ZM7 217H101V218H7ZM108 217H127V218H108ZM132 217H142V218H132ZM194 204H198V218H194ZM231 217H241V218H231ZM247 217H266V218H247ZM274 217H365V218H274ZM369 217H370V218H369ZM13 218H99V219H13ZM106 218H126V219H106ZM131 218H141V219H131ZM185 203H189V219H185ZM195 218H198V219H195ZM233 218H243V219H233ZM248 218H268V219H248ZM276 218H360V219H276ZM16 219H97V220H16ZM104 219H124V220H104ZM130 219H139V220H130ZM162 208H166V220H162ZM176 204H180V220H176ZM182 219H189V220H182ZM190 219H191V220H190ZM194 219H198V220H194ZM208 208H212V220H208ZM234 219H244V220H234ZM250 219H270V220H250ZM278 219H357V220H278ZM19 220H94V221H19ZM103 220H123V221H103ZM129 220H138V221H129ZM148 214H152V221H148ZM157 220H219V221H157ZM222 215H226V221H222ZM236 220H245V221H236ZM251 220H271V221H251ZM280 220H354V221H280ZM5 221H10V222H5ZM23 221H92V222H23ZM101 221H122V222H101ZM128 221H137V222H128ZM144 221H232V222H144ZM236 221H246V222H236ZM252 221H273V222H252ZM282 221H351V222H282ZM363 221H369V222H363ZM5 222H14V223H5ZM26 222H89V223H26ZM99 222H121V223H99ZM126 222H247V223H126ZM253 222H275V223H253ZM284 222H347V223H284ZM359 222H369V223H359ZM7 223H17V224H7ZM29 223H87V224H29ZM97 223H120V224H97ZM125 223H166V224H125ZM208 223H248V224H208ZM254 223H277V224H254ZM287 223H344V224H287ZM356 223H367V224H356ZM8 224H20V225H8ZM33 224H84V225H33ZM94 224H119V225H94ZM124 224H146V225H124ZM147 224H152V225H147ZM222 224H249V225H222ZM255 224H280V225H255ZM290 224H340V225H290ZM353 224H365V225H353ZM10 225H23V226H10ZM37 225H80V226H37ZM92 225H118V226H92ZM123 225H132V226H123ZM236 225H240V226H236ZM241 225H250V226H241ZM256 225H282V226H256ZM293 225H336V226H293ZM350 225H364V226H350ZM11 226H26V227H11ZM42 226H76V227H42ZM90 226H117V227H90ZM122 226H131V227H122ZM242 226H252V227H242ZM257 226H285V227H257ZM297 226H331V227H297ZM346 226H362V227H346ZM13 227H30V228H13ZM48 227H70V228H48ZM87 227H116V228H87ZM121 227H130V228H121ZM244 227H253V228H244ZM258 227H287V228H258ZM303 227H324V228H303ZM343 227H361V228H343ZM14 228H34V229H14ZM83 228H115V229H83ZM120 228H129V229H120ZM245 228H253V229H245ZM259 228H290V229H259ZM339 228H359V229H339ZM16 229H38V230H16ZM80 229H114V230H80ZM119 229H128V230H119ZM246 229H254V230H246ZM260 229H294V230H260ZM335 229H358V230H335ZM17 230H43V231H17ZM75 230H113V231H75ZM118 230H127V231H118ZM247 230H255V231H247ZM261 230H298V231H261ZM330 230H356V231H330ZM19 231H51V232H19ZM69 231H99V232H69ZM100 231H112V232H100ZM117 231H126V232H117ZM248 231H256V232H248ZM262 231H306V232H262ZM323 231H355V232H323ZM21 232H97V233H21ZM100 232H111V233H100ZM116 232H125V233H116ZM248 232H257V233H248ZM276 232H353V233H276ZM22 233H95V234H22ZM116 233H124V234H116ZM249 233H258V234H249ZM263 232H273V234H263ZM278 233H351V234H278ZM24 234H95V235H24ZM100 233H110V235H100ZM115 234H123V235H115ZM250 234H259V235H250ZM264 234H273V235H264ZM278 234H350V235H278ZM25 235H95V236H25ZM100 235H109V236H100ZM114 235H122V236H114ZM251 235H260V236H251ZM265 235H273V236H265ZM278 235H348V236H278ZM27 236H95V237H27ZM100 236H108V237H100ZM113 236H122V237H113ZM148 225H152V237H148ZM252 236H260V237H252ZM278 236H347V237H278ZM29 237H80V238H29ZM85 237H95V238H85ZM112 237H122V238H112ZM133 225H137V238H133ZM147 237H152V238H147ZM162 224H166V238H162ZM176 223H180V238H176ZM185 223H189V238H185ZM194 223H198V238H194ZM199 237H206V238H199ZM208 224H212V238H208ZM222 225H226V238H222ZM237 226H240V238H237ZM252 237H261V238H252ZM266 236H273V238H266ZM278 237H289V238H278ZM294 237H345V238H294ZM30 238H80V239H30ZM100 237H107V239H100ZM112 238H262V239H112ZM267 238H273V239H267ZM278 238H288V239H278ZM294 238H343V239H294ZM32 239H81V240H32ZM86 238H95V240H86ZM100 239H106V240H100ZM111 239H263V240H111ZM268 239H273V240H268ZM293 239H342V240H293ZM34 240H82V241H34ZM87 240H95V241H87ZM101 240H105V241H101ZM110 240H263V241H110ZM278 239H287V241H278ZM292 240H340V241H292ZM36 241H82V242H36ZM88 241H95V242H88ZM110 241H122V242H110ZM222 241H226V242H222ZM251 241H264V242H251ZM269 240H273V242H269ZM278 241H286V242H278ZM291 241H338V242H291ZM38 242H83V243H38ZM101 241H104V243H101ZM109 242H117V243H109ZM291 242H336V243H291ZM39 243H84V244H39ZM89 242H95V244H89ZM108 243H117V244H108ZM257 242H265V244H257ZM270 242H273V244H270ZM278 242H285V244H278ZM290 243H334V244H290ZM41 244H84V245H41ZM90 244H95V245H90ZM101 243H103V245H101ZM108 244H116V245H108ZM258 244H266V245H258ZM271 244H273V245H271ZM278 244H284V245H278ZM289 244H332V245H289ZM43 245H85V246H43ZM223 242H226V246H223ZM278 245H283V246H278ZM289 245H330V246H289ZM45 246H86V247H45ZM91 245H95V247H91ZM107 245H115V247H107ZM259 245H267V247H259ZM288 246H328V247H288ZM47 247H86V248H47ZM92 247H95V248H92ZM106 247H114V248H106ZM278 246H282V248H278ZM47 248H87V249H47ZM260 247H268V249H260ZM278 248H281V249H278ZM287 247H327V249H287ZM47 249H88V250H47ZM93 248H95V250H93ZM105 248H113V250H105ZM278 249H280V250H278ZM286 249H327V250H286ZM56 250H89V251H56ZM261 249H269V251H261ZM285 250H327V251H285ZM59 251H89V252H59ZM104 250H112V252H104ZM285 251H314V252H285ZM61 252H90V253H61ZM262 251H270V253H262ZM284 252H313V253H284ZM68 253H91V254H68ZM103 252H111V254H103ZM118 242H122V254H118ZM133 241H137V254H133ZM148 241H152V254H148ZM162 241H166V254H162ZM176 241H180V254H176ZM185 241H189V254H185ZM194 241H198V254H194ZM208 241H212V254H208ZM222 246H226V254H222ZM237 241H240V254H237ZM252 242H255V254H252ZM263 253H271V254H263ZM283 253H305V254H283ZM73 254H91V255H73ZM103 254H271V255H103ZM283 254H301V255H283ZM80 255H92V256H80ZM282 255H291V256H282ZM296 255H300V256H296ZM47 250H55V257H47ZM102 255H272V257H102ZM281 256H291V257H281ZM297 256H301V257H297ZM319 251H327V257H319ZM84 256H93V258H84ZM101 257H272V258H101ZM281 257H290V258H281ZM319 257H377V258H319ZM84 258H94V259H84ZM85 259H94V260H85ZM185 258H189V260H185ZM264 258H273V260H264ZM280 258H289V260H280ZM176 258H180V261H176ZM186 260H188V261H186ZM194 258H198V261H194ZM148 258H152V262H148ZM162 258H166V262H162ZM177 261H179V262H177ZM208 258H212V262H208ZM222 258H226V262H222ZM279 260H288V262H279ZM133 258H137V263H133ZM148 262H151V263H148ZM223 262H226V263H223ZM296 257H300V263H296ZM133 263H136V264H133ZM237 258H240V264H237ZM118 258H122V265H118ZM163 264H207V265H163ZM252 258H255V265H252ZM297 263H300V265H297ZM144 265H226V266H144ZM296 265H300V266H296ZM0 257H55V267H0ZM61 253H65V267H61ZM73 255H77V267H73ZM86 260H95V267H86ZM130 266H243V267H130ZM279 262H287V267H279ZM297 266H300V267H297ZM309 253H313V267H309ZM319 258H378V267H319ZM0 267H72V268H0ZM73 267H95V268H73ZM101 258H109V268H101ZM117 267H256V268H117ZM265 260H273V268H265ZM279 267H317V268H279ZM318 267H378V268H318ZM0 268H95V271H0ZM279 268H378V271H279ZM0 271H15V272H0ZM101 268H273V274H101ZM0 272H14V275H0ZM86 271H95V275H86ZM101 274H127V275H101ZM279 271H287V275H279ZM359 271H378V275H359ZM101 275H126V278H101ZM130 277H141V278H130ZM160 277H173V278H160ZM177 277H196V278H177ZM0 275H95V279H0ZM279 275H378V279H279ZM101 278H127V286H101ZM177 278H197V287H177ZM176 287H197V289H176ZM356 279H378V297H356ZM0 279H18V298H0ZM22 279H55V298H22ZM59 279H95V298H59ZM101 286H126V298H101ZM129 278H141V298H129ZM144 277H157V298H144ZM160 278H174V298H160ZM177 289H197V298H177ZM200 277H213V298H200ZM216 277H229V298H216ZM232 277H244V298H232ZM247 274H273V298H247ZM279 279H314V298H279ZM319 279H352V298H319ZM356 297H377V298H356ZM62 298H65V299H62ZM82 298H87V299H82ZM114 298H117V299H114ZM147 298H149V299H147ZM161 298H162V299H161ZM163 298H164V299H163ZM252 298H256V299H252ZM325 298H326V299H325ZM357 298H358V299H357ZM359 298H361V299H359Z\"></path>"
  },
  "station_qinghe": {
    "viewBox": "28 97 386 151",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M50 118H392V119H50ZM50 119H393V130H50ZM50 130H392V131H50ZM51 131H392V132H51ZM64 136H379V137H64ZM63 137H379V138H63ZM65 138H378V139H65ZM66 139H377V140H66ZM67 140H375V141H67ZM68 141H374V142H68ZM70 142H373V143H70ZM71 143H371V144H71ZM73 144H370V145H73ZM74 145H368V146H74ZM75 146H116V147H75ZM149 146H294V147H149ZM299 146H321V147H299ZM326 146H367V147H326ZM77 147H117V148H77ZM122 146H143V148H122ZM148 147H294V148H148ZM299 147H320V148H299ZM326 147H366V148H326ZM78 148H118V149H78ZM300 148H320V149H300ZM325 148H365V149H325ZM79 149H118V150H79ZM123 148H142V150H123ZM147 148H295V150H147ZM324 149H363V150H324ZM80 150H119V151H80ZM301 149H319V151H301ZM324 150H362V151H324ZM82 151H119V152H82ZM124 150H141V152H124ZM146 150H296V152H146ZM323 151H361V152H323ZM83 152H120V153H83ZM125 152H140V153H125ZM145 152H297V153H145ZM302 151H318V153H302ZM323 152H360V153H323ZM84 153H120V154H84ZM125 153H139V154H125ZM145 153H298V154H145ZM303 153H317V154H303ZM322 153H358V154H322ZM85 154H121V155H85ZM126 154H139V155H126ZM144 154H298V155H144ZM322 154H357V155H322ZM86 155H121V156H86ZM144 155H299V156H144ZM304 154H316V156H304ZM321 155H356V156H321ZM88 156H122V157H88ZM127 155H138V157H127ZM143 156H299V157H143ZM321 156H355V157H321ZM89 157H122V158H89ZM143 157H300V158H143ZM305 156H315V158H305ZM320 157H354V158H320ZM90 158H123V159H90ZM128 157H137V159H128ZM142 158H300V159H142ZM320 158H353V159H320ZM91 159H123V160H91ZM142 159H301V160H142ZM306 158H314V160H306ZM92 160H124V161H92ZM129 159H136V161H129ZM141 160H301V161H141ZM307 160H313V161H307ZM319 159H351V161H319ZM130 161H135V162H130ZM140 161H302V162H140ZM318 161H351V162H318ZM92 161H125V163H92ZM140 162H173V163H140ZM265 162H269V163H265ZM270 162H302V163H270ZM308 161H312V163H308ZM317 162H351V163H317ZM119 163H126V164H119ZM131 162H134V164H131ZM139 163H146V164H139ZM171 163H173V164H171ZM285 163H289V164H285ZM291 163H303V164H291ZM309 163H311V164H309ZM317 163H323V164H317ZM120 164H126V165H120ZM132 164H133V165H132ZM139 164H145V165H139ZM310 164H311V165H310ZM294 164H304V166H294ZM316 164H323V166H316ZM120 165H127V167H120ZM138 165H145V167H138ZM120 167H128V168H120ZM294 166H305V168H294ZM315 166H323V168H315ZM137 167H145V169H137ZM92 163H97V170H92ZM103 163H106V170H103ZM121 168H128V170H121ZM182 162H185V170H182ZM200 162H203V170H200ZM219 162H222V170H219ZM238 162H241V170H238ZM256 162H259V170H256ZM294 168H306V170H294ZM92 170H98V171H92ZM102 170H106V171H102ZM112 163H115V171H112ZM120 170H129V171H120ZM136 169H145V171H136ZM151 163H154V171H151ZM160 163H164V171H160ZM170 164H173V171H170ZM181 170H186V171H181ZM200 170H204V171H200ZM212 170H218V171H212ZM219 170H223V171H219ZM235 170H237V171H235ZM238 170H242V171H238ZM246 170H255V171H246ZM256 170H260V171H256ZM265 163H268V171H265ZM275 163H279V171H275ZM285 164H288V171H285ZM294 170H307V171H294ZM314 168H323V171H314ZM329 163H332V171H329ZM338 163H341V171H338ZM347 163H351V171H347ZM92 171H129V172H92ZM135 171H307V173H135ZM92 172H130V174H92ZM135 173H223V174H135ZM225 173H237V174H225ZM238 173H242V174H238ZM245 173H307V174H245ZM313 171H351V174H313ZM266 174H268V175H266ZM295 174H307V175H295ZM92 174H97V182H92ZM112 174H115V182H112ZM121 174H130V182H121ZM171 174H173V182H171ZM182 174H185V182H182ZM200 174H203V182H200ZM219 174H222V182H219ZM238 174H241V182H238ZM256 174H259V182H256ZM338 174H341V182H338ZM347 174H351V182H347ZM92 182H98V183H92ZM103 174H106V183H103ZM111 182H115V183H111ZM120 182H130V183H120ZM135 174H145V183H135ZM151 174H154V183H151ZM160 174H164V183H160ZM170 182H173V183H170ZM182 182H255V183H182ZM256 182H260V183H256ZM265 175H268V183H265ZM275 174H279V183H275ZM285 174H288V183H285ZM294 175H307V183H294ZM313 174H323V183H313ZM329 174H332V183H329ZM338 182H342V183H338ZM346 182H351V183H346ZM92 183H130V185H92ZM135 183H307V185H135ZM313 183H351V185H313ZM92 185H98V186H92ZM102 185H106V186H102ZM111 185H119V186H111ZM120 185H130V186H120ZM150 185H154V186H150ZM155 185H156V186H155ZM170 185H173V186H170ZM200 185H204V186H200ZM219 185H223V186H219ZM256 185H260V186H256ZM265 185H269V186H265ZM275 185H307V186H275ZM328 185H332V186H328ZM338 185H343V186H338ZM346 185H351V186H346ZM200 186H203V192H200ZM219 186H222V192H219ZM265 186H268V192H265ZM171 186H173V193H171ZM182 185H185V193H182ZM199 192H204V193H199ZM219 192H223V193H219ZM238 185H241V193H238ZM256 186H259V193H256ZM266 192H268V193H266ZM92 186H97V194H92ZM103 186H106V194H103ZM112 186H115V194H112ZM121 186H130V194H121ZM135 185H145V194H135ZM151 186H154V194H151ZM160 185H164V194H160ZM171 193H268V194H171ZM285 186H288V194H285ZM313 185H323V194H313ZM329 186H332V194H329ZM338 186H341V194H338ZM347 186H351V194H347ZM135 194H154V195H135ZM155 194H164V195H155ZM170 194H269V195H170ZM275 186H279V195H275ZM280 194H284V195H280ZM285 194H289V195H285ZM290 194H293V195H290ZM294 186H307V195H294ZM49 194H130V197H49ZM135 195H307V197H135ZM313 194H393V197H313ZM120 197H130V198H120ZM285 197H289V198H285ZM346 197H393V198H346ZM170 197H269V201H170ZM170 201H270V202H170ZM49 197H97V206H49ZM103 197H106V206H103ZM112 197H115V206H112ZM121 198H130V206H121ZM135 197H145V206H135ZM151 197H154V206H151ZM160 197H164V206H160ZM170 202H182V206H170ZM260 202H270V206H260ZM275 197H279V206H275ZM285 198H288V206H285ZM294 197H307V206H294ZM313 197H323V206H313ZM329 197H332V206H329ZM338 197H341V206H338ZM347 198H393V206H347ZM260 206H274V207H260ZM275 206H307V207H275ZM49 206H130V209H49ZM135 206H182V209H135ZM260 207H307V209H260ZM313 206H393V209H313ZM49 209H97V217H49ZM103 209H106V217H103ZM112 209H115V217H112ZM121 209H130V217H121ZM135 209H145V217H135ZM151 209H154V217H151ZM160 209H164V217H160ZM170 209H182V217H170ZM260 209H269V217H260ZM275 209H279V217H275ZM285 209H288V217H285ZM294 209H307V217H294ZM313 209H323V217H313ZM329 209H332V217H329ZM338 209H341V217H338ZM347 209H393V217H347ZM49 217H130V227H49ZM135 217H182V227H135ZM185 205H200V227H185ZM203 205H219V227H203ZM222 205H239V227H222ZM242 205H257V227H242ZM260 217H307V227H260ZM313 217H393V227H313Z\"></path>"
  },
  "station_yizhuang": {
    "viewBox": "37 103 333 145",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M56 121H351V122H56ZM55 122H352V140H55ZM56 140H351V141H56ZM57 141H350V142H57ZM58 142H348V143H58ZM59 143H347V144H59ZM61 144H345V145H61ZM67 148H68V149H67ZM70 148H339V149H70ZM66 149H340V150H66ZM67 150H340V151H67ZM68 151H338V152H68ZM69 152H338V153H69ZM70 153H337V154H70ZM71 154H336V155H71ZM72 155H335V156H72ZM72 156H334V157H72ZM73 157H333V158H73ZM74 158H332V159H74ZM75 159H331V160H75ZM76 160H330V161H76ZM78 161H329V162H78ZM95 162H311V171H95ZM95 171H114V172H95ZM122 174H147V175H122ZM150 174H288V175H150ZM117 175H290V185H117ZM95 172H113V186H95ZM118 185H289V186H118ZM294 171H311V186H294ZM63 186H75V187H63ZM80 186H113V187H80ZM294 186H315V187H294ZM320 186H345V187H320ZM56 187H114V188H56ZM294 187H350V188H294ZM56 188H115V189H56ZM292 188H350V189H292ZM56 189H116V190H56ZM291 189H350V190H291ZM56 190H118V191H56ZM289 190H350V191H289ZM56 191H119V192H56ZM288 191H350V192H288ZM56 192H124V198H56ZM130 190H278V198H130ZM283 192H350V198H283ZM104 198H124V202H104ZM56 198H68V203H56ZM77 198H81V203H77ZM91 198H94V203H91ZM104 202H125V203H104ZM283 198H303V203H283ZM313 198H316V203H313ZM326 198H329V203H326ZM339 198H350V203H339ZM56 203H125V206H56ZM283 203H350V206H283ZM312 206H316V207H312ZM90 206H94V211H90ZM56 206H68V212H56ZM77 206H81V212H77ZM91 211H94V212H91ZM104 206H125V212H104ZM283 206H303V212H283ZM313 207H316V212H313ZM326 206H329V212H326ZM339 206H350V212H339ZM56 212H125V215H56ZM283 212H350V215H283ZM90 215H94V216H90ZM103 215H125V216H103ZM312 215H316V216H312ZM338 215H350V216H338ZM91 216H94V220H91ZM104 216H125V220H104ZM313 216H316V220H313ZM339 216H350V220H339ZM56 215H68V221H56ZM77 215H81V221H77ZM90 220H94V221H90ZM103 220H124V221H103ZM283 215H303V221H283ZM312 220H316V221H312ZM326 215H329V221H326ZM338 220H350V221H338ZM56 221H124V226H56ZM130 198H143V228H130ZM56 226H125V229H56ZM129 228H143V229H129ZM57 229H124V230H57ZM130 229H143V230H130ZM147 202H165V230H147ZM169 202H188V230H169ZM192 202H213V230H192ZM217 202H237V230H217ZM241 202H260V230H241ZM264 198H278V230H264ZM283 221H350V230H283Z\"></path>"
  },
  "station_tongzhou": {
    "viewBox": "0 69 407 184",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M1 92H3V93H1ZM1 93H4V94H1ZM2 94H6V95H2ZM382 94H384V95H382ZM2 95H8V96H2ZM380 95H384V96H380ZM3 96H9V97H3ZM379 96H383V97H379ZM3 97H11V98H3ZM194 97H196V98H194ZM377 97H383V98H377ZM4 98H12V99H4ZM192 98H197V99H192ZM376 98H382V99H376ZM4 99H14V100H4ZM191 99H198V100H191ZM374 99H382V100H374ZM5 100H16V101H5ZM190 100H200V101H190ZM373 100H381V101H373ZM6 101H17V102H6ZM189 101H201V102H189ZM371 101H381V102H371ZM6 102H19V103H6ZM188 102H202V103H188ZM370 102H380V103H370ZM7 103H21V104H7ZM186 103H203V104H186ZM368 103H380V104H368ZM7 104H22V105H7ZM185 104H204V105H185ZM366 104H379V105H366ZM8 105H24V106H8ZM184 105H206V106H184ZM364 105H378V106H364ZM9 106H26V107H9ZM182 106H207V107H182ZM363 106H378V107H363ZM9 107H28V108H9ZM181 107H209V108H181ZM361 107H377V108H361ZM10 108H30V109H10ZM179 108H210V109H179ZM359 108H377V109H359ZM10 109H32V110H10ZM178 109H211V110H178ZM357 109H376V110H357ZM11 110H34V111H11ZM176 110H213V111H176ZM355 110H375V111H355ZM12 111H36V112H12ZM175 111H215V112H175ZM354 111H375V112H354ZM12 112H38V113H12ZM173 112H216V113H173ZM352 112H374V113H352ZM13 113H40V114H13ZM171 113H218V114H171ZM350 113H373V114H350ZM14 114H43V115H14ZM170 114H219V115H170ZM348 114H373V115H348ZM14 115H45V116H14ZM168 115H221V116H168ZM346 115H372V116H346ZM15 116H47V117H15ZM166 116H223V117H166ZM343 116H371V117H343ZM16 117H50V118H16ZM164 117H225V118H164ZM341 117H371V118H341ZM16 118H52V119H16ZM162 118H226V119H162ZM339 118H370V119H339ZM17 119H55V120H17ZM160 119H228V120H160ZM337 119H369V120H337ZM18 120H57V121H18ZM158 120H231V121H158ZM334 120H369V121H334ZM19 121H60V122H19ZM155 121H233V122H155ZM331 121H368V122H331ZM19 122H63V123H19ZM153 122H235V123H153ZM328 122H368V123H328ZM21 123H67V124H21ZM150 123H194V124H150ZM196 123H237V124H196ZM325 123H366V124H325ZM23 124H70V125H23ZM147 124H192V125H147ZM197 124H240V125H197ZM323 124H364V125H323ZM25 125H74V126H25ZM144 125H191V126H144ZM198 125H243V126H198ZM320 125H362V126H320ZM27 126H77V127H27ZM141 126H189V127H141ZM200 126H246V127H200ZM316 126H360V127H316ZM29 127H82V128H29ZM137 127H188V128H137ZM194 127H195V128H194ZM202 127H249V128H202ZM313 127H358V128H313ZM31 128H87V129H31ZM133 128H186V129H133ZM193 128H197V129H193ZM203 128H253V129H203ZM309 128H356V129H309ZM34 129H93V130H34ZM127 129H184V130H127ZM191 129H198V130H191ZM205 129H257V130H205ZM305 129H354V130H305ZM36 130H103V131H36ZM118 130H183V131H118ZM190 130H200V131H190ZM206 130H262V131H206ZM299 130H352V131H299ZM27 131H29V132H27ZM38 131H181V132H38ZM188 131H202V132H188ZM208 131H268V132H208ZM292 131H350V132H292ZM358 131H360V132H358ZM27 132H32V133H27ZM41 132H179V133H41ZM186 132H203V133H186ZM210 132H348V133H210ZM356 132H359V133H356ZM28 133H34V134H28ZM43 133H177V134H43ZM185 133H205V134H185ZM212 133H345V134H212ZM354 133H358V134H354ZM29 134H36V135H29ZM46 134H175V135H46ZM183 134H206V135H183ZM214 134H343V135H214ZM351 134H357V135H351ZM30 135H39V136H30ZM48 135H173V136H48ZM181 135H208V136H181ZM216 135H340V136H216ZM349 135H357V136H349ZM31 136H41V137H31ZM51 136H171V137H51ZM179 136H210V137H179ZM218 136H338V137H218ZM347 136H356V137H347ZM32 137H43V138H32ZM53 137H169V138H53ZM177 137H212V138H177ZM220 137H335V138H220ZM344 137H355V138H344ZM33 138H46V139H33ZM56 138H166V139H56ZM175 138H214V139H175ZM223 138H332V139H223ZM342 138H354V139H342ZM34 139H48V140H34ZM59 139H164V140H59ZM173 139H216V140H173ZM225 139H329V140H225ZM339 139H353V140H339ZM35 140H51V141H35ZM63 140H161V141H63ZM171 140H218V141H171ZM228 140H326V141H228ZM337 140H352V141H337ZM36 141H54V142H36ZM66 141H158V142H66ZM168 141H221V142H168ZM231 141H323V142H231ZM334 141H351V142H334ZM37 142H57V143H37ZM70 142H155V143H70ZM166 142H223V143H166ZM234 142H320V143H234ZM331 142H350V143H331ZM38 143H60V144H38ZM73 143H151V144H73ZM163 143H225V144H163ZM237 143H316V144H237ZM328 143H349V144H328ZM39 144H63V145H39ZM77 144H148V145H77ZM161 144H228V145H161ZM240 144H312V145H240ZM325 144H348V145H325ZM40 145H67V146H40ZM83 145H144V146H83ZM158 145H191V146H158ZM198 145H231V146H198ZM244 145H308V146H244ZM322 145H347V146H322ZM41 146H71V147H41ZM88 146H139V147H88ZM154 146H189V147H154ZM193 145H196V147H193ZM200 146H234V147H200ZM248 146H303V147H248ZM319 146H346V147H319ZM42 147H75V148H42ZM95 147H132V148H95ZM151 147H188V148H151ZM192 147H196V148H192ZM201 147H238V148H201ZM254 147H297V148H254ZM315 147H345V148H315ZM43 148H79V149H43ZM106 148H121V149H106ZM147 148H241V149H147ZM262 148H289V149H262ZM311 148H344V149H311ZM44 149H83V150H44ZM142 149H245V150H142ZM306 149H343V150H306ZM44 150H89V151H44ZM137 150H250V151H137ZM301 150H342V151H301ZM45 151H97V152H45ZM130 151H183V152H130ZM205 151H256V152H205ZM294 151H341V152H294ZM46 152H178V153H46ZM210 152H266V153H210ZM285 152H340V153H285ZM47 153H176V154H47ZM212 153H339V154H212ZM48 154H174V155H48ZM214 154H338V155H214ZM49 155H172V156H49ZM216 155H338V156H216ZM50 156H82V157H50ZM85 156H171V157H85ZM217 156H304V157H217ZM305 156H337V157H305ZM51 157H82V158H51ZM87 157H167V158H87ZM217 157H300V158H217ZM305 157H336V158H305ZM52 158H83V159H52ZM88 158H165V159H88ZM168 157H171V159H168ZM180 152H183V159H180ZM193 151H196V159H193ZM205 152H208V159H205ZM217 158H220V159H217ZM223 158H300V159H223ZM304 158H335V159H304ZM54 159H83V160H54ZM88 159H108V160H88ZM113 159H163V160H113ZM167 159H172V160H167ZM177 159H186V160H177ZM192 159H196V160H192ZM205 159H209V160H205ZM217 159H222V160H217ZM224 159H274V160H224ZM279 159H299V160H279ZM304 159H334V160H304ZM55 160H84V161H55ZM89 160H108V161H89ZM113 160H275V161H113ZM303 160H332V161H303ZM56 161H84V162H56ZM89 161H107V162H89ZM112 161H275V162H112ZM280 160H298V162H280ZM303 161H331V162H303ZM57 162H85V163H57ZM90 162H107V163H90ZM112 162H276V163H112ZM302 162H330V163H302ZM58 163H85V164H58ZM111 163H153V164H111ZM205 163H208V164H205ZM235 163H276V164H235ZM281 162H297V164H281ZM302 163H329V164H302ZM59 164H86V165H59ZM91 163H106V165H91ZM111 164H150V165H111ZM205 164H209V165H205ZM238 164H277V165H238ZM282 164H296V165H282ZM301 164H328V165H301ZM60 165H87V166H60ZM92 165H105V166H92ZM240 165H277V166H240ZM282 165H295V166H282ZM301 165H327V166H301ZM61 166H87V167H61ZM92 166H104V167H92ZM110 165H148V167H110ZM205 165H208V167H205ZM245 166H278V167H245ZM283 166H295V167H283ZM300 166H326V167H300ZM62 167H88V168H62ZM93 167H104V168H93ZM109 167H141V168H109ZM247 167H278V168H247ZM283 167H294V168H283ZM300 167H325V168H300ZM63 168H88V169H63ZM109 168H137V169H109ZM250 168H279V169H250ZM284 168H294V169H284ZM299 168H324V169H299ZM64 169H89V170H64ZM94 168H103V170H94ZM108 169H137V170H108ZM205 167H209V170H205ZM252 169H279V170H252ZM284 169H293V170H284ZM298 169H323V170H298ZM65 170H89V171H65ZM108 170H130V171H108ZM133 170H137V171H133ZM145 167H148V171H145ZM156 163H160V171H156ZM168 163H171V171H168ZM180 163H183V171H180ZM193 163H196V171H193ZM205 170H208V171H205ZM217 163H220V171H217ZM229 163H232V171H229ZM252 170H255V171H252ZM257 170H280V171H257ZM285 170H292V171H285ZM298 170H322V171H298ZM66 171H90V172H66ZM95 170H102V172H95ZM107 171H128V172H107ZM131 171H137V172H131ZM138 171H139V172H138ZM144 171H172V172H144ZM173 171H175V172H173ZM179 171H184V172H179ZM185 171H186V172H185ZM187 171H191V172H187ZM192 171H227V172H192ZM228 171H232V172H228ZM240 166H244V172H240ZM245 171H250V172H245ZM251 171H256V172H251ZM259 171H280V172H259ZM286 171H292V172H286ZM297 171H321V172H297ZM68 172H90V173H68ZM96 172H101V173H96ZM107 172H281V173H107ZM286 172H291V173H286ZM297 172H320V173H297ZM69 173H91V174H69ZM106 173H281V174H106ZM287 173H291V174H287ZM296 173H319V174H296ZM70 174H92V175H70ZM97 173H100V175H97ZM105 174H129V175H105ZM132 174H282V175H132ZM287 174H290V175H287ZM296 174H318V175H296ZM71 175H92V176H71ZM98 175H99V176H98ZM105 175H115V176H105ZM122 175H125V176H122ZM145 175H148V176H145ZM205 175H208V176H205ZM273 175H282V176H273ZM288 175H290V176H288ZM295 175H316V176H295ZM72 176H93V177H72ZM121 176H125V177H121ZM144 176H148V177H144ZM273 176H283V177H273ZM294 176H315V177H294ZM73 177H93V178H73ZM104 176H114V178H104ZM274 177H283V178H274ZM294 177H314V178H294ZM74 178H94V179H74ZM274 178H284V179H274ZM293 178H313V179H293ZM75 179H94V180H75ZM103 178H113V180H103ZM275 179H284V180H275ZM293 179H312V180H293ZM76 180H95V181H76ZM103 180H112V181H103ZM275 180H285V181H275ZM292 180H311V181H292ZM78 181H95V182H78ZM292 181H310V182H292ZM79 182H95V183H79ZM102 181H112V183H102ZM122 177H125V183H122ZM133 175H137V183H133ZM145 177H148V183H145ZM156 175H160V183H156ZM168 175H171V183H168ZM180 175H183V183H180ZM193 175H196V183H193ZM205 176H209V183H205ZM217 175H220V183H217ZM229 175H232V183H229ZM240 175H244V183H240ZM252 175H255V183H252ZM263 175H267V183H263ZM276 181H285V183H276ZM291 182H309V183H291ZM80 183H96V184H80ZM101 183H285V184H101ZM291 183H307V184H291ZM81 184H96V185H81ZM102 184H285V185H102ZM291 184H306V185H291ZM82 185H96V186H82ZM101 185H285V186H101ZM291 185H305V186H291ZM83 186H96V187H83ZM101 186H112V187H101ZM121 186H125V187H121ZM144 186H149V187H144ZM167 186H172V187H167ZM180 186H184V187H180ZM192 186H198V187H192ZM205 186H209V187H205ZM217 186H221V187H217ZM229 186H233V187H229ZM291 186H304V187H291ZM291 187H303V188H291ZM85 187H96V189H85ZM86 189H96V190H86ZM101 187H111V194H101ZM122 187H125V194H122ZM133 186H137V194H133ZM145 187H148V194H145ZM156 186H160V194H156ZM168 187H171V194H168ZM180 187H183V194H180ZM193 187H196V194H193ZM205 187H208V194H205ZM217 187H220V194H217ZM229 187H232V194H229ZM240 186H244V194H240ZM252 186H255V194H252ZM263 186H267V194H263ZM276 186H285V194H276ZM83 194H84V195H83ZM85 190H96V195H85ZM291 188H302V195H291ZM101 194H285V199H101ZM23 195H96V201H23ZM24 201H96V202H24ZM291 195H363V202H291ZM102 199H285V203H102ZM85 202H96V204H85ZM86 204H96V205H86ZM291 202H301V205H291ZM85 205H96V206H85ZM261 203H285V206H261ZM291 205H302V206H291ZM27 206H96V207H27ZM130 206H147V207H130ZM174 206H192V207H174ZM196 206H214V207H196ZM240 206H257V207H240ZM26 207H96V210H26ZM102 203H127V212H102ZM101 212H127V213H101ZM129 207H148V213H129ZM27 210H96V214H27ZM101 213H126V218H101ZM261 206H286V219H261ZM102 218H126V225H102ZM26 214H96V226H26ZM27 226H96V228H27ZM130 213H148V228H130ZM261 219H285V228H261ZM26 228H96V229H26ZM101 225H126V229H101ZM129 228H148V229H129ZM195 207H214V229H195ZM239 207H257V229H239ZM260 228H285V229H260ZM27 229H95V230H27ZM102 229H126V230H102ZM130 229H147V230H130ZM151 206H170V230H151ZM173 207H192V230H173ZM196 229H214V230H196ZM218 206H236V230H218ZM240 229H257V230H240ZM261 229H285V230H261ZM291 206H360V230H291Z\"></path>"
  },
  "station_capital": {
    "viewBox": "0 116 418 125",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M162 140H237V141H162ZM143 141H254V142H143ZM127 142H271V143H127ZM113 143H285V144H113ZM101 144H297V145H101ZM90 145H309V146H90ZM79 146H320V147H79ZM68 147H331V148H68ZM59 148H192V149H59ZM197 148H198V149H197ZM207 148H340V149H207ZM50 149H154V150H50ZM245 149H349V150H245ZM42 150H136V151H42ZM263 150H357V151H263ZM33 151H120V152H33ZM279 151H365V152H279ZM25 152H106V153H25ZM160 152H239V153H160ZM292 152H374V153H292ZM17 153H93V154H17ZM139 153H261V154H139ZM305 153H382V154H305ZM9 154H82V155H9ZM121 154H277V155H121ZM317 154H390V155H317ZM1 155H71V156H1ZM106 155H291V156H106ZM328 155H396V156H328ZM0 156H61V157H0ZM95 156H303V157H95ZM338 156H397V157H338ZM0 157H51V158H0ZM84 157H315V158H84ZM347 157H397V158H347ZM0 158H41V159H0ZM73 158H327V159H73ZM357 158H397V159H357ZM0 159H32V160H0ZM61 159H337V160H61ZM366 159H397V160H366ZM0 160H24V161H0ZM50 160H348V161H50ZM374 160H397V161H374ZM0 161H14V162H0ZM40 161H358V162H40ZM382 161H397V162H382ZM0 162H6V163H0ZM30 162H367V163H30ZM391 162H397V163H391ZM0 163H4V164H0ZM21 163H180V164H21ZM181 163H211V164H181ZM213 163H377V164H213ZM393 163H396V164H393ZM10 164H151V165H10ZM153 164H163V165H153ZM168 164H179V165H168ZM181 164H212V165H181ZM214 164H225V165H214ZM230 164H240V165H230ZM243 164H386V165H243ZM1 165H152V166H1ZM154 165H163V166H154ZM167 165H178V166H167ZM180 165H213V166H180ZM215 165H225V166H215ZM230 165H239V166H230ZM242 165H258V166H242ZM259 165H395V166H259ZM2 166H120V167H2ZM124 166H135V167H124ZM137 166H153V167H137ZM155 166H163V167H155ZM167 166H177V167H167ZM179 166H213V167H179ZM216 166H225V167H216ZM230 166H238V167H230ZM241 166H259V167H241ZM260 166H269V167H260ZM274 166H394V167H274ZM4 167H110V168H4ZM111 167H120V168H111ZM124 167H134V168H124ZM136 167H154V168H136ZM156 167H163V168H156ZM168 167H176V168H168ZM179 167H180V168H179ZM212 167H214V168H212ZM217 167H221V168H217ZM230 167H237V168H230ZM240 167H259V168H240ZM261 167H270V168H261ZM274 167H284V168H274ZM286 167H392V168H286ZM5 168H86V169H5ZM90 168H100V169H90ZM101 168H110V169H101ZM112 168H120V169H112ZM124 168H133V169H124ZM135 168H154V169H135ZM157 168H160V169H157ZM171 168H175V169H171ZM178 168H196V169H178ZM197 168H211V169H197ZM212 168H215V169H212ZM218 168H222V169H218ZM224 168H225V169H224ZM233 168H237V169H233ZM240 168H242V169H240ZM244 168H260V169H244ZM262 168H270V169H262ZM274 168H283V169H274ZM285 168H390V169H285ZM7 169H86V170H7ZM90 169H99V170H90ZM101 169H111V170H101ZM113 169H120V170H113ZM124 169H132V170H124ZM134 169H141V170H134ZM152 169H155V170H152ZM157 169H163V170H157ZM177 169H196V170H177ZM197 169H216V170H197ZM219 169H226V170H219ZM230 169H236V170H230ZM239 169H242V170H239ZM257 169H261V170H257ZM263 169H269V170H263ZM274 169H282V170H274ZM284 169H304V170H284ZM306 169H316V170H306ZM319 169H388V170H319ZM9 170H55V171H9ZM57 170H77V171H57ZM79 170H86V171H79ZM90 170H98V171H90ZM100 170H112V171H100ZM114 170H120V171H114ZM125 170H126V171H125ZM128 170H131V171H128ZM133 170H136V171H133ZM142 170H156V171H142ZM158 170H163V171H158ZM167 169H174V171H167ZM176 170H181V171H176ZM182 170H196V171H182ZM238 170H255V171H238ZM258 170H261V171H258ZM263 170H266V171H263ZM275 170H281V171H275ZM284 170H305V171H284ZM319 170H330V171H319ZM331 170H386V171H331ZM11 171H54V172H11ZM58 171H67V172H58ZM69 171H78V172H69ZM90 171H97V172H90ZM99 171H113V172H99ZM115 171H118V172H115ZM127 171H131V172H127ZM133 171H156V172H133ZM167 171H173V172H167ZM175 171H196V172H175ZM212 170H217V172H212ZM220 170H226V172H220ZM230 170H235V172H230ZM237 171H262V172H237ZM264 171H270V172H264ZM274 171H280V172H274ZM283 171H286V172H283ZM287 171H306V172H287ZM307 170H316V172H307ZM319 171H329V172H319ZM331 171H384V172H331ZM13 172H47V173H13ZM48 172H54V173H48ZM58 172H66V173H58ZM68 172H79V173H68ZM80 171H86V173H80ZM90 172H96V173H90ZM99 172H104V173H99ZM110 172H113V173H110ZM116 172H120V173H116ZM124 172H130V173H124ZM132 172H157V173H132ZM159 171H163V173H159ZM167 172H172V173H167ZM175 172H181V173H175ZM212 172H218V173H212ZM221 172H226V173H221ZM230 172H234V173H230ZM237 172H242V173H237ZM282 172H286V173H282ZM298 172H307V173H298ZM308 172H316V173H308ZM319 172H328V173H319ZM330 172H344V173H330ZM346 172H354V173H346ZM358 172H382V173H358ZM15 173H30V174H15ZM33 173H48V174H33ZM49 173H54V174H49ZM58 173H65V174H58ZM67 173H79V174H67ZM81 173H85V174H81ZM90 173H92V174H90ZM93 173H96V174H93ZM98 173H101V174H98ZM105 173H114V174H105ZM116 173H121V174H116ZM131 173H157V174H131ZM174 173H181V174H174ZM256 172H263V174H256ZM265 172H270V174H265ZM274 172H279V174H274ZM281 173H299V174H281ZM304 173H307V174H304ZM309 173H316V174H309ZM319 173H327V174H319ZM329 173H345V174H329ZM346 173H355V174H346ZM358 173H380V174H358ZM17 174H22V175H17ZM24 174H30V175H24ZM33 174H41V175H33ZM42 174H48V175H42ZM50 174H54V175H50ZM66 174H80V175H66ZM82 174H84V175H82ZM90 174H95V175H90ZM97 174H115V175H97ZM124 173H129V175H124ZM131 174H158V175H131ZM167 173H171V175H167ZM212 173H219V175H212ZM222 173H226V175H222ZM230 173H233V175H230ZM236 173H242V175H236ZM274 174H278V175H274ZM281 174H308V175H281ZM310 174H316V175H310ZM323 174H326V175H323ZM329 174H346V175H329ZM347 174H355V175H347ZM358 174H367V175H358ZM369 174H378V175H369ZM19 175H23V176H19ZM33 175H40V176H33ZM41 175H49V176H41ZM58 174H64V176H58ZM66 175H72V176H66ZM77 175H81V176H77ZM82 175H86V176H82ZM96 175H115V176H96ZM117 174H121V176H117ZM130 175H158V176H130ZM160 173H163V176H160ZM173 174H181V176H173ZM212 175H220V176H212ZM235 175H242V176H235ZM256 174H264V176H256ZM266 174H270V176H266ZM274 175H277V176H274ZM280 175H309V176H280ZM320 174H321V176H320ZM322 175H325V176H322ZM328 175H346V176H328ZM348 175H355V176H348ZM358 175H366V176H358ZM368 175H376V176H368ZM21 176H23V177H21ZM25 175H30V177H25ZM33 176H39V177H33ZM41 176H50V177H41ZM51 175H54V177H51ZM61 176H63V177H61ZM65 176H68V177H65ZM73 176H81V177H73ZM89 175H94V177H89ZM96 176H116V177H96ZM124 175H128V177H124ZM167 175H170V177H167ZM223 175H226V177H223ZM230 175H232V177H230ZM273 176H277V177H273ZM279 176H309V177H279ZM311 175H316V177H311ZM319 176H325V177H319ZM327 176H331V177H327ZM336 176H347V177H336ZM358 176H365V177H358ZM367 176H374V177H367ZM26 177H30V178H26ZM40 177H50V178H40ZM58 176H59V178H58ZM60 177H63V178H60ZM65 177H67V178H65ZM69 177H82V178H69ZM83 176H86V178H83ZM95 177H116V178H95ZM118 176H121V178H118ZM129 176H159V178H129ZM161 176H163V178H161ZM172 176H181V178H172ZM182 172H196V178H182ZM197 170H211V178H197ZM212 176H221V178H212ZM234 176H242V178H234ZM256 176H265V178H256ZM267 176H270V178H267ZM279 177H310V178H279ZM319 177H324V178H319ZM326 177H337V178H326ZM344 177H347V178H344ZM349 176H355V178H349ZM358 177H364V178H358ZM366 177H374V178H366ZM21 177H24V179H21ZM33 177H38V179H33ZM40 178H44V179H40ZM52 177H54V179H52ZM64 178H82V179H64ZM89 177H93V179H89ZM95 178H117V179H95ZM124 177H127V179H124ZM128 178H137V179H128ZM138 178H150V179H138ZM152 178H160V179H152ZM167 177H169V179H167ZM171 178H176V179H171ZM178 178H181V179H178ZM183 178H188V179H183ZM192 178H194V179H192ZM233 178H242V179H233ZM243 172H255V179H243ZM256 178H266V179H256ZM268 178H270V179H268ZM273 177H276V179H273ZM278 178H311V179H278ZM312 177H316V179H312ZM325 178H348V179H325ZM350 178H355V179H350ZM27 178H30V180H27ZM33 179H37V180H33ZM39 179H41V180H39ZM48 178H51V180H48ZM52 179H55V180H52ZM58 178H62V180H58ZM63 179H82V180H63ZM94 179H100V180H94ZM102 179H110V180H102ZM113 179H117V180H113ZM128 179H132V180H128ZM156 179H160V180H156ZM162 178H164V180H162ZM167 179H168V180H167ZM171 179H181V180H171ZM183 179H196V180H183ZM198 178H211V180H198ZM224 177H226V180H224ZM230 177H231V180H230ZM233 179H237V180H233ZM262 179H266V180H262ZM268 179H271V180H268ZM278 179H282V180H278ZM302 179H306V180H302ZM307 179H311V180H307ZM319 178H323V180H319ZM330 179H349V180H330ZM358 178H363V180H358ZM365 178H374V180H365ZM21 179H25V181H21ZM45 180H51V181H45ZM53 180H54V181H53ZM63 180H67V181H63ZM69 180H76V181H69ZM84 178H86V181H84ZM94 180H98V181H94ZM109 180H110V181H109ZM113 180H118V181H113ZM119 178H121V181H119ZM128 180H160V181H128ZM212 178H222V181H212ZM233 180H242V181H233ZM269 180H271V181H269ZM273 179H275V181H273ZM277 180H286V181H277ZM287 180H299V181H287ZM301 180H304V181H301ZM307 180H312V181H307ZM319 180H322V181H319ZM324 179H329V181H324ZM331 180H342V181H331ZM343 180H349V181H343ZM351 179H355V181H351ZM358 180H362V181H358ZM364 180H368V181H364ZM28 180H30V182H28ZM38 180H44V182H38ZM57 180H61V182H57ZM62 181H66V182H62ZM72 181H73V182H72ZM74 181H76V182H74ZM79 180H83V182H79ZM85 181H86V182H85ZM89 179H92V182H89ZM124 179H126V182H124ZM256 180H267V182H256ZM277 181H312V182H277ZM313 179H316V182H313ZM363 181H368V182H363ZM21 181H26V183H21ZM29 182H30V183H29ZM32 180H36V183H32ZM45 181H52V183H45ZM62 182H68V183H62ZM89 182H91V183H89ZM93 181H111V183H93ZM112 181H118V183H112ZM127 181H161V183H127ZM170 180H196V183H170ZM212 181H223V183H212ZM287 182H312V183H287ZM319 181H321V183H319ZM323 181H342V183H323ZM343 181H350V183H343ZM352 181H355V183H352ZM358 181H361V183H358ZM363 182H367V183H363ZM37 182H44V184H37ZM57 182H60V184H57ZM61 183H68V184H61ZM69 182H76V184H69ZM77 182H84V184H77ZM232 181H242V184H232ZM314 182H316V184H314ZM319 183H320V184H319ZM362 183H367V184H362ZM32 183H35V185H32ZM57 184H59V185H57ZM61 184H76V185H61ZM92 183H111V185H92ZM276 182H286V185H276ZM322 183H342V185H322ZM343 183H351V185H343ZM358 183H360V185H358ZM362 184H366V185H362ZM21 183H27V186H21ZM36 184H44V186H36ZM45 183H53V186H45ZM112 183H119V186H112ZM169 183H196V186H169ZM212 183H224V186H212ZM256 182H268V186H256ZM287 183H313V186H287ZM353 183H355V186H353ZM358 185H359V186H358ZM32 185H34V187H32ZM126 183H162V187H126ZM231 184H242V187H231ZM343 185H352V187H343ZM361 185H365V187H361ZM60 185H76V188H60ZM77 184H85V188H77ZM275 185H286V188H275ZM321 185H342V188H321ZM35 186H44V189H35ZM91 185H111V189H91ZM125 187H163V189H125ZM168 186H196V189H168ZM287 186H314V189H287ZM320 188H342V189H320ZM343 187H353V189H343ZM21 186H28V190H21ZM34 189H44V190H34ZM45 186H54V190H45ZM59 188H68V190H59ZM69 188H76V190H69ZM77 188H86V190H77ZM90 189H100V190H90ZM101 189H111V190H101ZM112 186H120V190H112ZM125 189H137V190H125ZM138 189H163V190H138ZM168 189H181V190H168ZM182 189H196V190H182ZM197 180H211V190H197ZM212 186H225V190H212ZM230 187H242V190H230ZM243 180H255V190H243ZM256 186H269V190H256ZM274 188H286V190H274ZM287 189H299V190H287ZM300 189H315V190H300ZM320 189H330V190H320ZM331 189H342V190H331ZM343 189H354V190H343ZM360 187H365V190H360ZM34 190H37V191H34ZM51 190H54V191H51ZM59 190H62V191H59ZM75 190H76V191H75ZM83 190H86V191H83ZM90 190H94V191H90ZM117 190H120V191H117ZM125 190H129V191H125ZM159 190H163V191H159ZM168 190H172V191H168ZM222 190H225V191H222ZM230 190H234V191H230ZM266 190H269V191H266ZM274 190H278V191H274ZM311 190H315V191H311ZM320 190H324V191H320ZM350 190H354V191H350ZM34 191H54V193H34ZM21 190H29V194H21ZM320 191H354V194H320ZM33 193H54V202H33ZM59 191H86V202H59ZM90 191H120V202H90ZM125 191H163V202H125ZM168 191H225V202H168ZM230 191H269V202H230ZM274 191H315V202H274ZM319 194H354V202H319ZM20 194H29V203H20ZM59 202H63V204H59ZM117 202H120V204H117ZM319 202H324V204H319ZM97 204H102V205H97ZM103 204H109V205H103ZM110 204H120V205H110ZM319 204H332V205H319ZM41 204H48V206H41ZM133 204H140V206H133ZM141 204H149V206H141ZM41 206H49V207H41ZM133 206H149V207H133ZM207 204H214V208H207ZM236 204H243V208H236ZM320 205H332V208H320ZM59 204H82V209H59ZM83 202H86V209H83ZM189 204H197V209H189ZM198 204H206V211H198ZM235 208H243V211H235ZM280 204H296V211H280ZM319 208H332V211H319ZM21 203H29V212H21ZM33 202H40V212H33ZM41 207H48V212H41ZM50 202H54V212H50ZM59 209H86V212H59ZM90 202H95V212H90ZM96 205H120V212H96ZM125 202H131V212H125ZM133 207H140V212H133ZM141 207H149V212H141ZM150 204H158V212H150ZM159 202H163V212H159ZM168 202H178V212H168ZM180 204H188V212H180ZM189 209H196V212H189ZM198 211H205V212H198ZM207 208H215V212H207ZM216 202H225V212H216ZM230 202H234V212H230ZM236 211H243V212H236ZM244 204H252V212H244ZM253 204H261V212H253ZM263 202H269V212H263ZM274 202H279V212H274ZM280 211H287V212H280ZM289 211H296V212H289ZM297 204H304V212H297ZM305 202H315V212H305ZM320 211H332V212H320ZM333 204H341V212H333ZM342 204H349V212H342ZM350 202H354V212H350ZM359 190H365V212H359ZM369 180H374V212H369ZM1 212H57V213H1ZM58 212H89V213H58ZM90 212H121V213H90ZM122 212H394V213H122ZM0 213H395V216H0ZM1 216H394V217H1Z\"></path>"
  },
  "station_daxing": {
    "viewBox": "68 130 306 271",
    "body": "<path fill=\"currentColor\" stroke=\"none\" fill-rule=\"evenodd\" d=\"M212 146H219V147H212ZM223 146H230V147H223ZM210 147H219V148H210ZM223 147H233V148H223ZM208 148H219V149H208ZM223 148H234V149H223ZM206 149H219V150H206ZM223 149H236V150H223ZM205 150H219V151H205ZM223 150H237V151H223ZM204 151H219V153H204ZM223 151H238V153H223ZM223 153H239V161H223ZM203 153H219V162H203ZM204 162H219V166H204ZM223 161H238V166H223ZM223 166H237V169H223ZM205 166H219V170H205ZM223 169H236V173H223ZM206 170H219V174H206ZM223 173H235V178H223ZM207 174H219V179H207ZM208 179H219V185H208ZM223 178H234V185H223ZM223 185H233V196H223ZM223 196H232V204H223ZM209 185H219V213H209ZM223 204H233V214H223ZM98 214H106V215H98ZM336 214H344V215H336ZM96 215H108V216H96ZM334 215H346V216H334ZM94 216H110V217H94ZM332 216H348V217H332ZM93 217H112V218H93ZM208 213H219V218H208ZM330 217H349V218H330ZM92 218H113V219H92ZM223 214H234V219H223ZM328 218H350V219H328ZM91 219H115V220H91ZM327 219H351V220H327ZM90 220H117V221H90ZM325 220H352V221H325ZM89 221H119V222H89ZM207 218H219V222H207ZM223 219H235V222H223ZM323 221H353V222H323ZM89 222H120V223H89ZM321 222H353V223H321ZM91 223H122V224H91ZM206 222H219V224H206ZM223 222H236V224H223ZM320 223H352V224H320ZM93 224H124V225H93ZM318 224H349V225H318ZM96 225H126V226H96ZM205 224H219V226H205ZM223 224H237V226H223ZM316 225H346V226H316ZM99 226H128V227H99ZM314 226H343V227H314ZM86 227H90V228H86ZM102 227H130V228H102ZM204 226H219V228H204ZM223 226H238V228H223ZM312 227H340V228H312ZM352 227H356V228H352ZM86 228H93V229H86ZM105 228H132V229H105ZM203 228H219V229H203ZM223 228H239V229H223ZM310 228H337V229H310ZM349 228H356V229H349ZM85 229H96V230H85ZM108 229H134V230H108ZM202 229H219V230H202ZM223 229H240V230H223ZM308 229H335V230H308ZM347 229H357V230H347ZM85 230H98V231H85ZM110 230H137V231H110ZM201 230H219V231H201ZM305 230H332V231H305ZM344 230H357V231H344ZM85 231H101V232H85ZM113 231H139V232H113ZM200 231H219V232H200ZM223 230H241V232H223ZM303 231H329V232H303ZM341 231H357V232H341ZM84 232H104V233H84ZM115 232H141V233H115ZM199 232H219V233H199ZM223 232H243V233H223ZM301 232H327V233H301ZM338 232H358V233H338ZM84 233H106V234H84ZM118 233H144V234H118ZM198 233H219V234H198ZM223 233H244V234H223ZM298 233H324V234H298ZM336 233H358V234H336ZM84 234H109V235H84ZM121 234H147V235H121ZM196 234H219V235H196ZM223 234H245V235H223ZM295 234H321V235H295ZM333 234H358V235H333ZM84 235H112V236H84ZM124 235H150V236H124ZM195 235H219V236H195ZM223 235H247V236H223ZM291 235H318V236H291ZM330 235H358V236H330ZM84 236H115V237H84ZM127 236H154V237H127ZM193 236H219V237H193ZM223 236H249V237H223ZM288 236H316V237H288ZM327 236H358V237H327ZM84 237H118V238H84ZM129 237H158V238H129ZM190 237H219V238H190ZM223 237H252V238H223ZM284 237H313V238H284ZM325 237H358V238H325ZM84 238H120V239H84ZM132 238H163V239H132ZM186 238H219V239H186ZM223 238H255V239H223ZM279 238H310V239H279ZM322 238H358V239H322ZM84 239H123V240H84ZM134 239H172V240H134ZM179 239H219V240H179ZM223 239H262V240H223ZM270 239H307V240H270ZM319 239H358V240H319ZM84 240H126V241H84ZM137 240H219V241H137ZM223 240H305V241H223ZM316 240H358V241H316ZM84 241H128V242H84ZM140 241H219V242H140ZM223 241H302V242H223ZM314 241H358V242H314ZM85 242H131V243H85ZM143 242H219V243H143ZM223 242H300V243H223ZM311 242H357V243H311ZM85 243H134V244H85ZM146 243H197V244H146ZM204 243H219V244H204ZM223 243H237V244H223ZM246 243H297V244H246ZM308 243H357V244H308ZM86 244H136V245H86ZM148 244H194V245H148ZM206 244H219V245H206ZM223 244H236V245H223ZM248 244H294V245H248ZM306 244H356V245H306ZM87 245H139V246H87ZM151 245H193V246H151ZM249 245H291V246H249ZM303 245H355V246H303ZM89 246H142V247H89ZM153 246H192V247H153ZM250 246H289V247H250ZM300 246H353V247H300ZM94 247H144V248H94ZM156 247H191V248H156ZM250 247H286V248H250ZM297 247H349V248H297ZM101 248H147V249H101ZM159 248H191V249H159ZM251 248H283V249H251ZM295 248H342V249H295ZM107 249H150V250H107ZM161 249H191V250H161ZM207 245H219V250H207ZM223 245H235V250H223ZM251 249H281V250H251ZM292 249H334V250H292ZM113 250H153V251H113ZM164 250H191V251H164ZM206 250H219V251H206ZM223 250H236V251H223ZM251 250H278V251H251ZM289 250H329V251H289ZM118 251H155V252H118ZM166 251H192V252H166ZM205 251H219V252H205ZM223 251H237V252H223ZM250 251H275V252H250ZM287 251H324V252H287ZM123 252H158V253H123ZM169 252H193V253H169ZM203 252H219V253H203ZM223 252H239V253H223ZM249 252H273V253H249ZM284 252H320V253H284ZM126 253H161V254H126ZM172 253H195V254H172ZM201 253H219V254H201ZM223 253H241V254H223ZM247 253H270V254H247ZM281 253H316V254H281ZM130 254H163V255H130ZM174 254H219V255H174ZM223 254H268V255H223ZM279 254H313V255H279ZM133 255H166V256H133ZM177 255H218V256H177ZM224 255H265V256H224ZM276 255H309V256H276ZM136 256H169V257H136ZM179 256H218V257H179ZM224 256H262V257H224ZM273 256H307V257H273ZM139 257H171V258H139ZM182 257H217V258H182ZM225 257H260V258H225ZM271 257H304V258H271ZM141 258H174V259H141ZM185 258H216V259H185ZM226 258H257V259H226ZM268 258H301V259H268ZM143 259H176V260H143ZM187 259H215V260H187ZM227 259H255V260H227ZM265 259H299V260H265ZM146 260H179V261H146ZM190 260H214V261H190ZM228 260H252V261H228ZM263 260H297V261H263ZM148 261H181V262H148ZM192 261H213V262H192ZM229 261H249V262H229ZM260 261H295V262H260ZM150 262H184V263H150ZM195 262H212V263H195ZM230 262H246V263H230ZM257 262H292V263H257ZM152 263H187V264H152ZM198 263H210V264H198ZM232 263H244V264H232ZM255 263H290V264H255ZM153 264H190V265H153ZM200 264H208V265H200ZM234 264H241V265H234ZM252 264H289V265H252ZM155 265H192V266H155ZM203 265H205V266H203ZM237 265H238V266H237ZM249 265H287V266H249ZM157 266H195V267H157ZM247 266H285V267H247ZM158 267H197V268H158ZM244 267H284V268H244ZM159 268H200V269H159ZM242 268H282V269H242ZM161 269H203V270H161ZM239 269H281V270H239ZM162 270H204V271H162ZM238 270H280V271H238ZM163 271H205V272H163ZM237 271H279V272H237ZM164 272H206V273H164ZM236 272H278V273H236ZM165 273H207V274H165ZM235 273H277V274H235ZM166 274H207V275H166ZM234 274H276V275H234ZM167 275H208V276H167ZM233 275H275V276H233ZM168 276H209V277H168ZM233 276H274V277H233ZM168 277H186V278H168ZM192 277H210V278H192ZM232 277H249V278H232ZM256 277H274V278H256ZM169 278H184V279H169ZM195 278H211V279H195ZM231 278H247V279H231ZM259 278H273V279H259ZM169 279H182V280H169ZM197 279H211V280H197ZM260 279H273V280H260ZM169 280H181V281H169ZM197 280H212V281H197ZM230 279H245V281H230ZM261 280H273V281H261ZM198 281H212V283H198ZM198 283H213V285H198ZM229 281H244V285H229ZM170 281H181V286H170ZM197 285H213V286H197ZM261 281H272V286H261ZM170 286H182V287H170ZM196 286H212V287H196ZM229 285H245V287H229ZM260 286H272V287H260ZM170 287H184V288H170ZM195 287H211V288H195ZM230 287H247V288H230ZM259 287H272V288H259ZM169 288H186V289H169ZM193 288H210V289H193ZM231 288H249V289H231ZM256 288H273V289H256ZM169 289H209V290H169ZM216 289H226V290H216ZM232 289H273V290H232ZM169 290H208V291H169ZM215 290H227V291H215ZM233 290H273V291H233ZM169 291H207V292H169ZM214 291H228V292H214ZM235 291H273V292H235ZM168 292H206V293H168ZM213 292H229V293H213ZM236 292H274V293H236ZM168 293H205V294H168ZM211 293H230V294H211ZM237 293H274V294H237ZM167 294H204V295H167ZM210 294H232V295H210ZM238 294H275V295H238ZM167 295H202V296H167ZM209 295H233V296H209ZM239 295H275V296H239ZM166 296H201V297H166ZM208 296H234V297H208ZM241 296H276V297H241ZM166 297H200V298H166ZM207 297H235V298H207ZM242 297H276V298H242ZM165 298H199V299H165ZM206 298H236V299H206ZM243 298H277V299H243ZM165 299H198V300H165ZM204 299H237V300H204ZM244 299H277V300H244ZM164 300H197V301H164ZM203 300H239V301H203ZM245 300H278V301H245ZM163 301H195V302H163ZM202 301H240V302H202ZM246 301H279V302H246ZM163 302H194V303H163ZM201 302H241V303H201ZM247 302H279V303H247ZM162 303H193V304H162ZM200 303H242V304H200ZM249 303H280V304H249ZM161 304H192V305H161ZM199 304H243V305H199ZM250 304H281V305H250ZM161 305H191V306H161ZM197 305H244V306H197ZM251 305H281V306H251ZM160 306H190V307H160ZM196 306H246V307H196ZM252 306H282V307H252ZM159 307H188V308H159ZM195 307H247V308H195ZM254 307H283V308H254ZM158 308H187V309H158ZM194 308H248V309H194ZM255 308H284V309H255ZM157 309H186V310H157ZM193 309H218V310H193ZM224 309H249V310H224ZM256 309H284V310H256ZM157 310H185V311H157ZM192 310H216V311H192ZM226 310H250V311H226ZM257 310H285V311H257ZM156 311H184V312H156ZM190 311H215V312H190ZM227 311H251V312H227ZM258 311H286V312H258ZM155 312H182V313H155ZM189 312H214V313H189ZM228 312H253V313H228ZM259 312H287V313H259ZM154 313H181V314H154ZM188 313H213V314H188ZM228 313H254V314H228ZM261 313H288V314H261ZM153 314H180V315H153ZM187 314H213V315H187ZM229 314H255V315H229ZM262 314H289V315H262ZM152 315H179V316H152ZM186 315H212V316H186ZM230 315H256V316H230ZM263 315H290V316H263ZM151 316H178V317H151ZM184 316H212V317H184ZM230 316H257V317H230ZM264 316H291V317H264ZM150 317H177V318H150ZM183 317H211V318H183ZM231 317H258V318H231ZM265 317H292V318H265ZM149 318H175V319H149ZM182 318H211V319H182ZM231 318H260V319H231ZM267 318H293V319H267ZM148 319H174V320H148ZM181 319H210V320H181ZM231 319H261V320H231ZM268 319H294V320H268ZM147 320H173V321H147ZM180 320H210V321H180ZM232 320H262V321H232ZM269 320H295V321H269ZM146 321H172V322H146ZM179 321H210V322H179ZM232 321H263V322H232ZM270 321H296V322H270ZM145 322H171V323H145ZM177 322H210V323H177ZM232 322H264V323H232ZM271 322H297V323H271ZM144 323H169V324H144ZM176 323H209V324H176ZM233 323H266V324H233ZM273 323H298V324H273ZM142 324H168V325H142ZM175 324H209V325H175ZM233 324H267V325H233ZM274 324H300V325H274ZM141 325H167V326H141ZM174 325H209V326H174ZM233 325H268V326H233ZM275 325H301V326H275ZM140 326H166V327H140ZM173 326H209V327H173ZM233 326H269V327H233ZM276 326H302V327H276ZM139 327H164V328H139ZM171 327H209V328H171ZM233 327H270V328H233ZM277 327H303V328H277ZM137 328H163V329H137ZM170 328H209V329H170ZM233 328H272V329H233ZM278 328H305V329H278ZM136 329H162V330H136ZM169 329H208V330H169ZM233 329H273V330H233ZM280 329H306V330H280ZM134 330H161V331H134ZM168 330H208V331H168ZM233 330H274V331H233ZM281 330H307V331H281ZM133 331H160V332H133ZM167 331H208V332H167ZM234 331H275V332H234ZM282 331H309V332H282ZM131 332H159V333H131ZM165 332H208V333H165ZM234 332H276V333H234ZM283 332H310V333H283ZM130 333H157V334H130ZM164 333H208V334H164ZM234 333H278V334H234ZM284 333H312V334H284ZM128 334H156V335H128ZM163 334H208V335H163ZM234 334H279V335H234ZM286 334H313V335H286ZM127 335H155V336H127ZM162 335H208V336H162ZM234 335H280V336H234ZM287 335H315V336H287ZM125 336H154V337H125ZM161 336H208V337H161ZM233 336H281V337H233ZM288 336H317V337H288ZM123 337H153V338H123ZM159 337H208V338H159ZM233 337H282V338H233ZM289 337H319V338H289ZM121 338H151V339H121ZM158 338H209V339H158ZM233 338H283V339H233ZM291 338H321V339H291ZM120 339H150V340H120ZM157 339H209V340H157ZM233 339H285V340H233ZM292 339H322V340H292ZM118 340H149V341H118ZM156 340H209V341H156ZM233 340H286V341H233ZM293 340H324V341H293ZM116 341H148V342H116ZM155 341H209V342H155ZM233 341H287V342H233ZM294 341H326V342H294ZM114 342H146V343H114ZM154 342H209V343H154ZM233 342H288V343H233ZM295 342H328V343H295ZM112 343H145V344H112ZM152 343H209V344H152ZM233 343H289V344H233ZM297 343H330V344H297ZM110 344H144V345H110ZM151 344H210V345H151ZM232 344H291V345H232ZM298 344H332V345H298ZM108 345H143V346H108ZM150 345H210V346H150ZM232 345H292V346H232ZM299 345H334V346H299ZM106 346H142V347H106ZM149 346H210V347H149ZM232 346H293V347H232ZM300 346H336V347H300ZM104 347H140V348H104ZM147 347H211V348H147ZM231 347H294V348H231ZM301 347H338V348H301ZM103 348H139V349H103ZM146 348H211V349H146ZM231 348H295V349H231ZM303 348H339V349H303ZM102 349H138V350H102ZM145 349H211V350H145ZM231 349H297V350H231ZM304 349H340V350H304ZM101 350H137V351H101ZM144 350H212V351H144ZM230 350H298V351H230ZM305 350H341V351H305ZM101 351H136V352H101ZM143 351H212V352H143ZM230 351H299V352H230ZM306 351H341V352H306ZM100 352H134V353H100ZM142 352H213V353H142ZM229 352H300V353H229ZM307 352H342V353H307ZM100 353H133V354H100ZM140 353H190V354H140ZM207 353H214V354H207ZM228 353H235V354H228ZM252 353H302V354H252ZM309 353H342V354H309ZM100 354H132V355H100ZM139 354H184V355H139ZM208 354H214V355H208ZM227 354H234V355H227ZM257 354H303V355H257ZM310 354H342V355H310ZM101 355H131V356H101ZM138 355H180V356H138ZM209 355H216V356H209ZM226 355H233V356H226ZM262 355H304V356H262ZM311 355H341V356H311ZM101 356H129V357H101ZM137 356H177V357H137ZM209 356H217V357H209ZM225 356H233V357H225ZM265 356H305V357H265ZM312 356H341V357H312ZM102 357H128V358H102ZM135 357H174V358H135ZM210 357H219V358H210ZM223 357H232V358H223ZM268 357H306V358H268ZM314 357H340V358H314ZM102 358H127V359H102ZM134 358H172V359H134ZM211 358H231V359H211ZM270 358H308V359H270ZM315 358H340V359H315ZM103 359H126V360H103ZM133 359H170V360H133ZM212 359H230V360H212ZM272 359H309V360H272ZM316 359H339V360H316ZM103 360H125V361H103ZM132 360H168V361H132ZM213 360H229V361H213ZM274 360H310V361H274ZM317 360H339V361H317ZM104 361H123V362H104ZM131 361H166V362H131ZM215 361H227V362H215ZM276 361H311V362H276ZM319 361H338V362H319ZM105 362H122V363H105ZM129 362H164V363H129ZM217 362H225V363H217ZM277 362H312V363H277ZM320 362H337V363H320ZM105 363H121V364H105ZM128 363H163V364H128ZM279 363H314V364H279ZM321 363H337V364H321ZM106 364H120V365H106ZM127 364H161V365H127ZM280 364H315V365H280ZM322 364H336V365H322ZM107 365H118V366H107ZM126 365H160V366H126ZM282 365H316V366H282ZM323 365H335V366H323ZM108 366H117V367H108ZM125 366H159V367H125ZM283 366H317V367H283ZM325 366H334V367H325ZM108 367H116V368H108ZM123 367H157V368H123ZM284 367H318V368H284ZM326 367H333V368H326ZM109 368H115V369H109ZM122 368H156V369H122ZM286 368H320V369H286ZM327 368H333V369H327ZM110 369H113V370H110ZM121 369H155V370H121ZM287 369H321V370H287ZM329 369H332V370H329ZM120 370H153V371H120ZM288 370H322V371H288ZM119 371H152V372H119ZM290 371H323V372H290ZM118 372H151V373H118ZM291 372H324V373H291ZM116 373H150V374H116ZM292 373H326V374H292ZM115 374H148V375H115ZM293 374H326V375H293ZM115 375H147V376H115ZM295 375H326V376H295ZM116 376H146V377H116ZM296 376H326V377H296ZM117 377H145V378H117ZM297 377H325V378H297ZM118 378H143V379H118ZM299 378H324V379H299ZM119 379H142V380H119ZM300 379H323V380H300ZM120 380H141V381H120ZM301 380H322V381H301ZM121 381H139V382H121ZM303 381H321V382H303ZM123 382H138V383H123ZM304 382H319V383H304ZM124 383H137V384H124ZM305 383H318V384H305ZM126 384H135V385H126ZM307 384H315V385H307Z\"></path>"
  }
};

STATION_ICON_REPLICA_LIBRARY.station_fengtai = STATION_ICON_REPLICA_LIBRARY.station_yizhuang;

if (typeof window !== "undefined") {
  window.ICON_REPLICA_LIBRARY = Object.assign(window.ICON_REPLICA_LIBRARY || {}, STATION_ICON_REPLICA_LIBRARY);
}

const ICON_REPLICA_LIBRARY =
  typeof window !== "undefined" && window.ICON_REPLICA_LIBRARY ? window.ICON_REPLICA_LIBRARY : STATION_ICON_REPLICA_LIBRARY;

function renderIcon(name, className) {
  const resolvedName = ICON_ALIASES[name] || name;
  const iconDef = ICON_REPLICA_LIBRARY[resolvedName] || ICON_LIBRARY[resolvedName] || ICON_LIBRARY.grid;
  let svgBody = typeof iconDef === "string" ? iconDef : iconDef.body;
  const viewBox = typeof iconDef === "string" ? "0 0 24 24" : iconDef.viewBox || "0 0 24 24";
  return `<svg class="${className}" viewBox="${viewBox}" aria-hidden="true" data-icon="${resolvedName}">${svgBody}</svg>`;
}

function iconMarkup(name) {
  return renderIcon(name, "icon");
}

function anchorIcon(name, className = "") {
  return renderIcon(name, className ? `anchor-icon ${className}` : "anchor-icon");
}

function stationHeroImage(id, variant = "landscape") {
  const assets = variant === "portrait" ? stationPortraitAssets : stationHeroAssets;
  const src = assets[id] || assets.west;
  return `${src}?v=20260527-2`;
}

function stationIconMarkup(id) {
  return iconMarkup(stationIconNames[id] || stationIconNames.west);
}

function stationKindLabel(id) {
  return id === "capital" || id === "daxing" ? "机场" : "火车站";
}

function pickSplashImage(kind) {
  const choices = splashImageSets[kind] || splashImageSets.traveler;
  const storageKey = `arrive-beijing.splash.${kind}`;
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved && choices.includes(saved)) return saved;
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    sessionStorage.setItem(storageKey, chosen);
    return chosen;
  } catch (error) {
    return choices[Math.floor(Math.random() * choices.length)];
  }
}

const travelerNav = [
  { x: 0, y: 90.4, w: 20, h: 9.6, to: "#/station/home" },
  { x: 20, y: 90.4, w: 20, h: 9.6, to: "#/nav/map" },
  { x: 40, y: 90.4, w: 20, h: 9.6, to: "#/traffic/mixed" },
  { x: 60, y: 90.4, w: 20, h: 9.6, to: "#/announcements" },
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
    src: "P02-01_京通首页-clear.jpg",
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
  const from = route();
  if (from !== to) {
    state.previousRoute = from;
    if (from === "#/station/home" && to === "#/driver/short-haul/booking") {
      state.shortHaulBackTo = "#/station/home";
    } else if (!from.startsWith("#/driver/short-haul/") && !to.startsWith("#/driver/short-haul/")) {
      state.shortHaulBackTo = "#/driver/queue";
    }
  }
  location.hash = to;
}

function syncDesktopPreviewFrame() {
  const isAnchorPreview = app.classList.contains("anchor-app");
  const isMobilePreview = app.classList.contains("mobile-preview-app");
  const isDesignPreview = app.classList.contains("design-system-app");
  const isPreviewFrame = isAnchorPreview || isMobilePreview || isDesignPreview;
  const isDesktopPreview = (isAnchorPreview || isMobilePreview || isDesignPreview) && window.innerWidth >= 1000;
  const baseWidth = isAnchorPreview ? 864 : 430;
  const baseHeight = isAnchorPreview ? 1728 : 860;
  const viewportPadding = isDesktopPreview ? 32 : 0;
  const mobileScreenWidth = window.screen && window.screen.width ? window.screen.width : window.innerWidth;
  const mobileScreenHeight = window.screen && window.screen.height ? window.screen.height : window.innerHeight;
  const mobileViewportHeight = window.visualViewport && window.visualViewport.height ? window.visualViewport.height : window.innerHeight;
  const mobileVisualWidth = Math.min(window.innerWidth, mobileScreenWidth);
  const mobileVisualHeight = Math.min(window.innerHeight, mobileScreenHeight, mobileViewportHeight);
  const availableWidth = Math.max(1, (isDesktopPreview ? window.innerWidth : mobileVisualWidth) - viewportPadding);
  const availableHeight = Math.max(1, (isDesktopPreview ? window.innerHeight : mobileVisualHeight) - viewportPadding);
  const scale = isDesktopPreview
    ? Math.min(availableWidth / baseWidth, availableHeight / baseHeight)
    : isPreviewFrame
      ? Math.min(availableWidth / baseWidth, 1)
      : 1;
  const layoutHeight = isDesktopPreview || !isPreviewFrame ? baseHeight : availableHeight / scale;
  const visualWidth = baseWidth * scale;
  const visualHeight = layoutHeight * scale;
  const visualLeft = isDesktopPreview ? Math.max(0, (window.innerWidth - visualWidth) / 2) : 0;
  app.style.setProperty("--desktop-preview-scale", String(scale));
  document.documentElement.style.setProperty("--preview-layout-height", `${layoutHeight}px`);
  document.documentElement.style.setProperty("--desktop-preview-scale", String(scale));
  document.documentElement.style.setProperty("--preview-frame-width", `${visualWidth}px`);
  document.documentElement.style.setProperty("--preview-frame-height", `${visualHeight}px`);
  document.documentElement.style.setProperty("--preview-frame-left", `${visualLeft}px`);
  document.body.classList.toggle("desktop-preview", isDesktopPreview);
  document.body.classList.toggle("scaled-mobile-preview", isPreviewFrame && !isDesktopPreview);
}

function updateStationCarouselSelection(carousel) {
  const slides = [...carousel.querySelectorAll("[data-station]")];
  if (!slides.length) return;
  const carouselBox = carousel.getBoundingClientRect();
  const center = carouselBox.left + carouselBox.width / 2;
  const nearest = slides.reduce((best, slide) => {
    const box = slide.getBoundingClientRect();
    const distance = Math.abs(box.left + box.width / 2 - center);
    return !best || distance < best.distance ? { slide, distance } : best;
  }, null);
  if (!nearest) return;
  const stationId = nearest.slide.dataset.station;
  state.draftStation = stationId;
  slides.forEach((slide) => slide.classList.toggle("active", slide.dataset.station === stationId));
  const [id, name] = stationById(stationId);
  const nameNode = document.querySelector("[data-selected-station-name]");
  const kindNode = document.querySelector("[data-selected-station-kind]");
  if (nameNode) nameNode.textContent = name;
  if (kindNode) kindNode.textContent = stationKindLabel(id);
}

function syncStationCarousel() {
  const gridScroller = document.querySelector(".station-grid-source");
  if (gridScroller) {
    const active = gridScroller.querySelector(`[data-station="${state.draftStation}"]`);
    if (!active) return;
    active.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    return;
  }
  const carousel = document.querySelector("[data-station-carousel]");
  if (!carousel) return;
  const active = carousel.querySelector(`[data-station="${state.draftStation}"]`);
  if (!active) return;
  active.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
}

function scheduleStationCarouselSync() {
  const gridScroller = document.querySelector(".station-grid-source");
  const reveal = () => {
    if (gridScroller) gridScroller.classList.remove("is-preparing");
  };
  const sync = () => syncStationCarousel();
  sync();
  reveal();
  requestAnimationFrame(() => {
    sync();
    reveal();
    window.setTimeout(sync, 80);
    window.setTimeout(sync, 260);
  });
  document.querySelectorAll(".station-grid-source img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", sync, { once: true });
  });
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

function getToastPositionStyle() {
  const nav = document.querySelector(".ab-bottom-nav, .bottom-nav, .anchor-bottom-nav");
  if (!nav) return "";
  const rect = nav.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  if (!rect.width || rect.top <= 0 || rect.top >= viewportHeight) return "";
  const top = Math.max(16, Math.round(rect.top - 62));
  return ` style="top:${top}px;bottom:auto;"`;
}

function showToast(message) {
  if (!modalRoot) return;
  window.clearTimeout(toastTimer);
  modalRoot.classList.remove("open");
  modalRoot.innerHTML = `<div class="toast"${getToastPositionStyle()}>${message}</div>`;
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

  const radiusTokens = [
    ["控件圆角", "--ds-radius-control", "8px"],
    ["小卡片", "--ds-radius-card-sm", "10px"],
    ["标准卡片", "--ds-radius-card", "12px"],
    ["头图/媒体", "--ds-radius-media", "14px"],
    ["胶囊", "--ds-radius-pill", "999px"],
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

  const calibrationIconGroups = [
    {
      title: "第一批校准",
      icons: [
        ["pin", "定位"],
        ["map", "导航地图"],
        ["route", "交通路线"],
        ["notice", "站区公告"],
        ["search", "搜索"],
        ["user", "身份"],
        ["taxi", "出租车"],
        ["car", "网约车"],
        ["transfer", "场站接驳"],
      ],
    },
    {
      title: "设置反馈",
      icons: [
        ["message", "消息"],
        ["globe", "语言"],
        ["accessibility", "无障碍"],
        ["shield", "账号安全"],
        ["lock", "隐私"],
        ["ear", "辅助"],
        ["feedback", "反馈"],
        ["phone", "电话"],
        ["mail", "邮箱"],
      ],
    },
    {
      title: "服务工具",
      icons: [
        ["home", "首页"],
        ["parking", "停车"],
        ["points", "积分"],
        ["calendar", "日期"],
        ["clock", "时间"],
        ["back", "返回"],
        ["train", "车站"],
        ["people", "人群"],
        ["history", "历史"],
      ],
    },
    {
      title: "的士之家",
      icons: [
        ["lounge", "休息"],
        ["dining", "餐饮"],
        ["charger", "充电"],
        ["wifi", "WIFI"],
        ["tea", "茶水"],
        ["book", "阅读"],
        ["medical", "急救"],
        ["restroom", "洗手间"],
        ["gift", "兑换"],
      ],
    },
    {
      title: "控件补齐",
      icons: [
        ["check", "确认"],
        ["more", "更多"],
        ["question", "问号"],
        ["refresh", "刷新"],
        ["settings", "设置"],
        ["edit", "编辑"],
        ["scan", "扫码"],
        ["camera", "相机"],
        ["id", "证件"],
      ],
    },
    {
      title: "出行反馈",
      icons: [
        ["angry", "情绪"],
        ["bike", "骑行"],
        ["bus", "公交"],
        ["chat", "沟通"],
        ["cup", "杯子"],
        ["glove", "手套"],
        ["leaf", "绿色"],
        ["logout", "退出"],
        ["paper", "文档"],
      ],
    },
    {
      title: "补齐杂项",
      icons: [
        ["pillow", "枕头"],
        ["plane", "飞机"],
        ["grid", "九宫格"],
        ["handshake", "握手"],
        ["qr", "二维码"],
        ["thumb", "点赞"],
        ["gift", "礼品"],
        ["scan", "扫码"],
        ["camera", "相机"],
      ],
    },
    {
      title: "站点轮廓 A",
      icons: [
        ["station_beijing", "北京站"],
        ["station_west", "北京西站"],
        ["station_south", "北京南站"],
        ["station_north", "北京北站"],
        ["station_chaoyang", "朝阳站"],
        ["station_qinghe", "清河站"],
        ["station_fengtai", "丰台站"],
        ["station_tongzhou", "通州站"],
        ["station_capital", "首都机场"],
      ],
    },
    {
      title: "站点轮廓 B",
      icons: [
        ["station_daxing", "大兴机场"],
        ["station_beijing", "北京站"],
        ["station_west", "北京西站"],
        ["station_south", "北京南站"],
        ["station_north", "北京北站"],
        ["station_chaoyang", "朝阳站"],
        ["station_qinghe", "清河站"],
        ["station_fengtai", "丰台站"],
        ["station_tongzhou", "通州站"],
      ],
    },
    {
      title: "交通接驳",
      icons: [
        ["walk", "步行"],
        ["metro", "地铁"],
        ["traffic_bus", "公交"],
        ["traffic_taxi", "出租"],
        ["car", "网约"],
        ["route_swap", "起终点交换"],
        ["filter_sliders", "偏好筛选"],
        ["departure_time", "出发时间"],
        ["route_recommend", "推荐"],
      ],
    },
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
            <h2>图标系统</h2>
            <span>十批复刻</span>
          </div>
          ${calibrationIconGroups
            .map(
              (group) => `
                <div class="card padded ds-icon-panel">
                  <div class="ds-icon-panel-title">${group.title}</div>
                  <div class="ds-icon-grid">
                    ${group.icons
                      .map(
                        ([icon, label]) => `
                          <span class="ds-icon-sample" data-toast="${label}图标">
                            <span>${iconMarkup(icon)}</span>
                            <strong>${label}</strong>
                          </span>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
            )
            .join("")}
        </section>

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
            <h2>圆角 Token</h2>
            <span>按 430px 业务画布校准</span>
          </div>
          <div class="card padded ds-radius-grid">
            ${radiusTokens
              .map(
                ([label, token, value]) => `
                  <article class="ds-radius-sample" style="--sample-radius:var(${token})">
                    <span aria-hidden="true"></span>
                    <div>
                      <strong>${label}</strong>
                      <code>${token} · ${value}</code>
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
          { key: "house", label: "的士之家", icon: "lounge", to: "#/driver/taxi-house/info" },
          { key: "profile", label: "个人", icon: "user", to: "#/driver/profile" },
        ]
      : [
          { key: "home", label: "首页", icon: "home", to: "#/station/home" },
          { key: "nav", label: "导航", icon: "map", to: "#/nav/map" },
          { key: "traffic", label: "交通", icon: "route", to: "#/traffic/mixed" },
          { key: "notice", label: "公告", icon: "notice", to: "#/announcements" },
          { key: "profile", label: "个人", icon: "user", to: "#/profile" },
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
          const badge = typeof item === "object" && item && item.badge ? `<i class="ab-tab-badge">${item.badge}</i>` : "";
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
              ${badge}
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
  const heroPositionY = state.station === "west" ? "64%" : "bottom";
  const announcements = stationAnnouncementOverrides[state.station] || stationHomeAnnouncements;
  const trafficCards = [
    { icon: "taxi", label: "出租车", meta: "南广场出口 · 20-30分钟", to: "#/traffic/taxi" },
    { icon: "car", label: "网约车", meta: "推荐上车点 · 200m", to: "#/traffic/ride" },
    { icon: "train", label: "地铁", meta: "4号线/14号线 · 站内换乘", to: "#/traffic/metro" },
  ];
  const serviceTiles = stationHomeServices;

  return renderAppShell({
    className: "ab-home-page",
    body: `
      <section class="ab-home-hero" style="--ab-home-image:url('${stationSrc}');--ab-home-position-y:${heroPositionY}">
        <div class="ab-home-hero-card">
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
        </div>
      </section>

      <section class="ab-page-section">
        ${renderSectionTitle("站区公告", `<button class="ab-section-link" data-to="#/announcements">更多 ></button>`)}
        <div class="ab-info-list ab-announcement-list compact">
          ${announcements
            .map(
              (item, index) => `
                <button class="ab-info-row ab-announcement-row" data-to="#/announcements">
                  <span class="ab-info-row-left">
                    <span class="ab-info-icon tag ${index === 0 ? "danger" : index === 1 ? "warning" : "primary"}">${item.tag}</span>
                    <span>
                      <strong>${item.text}</strong>
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
        <div class="ab-service-card">
          ${renderActionGrid(serviceTiles, "ab-service-grid")}
        </div>
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

function renderStationServicesPage() {
  return renderAppShell({
    className: "ab-station-service-page",
    topbar: renderAppTopbar({
      title: "站内服务",
      backTo: "#/station/home",
    }),
    body: `
      <section class="ab-page-section">
        ${renderSectionTitle("常用服务")}
        ${renderActionGrid(stationServiceItems, "ab-station-service-grid")}
      </section>
    `,
    footer: renderAbFooterNav("traveler", "home"),
  });
}

function renderStationInquiryPage() {
  return renderAppShell({
    className: "ab-station-service-page",
    topbar: renderAppTopbar({
      title: "问询服务",
      backTo: "#/station/services",
    }),
    body: `
      <section class="ab-page-section">
        ${renderInfoRows(supportContactRows)}
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
        ${supportContactRows
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
          ${supportContactRows
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
              { label: "我的积分", icon: "points", to: "#/driver/short-haul/points", bg: "#e5f7ef", fg: "#0b7a50" },
              { label: "行程历史", icon: "history", to: "#/driver/short-haul/history", bg: "#fff4d8", fg: "#a16207" },
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
  { tag: "提示", tone: "warning", title: "今日有暴雨蓝色预警，出门请注意带伞", meta: "2025-01-18 09:00" },
  { tag: "活动", tone: "primary", title: "春节期间文化展览活动预告", meta: "2025-01-17 16:00" },
  { tag: "通知", tone: "primary", title: "今明两日大风橙色预警，出行请注意安全", meta: "2025-01-16 11:20" },
  {
    tag: "提示",
    tone: "warning",
    title: "行李托运服务操作流程更新",
    meta: "2025-01-15 08:00",
    reply:
      "即日起，行李托运需在出发前3小时办理，托运标准为每人不超过50公斤。请于各站行李房窗口办理，携带有效证件及车票。",
  },
];

const announcementItemOverrides = {
  south: [
    { tag: "紧急", tone: "danger", title: "北京南站北广场临时施工通告", meta: "2025-01-20 10:30" },
    { tag: "通知", tone: "primary", title: "春运期间地铁4号线延时至次日02:00", meta: "2025-01-19 14:00" },
    { tag: "提示", tone: "warning", title: "今日有暴雨蓝色预警，出门请注意带伞", meta: "2025-01-18 09:00" },
    { tag: "活动", tone: "primary", title: "春节期间文化展览活动预告", meta: "2025-01-17 16:00" },
    { tag: "通知", tone: "primary", title: "今明两日大风橙色预警，出行请注意安全", meta: "2025-01-16 11:20" },
    {
      tag: "提示",
      tone: "warning",
      title: "行李托运服务操作流程更新",
      meta: "2025-01-15 08:00",
      reply:
        "即日起，行李托运需在出发前3小时办理，托运标准为每人不超过50公斤。请于各站行李房窗口办理，携带有效证件及车票。",
    },
  ],
};

function stationScopedAnnouncementItems() {
  return announcementItemOverrides[state.station] || announcementItems;
}

const announcementTabs = [
  { key: "全部", label: "全部" },
  { key: "紧急", label: "紧急", badge: "1" },
  { key: "通知", label: "通知" },
  { key: "提示", label: "提示" },
  { key: "活动", label: "活动" },
];

const trafficTabs = [
  { key: "mixed", label: "推荐", to: "#/traffic/mixed" },
  { key: "metro", label: "地铁", to: "#/traffic/metro" },
  { key: "bus", label: "公交", to: "#/traffic/bus" },
  { key: "taxi", label: "出租", to: "#/traffic/taxi" },
  { key: "ride", label: "网约", to: "#/traffic/ride" },
];

const navModeTabs = [
  { key: "map", label: "平面", to: "#/nav/map" },
  { key: "ar", label: "实景", to: "#/nav/ar" },
  { key: "map3d", label: "3D", to: "#/nav/map3d" },
];

const trafficTaxiStops = [
  { name: "南广场出口", note: "排队 85 人", status: "可排队", tone: "success", action: "导航" },
  { name: "北广场出口", note: "排队 42 人", status: "可排队", tone: "success", action: "导航" },
];

const trafficRideOffers = [
  { name: "滴滴出行 · 快车", eta: "预计到达 4 分钟", demand: "候车低", price: "¥28-35", recommended: true },
  { name: "滴滴出行 · 优享", eta: "预计到达 6 分钟", demand: "候车低", price: "¥45-58" },
  { name: "高德打车 · 快车", eta: "预计到达 5 分钟", demand: "候车中", price: "¥25-32", demandTone: "warning" },
  { name: "美团打车 · 快车", eta: "预计到达 7 分钟", demand: "候车低", price: "¥27-34" },
];

const trafficMetroLines = [
  {
    line: "4号线大兴线",
    tone: "success",
    recommended: true,
    from: "北京南站",
    to: "安河桥北 / 天宫院",
    next: "约8分钟/趟",
    trip: "可直达北京大学东门",
    load: "42%",
    loadPeople: 2,
    firstLast: "首05:09 / 05:42 · 末23:23 / 23:32",
  },
  {
    line: "14号线",
    tone: "warning",
    from: "北京南站",
    to: "善各庄 / 张郭庄",
    next: "约6分钟/趟",
    trip: "可换乘 10号线、19号线",
    load: "63%",
    loadPeople: 3,
    firstLast: "首05:27 / 05:47 · 末23:12 / 23:33",
  },
];

const trafficBusRoutes = [
  { line: "9路", dest: "木樨地", meta: "5站台 · 12站", eta: "3分钟", tone: "primary" },
  { line: "特15", dest: "公主坟", meta: "2站台 · 8站", eta: "即将发车", tone: "success" },
  { line: "122路", dest: "北京南站", meta: "3站台 · 15站", eta: "7分钟", tone: "primary" },
  { line: "快速公交1", dest: "天通苑", meta: "6站台 · 20站", eta: "12分钟", tone: "primary" },
];

const trafficMixedRows = [
  {
    label: "地铁 4号线大兴线",
    icon: "metro",
    note: "route",
    value: "46分钟 · ¥5",
    tone: "success",
    tag: "最快",
    summary: "步行202米",
    chips: [
      { type: "walk", label: "1" },
      { type: "line", label: "4号线大兴线" },
      { type: "walk", label: "3" },
    ],
    meta: "16站 · ¥5 · 北京南站(D西入口)进站",
    leg: "4号线大兴线（安河桥北方向）",
    headway: "约8分钟/趟",
  },
  {
    label: "出租",
    icon: "traffic_taxi",
    note: "上门接送",
    value: "26分钟 · ¥56",
    tone: "warning",
    meta: "约19.8公里 · 南广场出租车上车区",
  },
  {
    label: "公交 144路/332路",
    icon: "traffic_bus",
    note: "步行 517米",
    value: "1小时25分 · ¥5",
    tone: "primary",
    chips: [
      { type: "walk", label: "7" },
      { type: "line", label: "144路" },
      { type: "line", label: "332路" },
      { type: "walk", label: "1" },
    ],
    meta: "23站 · ¥5 · 开阳桥南上车",
    leg: "144路（岳家楼桥方向）",
    headway: "约8分钟/趟",
  },
  {
    label: "网约车",
    icon: "car",
    note: "候车低",
    value: "约26分钟 · ¥56",
    tone: "primary",
    meta: "推荐南广场一号网约车点 · 接驾3-5分钟",
  },
];

const trafficOtherOptions = [
  { icon: "bus", label: "公共汽车", toast: "公共汽车（原型演示）" },
  { icon: "bike", label: "共享单车", toast: "共享单车（原型演示）" },
  { icon: "plane", label: "机场巴士", toast: "机场巴士（原型演示）" },
  { icon: "car", label: "出租车", toast: "出租车（原型演示）" },
];

const stationTransferDestinations = [
  { key: "beijing", name: "北京站", icon: "station_beijing", meta: "约33分钟 · 地铁4号线换2号线" },
  { key: "west", name: "北京西站", icon: "station_west", meta: "约28分钟 · 地铁4号线换7号线" },
  { key: "north", name: "北京北站", icon: "station_north", meta: "约31分钟 · 地铁4号线直达西直门" },
  { key: "qinghe", name: "清河站", icon: "station_qinghe", meta: "约52分钟 · 地铁4号线换13号线" },
  { key: "chaoyang", name: "北京朝阳站", icon: "station_chaoyang", meta: "约49分钟 · 地铁14号线换3号线" },
  { key: "fengtai", name: "丰台站", icon: "station_fengtai", meta: "约27分钟 · 14号线换10号线" },
  { key: "tongzhou", name: "北京通州站", icon: "station_tongzhou", meta: "约1小时22分 · 地铁14号线换6号线" },
  { key: "capital", name: "首都国际机场", icon: "station_capital", meta: "约1小时12分 · 地铁换机场线" },
  { key: "daxing", name: "北京大兴国际机场", icon: "station_daxing", meta: "约43分钟 · 地铁换大兴机场线" },
];

const stationTransferPlans = {
  beijing: {
    title: "北京站",
    routes: [
      { tag: "无堵车风险", time: "33分钟", walk: "453米", lines: ["4号线大兴线", "2号线外环"], meta: "7站 · ¥4 · 北京南站(D西入口)进站", headway: "4号线大兴线（安河桥北方向） · 约8分钟/趟" },
      { tag: "出租", time: "出租 26分钟", lines: ["出租¥23"], meta: "10.7公里 · 上门接送" },
      { tag: "直达", time: "59分钟", walk: "1.2公里", lines: ["106路"], meta: "13站 · ¥2 · 北京南站上车", headway: "106路（东直门枢纽站方向） · 约12分钟/趟" },
    ],
  },
  west: {
    title: "北京西站",
    routes: [
      { tag: "最快", time: "28分钟", walk: "317米", lines: ["4号线大兴线", "7号线"], meta: "6站 · ¥4 · 北京南站(D西入口)进站", headway: "4号线大兴线（安河桥北方向） · 约8分钟/趟" },
      { tag: "步行少", time: "34分钟", walk: "171米", lines: ["14号线", "9号线"], meta: "10站 · ¥4 · 北京南站(D西入口)进站", headway: "14号线（张郭庄方向） · 约6分钟/趟" },
      { tag: "出租", time: "出租 16分钟", lines: ["出租¥22"], meta: "12.0公里 · 上门接送" },
    ],
  },
  north: {
    title: "北京北站",
    routes: [
      { tag: "最快", time: "31分钟", walk: "309米", lines: ["4号线大兴线"], meta: "9站 · ¥4 · 北京南站(D西入口)进站", headway: "4号线大兴线（安河桥北方向） · 约8分钟/趟" },
      { tag: "出租", time: "出租 21分钟", lines: ["出租¥34"], meta: "14.5公里 · 上门接送" },
      { tag: "直达", time: "1小时4分", walk: "1.5公里", lines: ["200路内环"], meta: "13站 · ¥3 · 开阳桥西上车", headway: "200路内环（右安门东方向） · 约10分钟/趟" },
    ],
  },
  chaoyang: {
    title: "北京朝阳站",
    routes: [
      { tag: "最快", time: "49分钟", walk: "244米", lines: ["14号线", "3号线"], meta: "13站 · ¥5 · 北京南站(D西入口)进站", headway: "14号线（善各庄方向） · 约6分钟/趟" },
      { tag: "出租", time: "出租 27分钟", lines: ["出租¥51"], meta: "20.9公里 · 上门接送" },
      { tag: "直达", time: "1小时32分", walk: "3.8公里", lines: ["14号线"], meta: "12站 · ¥5 · 北京南站(D西入口)进站", headway: "14号线（善各庄方向） · 约6分钟/趟" },
    ],
  },
  qinghe: {
    title: "清河站",
    routes: [
      { tag: "最快", time: "52分钟", walk: "626米", lines: ["4号线大兴线", "13号线"], meta: "14站 · ¥5 · 北京南站(D西入口)进站", headway: "4号线大兴线（安河桥北方向） · 约8分钟/趟" },
      { tag: "出租", time: "出租 32分钟", lines: ["出租¥74"], meta: "31.2公里 · 上门接送" },
      { tag: "网约车", time: "网约车31分钟", lines: ["一口价¥34"], meta: "一口价超便宜" },
    ],
  },
  fengtai: {
    title: "丰台站",
    routes: [
      { tag: "最快", time: "27分钟", walk: "436米", lines: ["14号线", "10号线"], meta: "7站 · ¥4 · 北京南站(D西入口)进站", headway: "14号线（张郭庄方向） · 约6分钟/趟" },
      { tag: "出租", time: "出租 19分钟", lines: ["出租¥35"], meta: "12.5公里 · 上门接送" },
      { tag: "网约车", time: "网约车20分钟", lines: ["一口价¥32"], meta: "以平台预估为准" },
    ],
  },
  tongzhou: {
    title: "北京通州站",
    routes: [
      { time: "1小时22分", walk: "1公里", lines: ["14号线", "6号线"], meta: "20站 · ¥7 · 北京南站(D西入口)进站", headway: "14号线（善各庄方向） · 约6分钟/趟" },
      { time: "1小时46分", walk: "1.4公里", lines: ["G7808 / G8902 / G882", "2号线外环", "6号线"], meta: "16站 · ¥14 · 北京南上车" },
      { tag: "出租", time: "出租 43分钟", lines: ["出租¥103"], meta: "34.3公里 · 上门接送" },
    ],
  },
  capital: {
    title: "首都国际机场",
    routes: [
      { time: "1小时12分", walk: "707米", lines: ["14号线", "10号线外环", "首都机场线"], meta: "16站 · ¥30 · 北京南站(D西入口)进站", headway: "14号线（善各庄方向） · 约6分钟/趟" },
      { tag: "步行少", time: "1小时23分", walk: "317米", lines: ["首都机场巴士北京南站线"], meta: "7站 · ¥30 · 北京南站上车" },
      { tag: "出租", time: "出租 36分钟", lines: ["出租¥114"], meta: "37.7公里 · 上门接送" },
    ],
  },
  daxing: {
    title: "北京大兴国际机场",
    routes: [
      { time: "43分钟", walk: "462米", lines: ["14号线", "19号线", "大兴机场线"], meta: "4站 · ¥38 · 北京南站(D西入口)进站", headway: "14号线（张郭庄方向） · 约6分钟/趟" },
      { time: "59分钟", walk: "1.9公里", lines: ["19号线", "大兴机场线"], meta: "3站 · ¥38 · 景风门(B口)进站", headway: "19号线（新宫方向） · 约7分钟/趟" },
      { tag: "出租", time: "出租 43分钟", lines: ["出租¥156"], meta: "48.2公里 · 上门接送" },
    ],
  },
};

const parkingTabs = [
  { key: "list", label: "停车场列表", to: "#/parking/list" },
  { key: "price", label: "价格对比", to: "#/parking/price" },
];

const parkingStats = [
  { value: "5个", label: "停车场数量" },
  { value: "817", label: "总空余车位" },
  { value: "14:35", label: "更新时间" },
];

const parkingListTop = [
  {
    title: "北京南站P1停车场",
    tone: "success",
    status: "充裕",
    use: "84 / 600 已用",
    distance: "步行 3 分钟",
    price: "￥18/小时，封顶￥240/天",
    note: "新能源车位",
    progress: 14,
  },
  {
    title: "北京南站P2停车场",
    tone: "warning",
    status: "紧张",
    use: "304 / 320 已用",
    distance: "步行 1 分钟",
    price: "￥18/小时，封顶￥240/天",
    note: "",
    progress: 95,
  },
];

const parkingListMore = [
  {
    title: "北京南站P3停车场",
    tone: "success",
    status: "充裕",
    use: "238 / 450 已用",
    distance: "步行 8 分钟",
    price: "￥18/小时，封顶￥240/天",
    note: "新能源车位",
    progress: 53,
  },
  {
    title: "北京南站P4停车场",
    tone: "danger",
    status: "已满",
    use: "80 / 80 已用",
    distance: "步行 12 分钟",
    price: "￥18/小时，封顶￥240/天",
    note: "",
    progress: 100,
  },
  {
    title: "北京南站立体停车场",
    tone: "warning",
    status: "紧张",
    use: "187 / 260 已用",
    distance: "步行 6 分钟",
    price: "￥18/小时，封顶￥100/天",
    note: "靠近南广场进站口",
    progress: 72,
  },
];

const parkingPriceRows = [
  { label: "15分钟", p1: "￥4.5", p2: "￥4.5", p3: "￥4.5", p4: "￥4.5", vertical: "￥4.5" },
  { label: "1小时", p1: "￥18", p2: "￥18", p3: "￥18", p4: "￥18", vertical: "￥18" },
  { label: "全天封顶", p1: "￥240", p2: "￥240", p3: "￥240", p4: "￥240", vertical: "￥100" },
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
  { id: "beijing", type: "train", name: "北京站", distance: "3.2km", status: "正常", tone: "warning", passengers: "82", vehicles: "79", wait: "10-20", to: "#/driver/station/beijing" },
  { id: "west", type: "train", name: "北京西站", distance: "5.8km", status: "拥挤", tone: "danger", passengers: "157", vehicles: "147", wait: "30-40", to: "#/driver/station/west" },
  { id: "south", type: "train", name: "北京南站", distance: "8.1km", status: "拥挤", tone: "danger", passengers: "130", vehicles: "124", wait: "25-35", to: "#/driver/station/south" },
  { id: "north", type: "train", name: "北京北站", distance: "4.5km", status: "畅通", tone: "success", passengers: "42", vehicles: "18", wait: "5-15", to: "#/driver/station/north" },
  { id: "qinghe", type: "train", name: "清河站", distance: "12.4km", status: "畅通", tone: "success", passengers: "46", vehicles: "52", wait: "5-15", to: "#/driver/station/qinghe" },
  { id: "chaoyang", type: "train", name: "朝阳站", distance: "6.3km", status: "正常", tone: "warning", passengers: "117", vehicles: "98", wait: "20-30", to: "#/driver/station/chaoyang" },
  { id: "fengtai", type: "train", name: "丰台站", distance: "18.6km", status: "正常", tone: "warning", passengers: "96", vehicles: "31", wait: "10-20", to: "#/driver/station/fengtai" },
  { id: "tongzhou", type: "train", name: "通州站", distance: "20.8km", status: "正常", tone: "warning", passengers: "83", vehicles: "74", wait: "15-25", to: "#/driver/station/tongzhou" },
  { id: "capital", type: "plane", name: "首都机场", distance: "25.6km", status: "拥挤", tone: "danger", passengers: "1000", vehicles: "333", wait: "45-55", to: "#/driver/station/capital" },
  { id: "daxing", type: "plane", name: "大兴机场", distance: "42.3km", status: "正常", tone: "warning", passengers: "413", vehicles: "150", wait: "20-30", to: "#/driver/station/daxing" },
];

const driverStationData = {
  beijing: {
    title: "北京站",
    address: "东城区毛家湾胡同甲13号",
    areas: [
      { title: "北京站东街出租车调度站", tone: "warning", status: "正常", passengers: "49", vehicles: "46", wait: "10-20" },
      { title: "北京站西街出租车调度站", tone: "success", status: "畅通", passengers: "33", vehicles: "33", wait: "5-15" },
    ],
    mapNote: "点击区域标签可查看详细候车信息，蓝色路线为引导路径",
    mapAreas: [
      { label: "东街调度站", tone: "warning", position: "left" },
      { label: "西街调度站", tone: "success", position: "right" },
    ],
  },
  west: {
    title: "北京西站",
    address: "丰台区莲花池东路118号",
    areas: [
      { title: "北京西站南广场出租车调度站", tone: "danger", status: "拥挤", passengers: "96", vehicles: "89", wait: "30-40" },
      { title: "北京西站北广场出租车调度站", tone: "warning", status: "正常", passengers: "61", vehicles: "58", wait: "20-30" },
    ],
  },
  south: {
    title: "北京南站",
    address: "丰台区永外大街12号",
    areas: [
      { title: "北京南站南广场出租车调度站", tone: "danger", status: "拥挤", passengers: "83", vehicles: "78", wait: "25-35" },
      { title: "北京南站北广场出租车调度站", tone: "warning", status: "正常", passengers: "47", vehicles: "46", wait: "15-25" },
    ],
  },
  north: {
    title: "北京北站",
    address: "西城区北滨河路1号",
    areas: [
      { title: "北京北站南广场出租车调度站", tone: "success", status: "畅通", passengers: "27", vehicles: "12", wait: "5-15" },
      { title: "北京北站北落客出租车调度站", tone: "success", status: "畅通", passengers: "15", vehicles: "6", wait: "5-15" },
    ],
  },
  qinghe: {
    title: "清河站",
    address: "海淀区安宁庄西路",
    areas: [
      { title: "清河站东广场出租车调度站", tone: "success", status: "畅通", passengers: "28", vehicles: "31", wait: "5-15" },
      { title: "清河站西广场出租车调度站", tone: "success", status: "畅通", passengers: "18", vehicles: "21", wait: "5-15" },
    ],
  },
  chaoyang: {
    title: "朝阳站",
    address: "朝阳区姚家园北路",
    areas: [
      { title: "北京朝阳站南广场出租车调度站", tone: "warning", status: "正常", passengers: "68", vehicles: "57", wait: "20-30" },
      { title: "北京朝阳站北广场出租车调度站", tone: "warning", status: "正常", passengers: "49", vehicles: "41", wait: "15-25" },
    ],
  },
  fengtai: {
    title: "丰台站",
    address: "丰台区正阳大街4号",
    areas: [
      { title: "丰台站南广场出租车调度站", tone: "warning", status: "正常", passengers: "58", vehicles: "19", wait: "10-20" },
      { title: "丰台站北广场出租车调度站", tone: "success", status: "畅通", passengers: "38", vehicles: "12", wait: "5-15" },
    ],
  },
  tongzhou: {
    title: "通州站",
    address: "通州区新华东街",
    areas: [
      { title: "北京通州站东广场出租车调度站", tone: "warning", status: "正常", passengers: "50", vehicles: "45", wait: "15-25" },
      { title: "北京通州站西广场出租车调度站", tone: "success", status: "畅通", passengers: "33", vehicles: "29", wait: "10-20" },
    ],
  },
  capital: {
    title: "首都机场",
    address: "顺义区首都机场路",
    areas: [
      { title: "首都机场T3出租车调度站", tone: "danger", status: "拥挤", passengers: "610", vehicles: "205", wait: "45-55" },
      { title: "首都机场T2出租车调度站", tone: "warning", status: "正常", passengers: "390", vehicles: "128", wait: "35-45" },
    ],
  },
  daxing: {
    title: "大兴机场",
    address: "大兴区礼贤镇航兴路",
    areas: [
      { title: "大兴机场航站楼出租车调度站", tone: "warning", status: "正常", passengers: "248", vehicles: "90", wait: "20-30" },
      { title: "大兴机场远端出租车蓄车区", tone: "success", status: "畅通", passengers: "165", vehicles: "60", wait: "15-25" },
    ],
  },
};

const shortHaulDispatchData = {
  beijing: {
    name: "北京站",
    areas: [
      { key: "east-street", name: "北京站东街出租车调度区", dispatches: ["北京站东街1号出租车调度站", "北京站东街2号出租车调度站"] },
      { key: "west-street", name: "北京站西街出租车调度区", dispatches: ["北京站西街出租车调度站"] },
    ],
  },
  west: {
    name: "北京西站",
    areas: [
      { key: "south-plaza", name: "北京西站南广场出租车调度区", dispatches: ["北京西站南广场东侧出租车调度站", "北京西站南广场西侧出租车调度站"] },
      { key: "north-plaza", name: "北京西站北广场出租车调度区", dispatches: ["北京西站北广场出租车调度站"] },
    ],
  },
  south: {
    name: "北京南站",
    areas: [
      { key: "south-plaza", name: "北京南站南广场出租车调度区", dispatches: ["北京南站南广场东侧出租车调度站", "北京南站南广场西侧出租车调度站", "北京南站南广场地下出租车调度站"] },
      { key: "north-plaza", name: "北京南站北广场出租车调度区", dispatches: ["北京南站北广场东侧出租车调度站", "北京南站北广场西侧出租车调度站"] },
    ],
  },
  north: {
    name: "北京北站",
    areas: [
      { key: "south-plaza", name: "北京北站南广场出租车调度区", dispatches: ["北京北站南广场出租车调度站"] },
      { key: "north-dropoff", name: "北京北站北落客出租车调度区", dispatches: ["北京北站北落客出租车调度站"] },
    ],
  },
  qinghe: {
    name: "清河站",
    areas: [
      { key: "east-plaza", name: "清河站东广场出租车调度区", dispatches: ["清河站东广场出租车调度站", "清河站东广场备用出租车调度站"] },
      { key: "west-plaza", name: "清河站西广场出租车调度区", dispatches: ["清河站西广场出租车调度站"] },
    ],
  },
  chaoyang: {
    name: "朝阳站",
    areas: [
      { key: "south-plaza", name: "北京朝阳站南广场出租车调度区", dispatches: ["北京朝阳站南广场主出租车调度站", "北京朝阳站南广场备用出租车调度站"] },
      { key: "north-plaza", name: "北京朝阳站北广场出租车调度区", dispatches: ["北京朝阳站北广场出租车调度站"] },
    ],
  },
  fengtai: {
    name: "丰台站",
    areas: [
      { key: "south-plaza", name: "丰台站南广场出租车调度区", dispatches: ["丰台站南广场出租车调度站", "丰台站南广场备用出租车调度站"] },
      { key: "north-plaza", name: "丰台站北广场出租车调度区", dispatches: ["丰台站北广场出租车调度站"] },
    ],
  },
  tongzhou: {
    name: "通州站",
    areas: [
      { key: "east-plaza", name: "北京通州站东广场出租车调度区", dispatches: ["北京通州站东广场出租车调度站", "北京通州站东广场备用出租车调度站"] },
      { key: "west-plaza", name: "北京通州站西广场出租车调度区", dispatches: ["北京通州站西广场出租车调度站"] },
    ],
  },
};

function queueStationById(id) {
  return driverQueueStations.find((station) => station.id === id) || driverQueueStations[0];
}

function dispatchStationCount(station) {
  return (station && station.areas ? station.areas : []).reduce((total, area) => total + area.dispatches.length, 0);
}

function shortHaulStationById(id) {
  return shortHaulDispatchData[id] || shortHaulDispatchData.south;
}

function shortHaulAreaByKey(stationKey, areaKey) {
  const station = shortHaulStationById(stationKey);
  return station.areas.find((area) => area.key === areaKey) || station.areas[0];
}

function selectedShortHaulSummary() {
  const stationKey = shortHaulDispatchData[state.selected.shortHaulStation] ? state.selected.shortHaulStation : "south";
  const station = shortHaulStationById(stationKey);
  const area = state.selected.shortHaulArea ? shortHaulAreaByKey(stationKey, state.selected.shortHaulArea) : null;
  const dispatch = area && area.dispatches.includes(state.selected.shortHaulDispatch) ? state.selected.shortHaulDispatch : "";
  return { stationKey, station, area, dispatch };
}

const shortHaulTabs = [
  { key: "booking", label: "预约进场", to: "#/driver/short-haul/booking" },
  { key: "history", label: "行程记录", to: "#/driver/short-haul/history" },
  { key: "points", label: "积分明细", to: "#/driver/short-haul/points" },
];

const shortHaulHistory = [
  { title: "北京南站", meta: "今天 14:32 · 行程里程 3.2km", value: "+10分", tone: "success", tag: "短途" },
  { title: "北京西站", meta: "今天 11:15 · 行程里程 12.5km", value: "-10分", tone: "danger", tag: "复载" },
  { title: "首都机场T3", meta: "昨天 18:40 · 行程里程 4.8km", value: "+10分", tone: "success", tag: "短途" },
  { title: "北京站", meta: "昨天 09:22 · 行程里程 8.1km", value: "-10分", tone: "danger", tag: "复载" },
];

const shortHaulPoints = [
  { title: "短途赋分", meta: "今天 14:32 · 北京南站", value: "+10", tone: "success", tag: "积分" },
  { title: "复载消分", meta: "今天 11:15 · 北京西站", value: "-10", tone: "danger", tag: "积分" },
  { title: "短途赋分", meta: "昨天 18:40 · 首都机场T3", value: "+10", tone: "success", tag: "积分" },
  { title: "复载消分", meta: "昨天 09:22 · 北京站", value: "-10", tone: "danger", tag: "积分" },
  { title: "短途赋分", meta: "前天 16:05 · 朝阳站", value: "+10", tone: "success", tag: "积分" },
];

const taxiHouseTabs = [
  { key: "info", label: "基本信息", to: "#/driver/taxi-house/info" },
  { key: "meal", label: "今日餐饮", to: "#/driver/taxi-house/meal" },
  { key: "redeem", label: "积分兑换", to: "#/driver/taxi-house/redeem" },
];

const taxiHouseServices = [
  { key: "免费休息区", label: "免费休息区", icon: "lounge", toast: "免费休息区（原型演示）" },
  { key: "餐饮服务", label: "餐饮服务", icon: "dining", toast: "餐饮服务（原型演示）" },
  { key: "充电桩", label: "充电桩", icon: "charger", toast: "充电桩（原型演示）" },
  { key: "免费WIFI", label: "免费WIFI", icon: "wifi", toast: "免费WIFI（原型演示）" },
  { key: "茶水供应", label: "茶水供应", icon: "tea", toast: "茶水供应（原型演示）" },
  { key: "阅读角", label: "阅读角", icon: "book", toast: "阅读角（原型演示）" },
  { key: "医疗急救箱", label: "医疗急救箱", icon: "medical", toast: "医疗急救箱（原型演示）" },
  { key: "洗手间", label: "洗手间", icon: "restroom", toast: "洗手间（原型演示）" },
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
  const loadCount = item.loadPeople || 1;
  const loadTone = loadCount <= 2 ? "success" : loadCount <= 4 ? "warning" : "danger";
  return `
    <article class="ab-traffic-metro-card">
      <div class="ab-traffic-metro-head">
        <span class="ab-line-badge ${item.tone}">${item.line}</span>
        <strong>${item.from} > ${item.to}</strong>
        ${item.recommended ? renderStatusPill("success", "推荐") : ""}
      </div>
      <div class="ab-traffic-metro-grid">
        <div><span>发车间隔</span><strong>${item.next}</strong></div>
        <div><span>行程</span><strong>${item.trip}</strong></div>
        <div>
          <span>当前满载率</span>
          <strong class="ab-load-people ${loadTone}" aria-label="满载率${item.load}">
            ${[1, 2, 3, 4, 5].map((slot) => `<i class="${slot <= loadCount ? "filled" : ""}" aria-hidden="true"></i>`).join("")}
          </strong>
        </div>
      </div>
      <div class="ab-traffic-metro-foot">
        <span>${item.firstLast}</span>
      </div>
    </article>
  `;
}

function renderTrafficBusLine(line) {
  if (line === "快速公交1") {
    return `<span>快速</span><span>公交1</span>`;
  }
  return `<span>${line}</span>`;
}

function renderTrafficBusCard(item) {
  return `
    <button class="ab-traffic-bus-card" data-toast="${item.line}（原型演示）">
      <span class="ab-traffic-bus-icon" aria-label="${item.line}">${renderTrafficBusLine(item.line)}</span>
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

function renderRouteChipRow(chips = []) {
  if (!chips.length) return "";
  return `
    <div class="ab-route-chip-row">
      ${chips
        .map((chip) =>
          chip.type === "walk"
            ? `<span class="ab-route-walk-chip">${iconMarkup("walk_solid")}<b>${chip.label}</b></span>`
            : `<strong>${chip.label}</strong>`
        )
        .join("")}
    </div>
  `;
}

function renderTrafficPlanCard(row, query, index) {
  const note = row.note === "route" ? `北京南站 → ${query}` : row.note;
  return `
    <button class="ab-traffic-plan-card ${index === 0 ? "featured" : ""}" data-toast="${row.label}（原型演示）">
      <span class="ab-traffic-plan-icon ${row.tone || "primary"}">${iconMarkup(row.icon || "route")}</span>
      <span class="ab-traffic-plan-main">
        <span class="ab-traffic-plan-title">
          <strong>${row.label}</strong>
          ${row.tag ? `<b class="ab-small-badge">${row.tag}</b>` : ""}
        </span>
        <em>${note}</em>
      </span>
      <span class="ab-traffic-plan-value">
        <b>${row.value}</b>
        ${row.summary ? `<em>${row.summary}</em>` : ""}
        <i>›</i>
      </span>
      ${renderRouteChipRow(row.chips)}
      ${row.meta ? `<p>${row.meta}</p>` : ""}
      ${
        row.leg
          ? `<span class="ab-route-leg">${row.leg}${row.headway ? `<b>${row.headway}</b>` : ""}</span>`
          : ""
      }
    </button>
  `;
}

function renderTrafficSearch(activeRoute) {
  const query = state.selected.trafficQuery || "北京大学";
  const hasResult = !!state.selected.trafficSearchResult;
  return `
    <section class="ab-page-section ab-traffic-search-section ${hasResult ? "is-result" : ""}">
      <form class="ab-traffic-search ${hasResult ? "is-result" : "is-quick"}" data-traffic-search-form>
        ${
          hasResult
            ? `<button class="ab-traffic-search-back" type="button" data-traffic-search-back aria-label="返回搜索输入">${iconMarkup("chevron_left")}</button>
              <div class="ab-traffic-search-points">
                <label><i class="start"></i><span>北京南站</span></label>
                <label><i class="end"></i><input name="trafficQuery" value="${query}" aria-label="目的地"></label>
              </div>`
            : `<div class="ab-traffic-quick-field">
                ${iconMarkup("search")}
                <input name="trafficQuery" value="${query}" aria-label="目的地" placeholder="搜索目的地">
              </div>`
        }
        <button type="submit">${hasResult ? "搜索" : "搜索"}</button>
      </form>
      ${renderSelectableGrid(trafficTabs, { activeValue: activeRoute, cols: 5, className: "ab-tab-row" })}
    </section>
  `;
}

function renderTransferRouteCard(item) {
  return `
    <article class="ab-transfer-route-card">
      <div class="ab-transfer-route-head">
        <div>
          <strong>${item.time}</strong>
          ${item.walk ? `<span>步行${item.walk}</span>` : ""}
        </div>
        ${item.tag ? renderStatusPill(item.tag === "出租" || item.tag === "网约车" ? "primary" : "success", item.tag) : ""}
      </div>
      <div class="ab-route-chip-row">
        ${item.lines.map((line) => `<strong>${line}</strong>`).join("")}
      </div>
      <p>${item.meta}</p>
      ${item.headway ? `<div class="ab-route-leg">${item.headway}</div>` : ""}
    </article>
  `;
}

function renderStationTransferSelectPage() {
  return renderAppShell({
    className: "ab-transfer-page",
    topbar: renderAppTopbar({
      title: "场站换乘",
      backTo: "#/station/home",
    }),
    body: `
      <section class="ab-page-section">
        ${renderSectionTitle("选择目的站")}
        <div class="ab-transfer-destination-list">
          ${stationTransferDestinations
            .map(
              (item) => `
                <button class="ab-transfer-destination-card" data-to="#/station-transfer/${item.key}">
                  <span class="ab-transfer-destination-icon">${iconMarkup(item.icon)}</span>
                  <span>
                    <strong>${item.name}</strong>
                    <em>${item.meta}</em>
                  </span>
                  <i>›</i>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "traffic"),
  });
}

function renderStationTransferRoutePage(key) {
  const routeKey = key === "yizhuang" ? "fengtai" : key;
  const plan = stationTransferPlans[routeKey] || stationTransferPlans.beijing;
  return renderAppShell({
    className: "ab-transfer-page",
    topbar: renderAppTopbar({
      title: "场站换乘",
      backTo: "#/station-transfer/select",
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-transfer-search-card">
          <span><i class="start"></i><b>北京南站</b></span>
          <span><i class="end"></i><b>${plan.title}</b></span>
        </div>
      </section>
      <section class="ab-page-section">
        ${renderSectionTitle("推荐路线")}
        <div class="ab-transfer-route-list">
          ${plan.routes.map(renderTransferRouteCard).join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("traveler", "traffic"),
  });
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

function renderNavFocusMarker(visualMode, selectedFloor, navFocus) {
  if (visualMode !== "map") return "";
  if (navFocus === "taxi" && selectedFloor === "B1") {
    return `<span class="ab-nav-pulse-marker ab-nav-pulse-marker--taxi" aria-hidden="true"></span>`;
  }
  if (navFocus === "exit" && selectedFloor === "F1") {
    return `<span class="ab-nav-pulse-marker ab-nav-pulse-marker--exit" aria-hidden="true"></span>`;
  }
  return "";
}

function renderNavigationPage(mode) {
  const activeRoute = `#/nav/${mode}`;
  const activeModeRoute = mode === "route" ? "#/nav/map" : activeRoute;
  const visualMode = mode === "route" ? "map" : mode;
  const selectedFloor = state.selected.navFloor || "F1";
  const navFocus = state.selected.navFocus || "restroom";
  const selected3dLayer = state.selected.nav3dLayer || "overview";
  const visualCopy = {
    map: {
      title: `${selectedFloor} 平面图`,
      badge: "平面",
    },
    map3d: {
      title: "3D 总览",
      badge: "总览",
    },
    ar: {
      title: "实景指引",
      badge: "实景",
    },
    route: {
      title: "路线规划",
      badge: "路线",
    },
  };
  const currentVisual = visualCopy[visualMode] || visualCopy.map;
  const currentImage =
    visualMode === "map"
      ? navigationVisualAssets.floors[selectedFloor] || navigationVisualAssets.map
      : navigationVisualAssets[visualMode] || navigationVisualAssets.map;
  const layerControlItems =
    visualMode === "map"
      ? [
          { key: "B1", label: "B1" },
          { key: "F1", label: "F1" },
          { key: "F2", label: "F2" },
          { key: "F3", label: "F3" },
        ]
      : [];
  const renderLayerControl = () =>
    layerControlItems.length
      ? `<div class="ab-nav-layer-control" aria-label="楼层切换">
          ${layerControlItems
            .map((item) => {
              const activeValue = selectedFloor;
              const selectKey = "navFloor";
              return `<button class="${activeValue === item.key ? "active" : ""}" data-select-key="${selectKey}" data-select-value="${item.key}">${item.label}</button>`;
            })
            .join("")}
        </div>`
      : "";

  return renderAppShell({
    className: "ab-navigation-page",
    topbar: renderAppTopbar({
      title: "导航指引",
      backTo: "#/station/home",
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-nav-search">
          ${iconMarkup("search")}
          <span>搜索目的地（出口、检票口等）</span>
          <button data-toast="导航搜索（原型演示）">导航</button>
        </div>
        ${renderSelectableGrid(navModeTabs, { activeValue: activeModeRoute, cols: 3, className: "ab-tab-row" })}
      </section>

      <section class="ab-page-section">
        ${visualMode === "map" ? "" : renderSectionTitle(currentVisual.title)}
        <div class="ab-nav-visual" data-floor="${selectedFloor}" data-mode="${visualMode}" data-layer="${selected3dLayer}">
          <img src="${currentImage}" alt="${currentVisual.title}">
          <div class="ab-nav-visual-shade"></div>
          ${
            visualMode === "map"
              ? ""
              : `<div class="ab-nav-visual-top">
                  <span>${visualMode === "map3d" && selected3dLayer !== "overview" ? selected3dLayer : currentVisual.badge}</span>
                </div>`
          }
          ${renderNavFocusMarker(visualMode, selectedFloor, navFocus)}
          ${renderLayerControl()}
        </div>
        ${
          visualMode === "map"
            ? `<div class="ab-nav-poi-row" aria-label="重点地点">
                <button class="${navFocus === "taxi" ? "active" : ""}" data-nav-poi="taxi">${iconMarkup("taxi")}出租车上车区</button>
                <button class="${navFocus === "exit" ? "active" : ""}" data-nav-poi="exit">${iconMarkup("pin")}南广场出站口</button>
              </div>`
            : ""
        }
      </section>
    `,
    footer: renderAbFooterNav("traveler", "nav"),
  });
}

function renderAnnouncementsPage(variant = "top") {
  const activeCategory = state.selected.announcementCategory || "全部";
  const currentAnnouncementItems = stationScopedAnnouncementItems();
  const filteredItems =
    activeCategory === "全部"
      ? currentAnnouncementItems
      : currentAnnouncementItems.filter((item) => item.tag === activeCategory);
  const topItems = filteredItems.slice(0, 4);
  const lowerItems = filteredItems.slice(4);
  const showUrgentSummary = activeCategory === "全部";

  return renderAppShell({
    className: "ab-announcements-page",
    topbar: renderAppTopbar({
      title: "站区公告",
      backTo: "#/station/home",
      action: `<button class="ab-topbar-action" data-toast="通知中心（原型演示）">通知中心</button>`,
    }),
    body: `
      <section class="ab-page-section ab-announcement-filter-section">
        <div class="ab-nav-search ab-announcement-search" data-toast="搜索公告（原型演示）">
          ${iconMarkup("search")}
          <span>搜索公告关键词</span>
        </div>
        ${renderSelectableGrid(announcementTabs, { activeValue: state.selected.announcementCategory || "全部", selectKey: "announcementCategory", cols: 5, className: "ab-tab-row ab-tab-row--plain" })}
      </section>

      ${showUrgentSummary ? `
        <section class="ab-page-section">
          <div class="ab-tip-card ab-tip-card--alert">
            <strong>当前有1条紧急公告</strong>
            <p>请旅客注意查看并遵守相关规定</p>
          </div>
        </section>
      ` : ""}

      <section class="ab-page-section">
        <div class="ab-record-list">
          ${topItems.map((item) => renderRecordCard(item)).join("")}
        </div>
      </section>

      <section class="ab-page-section" id="announcements-lower">
        <div class="ab-record-list">
          ${lowerItems
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
    taxi: "交通接驳",
    ride: "交通接驳",
    metro: "交通接驳",
    bus: "交通接驳",
    mixed: "交通接驳",
    other: "交通接驳",
  };
  const taxiSummary = `
    <div class="ab-panel">
      <div class="ab-panel-head">
        <div>
          <h2>南广场出租车实时状态</h2>
        </div>
      </div>
      ${renderStatGrid([
        { value: "85人", label: "排队人数", tone: "danger" },
        { value: "20-30分钟", label: "等候时间", tone: "danger" },
        { value: "12辆", label: "候车辆数", tone: "success" },
      ])}
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
      <div class="ab-traffic-plan-list">
        ${trafficMixedRows.map((row, index) => renderTrafficPlanCard(row, state.selected.trafficQuery || "北京大学", index)).join("")}
      </div>
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
      title: titleMap[mode] || "交通接驳",
      backTo: "#/station/home",
      action: mode === "mixed" ? "" : `<button class="ab-topbar-action" data-toast="数据实时（原型演示）">数据实时</button>`,
    }),
    body: `
      ${renderTrafficSearch(activeRoute)}
      ${
        mode === "mixed"
          ? ""
          : `<section class="ab-page-section">
              <div class="ab-traffic-meta">
                <span>最后更新 14:32:18</span>
                <b>数据实时</b>
              </div>
            </section>`
      }
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
        <div class="ab-table-card ab-parking-price-table">
          <div class="ab-table-head">
            <span>停车时长</span>
            <span>P1</span>
            <span>P2</span>
            <span>P3</span>
            <span>P4</span>
            <span>立体</span>
          </div>
          ${parkingPriceRows
            .map(
              (row) => `
                <div class="ab-table-row">
                  <strong>${row.label}</strong>
                  <span>${row.p1}</span>
                  <span>${row.p2}</span>
                  <span>${row.p3}</span>
                  <span>${row.p4}</span>
                  <span>${row.vertical}</span>
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
        ${renderSelectableGrid(parkingTabs, { activeValue: activeRoute, cols: 2, className: "ab-tab-row" })}
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
        ${renderSelectableGrid(driverQueueFilters, { activeValue: filter, selectKey: "queueFilter", cols: 3, className: "ab-tab-row ab-driver-filter-row" })}
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
  const queueStation = queueStationById(stationKey);
  const isBeijing = stationKey === "beijing";
  const heroStats = [
    { value: queueStation.passengers, label: "候乘旅客", tone: "primary" },
    { value: queueStation.vehicles, label: "排队车辆", tone: "success" },
    { value: `${queueStation.wait}分钟`, label: "最长等候", tone: "warning" },
  ];
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
          ${renderStatGrid(heroStats)}
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
          { activeValue: variant === "map" ? "map" : "queue", cols: 2, className: "ab-tab-row" }
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
              ${renderSectionTitle(`出租车调度站列表（${station.areas.length}个）`, `<button class="ab-section-link" data-toast="更新于刚刚">更新于刚刚</button>`)}
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

function renderShortHaulTargetCard() {
  const selection = selectedShortHaulSummary();
  const areaText = selection.area ? selection.area.name : "未选择站区";
  const dispatchText = selection.dispatch || "未选择调度站";
  return `
    <button class="ab-target-card ab-short-haul-target-card" data-to="#/driver/short-haul/station-select">
      <span class="ab-target-icon">${stationIconMarkup(selection.stationKey)}</span>
      <span class="ab-target-copy">
        <strong>${selection.station.name}</strong>
        <em>${areaText}</em>
        <em class="${selection.dispatch ? "selected" : "pending"}">${dispatchText}</em>
      </span>
      <i>›</i>
    </button>
  `;
}

function renderShortHaulStationChoiceCard([stationKey, station]) {
  const queueStation = queueStationById(stationKey);
  const selected = selectedShortHaulSummary().stationKey === stationKey;
  return `
    <button class="ab-short-haul-choice-card ${selected ? "active" : ""}" data-short-haul-station="${stationKey}">
      <span class="ab-short-haul-choice-icon">${stationIconMarkup(stationKey)}</span>
      <span class="ab-short-haul-choice-copy">
        <strong>${station.name}</strong>
        <em>${station.areas.length}个站区 · ${dispatchStationCount(station)}个出租车调度站</em>
        <small>当前排队 ${queueStation.passengers}人 · 预计 ${queueStation.wait}分钟</small>
      </span>
      ${selected ? `<span class="ab-short-haul-choice-check">${iconMarkup("check")}</span>` : `<i>›</i>`}
    </button>
  `;
}

function renderShortHaulAreaChoiceCard(stationKey, area) {
  const selected = state.selected.shortHaulStation === stationKey && state.selected.shortHaulArea === area.key;
  return `
    <button class="ab-short-haul-choice-card ${selected ? "active" : ""}" data-short-haul-area="${area.key}" data-short-haul-station="${stationKey}">
      <span class="ab-short-haul-choice-icon">${iconMarkup("pin")}</span>
      <span class="ab-short-haul-choice-copy">
        <strong>${area.name}</strong>
        <em>${area.dispatches.length}个出租车调度站</em>
        <small>选择后继续选择具体调度站</small>
      </span>
      <i>›</i>
    </button>
  `;
}

function renderShortHaulDispatchChoiceCard(stationKey, areaKey, dispatchName) {
  const selected =
    state.selected.shortHaulStation === stationKey &&
    state.selected.shortHaulArea === areaKey &&
    state.selected.shortHaulDispatch === dispatchName;
  return `
    <button class="ab-short-haul-choice-card ${selected ? "active" : ""}" data-short-haul-dispatch="${dispatchName}" data-short-haul-station="${stationKey}" data-short-haul-area="${areaKey}">
      <span class="ab-short-haul-choice-icon">${iconMarkup("taxi")}</span>
      <span class="ab-short-haul-choice-copy">
        <strong>${dispatchName}</strong>
        <em>点击后返回预约进场页</em>
      </span>
      ${selected ? `<span class="ab-short-haul-choice-check">${iconMarkup("check")}</span>` : `<i>›</i>`}
    </button>
  `;
}

function renderShortHaulStationSelectPage() {
  const stationsForBooking = Object.entries(shortHaulDispatchData);
  return renderAppShell({
    className: "ab-short-haul-page ab-short-haul-select-page",
    topbar: renderAppTopbar({ title: "选择目标车站", backTo: "#/driver/short-haul/booking" }),
    body: `
      <section class="ab-page-section">
        <div class="ab-choice-context">
          <strong>目标车站</strong>
          <span>先选择车站，再选择全称站区和具体出租车调度站。</span>
        </div>
      </section>
      <section class="ab-page-section">
        <div class="ab-short-haul-choice-list">
          ${stationsForBooking.map(renderShortHaulStationChoiceCard).join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("driver", "short"),
  });
}

function renderShortHaulAreaSelectPage(stationKey) {
  const station = shortHaulStationById(stationKey);
  const resolvedStationKey = shortHaulDispatchData[stationKey] ? stationKey : "south";
  return renderAppShell({
    className: "ab-short-haul-page ab-short-haul-select-page",
    topbar: renderAppTopbar({ title: "选择站区", backTo: "#/driver/short-haul/station-select" }),
    body: `
      <section class="ab-page-section">
        <div class="ab-choice-context">
          <strong>${station.name}</strong>
          <span>${station.areas.length}个站区 · ${dispatchStationCount(station)}个出租车调度站</span>
        </div>
      </section>
      <section class="ab-page-section">
        <div class="ab-short-haul-choice-list">
          ${station.areas.map((area) => renderShortHaulAreaChoiceCard(resolvedStationKey, area)).join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("driver", "short"),
  });
}

function renderShortHaulDispatchSelectPage(stationKey, areaKey) {
  const resolvedStationKey = shortHaulDispatchData[stationKey] ? stationKey : "south";
  const station = shortHaulStationById(resolvedStationKey);
  const area = shortHaulAreaByKey(resolvedStationKey, areaKey);
  return renderAppShell({
    className: "ab-short-haul-page ab-short-haul-select-page",
    topbar: renderAppTopbar({ title: "选择调度站", backTo: `#/driver/short-haul/area-select/${resolvedStationKey}` }),
    body: `
      <section class="ab-page-section">
        <div class="ab-choice-context">
          <strong>${area.name}</strong>
          <span>${station.name} · ${area.dispatches.length}个出租车调度站</span>
        </div>
      </section>
      <section class="ab-page-section">
        <div class="ab-short-haul-choice-list">
          ${area.dispatches.map((dispatch) => renderShortHaulDispatchChoiceCard(resolvedStationKey, area.key, dispatch)).join("")}
        </div>
      </section>
    `,
    footer: renderAbFooterNav("driver", "short"),
  });
}

function renderShortHaulPage(variant = "booking") {
  const activeRoute = `#/driver/short-haul/${variant}`;
  const previousShortHaulRoute =
    state.previousRoute && state.previousRoute.startsWith("#/driver/short-haul/") ? state.previousRoute : "";
  const shortHaulBackTo = variant === "booking" ? state.shortHaulBackTo || "#/driver/queue" : previousShortHaulRoute || state.shortHaulBackTo || "#/driver/queue";
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
        ${renderSectionTitle("目标车站")}
        ${renderShortHaulTargetCard()}
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
        <button class="ab-primary-button" data-toast="确认预约（消耗10分）">确认预约（消耗10分）</button>
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
        ${renderStatGrid([{ value: "50", label: "当前积分", tone: "primary" }, { value: "+30", label: "本月获得", tone: "success" }, { value: "5次", label: "可复载次数", tone: "warning" }])}
      </section>

      <section class="ab-page-section">
        <div class="ab-info-list">
          ${pointsRules
            .map(
              (label) => `
                <button class="ab-info-row" data-toast="${label}（原型演示）">
                  <span class="ab-info-row-left">
                    <span class="ab-info-icon">${iconMarkup("points")}</span>
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
      backTo: shortHaulBackTo,
      action: `<button class="ab-topbar-action" data-toast="规则说明（原型演示）">规则</button>`,
    }),
    body: `
      <section class="ab-page-section">
        ${renderStatGrid([
          { value: "+10分", label: "短途赋分", tone: "success" },
          { value: "-10分", label: "复载消分", tone: "danger" },
          { value: "50分", label: "当前积分", tone: "primary" },
        ])}
      </section>

      <section class="ab-page-section">
        ${renderSelectableGrid(shortHaulTabs, { activeValue: activeRoute, cols: 3, className: "ab-tab-row" })}
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
        ${renderInfoRows([
          { icon: "lounge", label: "北京南站的士之家", note: "出租车候客区服务楼2层", toast: "北京南站的士之家" },
          { icon: "pin", label: "地址：北京南站出租车候客区服务楼2F", toast: "地址" },
          { icon: "clock", label: "开放时间：06:00 - 22:00（全年无休）", toast: "开放时间" },
          { icon: "people", label: "可容纳：约50名司机同时休息", toast: "容纳量" },
        ])}
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
            <b>50</b>
          </div>
          <p>积分来源：短途复载赋分<br>本月获得 +30 积分</p>
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
      action: `<button class="ab-topbar-action" data-toast="50积分（原型演示）">50积分</button>`,
    }),
    body: `
      <section class="ab-page-section">
        <div class="ab-house-hero">
          <div class="ab-house-hero-copy">
            <strong>北京南站 · 司机专属服务中心</strong>
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
        ${renderSelectableGrid(taxiHouseTabs, { activeValue: activeRoute, cols: 3, className: "ab-tab-row" })}
      </section>

      ${bodyMap[variant] || bodyMap.info}
    `,
    footer: renderAbFooterNav("driver", "house"),
  });
}

function renderFeatureRoute(current) {
  const transferMatch = current.match(/^#\/station-transfer\/([^/]+)$/);
  const driverStationMapMatch = current.match(/^#\/driver\/station\/([^/]+)\/map$/);
  const driverStationMatch = current.match(/^#\/driver\/station\/([^/]+)$/);
  const shortHaulAreaMatch = current.match(/^#\/driver\/short-haul\/area-select\/([^/]+)$/);
  const shortHaulDispatchMatch = current.match(/^#\/driver\/short-haul\/dispatch-select\/([^/]+)\/([^/]+)$/);
  if (current === "#/station/home") return renderStationHome();
  if (current === "#/nav/map") return renderNavigationPage("map");
  if (current === "#/nav/map3d") return renderNavigationPage("map3d");
  if (current === "#/nav/ar") return renderNavigationPage("ar");
  if (current === "#/nav/route") return renderNavigationPage("route");
  if (current === "#/announcements") return renderAnnouncementsPage("top");
  if (current === "#/announcements/more") return renderAnnouncementsPage("more");
  if (current === "#/station/services") return renderStationServicesPage();
  if (current === "#/station/services/inquiry") return renderStationInquiryPage();
  if (current === "#/station-transfer/select") return renderStationTransferSelectPage();
  if (transferMatch) return renderStationTransferRoutePage(transferMatch[1]);
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
  if (current === "#/driver/station/beijing-map") return renderDriverStationPage("beijing", "map");
  if (driverStationMapMatch && driverStationData[driverStationMapMatch[1]]) return renderDriverStationPage(driverStationMapMatch[1], "map");
  if (driverStationMatch && driverStationData[driverStationMatch[1]]) return renderDriverStationPage(driverStationMatch[1], "queue");
  if (current === "#/driver/short-haul/station-select") return renderShortHaulStationSelectPage();
  if (shortHaulAreaMatch) return renderShortHaulAreaSelectPage(shortHaulAreaMatch[1]);
  if (shortHaulDispatchMatch) return renderShortHaulDispatchSelectPage(shortHaulDispatchMatch[1], shortHaulDispatchMatch[2]);
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

function renderSplash(kind = "traveler") {
  const isDriver = kind === "driver";
  const target = isDriver ? "#/driver/short-haul/booking" : "#/station/select";
  const label = isDriver ? "进入短途复载" : "进入站区选择";
  const alt = isDriver ? "短途复载" : "到站北京";
  const splashImage = pickSplashImage(isDriver ? "driver" : "traveler");
  return `
    <div class="splash-shell">
      <button class="splash-trigger" data-to="${target}" aria-label="${label}">
        <img class="splash-full-image" src="${splashImage}" alt="${alt}">
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
  const selected = stationById(state.draftStation);
  const helperText = "点选站点后直接进入服务首页";

  return `
    <div class="source-screen custom-station-screen">
      <div class="custom-topbar">
        <button class="station-back-button" data-to="${isSwitch ? "#/station/home" : "#/splash"}" aria-label="返回">${iconMarkup("back")}</button>
        <strong>${title}</strong>
        <span></span>
      </div>
      <section class="station-select-intro">
        <p>${isSwitch ? "当前站点" : "首次进入请先选择站点"}</p>
        <h1>${selected[1]}</h1>
        <span>${helperText}</span>
      </section>
      <div class="station-grid-source is-preparing" aria-label="选择站点">
        <div class="station-select-grid">
          ${stations
            .map(
              ([id, name]) => `
                <button class="station-slide ${state.draftStation === id ? "active" : ""}" data-station="${id}" aria-label="选择${name}">
                  <span class="station-slide-media">
                    <img class="station-slide-photo" src="${stationHeroImage(id, "portrait")}" alt="${name}">
                    <span class="station-slide-icon">${stationIconMarkup(id)}</span>
                  </span>
                  <span class="station-slide-copy">
                    <strong>${name}</strong>
                    <em>${stationKindLabel(id)} · 到站服务</em>
                  </span>
                  <span class="station-slide-check">${iconMarkup("check")}</span>
                </button>`
            )
            .join("")}
        </div>
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
          ["profile", "个人", "user"],
        ]
      : [
          ["home", "首页", "home"],
          ["nav", "导航", "map"],
          ["traffic", "交通", "bus"],
          ["notice", "公告", "megaphone"],
          ["profile", "个人", "user"],
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
        <p class="anchor-consume">${anchorIcon("check")}<span>已消耗10分</span></p>
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
      <button class="anchor-logout" data-toast="退出登录（原型演示）">${anchorIcon("logout")}<span>退出登录</span></button>
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
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = renderSplash("traveler");
    syncDesktopPreviewFrame();
    return;
  }
  if (current === "#/driver/splash") {
    state.currentSurface = current;
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = renderSplash("driver");
    syncDesktopPreviewFrame();
    return;
  }
  if (current === "#/services") {
    state.currentSurface = current;
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = renderServices();
    syncDesktopPreviewFrame();
    requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  if (current === "#/station/select") {
    if (state.currentSurface !== current) {
      state.draftStation = "south";
    }
    state.currentSurface = current;
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = renderStationSelect("select");
    syncDesktopPreviewFrame();
    scheduleStationCarouselSync();
    return;
  }
  if (current === "#/station/switch") {
    if (state.currentSurface !== current) {
      state.draftStation = state.station;
    }
    state.currentSurface = current;
    app.className = "app-shell mobile-preview-app";
    app.innerHTML = renderStationSelect("switch");
    syncDesktopPreviewFrame();
    scheduleStationCarouselSync();
    return;
  }
  state.currentSurface = current;
  app.className = "app-shell mobile-preview-app";
  const page = pages[current] || pages["#/portal"];
  app.innerHTML = renderSourcePage(page);
  syncDesktopPreviewFrame();
}

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-traffic-search-form]");
  if (!form) return;
  event.preventDefault();
  const input = form.querySelector("[name='trafficQuery']");
  state.selected.trafficQuery = input && input.value.trim() ? input.value.trim() : "北京大学";
  state.selected.trafficSearchResult = true;
  render();
});

document.addEventListener("click", (event) => {
  const trafficSearchBack = event.target.closest("[data-traffic-search-back]");
  if (trafficSearchBack) {
    event.preventDefault();
    state.selected.trafficSearchResult = false;
    render();
    return;
  }

  const selectionButton = event.target.closest("[data-select-key]");
  if (selectionButton) {
    event.preventDefault();
    state.selected[selectionButton.dataset.selectKey] = selectionButton.dataset.selectValue;
    if (selectionButton.dataset.selectKey === "navFloor") {
      state.selected.navFocus = "restroom";
    }
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

  const navPoiButton = event.target.closest("[data-nav-poi]");
  if (navPoiButton) {
    event.preventDefault();
    const focus = navPoiButton.dataset.navPoi;
    state.selected.navFocus = focus;
    state.selected.navFloor = focus === "taxi" ? "B1" : "F1";
    go("#/nav/map");
    render();
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

  const shortHaulStationButton = event.target.closest("[data-short-haul-station]");
  if (shortHaulStationButton && !shortHaulStationButton.dataset.shortHaulArea && !shortHaulStationButton.dataset.shortHaulDispatch) {
    event.preventDefault();
    const stationKey = shortHaulDispatchData[shortHaulStationButton.dataset.shortHaulStation]
      ? shortHaulStationButton.dataset.shortHaulStation
      : "south";
    state.selected.shortHaulStation = stationKey;
    state.selected.shortHaulArea = "";
    state.selected.shortHaulDispatch = "";
    go(`#/driver/short-haul/area-select/${stationKey}`);
    return;
  }

  const shortHaulAreaButton = event.target.closest("[data-short-haul-area]");
  if (shortHaulAreaButton && !shortHaulAreaButton.dataset.shortHaulDispatch) {
    event.preventDefault();
    const stationKey = shortHaulDispatchData[shortHaulAreaButton.dataset.shortHaulStation]
      ? shortHaulAreaButton.dataset.shortHaulStation
      : "south";
    const areaKey = shortHaulAreaByKey(stationKey, shortHaulAreaButton.dataset.shortHaulArea).key;
    state.selected.shortHaulStation = stationKey;
    state.selected.shortHaulArea = areaKey;
    state.selected.shortHaulDispatch = "";
    go(`#/driver/short-haul/dispatch-select/${stationKey}/${areaKey}`);
    return;
  }

  const shortHaulDispatchButton = event.target.closest("[data-short-haul-dispatch]");
  if (shortHaulDispatchButton) {
    event.preventDefault();
    const stationKey = shortHaulDispatchData[shortHaulDispatchButton.dataset.shortHaulStation]
      ? shortHaulDispatchButton.dataset.shortHaulStation
      : "south";
    const area = shortHaulAreaByKey(stationKey, shortHaulDispatchButton.dataset.shortHaulArea);
    const dispatchName = area.dispatches.includes(shortHaulDispatchButton.dataset.shortHaulDispatch)
      ? shortHaulDispatchButton.dataset.shortHaulDispatch
      : area.dispatches[0];
    state.selected.shortHaulStation = stationKey;
    state.selected.shortHaulArea = area.key;
    state.selected.shortHaulDispatch = dispatchName;
    go("#/driver/short-haul/booking");
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
    if (route() === "#/station/select" || route() === "#/station/switch") {
      state.station = state.draftStation;
      localStorage.setItem("arrive-beijing.station", state.station);
      go("#/station/home");
      return;
    }
    render();
    return;
  }

  if (event.target.closest("[data-confirm-station]")) {
    state.station = state.draftStation;
    localStorage.setItem("arrive-beijing.station", state.station);
    go("#/station/home");
  }
});

document.addEventListener(
  "scroll",
  (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.matches("[data-station-carousel]")) return;
    window.clearTimeout(stationScrollTimer);
    stationScrollTimer = window.setTimeout(() => updateStationCarouselSelection(target), 90);
  },
  true
);

window.addEventListener("hashchange", render);
window.addEventListener("resize", syncDesktopPreviewFrame);
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/portal";
  render();
});
