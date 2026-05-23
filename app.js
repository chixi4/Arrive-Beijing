const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");

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
  },
  counters: {
    braisedRice: 0,
    tomatoNoodles: 0,
    porkRice: 0,
    steamedEgg: 0,
  },
};

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
  "#/services": {
    src: "P02-02_全部服务页.png",
    hotspots: [
      { x: 0, y: 0, w: 11, h: 9, to: "#/portal" },
      { x: 38, y: 83, w: 55, h: 5, to: "#/splash" },
      { x: 38, y: 88, w: 55, h: 6, to: "#/driver/splash" },
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
