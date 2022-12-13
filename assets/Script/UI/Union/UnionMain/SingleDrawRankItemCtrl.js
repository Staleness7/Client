cc.Class({
    extends: cc.Component,

    properties: {
        uid: cc.Label,
        nickname: cc.Label,
        avatar: cc.Sprite,
        score: cc.Label,
        rank: cc.Label
    },

    start () {

    },

    initWidget(userInfo, rank){
        this.uid.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;

        this.rank.string = rank + 1;
        userInfo.score = userInfo.score ? userInfo.score : 0;
        this.score.string = parseFloat(userInfo.score.toFixed(2));
    }
});
