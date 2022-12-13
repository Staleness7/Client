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
        title: cc.Label,
        time: cc.Label,
        readBtnNode: cc.Node,
        alreadyReadNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'read':
                Global.DialogManager.createDialog('UI/Notice/NoticeDetailDialog', {data: this.data});
                if (!this.data.isRead){
                    Global.API.hall.readEmailRequest(this.data.id);
                    this.readBtnNode.active = false;
                    this.alreadyReadNode.active = true;
                    this.data.isRead = true;
                }
                break;
        }
    },

    updateUI (data) {
        this.data = data;

        this.title.string = data.title;
        if (data.title.length > 7) {
            this.title.string = data.title.substr(0, 12) + '...';
        }
        this.time.string = (new Date(data.createTime)).format('yyyy/MM/dd');

        if (!!data.isRead){
            this.readBtnNode.active = false;
            this.alreadyReadNode.active = true;
        }else{
            this.readBtnNode.active = true;
            this.alreadyReadNode.active = false;
        }
    }
});
