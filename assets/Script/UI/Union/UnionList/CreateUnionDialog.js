cc.Class({
    extends: cc.Component,

    properties: {
        unionName: cc.EditBox
    },

    start () {

    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'create'){
            let unionName = this.unionName.string;
            if (!unionName){
                Global.DialogManager.addTipDialog("请输入俱乐部名称");
                return;
            }
            if (Global.Utils.getStringRealLength(unionName) > 12){
                Global.DialogManager.addPopDialog("俱乐部名称不得多于12个字符(1个中文为两个字符)");
                return;
            }
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.createUnionRequest(unionName, function (data) {
                Global.DialogManager.addPopDialog("创建成功", function () {
                    Global.DialogManager.createDialog("UI/Union/UnionMain/UnionMainDialog", {unionID: data.msg.unionID, lastDialog: 'hall'}, function () {
                        Global.DialogManager.destroyAllDialog(["UI/Union/UnionMain/UnionMainDialog"]);
                    }.bind(this));
                }.bind(this));
                Global.DialogManager.removeLoadingCircle();
            }.bind(this));
        }
    }
});
