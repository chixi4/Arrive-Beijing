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

const ICONS = {
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
};

function iconMarkup(name) {
  return ICONS[name] || ICONS.more;
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

function renderSplash() {
  return `
    <div class="splash-shell">
      <button class="splash-trigger" data-to="#/station/select" aria-label="进入站区选择">
        <img class="splash-full-image" src="${IMG}P04-01_开屏页.png" alt="到站北京">
      </button>
    </div>
  `;
}

function renderStationHome() {
  const [, stationName] = stationById(state.station);
  const stationSrc = stationHeroImage(state.station);
  return `
    <div class="screen station-home-screen">
      <section class="station-home-hero" style="--station-hero-image:url('${stationSrc}')">
        <div class="station-home-hero-inner">
          <div class="hero-topline">
            <button class="station-chip" data-to="#/station/switch" aria-label="切换站点">
              <span class="station-chip-pin" aria-hidden="true">${iconMarkup("pin")}</span>
              <span>${stationName}</span>
            </button>
            <div class="hero-search" aria-hidden="true">
              ${iconMarkup("search")}
              <span>搜索站区服务、设施等</span>
            </div>
          </div>
          <div class="station-home-hero-meta">
            <div class="station-home-flow">
              实时客流：<span>正常</span>
            </div>
            <div class="station-home-weather">
              <strong>31°C</strong>
              <span>晴</span>
            </div>
          </div>
        </div>
      </section>

      <section class="announcements">
        <div class="section-head">
          <div class="section-head-title">
            <span class="section-icon blue">${iconMarkup("notice")}</span>
            <span>站区公告</span>
          </div>
          <button class="more" data-to="#/announcements">更多 &gt;</button>
        </div>
        <div class="announcement-list">
          ${stationHomeAnnouncements
            .map(
              (item) => `
                <button class="list-card clickable announcement-card" data-to="${item.to}">
                  <div class="row">
                    <span class="tag ${item.tag === "紧急" ? "red" : item.tag === "通知" ? "blue" : "blue"}">${item.tag}</span>
                    <div class="announcement-text">${item.text}</div>
                  </div>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="station-services">
        <div class="section-head">
          <div class="section-head-title">
            <span class="section-icon blue">${iconMarkup("map")}</span>
            <span>站区服务</span>
          </div>
        </div>
        <div class="station-service-card">
          <div class="station-service-grid">
            ${stationHomeServices
              .map(
                (item) => `
                  <button class="station-service-item" data-to="${item.to}" style="--tile-bg:${item.bg};--tile-fg:${item.fg};">
                    <span class="glyph">${iconMarkup(item.icon)}</span>
                    <span class="label">${item.label}</span>
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      ${renderBottomNav("home")}
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

function render() {
  const current = route();
  if (current === "#/splash") {
    state.currentSurface = current;
    app.innerHTML = renderSplash();
    return;
  }
  if (current === "#/services") {
    state.currentSurface = current;
    app.innerHTML = renderServices();
    requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  if (current === "#/station/home") {
    state.currentSurface = current;
    app.innerHTML = renderStationHome();
    return;
  }
  if (current === "#/station/select") {
    state.currentSurface = current;
    app.innerHTML = renderStationSelect("select");
    return;
  }
  if (current === "#/station/switch") {
    if (state.currentSurface !== current) {
      state.draftStation = state.station;
    }
    state.currentSurface = current;
    app.innerHTML = renderStationSelect("switch");
    return;
  }
  state.currentSurface = current;
  const page = pages[current] || pages["#/portal"];
  app.innerHTML = renderSourcePage(page);
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
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/portal";
  render();
});
