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
        emailStatus0: cc.Node,
        emailStatus1: cc.Node,
        emailTitle: cc.Label,
        emailAbstract: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    initWidget: function (emailInfo) {
        this.emailInfo = emailInfo;

        this.emailStatus0.active = !this.emailInfo.isRead;
        this.emailStatus1.active = this.emailInfo.isRead;

        this.emailTitle.string = emailInfo.title;
        this.emailAbstract.string = emailInfo.content.slice(0, 10) + "...";
    },

    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'read':
                Global.DialogManager.createDialog('UI/Mail/MailDetailDialog', {mailData: this.emailInfo});
                break;
        }
    }
});
