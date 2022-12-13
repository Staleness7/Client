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
        noticeEditBox: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.unionInfo = this.dialogParameters.unionInfo;
        this.noticeEditBox.string = this.unionInfo.notice;
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'commit'){
            let notice = this.noticeEditBox.string;
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.updateAllUnionNoticeRequest(this.unionInfo.unionID, notice, function (data) {
                Global.DialogManager.removeLoadingCircle();
                Global.DialogManager.addTipDialog("修改成功");

                Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
            });
        }
    },
});
