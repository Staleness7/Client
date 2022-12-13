cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        roomNum: [cc.Label]
    },

    // use this for initialization
    onLoad: function () {
        for (let i = 0; i < this.roomNum.length; i ++) {
            this.roomNum[i].string = '';
        }
        this.index = 0;
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.roomNum[this.index].string = param;
                if (this.index < this.roomNum.length - 1) {
                    this.index += 1;
                }
                break;
            case 'delete':
                if (this.index === this.roomNum.length - 1 && this.roomNum[this.index].string !== '') {
                } else {
                    if (this.index > 0) {
                        this.index -= 1;
                    }
                }

                this.roomNum[this.index].string = '';
                break;
            case 'confirm':
                let roomID = '';
                for (let i = 0; i < this.roomNum.length; i ++) {
                    if (this.roomNum[i].string === '') {
                        Global.DialogManager.addPopDialog('请输入亲友圈ID！');
                        return;
                    }
                    roomID += this.roomNum[i].string;
                }

                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.joinUnionRequest(roomID, function (data) {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addPopDialog("加入成功", function () {
                        Global.DialogManager.createDialog("UI/Union/UnionMain/UnionMainDialog", {unionID: data.msg.unionID, lastDialog: 'hall'}, function () {
                            Global.DialogManager.destroyAllDialog(["UI/Union/UnionMain/UnionMainDialog"]);
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
