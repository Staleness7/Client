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
        inputNumber: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.callback = this.dialogParameters.cb;
        this.maxLength = this.dialogParameters.maxLength;
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
                if (this.inputNumber.string.length >= this.maxLength) return;
                this.inputNumber.string += param;
                break;
            case 'delete':
                if (this.inputNumber.string.length === 0) return;
                this.inputNumber.string = this.inputNumber.string.substr(0, this.inputNumber.string.length - 1);
                break;
            case 'confirm':
                Global.DialogManager.destroyDialog(this);
                this.callback(this.inputNumber.string);
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
