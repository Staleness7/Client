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
        uid: cc.Label,
        nickname: cc.Label,
        score: cc.Label,
        avatar: cc.Sprite,
        bigWinNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initWidget(userInfo, bigWinList){
        if (!userInfo){
            this.uid.node.active = false;
            this.nickname.node.active = false;
            this.score.node.active = false;
            this.avatar.node.active = false;
            this.bigWinNode.active = false;
        }else{
            this.uid.string = "ID:" + userInfo.uid;
            this.nickname.string = userInfo.nickname;
            this.score.string = userInfo.score;
            Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
            this.bigWinNode.active = bigWinList.indexOf(userInfo.uid) !== -1 && userInfo.score > 0;
        }
    }
});
