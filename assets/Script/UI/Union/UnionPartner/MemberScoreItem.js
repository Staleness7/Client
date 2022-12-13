cc.Class({
    extends: cc.Component,

    properties: {
        uid: cc.Label,
        nickname: cc.Label,
        avatar: cc.Sprite,
        score: cc.Label,
        safeScore: cc.Label,
        totalScore: cc.Label
    },

    start () {

    },

    initWidget(userInfo, unionID, unionOwnerID){
        this.unionID = unionID;
        this.unionOwnerID = unionOwnerID;
        this.userInfo = userInfo;

        this.uid.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;

        this.score.string = Global.Utils.formatNumberToString(userInfo.score, 2);
        this.safeScore.string = Global.Utils.formatNumberToString(userInfo.safeScore, 2);
        this.totalScore.string = Global.Utils.formatNumberToString(userInfo.score + userInfo.safeScore, 2);
    },

    updateScore(score){
        this.userInfo.score = score;
        this.score.string = Global.Utils.formatNumberToString(this.userInfo.score, 2);
        this.totalScore.string = Global.Utils.formatNumberToString(this.userInfo.score + this.userInfo.safeScore, 2);
    },

    onBtnClick(event, parameter){
        if (parameter === 'addScore'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeMemberScoreDialog", {unionID: this.unionID, memberUid: this.userInfo.uid, score: this.userInfo.score, operationType: 'add', unionOwnerID: this.unionOwnerID});
        } else if (parameter === 'jianScore'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeMemberScoreDialog", {unionID: this.unionID, memberUid: this.userInfo.uid, score: this.userInfo.score, operationType: 'jian', unionOwnerID: this.unionOwnerID});
        }
    }

    // update (dt) {},
});
