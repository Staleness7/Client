cc.Class({
    extends: cc.Component,

    properties: {
        uid: cc.Label,
        nickname: cc.Label,
        avatar: cc.Sprite,
        todayDraw: cc.Label,
        weekDraw: cc.Label,
        totalDraw: cc.Label,
        rank: cc.Label
    },

    start () {

    },

    initWidget(userInfo, rank){
        this.uid.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;

        this.rank.string = rank + 1;

        this.todayDraw.string = userInfo.todayDraw;
        this.weekDraw.string = userInfo.weekDraw;
        this.totalDraw.string = userInfo.totalDraw;
    }
});
