cc.Class({
    extends: cc.Component,

    properties: {
        uid: cc.Label,
        nickname: cc.Label,
        avatar: cc.Sprite,
        yesterdayDraw: cc.Label,
        yesterdayBigWin: cc.Label,
        yesterdayUser: cc.Label,
        totalDraw: cc.Label,
    },

    start () {

    },

    initWidget(userInfo, unionID){
        this.unionID = unionID;
        this.userInfo = userInfo;

        this.uid.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;

        this.yesterdayDraw.string = userInfo.yesterdayDraw;
        this.yesterdayBigWin.string = userInfo.yesterdayBigWinDraw;
        this.yesterdayUser.string = parseFloat(userInfo.yesterdayProvideRebate.toFixed(2));
        this.totalDraw.string = userInfo.totalDraw;
    }
});
