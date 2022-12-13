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
        listItem: cc.Prefab,
        content: cc.Node,
        noticeListRedPoint: cc.Node,
        onlineServiceRoot: cc.Node,
        emptyNode: cc.Node,

        msgEditBox: cc.EditBox
    },

    updatePlayerInfo () {
        this.noticeListRedPoint.active = Global.UserModel.unreadEmailCount() > 0;
    },

    start () {
        this.showNotice(true);
        this.updatePlayerInfo();

        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
    },

    onDestroy () {
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
    },

    messageCallbackHandler: function(router) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updatePlayerInfo();
                break;
        }
    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'notice':
                this.showNotice(true);
                break;
            case 'services':
                this.showServices(true);
                break;
            case 'submit':
                if (!this.msgEditBox.string){
                    Global.DialogManager.addTipDialog("发送消息为空");
                    return;
                }
                Global.DialogManager.addLoadingCircle();
                Global.API.hall.sendCustomerServiceMsgRequest(this.msgEditBox.string, function () {
                    Global.DialogManager.addPopDialog("问题已提交，客服将在5分钟内受理");
                    this.msgEditBox.string = "";
                    Global.DialogManager.removeLoadingCircle();
                }.bind(this));
                break;
        }
    },

    showNotice: function (show) {
        if (show){
            this.showServices(false);
            let data = Global.UserModel.emailArr;
            if (!!data && data.length > 0){
                data = JSON.parse(data);
                this.emptyNode.active = false;
            }else{
                data = [];
                this.emptyNode.active = true;
            }
            for (let i = data.length - 1; i >= 0; i --) {
                let mailData = data[i];
                let item = cc.instantiate(this.listItem);
                item.parent = this.content;
                item.getComponent('NoticeListItem').updateUI(mailData);
            }
        }else{
            this.content.destroyAllChildren();
            this.emptyNode.active = false;
        }
    },

    showServices: function (show) {
        if (!!show){
            this.showNotice(false);
        }
        this.onlineServiceRoot.active = show;
    }

    // update (dt) {},
});
