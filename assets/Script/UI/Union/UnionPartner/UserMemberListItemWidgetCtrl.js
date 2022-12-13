
cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        nickname: cc.Label,
        id:cc.Label,
        score: cc.Label,
        status: cc.Label,

        playingColor: cc.Color,
        offlineColor: cc.Color,
        onlineColor: cc.Color,

        forbidStatus: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    initWidget(userInfo, unionID, unionOwnerID){
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;
        this.id.string = userInfo.uid;
        this.score.string = '积分:'+userInfo.score;

        if (userInfo.uid === Global.UserModel.uid){
            this.status.string = '自己';
        } else if (userInfo.roomID){
            this.status.string = '游戏中';
            this.status.node.color = this.playingColor;
        } else if (userInfo.frontendId){
            this.status.string = '在线';
            this.status.node.color = this.onlineColor;
        } else{
            this.status.string = '离线';
            this.status.node.color = this.offlineColor;
        }

        this.unionOwnerID = unionOwnerID;
        this.unionID = unionID;
        this.userInfo = userInfo;

        this.forbidStatus.active =  (this.unionOwnerID === Global.UserModel.uid && !!userInfo.prohibitGame);
    },

    updateScore(score){
        this.userInfo.score = score;
    },

    onBtnClick(){
        if (this.userInfo.uid === Global.UserModel.uid) return;
        Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionMemberDetailDialog", {userInfo: this.userInfo, unionID: this.unionID, unionOwnerID: this.unionOwnerID, cb: function (forbid) {
            this.userInfo.prohibitGame = forbid;
            this.forbidStatus.active =  (this.unionOwnerID === Global.UserModel.uid && !!this.userInfo.prohibitGame);
        }.bind(this)});
    }
});
