// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        shareImg: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onBtnClick(event, param){
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'wx': {
                let url = Global.ConfigModel.downloadUrl;
                let title = "众乐乐";
                let description = "您的好友邀您一起游戏，点击即可下载游戏，等你来玩";
                Global.PlatformHelper.wxShareUrl(url, title, description, 0);
            }
                break;
            case 'friend':{
                let url = Global.ConfigModel.downloadUrl;
                let title = "众乐乐";
                let description = "您的好友邀您一起游戏，点击即可下载游戏，等你来玩";
                Global.PlatformHelper.wxShareUrl(url, title, description, 1);
            }
                break;
        }
    }

    // update (dt) {},
});
