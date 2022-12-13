let exp = module.exports = {};

let wxAppId     = 'wx537bb98731617afb';
let wxAppSecret = 'e5fe0171b9934603c3387bb590a8f40c';

exp.setKeepScreenOn = function (isOn) {
    if (cc.sys.isNative){
        if (cc.sys.os === cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonAPI", "setKeepScreenOn", "(Z)V",isOn);
        }else if (cc.sys.os === cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("AppController", "setKeepScreenOn:", isOn);
        }
    }
};

exp.copyText = function (text) {
    if (cc.sys.isNative){
        if (cc.sys.os === cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonAPI", "copyText", "(Ljava/lang/String;)V", text);
        }else if (cc.sys.os === cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("AppController", "copyText:", text);
        }
    }else{
        Global.DialogManager.addTipDialog("当前平台不支持");
    }
};

exp.openAppByUrl = function (url) {
    if (cc.sys.isNative){
        if (cc.sys.os === cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonAPI", "openAppByUrl", "(Ljava/lang/String;)V", url);
        }else if (cc.sys.os === cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("AppController", "openAppByUrl:", url);
        }
    }
};

let GET_LOCATION_CALLBACK = null;
exp.getLocation = function (cb) {
    GET_LOCATION_CALLBACK = cb;
    if (cc.sys.isNative){
        if (cc.sys.platform === cc.sys.ANDROID) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLocation", "()V")
        } else if (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD) {
            return jsb.reflection.callStaticMethod("AppController", "getLocation")
        }
    }else{
        setTimeout(function () {
            if (!!Global.wxAccountInfo){
                exp.getLocationFinished(JSON.stringify({
                    location: Global.wxAccountInfo.address,
                    latitude: Global.Utils.getRandomNum(10000, 99999)/1000,
                    longitude: Global.Utils.getRandomNum(10000, 99999)/1000
                }));
            } else{
                exp.getLocationFinished(JSON.stringify({
                    location: "",
                    latitude: Global.Utils.getRandomNum(10000, 99999)/1000,
                    longitude: Global.Utils.getRandomNum(10000, 99999)/1000
                }));
            }
        }, 100);
    }
};

exp.getLocationFinished = function (result) {
    cc.log('--getLocationFinished--');
    result = JSON.parse(result);
    cc.log(result);
    Global.Utils.invokeCallback(GET_LOCATION_CALLBACK, null, {
        location: result.location,
        address: JSON.stringify({
            x: result.latitude,
            y: result.longitude
        })
    });
};

exp.getNetworkDelay = function (cb) {
    if (cc.sys.isNative){
        if (cc.sys.platform === cc.sys.ANDROID) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonAPI", "getNetworkDelay", "()V")
        } else if (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD) {
            return jsb.reflection.callStaticMethod("AppController", "getNetworkDelay")
        }
    }else{
        Global.Utils.invokeCallback(cb, Global.Utils.getRandomNum(30, 500));
    }
};

exp.getBattery = function () {
    if (cc.sys.isNative){
        if (cc.sys.platform === cc.sys.ANDROID) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonAPI", "getBattery", "()V")
        } else if (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD) {
            return jsb.reflection.callStaticMethod("AppController", "getBattery")
        }
    }else{
        return 0.3;
    }
};

// -------------------------------------------------微信相关-------------------------------------------------------------
//微信授权登录
exp.wxLogin = function () {
    if (cc.sys.platform === cc.sys.ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxlogin", "()V")
    } else if ((cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD)) {
        jsb.reflection.callStaticMethod("AppController", "wxlogin")
    } else{
        setTimeout(function () {
            let account = cc.sys.localStorage.getItem('account');
            exp.wxLoginFinished(0, {
                openid: account?account:Global.Utils.randomString(16),
                nickname: account?account:Global.Utils.randomString(16),
                headimgurl: "Common/head_icon_default",
                sex: Global.Utils.getRandomNum(0, 1)
            })
        }, 1);
    }
};

//即将废弃
exp.wxLoginFinished = function (errCode, wxUserData) {
    cc.log('--wxLoginFinished--');
    cc.log(errCode, wxUserData);
    if (parseInt(errCode) == 0) {
        Global.MessageCallback.emitMessage('PlatformLogin', {platform: Global.Enum.loginPlatform.WEI_XIN,userInfo: wxUserData});
    } else {
        cc.log('--wxLoginFinished fail--'+parseInt(errCode));
    }
};

//js获取微信用户信息
exp.wxLoginFinishedCode = function (code) {
    //console.log('--wxLoginFinishedCode--'+code);
    let params = {
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + wxAppId + '&secret=' + wxAppSecret + '&code=' + code + '&grant_type=authorization_code',
        method: 'GET',

        cb: function (err, response) {
            console.log('--wxLoginFinishedCode response--');
            cc.log('--wxLoginFinished access_token--'+response.access_token);
            cc.log('--wxLoginFinished openid--'+response.openid);
            if(!response.access_token || !response.openid) {
                Global.DialogManager.addTipDialog("登录失败,请稍后再试");
                return;
            }
            let params2 = {
                url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + response.access_token + '&openid=' + response.openid + '&lang=zh_CN',
                method: 'GET',
                cb: function (error, response2) {
                    Global.MessageCallback.emitMessage('PlatformLogin', {
                        platform: Global.Enum.loginPlatform.WEI_XIN,
                        userInfo: response2
                    });
                }
            };

            Global.CCHelper.httpRequest(params2);
        }
    };

    Global.CCHelper.httpRequest(params);
};

// 微信分享截图
// sceneType: 0 朋友， 1朋友圈->暂不需要
exp.wxShareImg = function (imgPath) {
    if (cc.sys.platform === cc.sys.ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareImageToWX", "(Ljava/lang/String;)V", imgPath);
    } else if (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD) {
        jsb.reflection.callStaticMethod("AppController", "imgPath:", imgPath);
    } else {
        Global.DialogManager.addTipDialog("当前平台不支持");
    }
};

/**
 * 微信分享
 * @url 连接地址
 * @title 标题
 * @description 内容
 * @sceneType 0好友 1朋友圈
 * */
exp.wxShareUrl = function (url, title, description, sceneType) {
    if (cc.sys.platform === cc.sys.ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareUrlToWX", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", url, title, description, sceneType);
    } else if (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD) {
        jsb.reflection.callStaticMethod("AppController", "wxShareUrl:title:description:sceneType:", url, title, description, sceneType);
    } else{
        Global.DialogManager.addTipDialog("当前平台不支持");
    }
};

exp.wxShareFinished = function (errCode) {
    console.log('wxShareFinished');

    Global.MessageCallback.emitMessage('PlatformShare', {platform: Global.Enum.loginPlatform.WEI_XIN, errCode: errCode});
};
