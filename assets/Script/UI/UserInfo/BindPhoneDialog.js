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
        phoneEdit: cc.EditBox,
        pwdEdit: cc.EditBox,

        getCodeBtn: cc.Node,
        cdLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'bind':
                let account = this.phoneEdit.string;
                let pwd = this.pwdEdit.string;

                if (account === '') {
                    Global.DialogManager.addTipDialog('请输入手机号！');
                    return;
                }

                if (account.length < 11) {
                    Global.DialogManager.addTipDialog('请输入正确的手机号！');
                    return;
                }

                if (pwd === '') {
                    Global.DialogManager.addTipDialog('短信验证码！');
                    return;
                }

                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.bindPhoneRequest(account, pwd, null, function () {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addPopDialog("绑定成功", function () {
                        Global.DialogManager.destroyDialog(this);
                    }.bind(this));
                }.bind(this));
                break;
            case 'getCode':{
                let account = this.phoneEdit.string;

                if (account === '') {
                    Global.DialogManager.addTipDialog('请输入手机号！');
                    return;
                }

                if (account.length < 11) {
                    Global.DialogManager.addTipDialog('请输入正确的手机号！');
                    return;
                }
                Global.API.http.getPhoneCode(account, function () {
                    Global.DialogManager.addTipDialog("发送成功");
                }, function () {
                    Global.DialogManager.addTipDialog("发送失败，请稍后重试");
                });

                this.getCodeBtn.active = false;

                let time = 60;
                this.schedule(function () {
                    if (time <= 0){
                        this.getCodeBtn.active = true;
                        this.unscheduleAllCallbacks();
                    }
                    this.cdLabel.string = time + 's';
                    time--;
                }.bind(this), 1);
            }
                break;
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }

    // update (dt) {},
});
