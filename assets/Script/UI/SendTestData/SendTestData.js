// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        editBoxHead:cc.EditBox,

        editBoxData:cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },


    onClickSendTestData: function (event) {
        Global.DialogManager.addLoadingCircle(1);

        let _router = this.editBoxHead.string;
        let _requestData = null;
        try {
            _requestData = JSON.parse(this.editBoxData.string);
        }catch (e) {
            Global.DialogManager.addTipDialog('数据输入有误');
            return;
        }

        Global.API.hall.sendTestData(_router, _requestData, function (data) {
            Global.DialogManager.removeLoadingCircle();

            Global.DialogManager.addTipDialog('succeed');

        }.bind(this));
    },

    onClickDestroy:function (event) {
        Global.DialogManager.destroyDialog(this);
    }
});
