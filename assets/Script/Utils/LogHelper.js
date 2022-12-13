//const Sentry = require('@sentry/node');

let exp = module.exports = {};

let logArr = [];

let consoleEx = {};
consoleEx.log = console.log;
consoleEx.warn = console.warn;
consoleEx.error = console.error;

exp.replaceConsole = function () {
    console.log = exp.log;
    console.warn = exp.warn;
    console.error = exp.error;
    console.clash = exp.clash;

    if (Global.Constant.isLogReportEnable){
        startLogReport();
    }
};

exp.log = function (tag, msg) {
    if (Global.Constant.logPrintLevel !== "LOG") return;

    consoleEx.log(tag, msg || "");
    exp.addLog(tag, msg, null, "LOG");
};

exp.warn = function (tag, msg) {
    if (Global.Constant.logPrintLevel !== "WARNING" && Global.Constant.logPrintLevel !== "LOG") return;
    consoleEx.warn(tag, msg || "");
    exp.addLog(tag, msg, null, "WARNING");
};


exp.error = function (tag, msg) {
    consoleEx.error(tag, msg || "");
    exp.addLog(tag, msg, null, "ERROR");
};

// 输出崩溃日志，会触发上报
exp.clash = function (tag, msg) {
    consoleEx.error(tag, msg || "");
    exp.addLog(tag, msg, null, "CLASH");
    clashCount++;
    exp.reportLog();
};

let clashCount = 0;
let startLogReportID = null;
function startLogReport() {
    Global.Constant.isLogReportEnable = true;
    if (!!startLogReportID) clearInterval(startLogReportID);
    startLogReportID = setInterval(function () {
        clashCount = 0;
    }.bind(this), 2000)
}

// 停止上报，间隔60秒之后重新开始上报
let stopLogReportID = null;
function stopLogReport() {
    Global.Constant.isLogReportEnable = false;
    stopLogReportID.setTimeout(function () {
        startLogReport();
    }, 60 * 1000);
}

exp.addLog = function (tag, msg, stack, level) {
    if (!msg){
        msg = tag;
        tag = "";
    }
    logArr.push({
        uid: Global.UserModel.uid || "",
        version: Global.Constant.version,
        tag: (tag || "").toString(),
        msg: JSON.stringify(msg || ""),
        stack: (stack || "").toString(),
        level: level
    });
    if (logArr.length >= 5) logArr.shift();
};

exp.reportLog = function () {
    if (!Global.Constant.isLogReportEnable) return;
    // 如果一秒钟内产生5条崩溃，则暂停上报，60秒之后再开启
    if (clashCount >= 5){
        stopLogReport();
    }
    try {
        consoleEx.log("reportLog");
        let xhr = new XMLHttpRequest();
        xhr.open("POST", Global.Constant.logReportAddress, true);
        let body = JSON.stringify({__logs__: logArr});
        xhr.setRequestHeader("CONTENT-TYPE", "application/json");
        xhr.setRequestHeader("x-log-apiversion", "0.6.0");
        xhr.setRequestHeader("x-log-bodyrawsize", body.length.toString());
        xhr.send(body);

        logArr = [];
    }catch(e){
        consoleEx.error(e.stack);
    }
};

// 获取崩溃信息
if(cc.sys.isNative){
    window.__errorHandler = function (file, line, msg, error) {
        exp.addLog(file,  msg, error, "EXCEPTION");
        clashCount++;
        exp.reportLog();
    }
} else{
    window.onerror = function (msg, url, line, col, error) {
        exp.addLog(url,  msg, error.stack, "EXCEPTION");
        clashCount++;
        exp.reportLog();
    }
}
