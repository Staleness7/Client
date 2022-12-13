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
        userListRoot: cc.Node,
        userInfoItem: cc.Node,

        pageLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.curIndex = 0;
        this.maxIndex = 0;
        this.accountInfoArr = [];
        Global.DialogManager.addLoadingCircle(1);
        cc.loader.load(Global.Constant.wxAccountConfigAddress, function (err, data) {
            Global.DialogManager.removeLoadingCircle();
            if (!!err){
                Global.DialogManager.addPopDialog("加载账号信息失败");
            } else{
                try {
                    this.accountInfoArr = Global.Utils.csvToArray(data) || [];
                    this.updateList();
                }catch (e){
                    console.error(e);
                    Global.DialogManager.addPopDialog("配置信息解析错误");
                }
            }
        }.bind(this));
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'left'){
            if (this.curIndex === 0) return;
            this.curIndex--;
            this.updateList();
        } else if (parameter === 'right'){
            if (this.curIndex >= this.maxIndex) return;
            this.curIndex++;
            this.updateList();
        }
    },

    selectUser(event, parameter){
        Global.wxAccountInfo = this.accountInfoArr[parameter] || null;
        Global.Utils.invokeCallback(this.dialogParameters.cb);

        Global.DialogManager.destroyDialog(this);
    },

    updateList(){
        this.maxIndex = Math.floor((this.accountInfoArr.length + 1)/20);
        if ((this.accountInfoArr.length + 1)%20 === 0){
            this.maxIndex--;
        }
        this.userListRoot.removeAllChildren();
        this.pageLabel.string = (this.curIndex + 1) + "/" + (this.maxIndex + 1);
        for (let i = this.curIndex * 20; i < this.accountInfoArr.length; ++i){
            let accountInfo = this.accountInfoArr[i];
            let node = cc.instantiate(this.userInfoItem);
            node.active = true;
            Global.CCHelper.updateSpriteFrame(accountInfo.avatar, node.getChildByName("avatar").getComponent(cc.Sprite));
            node.getChildByName("nickname").getComponent(cc.Label).string = accountInfo.nickname;
            node.parent = this.userListRoot;

            node.getComponent(cc.Button).clickEvents[0].customEventData = i.toString();

            if (i >= (this.curIndex * 20 + 19)) break;
        }
    }
});
