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
        contentLabel: cc.Label,
        okBtn: cc.Node,
        cancelBtn: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.originalPositionX = Math.abs(this.okBtn.x);
        this.popDialogArr = [];
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'ok':
                if (!!this.popDialogArr[0] && !!this.popDialogArr[0].cbOK){
                    this.popDialogArr[0].cbOK();
                }
                this.removeLastPopDialog();
                break;
            case 'cancel':
                if (!!this.popDialogArr[0] && !!this.popDialogArr[0].cbCancel){
                    this.popDialogArr[0].cbCancel();
                }
                this.removeLastPopDialog();
                break;
        }
    },

    addPopDialog: function (content, cbOK, cbCancel, isRotate) {
        if (!content) return;
        this.popDialogArr.splice(0,0, {content: content, cbOK: cbOK, cbCancel: cbCancel, isRotate : !!isRotate});

        this.showNextPopDialog();
    },

    showNextPopDialog: function (){
        if (this.popDialogArr.length > 0){
            let popData = this.popDialogArr[0];
            this.node.active = true;
            let ctrl = this.node.getComponent("DialogActionWidgetCtrl");
            if (!!ctrl){
                ctrl.dialogIn();
            }
            this.contentLabel.string = popData.content;
            this.cancelBtn.active = !!popData.cbCancel;
            this.okBtn.active = !!popData.cbOK;
			// if(popData.isRotate) {
			// 	this.node.rotation = 90;
			// 	this.node.getChildByName('mask').rotation = 90;
			// } else {
			// 	this.node.rotation = 0;
			// 	this.node.getChildByName('mask').rotation = 0;
			// }

            if (!!popData.cbCancel && !!popData.cbOK) {
                this.cancelBtn.x = -1 * this.originalPositionX;
                this.okBtn.x = this.originalPositionX;
            } else {
                this.cancelBtn.x = 0;
                this.okBtn.x = 0;

                if (!popData.cbOK && !popData.cbCancel) {
                    this.okBtn.active = true;
                }
            }
        }

    },

    removeLastPopDialog: function (){
        if (this.popDialogArr.length > 0){
            this.popDialogArr.splice(0, 1);
            let ctrl = this.node.getComponent("DialogActionWidgetCtrl");
            if (!!ctrl){
                ctrl.dialogOut(function () {
                    this.node.active = false;
                }.bind(this));
            }else{
                this.node.active = false;
            }
            this.showNextPopDialog();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
