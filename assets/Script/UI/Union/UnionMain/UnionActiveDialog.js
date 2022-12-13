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
        content: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        let imgArr = JSON.parse(Global.ConfigModel.getData("unionActiveImgArr") || "[]");
        for (let i = 0; i < imgArr.length; ++i){
            let spriteNode = Global.CCHelper.createSpriteNode(Global.Constant.webServerAddress + "/" +imgArr[i]);
            //let spriteNode = Global.CCHelper.createSpriteNode("111");
            spriteNode.width = 500;
            spriteNode.height = 700;
            spriteNode.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;
            spriteNode.parent = this.content;
        }
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
