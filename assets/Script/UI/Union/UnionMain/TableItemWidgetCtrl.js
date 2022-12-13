cc.Class({
    extends: cc.Component,

    properties: {
        tableName: cc.RichText,
        drawCount: cc.Label,
        avatarPosNode: cc.Node,
        tableSprite: cc.Sprite
    },

    start () {
    },

    initWidget(roomInfo, unionInfo){
        let gameType = roomInfo.gameRule.gameType;
        this.tableName.string = "<outline width=2 color=#000000><color=#ffffff>" + roomInfo.gameRule.ruleName + "</c></outline>";
        if (roomInfo.gameStarted){
            this.drawCount.node.parent.active = true;
            this.drawCount.string = "已开局" + roomInfo.curBureau + '/' + roomInfo.gameRule.bureau;
        }else{
            this.drawCount.node.parent.active = false;
        }
		if (gameType === Global.Enum.gameType.PDK || gameType === Global.Enum.gameType.ZNMJ) {
			cc.find("img_room_draw_bg", this.node).y = 15;
			cc.find("img_room_name_bg", this.node).y = 48;
		}

        let maxPlayerCount = roomInfo.gameRule.maxPlayerCount || 10;
        if (maxPlayerCount > 10){
            maxPlayerCount = 10;
        }


        let tableRes = "";
        if (gameType === Global.Enum.gameType.PDK){
            tableRes = "table_pdk_" + maxPlayerCount;
        }
		else if (gameType === Global.Enum.gameType.SZ){
            tableRes = "table_sz_" + maxPlayerCount;
        }
		else if (gameType === Global.Enum.gameType.SG){
            tableRes = "table_sg_" + maxPlayerCount;
        }
		else if (gameType === Global.Enum.gameType.NN){
            tableRes = "table_nn_" + maxPlayerCount;
        }
		else if (gameType === Global.Enum.gameType.DGN){
            tableRes = "table_nn_" + maxPlayerCount;
        }
		else if (gameType === Global.Enum.gameType.ZNMJ){
            tableRes = "table_hzmj_" + maxPlayerCount;
        }

        Global.CCHelper.updateSpriteFrame("UI/Union/UnionMain/" + tableRes, this.tableSprite);

        this.roomInfo = roomInfo;
        this.unionInfo = unionInfo;

        let posNode = null;
        if (maxPlayerCount <= 2 && gameType === Global.Enum.gameType.PDK){
            posNode = this.avatarPosNode.getChildByName('2');
		} else if (maxPlayerCount <= 3 && gameType === Global.Enum.gameType.PDK){
            posNode = this.avatarPosNode.getChildByName('3');
		} else if (maxPlayerCount <= 4){
            posNode = this.avatarPosNode.getChildByName('4');
        } else if (maxPlayerCount <= 6){
            posNode = this.avatarPosNode.getChildByName('6');
        } else if (maxPlayerCount <= 8){
            posNode = this.avatarPosNode.getChildByName('8');
        } else if (maxPlayerCount <= 10){
            posNode = this.avatarPosNode.getChildByName('10');
        }
        if(!posNode) return;
        for (let i = 0; i < roomInfo.roomUserInfoArr.length; ++i){
            let node = posNode.getChildByName("bg" + i);
            if (!node) continue;
            node.active = true;
            let sprite = node.children[0].getComponent(cc.Sprite);
            if (!sprite) continue;
            Global.CCHelper.updateSpriteFrame(roomInfo.roomUserInfoArr[i].avatar, sprite);
        }
    },

    updateRoomInfo(roomInfo){
		let gameType = roomInfo.gameRule.gameType;
        this.tableName.string = "<outline width=2 color=#000000><color=#ffffff>" + roomInfo.gameRule.ruleName + "</c></outline>";
        if (roomInfo.gameStarted){
            this.drawCount.node.parent.active = true;
            this.drawCount.string = "已开局" + roomInfo.curBureau + '/' + roomInfo.gameRule.bureau;
        }else{
            this.drawCount.node.parent.active = false;
        }
		if (gameType === Global.Enum.gameType.PDK || gameType === Global.Enum.gameType.ZNMJ) {
			cc.find("img_room_draw_bg", this.node).y = 15;
			cc.find("img_room_name_bg", this.node).y = 48;
		}

        let maxPlayerCount = roomInfo.gameRule.maxPlayerCount || 10;
        if (maxPlayerCount > 10){
            maxPlayerCount = 10;
        }

        // 判断是否要更换桌面
        if (roomInfo.gameRule.gameType !== this.roomInfo.gameRule.gameType || maxPlayerCount !== this.roomInfo.gameRule.maxPlayerCount){
            let tableRes = "";
            if (gameType === Global.Enum.gameType.PDK){
                tableRes = "table_pdk_" + maxPlayerCount;
            }
			else if (gameType === Global.Enum.gameType.SZ){
                tableRes = "table_sz_" + maxPlayerCount;
            }
			else if (gameType === Global.Enum.gameType.SG){
                tableRes = "table_sg_" + maxPlayerCount;
            }
			else if (gameType === Global.Enum.gameType.NN){
                tableRes = "table_nn_" + maxPlayerCount;
            }
			else if (gameType === Global.Enum.gameType.DGN){
                tableRes = "table_nn_" + maxPlayerCount;
            }
			else if (gameType === Global.Enum.gameType.ZNMJ){
                tableRes = "table_hzmj_" + maxPlayerCount;
            }
            Global.CCHelper.updateSpriteFrame("UI/Union/UnionMain/" + tableRes, this.tableSprite);
        }

        // 如果新的用户信息和老的用户信息相同则不更新头像
        let isSame = roomInfo.roomUserInfoArr.length === this.roomInfo.roomUserInfoArr.length;
        if (isSame){
            for (let i = 0; i < roomInfo.roomUserInfoArr.length; ++i){
                let userInfo = this.roomInfo.roomUserInfoArr.find(function (e) {
                    return e.avatar === roomInfo.roomUserInfoArr[i].avatar;
                });
                if (!userInfo){
                    isSame = false;
                    break;
                }
            }
        }
        this.roomInfo = roomInfo;

        if (isSame) return;

        let posNode = null;
        if (maxPlayerCount <= 2 && gameType === Global.Enum.gameType.PDK){
            posNode = this.avatarPosNode.getChildByName('2');
		}
        else if (maxPlayerCount <= 3 && gameType === Global.Enum.gameType.PDK){
            posNode = this.avatarPosNode.getChildByName('3');
		}
        else if (maxPlayerCount <= 4){
            posNode = this.avatarPosNode.getChildByName('4');
        } else if (maxPlayerCount <= 6){
            posNode = this.avatarPosNode.getChildByName('6');
        } else if (maxPlayerCount <= 8){
            posNode = this.avatarPosNode.getChildByName('8');
        } else if (maxPlayerCount <= 10){
            posNode = this.avatarPosNode.getChildByName('10');
        }
        if(!posNode) return;
        for (let i = 0; i < posNode.childrenCount; ++i){
            posNode.children[i].active = false;
        }
        for (let i = 0; i < roomInfo.roomUserInfoArr.length; ++i){
            let node = posNode.getChildByName("bg" + i);
            if (!node) continue;
            node.active = true;
            let sprite = node.children[0].getComponent(cc.Sprite);
            if (!sprite) continue;
            Global.CCHelper.updateSpriteFrame(roomInfo.roomUserInfoArr[i].avatar, sprite);
        }
    },

    onBtnClick(){
        Global.DialogManager.addLoadingCircle(1);
        Global.DialogManager.createDialog("UI/Union/UnionMain/UnionTableDetailDialog", {roomInfo: this.roomInfo, unionInfo: this.unionInfo}, function () {
            Global.DialogManager.removeLoadingCircle();
        })
    }

    // update (dt) {},
});
