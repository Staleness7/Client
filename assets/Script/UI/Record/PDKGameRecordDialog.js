let roomProto         = require('../../API/RoomProto');
let roomAPI           = require('../../API/RoomAPI');

cc.Class({
    extends: cc.Component,

    properties: {
        bureau: cc.Label
    },

    onLoad () {
        this.curIndex = 0;
        this.list = this.dialogParameters.list;
        this.refrushLayout();
    },

    refrushLayout(){
        this.bureau.string = this.curIndex+1;
        let resultData = this.list[this.curIndex];

        let root = cc.find('Layout', this.node);
        root.removeAllChildren();

        let item = cc.find('Item', this.node);
        for (let i = 0; i < 3; ++i) {
            if (resultData.nicknameArr[i] == null) {
                continue;
            }
            let node = cc.instantiate(item);
            node.parent = cc.find('Layout', this.node);
            node.active = true;

            let nameLabel = cc.find('name', node).getComponent(cc.Label);
            nameLabel.string = Global.UserModel.convertNickname(resultData.nicknameArr[i]);

            let idLabel = cc.find('id', node).getComponent(cc.Label);
            idLabel.string = 'ID:' + (resultData.idArr[i] || '');

            let headSprite = cc.find('head', node).getComponent(cc.Sprite);
            Global.CCHelper.updateSpriteFrame(resultData.headArr[i], headSprite);

            let card = cc.find('Card', node);
            for (let j = 0; j < resultData.allHandCards[i].length; ++j) {
                let cards = resultData.allHandCards[i][j].concat([0]);
                for (let k = 0; k < cards.length; ++k) {
                    let cardNode = cc.instantiate(card);
                    cardNode.parent = cc.find('Layout', node);
                    cardNode.active = true;
                    cardNode.y = 0;
                    if (cards[k] != 0) {
                        Global.CCHelper.updateSpriteFrame('Game/Cards/'+cards[k], cardNode.getComponent(cc.Sprite));
                    }
                    else {
                        cardNode.width = 36;
                    }
                }
            }

            let gold = resultData.winArr[i];
            if (gold > 0) {
                let winLabel = cc.find('win', node).getComponent(cc.Label);
                winLabel.node.active = true;
                winLabel.string = '+' + parseInt(gold);
            }
            else {
                let loseLabel = cc.find('lose', node).getComponent(cc.Label);
                loseLabel.node.active = true;
                loseLabel.string = parseInt(gold);
            }

            let restLabel = cc.find('rest', node).getComponent(cc.Label);
            restLabel.string = '剩余牌数：' + resultData.allCardArr[i].length;

            let bombLabel = cc.find('bomb', node).getComponent(cc.Label);
            bombLabel.string = '炸弹数：' + resultData.bombArr[i];

            cc.find('icon', node).active = (resultData.winChairID == i);
        }
	},

    onBtnClick: function (event, parameters) {
		Global.AudioManager.playCommonSoundClickButton();
		if(parameters === 'left'){
            -- this.curIndex;
            if (this.curIndex < 0) {
                this.curIndex = this.list.length-1;
            }
            this.refrushLayout();
		}
		else if(parameters === 'right'){
            ++ this.curIndex;
            if (this.curIndex >= this.list.length) {
                this.curIndex = 0;
            }
            this.refrushLayout();
		}
		else if (parameters === 'close'){
			Global.DialogManager.destroyDialog(this);
		}
	}
});
