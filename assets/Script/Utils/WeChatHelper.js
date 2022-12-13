let utils = require('./utils');
let exp = module.exports = {};

//设置分享内容，默认设置在游戏中分享
// 分享到朋友圈
exp.setShareTimeline = function (params_) {
    if (!!Global.wx) {
        let params = params_ || {};
        let imgUrl = params.imgUrl || Global.Data.getData('share_game_timeline_img_url');

        Global.wx.onMenuShareTimeline({
            title: params.title || Global.Data.getData('share_game_timeline_title'), // 分享标题
            link: params.link || Global.Data.getData('share_game_link') + '?state=' + params.roomID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Global.Constant.storeImgIP + imgUrl + '?ver=' + (new Date()).valueOf(), // 分享图标
            success: function () {
                alert('分享成功');
                if (!!params.cb) {
                    params.cb('success');
                }
            },
            cancel: function () {
                alert('取消分享');
                if (!!params.cb) {
                    params.cb('cancel');
                }
            },
            fail: function () {
                alert('分享失败');
                if (!!params.cb) {
                    params.cb('fail');
                }
            }
        });
    }
};

//分享给朋友
exp.setShareFriend = function (params_) {
    if (!!Global.wx) {
        let params = params_ || {};
        let imgUrl = params.imgUrl || Global.Data.getData('share_game_friend_img_url');

        Global.wx.onMenuShareAppMessage({
            title: params.title || Global.Data.getData('share_game_friend_title'), // 分享标题
            desc: params.desc || Global.Data.getData('share_game_friend_desc').format(params.roomID), // 分享描述
            link: params.link || Global.Data.getData('share_game_link') + '?state=' + params.roomID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Global.Constant.storeImgIP + imgUrl + '?ver=' + (new Date()).valueOf(), // 分享图标
            type: params.type || '', // 分享类型,music、video或link，不填默认为link
            dataUrl: params.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                alert('分享成功');
                if (!!params.cb) {
                    params.cb('success');
                }
            },
            cancel: function () {
                alert('取消分享');
                if (!!params.cb) {
                    params.cb('cancel');
                }
            },
            fail: function () {
                alert('分享失败');
                if (!!params.cb) {
                    params.cb('fail');
                }
            }
        });
    }
};

/**
 *
 * @param configData = {
 *      debug: true or false,开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
 *     appId: 必填，公众号唯一标识
 *     timestamp： 必填，生成签名的时间戳
 *     nonceStr： 必填，生成签名的随机串
 *     signature: 必填，签名，见附录1
 *     jsApiList: api列表
 * }
 * @param cb
 */
exp.initJSSDK = function (configData, cb) {
    let jssdk = document.createElement('script');
    jssdk.async = true;
    jssdk.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
    document.body.appendChild(jssdk);
    /*---------JSSDK初始化-----------*/
    jssdk.addEventListener('load',function() {
        Global.wx = wx;
        wx.config(configData);
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage"
                ]
            });
            utils.invokeCallback(cb);
        }.bind(this));

        wx.error(function () {
            utils.invokeCallback(cb, "ssdk权限验证不通过，请重试！");
        })
    }.bind(this));
};