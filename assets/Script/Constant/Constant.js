let enumeration = require('../Constant/enumeration');
let DEBUG = true;
// 网页发布版本
let WEB_PRODUCTION = true;
let SERVER_IP      = "http://example.com:13000";
let SERVER_IP_WEB  = "http://example.com:14000";

//本地测试
let SERVER_IP_LOCAL      = "http://127.0.0.1:13000";
let SERVER_IP_WEB_LOCAL  = "http://127.0.0.1:14000";

// 开发模式
let SERVER_IP_DEVELOPMENT = "http://debug.example.com:13000";
let SERVER_IP_WEB_DEVELOPMENT = "http://debug.example.com:14000";

module.exports = {
    // 是否为测试包(测试包则可以在登录界面切换服务器连接地址)
	debug: DEBUG,
    // 开发模式(开发模式标识，开发时特有功能可用该标识控制，正式版本必须为false)
    development: DEBUG && !WEB_PRODUCTION && !cc.sys.isNative,
    // 可切换服务器地址
    serverAddressArr: [
        {name: "本机服务器", gateServerAddress: SERVER_IP_LOCAL},
        {name: "测试服务器", gateServerAddress: SERVER_IP_DEVELOPMENT},
        {name: "正式服务器", gateServerAddress: SERVER_IP}
    ],
    // 游戏服务器(默认游戏服务器)
    gateServerAddress: DEBUG ? SERVER_IP_DEVELOPMENT : SERVER_IP,
    // 网页服务器(默认网页服务器)
    webServerAddress: DEBUG ? SERVER_IP_WEB_DEVELOPMENT : SERVER_IP_WEB,
    // 热更新服务器(默认热更新)
    hotUpdateAddress: (DEBUG ? SERVER_IP_WEB_DEVELOPMENT : SERVER_IP_WEB) + '/hot-update',
    // 模拟微信账号配置文件地址
    wxAccountConfigAddress: (DEBUG ? SERVER_IP_WEB_DEVELOPMENT : SERVER_IP_WEB) + '/game-static/user_info_config.csv',
    // 是否自动登录
    isAutoLogin: !DEBUG && cc.sys.isNative,
    // 是否检查更新(正式出版本必须为true)
    isCheckUpdate: cc.sys.isNative,
    // 版本号(每次出版本必须提升小版本号)
    version: 'v1.0.9', // TODO 自动从打包文件内获取版本号
    // 设计分辨率
    designSize: cc.Size(1334, 750),
    // 游戏主界面
    gameDialogList: [
        {gameType: enumeration.gameType.PDK, gameDialog: "Game/PaoDeKuai/PDKMainDialog", loadDirArr: ["Game/PaoDeKuai"]},
		{gameType: enumeration.gameType.NN, gameDialog: "Game/Niuniu/NNMainDialog", loadDirArr: ["Game/Niuniu"]},
		{gameType: enumeration.gameType.SG, gameDialog: "Game/Sangong/SGMainDialog", loadDirArr: ["Game/Sangong"]},
		{gameType: enumeration.gameType.SZ, gameDialog: "Game/Sanzhang/SZMainDialog", loadDirArr: ["Game/Sanzhang"]},
        {gameType: enumeration.gameType.ZNMJ, gameDialog: "Game/Majiang/MJMainDialog", loadDirArr: ["Game/Majiang"]},
		{gameType: enumeration.gameType.DGN, gameDialog: "Game/Dougongniu/DGNMainDialog", loadDirArr: ["Game/Niuniu, Game/Dougongniu"]},
    ],
    // 聊天间隔时间
	chatCool: 3,
    // 刷新联盟间隔时间
    updateUnionTime: 3,
    // 是否启用日志报告
    isLogReportEnable: !DEBUG,
    // 日志打印等级
    logPrintLevel: WEB_PRODUCTION ? "ERROR" : "LOG",
    // 日志写入地址
    logReportAddress: "http://youyouyouxi.cn-zhangjiakou.log.aliyuncs.com/logstores/youyou/track",
    // 是否模拟微信登录（正式版本必须为false）
    simulationWXLogin: (DEBUG || WEB_PRODUCTION) && !cc.sys.isNative,
    // 是否开启微信随机账号(开启点击微信登录时，每次自动生成不同账号)
    wxRandomAccount: false,
    // 是否开启微信账号切换
    switchAccountEnable: WEB_PRODUCTION
};
