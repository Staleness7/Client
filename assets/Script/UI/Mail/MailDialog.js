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
        emptyTipNode: cc.Node,
        emailContentRoot: cc.Node,
        emailItemPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.createList();

        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
    },

    onDestroy: function () {
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updateMailStatus();
                break;
        }
    },


    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
        }
    },

    createList: function () {
        this.mailItems = {};
        this.emailContentRoot.destroyAllChildren();

        let mails = Global.UserModel.emailArr;
        if (!mails || mails.length === 0) mails = [];
        else {
            mails = JSON.parse(mails);
        }
        if (mails.length > 0){
            for (let i = mails.length - 1; i >= 0; i --) {
                let data = mails[i];
                let item = cc.instantiate(this.emailItemPrefab);
                item.parent = this.emailContentRoot;
                item.getComponent('EmailItemWidgetCtrl').initWidget(data);
                this.mailItems[data.id + ''] = item;
            }
            this.emptyTipNode.active = false;
        }else{
            this.emptyTipNode.active = true;
        }

    },

    updateMailStatus: function () {
        let mails = Global.UserModel.emailArr;
        if (!mails || mails.length === 0) mails = [];
        else {
            mails = JSON.parse(mails);
        }
        for (let i = mails.length - 1; i >= 0; i --) {
            let data = mails[i];
            if (!!this.mailItems[data.id + '']) {
                this.mailItems[data.id + ''].getComponent('EmailItemWidgetCtrl').initWidget(data);
            }
        }

        for (let key in this.mailItems){
            if (this.mailItems.hasOwnProperty(key)){
                let exist = false;
                for (let i = mails.length - 1; i >= 0; i --) {
                    let data = mails[i];
                    if (data.id.toString() === key) {
                        exist = true;
                    }
                }
                if (!exist){
                    this.mailItems[key].destroy();
                }
            }
        }
    }
});
