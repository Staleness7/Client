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
        userInfoNode: cc.Node,
        avatar: cc.Sprite,
        nickname: cc.Label,
        winScore: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initWidget(roomUserInfo){
        if (!roomUserInfo){
            this.unionInfo.active = false;
        }
        this.userInfoNode.active = true;
        Global.CCHelper.updateSpriteFrame(roomUserInfo.avatar, this.avatar);
        this.nickname.string = roomUserInfo.nickname;
        this.winScore.string = roomUserInfo.winScore;
    }

    // update (dt) {},
});
