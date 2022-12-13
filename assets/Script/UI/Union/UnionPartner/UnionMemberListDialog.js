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
        userListRoot: cc.Node,
        userMemberListItemWidget: cc.Prefab,
        pageLabel: cc.Label,
        uidEditBox: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.unionID = this.dialogParameters.unionInfo.unionID;
        this.unionOwnerID = this.dialogParameters.unionInfo.ownerUid;

        this.curIndex = 0;
        this.maxIndex = 0;

        this.updateList();

        Global.MessageCallback.addListener("UpdateMemberScoreList", this);
    },

    onDestroy(){
        Global.MessageCallback.removeListener("UpdateMemberScoreList", this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'UpdateMemberScoreList':
                this.updateItem(data.uid, data.score);
                break;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'addMember'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/AddMemberDialog", {unionID: this.unionID});
        } else if (parameter === 'query'){
            let uid = this.uidEditBox.string;
            if (uid.length !== 6){
                Global.DialogManager.addTipDialog("请输入正确的用户ID");
                return;
            }
            Global.DialogManager.addLoadingCircle(1);
            let matchData = {
                uid: uid,
                unionInfo: {
                    $elemMatch: {
                        unionID: this.unionID
                    }
                }
            };
            if (this.unionOwnerID !== Global.UserModel.uid){
                matchData.unionInfo.$elemMatch.spreaderID = Global.UserModel.uid;
            }
            Global.API.hall.getMemberListRequest(this.unionID, matchData, 0, 1, function (data) {
                this.curIndex = 0;
                this.maxIndex = 0;
                this.pageLabel.string = (this.curIndex + 1) + "/" + (this.maxIndex + 1);

                Global.DialogManager.removeLoadingCircle();

                this.userListRoot.removeAllChildren();

                for (let i = 0; i < data.msg.recordArr.length; ++i){
                    let node = cc.instantiate(this.userMemberListItemWidget);
                    let ctrl = node.getComponent('UserMemberListItemWidgetCtrl');
                    ctrl.initWidget(data.msg.recordArr[i], this.unionID, this.unionOwnerID);
                    node.parent = this.userListRoot;
                }
            }.bind(this));
        } else if (parameter === 'left'){
            if (this.curIndex === 0) return;
            this.curIndex--;
            this.updateList();
        } else if (parameter === 'right'){
            if (this.curIndex >= this.maxIndex) return;
            this.curIndex++;
            this.updateList();
        }
    },

    updateList(){
        Global.DialogManager.addLoadingCircle(1);
        let matchData = {
            unionInfo: {
                $elemMatch:{
                    unionID: this.unionID
                }
            }
        };
        if (this.unionOwnerID !== Global.UserModel.uid){
            matchData.unionInfo.$elemMatch.spreaderID = Global.UserModel.uid;
        }
        Global.API.hall.getMemberListRequest(this.unionID, matchData, this.curIndex * 20, 20, function (data) {
            Global.DialogManager.removeLoadingCircle();

            this.maxIndex = Math.floor((data.msg.totalCount + 1)/20);
            if ((data.msg.totalCount + 1)%20 === 0){
                this.maxIndex--;
            }
            this.userListRoot.removeAllChildren();
            this.ctrlArr = [];

            this.pageLabel.string = (this.curIndex + 1) + "/" + (this.maxIndex + 1);
            // 添加自己
            if (this.unionOwnerID !== Global.UserModel.uid) {
                let node = cc.instantiate(this.userMemberListItemWidget);
                let ctrl = node.getComponent('UserMemberListItemWidgetCtrl');
                ctrl.initWidget({
                    nickname: Global.UserModel.nickname,
                    avatar: Global.UserModel.avatar,
                    uid: Global.UserModel.uid,
                    prohibitGame: Global.UserModel.getUnionInfoItemByUnionID(this.unionID).prohibitGame,
                    score:Global.UserModel.getUnionInfoItemByUnionID(this.unionID).score
                }, this.unionID, this.unionOwnerID);
                node.parent = this.userListRoot;

                this.ctrlArr.push(ctrl);
            }
            for (let i = 0; i < data.msg.recordArr.length; ++i){
                let node = cc.instantiate(this.userMemberListItemWidget);
                let ctrl = node.getComponent('UserMemberListItemWidgetCtrl');
                ctrl.initWidget(data.msg.recordArr[i], this.unionID, this.unionOwnerID);
                node.parent = this.userListRoot;

                this.ctrlArr.push(ctrl);
            }
        }.bind(this));
    },

    updateItem(uid, score){
        for (let i = 0; i < this.ctrlArr.length; ++i){
            let ctrl = this.ctrlArr[i];
            if (ctrl.userInfo.uid === uid){
                ctrl.updateScore(score);
                break;
            }
        }
    }

    // update (dt) {},
});
