/**
 * Created by cuilifeng on 2014/5/29.
 */


let utils = module.exports;

// control letiable of func "myPrint"
let isPrintFlag = false;


/**
 * Check and invoke callback function
 */
utils.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

/**
 * clone an object
 */
utils.clone = function (origin) {
    if (!origin) {
        return;
    }

    let obj = {};
    for (let f in origin) {
        if (origin.hasOwnProperty(f)) {
            obj[f] = origin[f];
        }
    }
    return obj;
};

utils.size = function (obj) {
    if (!obj) {
        return 0;
    }

    let size = 0;
    for (let f in obj) {
        if (obj.hasOwnProperty(f)) {
            size++;
        }
    }

    return size;
};

// print the file name and the line number ~ begin
function getStack() {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    let err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    let stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

function getFileName(stack) {
    return stack[1].getFileName();
}

function getLineNumber(stack) {
    return stack[1].getLineNumber();
}

utils.myPrint = function () {
    if (isPrintFlag) {
        let len = arguments.length;
        if (len <= 0) {
            return;
        }
        let stack = getStack();
        let aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for (let i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        console.log('\n' + aimStr);
    }
};
// print the file name and the line number ~ end

utils.getProperties = function (model, fields) {
    let result = {};
    fields.forEach(function (field) {
        if (model.hasOwnProperty(field)) {
            result[field] = model[field];
        }
    });
    return result;
};

utils.setProperties = function (model, properties) {
    for (let prop in properties) {
        model[prop] = properties[prop];
    }
};

utils.multiplyProperties = function (properties, multiplier) {
    let result = {};
    for (let k in properties) {
        result[k] = Math.floor(properties[k] * multiplier);
    }
    return result;
};

utils.addProperties = function (toProps, fromProps) {
    for (let k in fromProps) {
        if (toProps[k]) {
            toProps[k] += fromProps[k];
        } else {
            toProps[k] = fromProps[k];
        }
    }

};

utils.isEmptyObject = function (obj) {
    for (let name in obj) {
        return false;
    }
    return true;
};

utils.getLength = function (obj) {
    let total = 0;
    for (let k in obj) {
        total++;
    }
    return total;
}

utils.getDist = function (fromPos, toPos) {
    let dx = toPos.x - fromPos.x;
    let dy = toPos.y - fromPos.y;
    return Math.sqrt(dx * dx + dy * dy);
};

utils.isPositiveInteger = function (num) {
    let r = /^[1-9][0-9]*$/;
    return r.test(num);
};

utils.ipToInt = function (ip) {
    let parts = ip.split(".");

    if (parts.length != 4) {
        return 0;
    }
    return (parseInt(parts[0], 10) << 24
        | parseInt(parts[1], 10) << 16
        | parseInt(parts[2], 10) << 8
        | parseInt(parts[3], 10)) >>> 0;
};

utils.getRandomNum = function (Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    return (Min + Math.round(Rand * Range));
};


utils.userId2Number = function (userId) {
    let hash = 5381,
        i = userId.length;

    while (i)
        hash = (hash * 33) ^ userId.charCodeAt(--i);

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return Number(hash >>> 0);
};

utils.createJoinRoomID = function (serverID, roomID){
    let id = parseInt(serverID.split('-')[1]);
    if (!!id){
        return id * 1000 + roomID;
    }

    return 0;
};

utils.parseJoinRoomID = function (joinRoomID){
    joinRoomID = parseInt(joinRoomID);
    if (!!joinRoomID){
        return {
            gameServerID: 'game-' + Math.floor(joinRoomID/1000),
            roomID: joinRoomID % 1000
        };
    }
    return null;
};

let DAY_MS = 24 * 60 * 60 * 1000;
utils.getIntervalDay = function (time1, time2){
    return Math.abs((Math.floor(time1/DAY_MS) - Math.floor(time2/DAY_MS)));
};

//使数字保留num个小数位，默认保留2位，转换之后是数字
utils.numToFixed = function (number, count) {
    let count_ = count || 2;
    return parseFloat(parseFloat(number).toFixed(count_));
};

//时间戳转换成日期
Date.prototype.format = function(format) {
    let date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

String.prototype.format = function(args) {
    let result = this;
    if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) === "object") {
            for (let key in args) {
                if(args[key]!==undefined){
                    let reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    let reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

//生成随机字符串
utils.randomString = function (len) {
    len = len || 16;
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = chars.length;
    let pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

// 获取单位向量
utils.getUnitVector = function (startPoint, endPoint) {
    let point = cc.v2(0, 0);
    let distance;
    distance = Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y),2);
    distance = Math.sqrt(distance);
    if(distance === 0) return point;
    point.x = (endPoint.x - startPoint.x)/distance;
    point.y = (endPoint.y - startPoint.y)/distance;
    return point;
};

utils.stringFormat = function() {
    if (arguments.length === 0)
        return null;
    let str = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

// 截取英文字符的长度
utils.getStringByRealLength = function(str, length) {
    let realLength = 0;
    for(let i = 0; i < str.length; ++i) {
        let count = str.charCodeAt(i);
        if(count >= 0 && count <= 128) {
            ++ realLength;
        } else {
            realLength += 2;
        }
        if(realLength >= length) {
            break;
        }
    }
    return str.substring(0, i+1);
};

utils.getStringRealLength = function(str) {
    let realLength = 0;
    for(let i = 0; i < str.length; ++i) {
        let count = str.charCodeAt(i);
        if(count >= 0 && count <= 128) {
            ++ realLength;
        } else {
            realLength += 2;
        }
    }
    return realLength;
};

utils.formatNumberToString = function (num, maxDecimalLength) {
    return parseFloat(num.toFixed(maxDecimalLength)).toString();
};

utils.keepNumberPoint = function (num, maxDecimalLength) {
    let base = 1;
    for (let i = 0; i < maxDecimalLength; ++i){
        base *= 10;
    }
    return Math.floor(num * base)/base;
};

// 根据经纬度获取，两点之间的距离
utils.getDistanceByLocation = function (location1, location2) {
    let radLat1 = location1.x*Math.PI / 180.0;
    let radLat2 = location2.x*Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let  b = location1.y*Math.PI / 180.0 - location1.y*Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
};

var EARTH_RADIUS = 6378.137; //地球半径  
//将用角度表示的角转换为近似相等的用弧度表示的角 java Math.toRadians  
function rad(d) {
    return d * Math.PI / 180.0;
}
/** 
 * 谷歌地图计算两个坐标点的距离 
 * @param lng1  经度1 
 * @param lat1  纬度1 
 * @param lng2  经度2 
 * @param lat2  纬度2 
 * @return 距离（千米） 
 */
utils.getDistance = function (lng1, lat1, lng2, lat2) {
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2)
        * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

utils.csvToArray = function (strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    let objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    let arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        let strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter !== strDelimiter)
        ) {
            arrData.push([]);
        }
        let strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    if (arrData.length > 0) {
        arrData.pop();
    }

    let kNames = arrData[0];
    let datas = [];
    for (let k in arrData) {
        if (k == 0) continue;
        let dataIndex = arrData[k];
        let jsData = {};
        for (let ki in dataIndex) {
            let kk = kNames[ki];
            let kv = dataIndex[ki];
            jsData[kk] = kv;
        }
        datas[k - 1] = jsData;
    }
    return datas;
};
 
 
// let a = distance([119.9969915847, 30.2754597274,], [119.9972383479, 30.2759230036])
// let a = distance([30.2822920169, 125.0036899474], [30.2818472718, 120.0034646419])
// let a = getDistance(30.27895275, 119.9921260576, 30.2832692396, 120.0249984587)
// console.log(a)
