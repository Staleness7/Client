cc.Class({
    extends: cc.Component,

    properties: {
        unionName: cc.EditBox
    },

    start () {
        this.unionName.string = this.dialogParameters.unionInfo.unionName || "";
        this.unionID = this.dialogParameters.unionInfo.unionID;
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
            Global.DialogManager.addPopDialog("是否确定要修改亲友圈名字", function () {
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.updateUnionNameRequest(this.unionID, unionName, function (data) {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("修改成功");

                    Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
                }.bind(this));
            }.bind(this), function () {});

        }
    }
});
