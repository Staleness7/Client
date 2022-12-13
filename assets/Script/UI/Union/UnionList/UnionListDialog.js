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
        unionListItemWidgetPrefab: cc.Prefab,
        unionList: cc.Node,
        createUnionBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.createUnionBtn.active = !!Global.UserModel.isAgent;

        this.callback = !!this.dialogParameters?this.dialogParameters.cb:null;
    },

    start () {
        Global.DialogManager.addLoadingCircle(1);
        Global.API.hall.getUserUnionListRequest(function (data) {
            Global.DialogManager.removeLoadingCircle();
            this.createUnionList(data.msg.recordArr);
        }.bind(this));
    },

    createUnionList(unionList){
        this.unionList.removeAllChildren();
        let lastEnterUnionID = parseInt(cc.sys.localStorage.getItem("LAST_ENTER_UNION_ID") || 0);
        if (!!lastEnterUnionID){
            let unionInfo = unionList.find(function (e) {
                return e.unionID === lastEnterUnionID;
            });
            if (!!unionInfo){
                let node = cc.instantiate(this.unionListItemWidgetPrefab);
                let ctrl = node.getComponent('UnionListItemWidgetCtrl');
                ctrl.initWidget(unionInfo, this.enterUnion.bind(this));
                node.parent = this.unionList;
            }
        }
        for (let i = 0; i < unionList.length; ++i){
            if (lastEnterUnionID === unionList[i].unionID) continue;
            let node = cc.instantiate(this.unionListItemWidgetPrefab);
            let ctrl = node.getComponent('UnionListItemWidgetCtrl');
            ctrl.initWidget(unionList[i], this.enterUnion.bind(this));
            node.parent = this.unionList;
        }
    },

    onBtnClick(event, parameter){
        Global.AudioManager.playCommonSoundClickButton();
        if (parameter === 'back'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'createUnion'){
            Global.DialogManager.createDialog("UI/Union/UnionList/CreateUnionDialog", {cb: this.enterUnion.bind(this)});
        } else if (parameter === 'joinUnion'){
            if (Global.UserModel.unionInfo.length >= 20){
                Global.DialogManager.addPopDialog("最多加入20个不同的亲友圈");
                return;
            }
            Global.DialogManager.createDialog("UI/Union/UnionList/JoinUnionDialog", {cb: this.enterUnion.bind(this)});
        }
    },

    enterUnion(unionID){
        if (!!this.callback){
            Global.DialogManager.destroyDialog(this);
            this.callback(unionID);
        }else{
            Global.DialogManager.addLoadingCircle(1);
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionMainDialog", {unionID: unionID, lastDialog: 'hall'}, function () {
                Global.DialogManager.destroyAllDialog(["UI/Union/UnionMain/UnionMainDialog"]);
            }.bind(this));
        }
    }
});
