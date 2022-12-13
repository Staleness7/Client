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
        progressMusic: cc.ProgressBar,
        sliderMusic: cc.Slider,
        progressSound: cc.ProgressBar,
        sliderSound: cc.Slider,

        hallMusicNode: cc.Node,
        unionBgNode: cc.Node,
        gameMusicNode: cc.Node,
        cardBgNode: cc.Node,
        gameBgNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        let musicVolume = cc.sys.localStorage.getItem('MusicVolume');
        let soundVolume = cc.sys.localStorage.getItem('SoundVolume');

        this.progressMusic.progress = musicVolume;
        this.sliderMusic.progress = musicVolume;
        this.progressSound.progress = soundVolume;
        this.sliderSound.progress = soundVolume;

        this.selectMask = true;

        let type = "game";
        if (!!this.dialogParameters){
            type = this.dialogParameters.type || "game";
        }
        if (type === 'union'){
            this.unionBgNode.active = true;
            let unionBg = cc.sys.localStorage.getItem('unionBg');
            if (!unionBg || unionBg === 'unionBg1'){
                let node = this.unionBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (unionBg === 'unionBg2'){
                let node = this.unionBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }

            this.hallMusicNode.active = true;
            let hallMusic = cc.sys.localStorage.getItem('hallMusic');
            if (!hallMusic || hallMusic === 'hallMusic1'){
                let node = this.hallMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (hallMusic === 'hallMusic2'){
                let node = this.hallMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }
        } else if (type === 'game'){
            this.gameMusicNode.active = true;
            let gameMusic = cc.sys.localStorage.getItem('gameMusic');
            if (!gameMusic || gameMusic === 'gameMusic1'){
                let node = this.gameMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (gameMusic === 'gameMusic2'){
                let node = this.gameMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }
            this.cardBgNode.active = true;
            let cardBg = cc.sys.localStorage.getItem('cardBg');
            if (!cardBg || cardBg === 'cardBg1'){
                let node = this.cardBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (cardBg === 'cardBg2'){
                let node = this.cardBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (cardBg === 'cardBg3'){
                let node = this.cardBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle3");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (cardBg === 'cardBg4'){
                let node = this.cardBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle4");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }
			if (Global.DialogManager.isDialogExit('Game/Majiang/MJMainDialog')) {
				this.cardBgNode.active = false;
			}

            this.gameBgNode.active = true;
            let gameBg = cc.sys.localStorage.getItem('gameBg');
            if (!gameBg || gameBg === 'gameBg1'){
                let node = this.gameBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (gameBg === 'gameBg2'){
                let node = this.gameBgNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }
        } else if (type === 'hall'){
            this.hallMusicNode.active = true;
            let hallMusic = cc.sys.localStorage.getItem('hallMusic');
            if (!hallMusic || hallMusic === 'hallMusic1'){
                let node = this.hallMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle1");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            } else if (hallMusic === 'hallMusic2'){
                let node = this.hallMusicNode.getChildByName("ToggleContainer");
                let toggleNode = node.getChildByName("toggle2");
                toggleNode.getComponent(cc.Toggle).isChecked = true;
            }
        }

        this.selectMask = false;
    },

    onBtnClk: function (event, param) {
        if (this.selectMask) return;
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                Global.AudioManager.playCommonSoundClickButton();
                break;
            case 'music_slider':
                this.progressMusic.progress = event.progress;
                Global.AudioManager.setMusicVolume(this.progressMusic.progress);
				if(this.callback) {
					this.callback();
				}
                break;
            case 'sound_slider':
                this.progressSound.progress = event.progress;
                Global.AudioManager.setSoundVolume(this.progressSound.progress);
				if(this.callback) {
					this.callback();
				}
                break;
            case 'hallMusic1':
                Global.AudioManager.playCommonSoundClickButton();
                Global.AudioManager.startPlayBgMusic("UI/Hall/Sound/hall_bg_music1");
                cc.sys.localStorage.setItem('hallMusic', "hallMusic1");
                break;
            case 'hallMusic2':
                Global.AudioManager.playCommonSoundClickButton();
                Global.AudioManager.startPlayBgMusic("UI/Hall/Sound/hall_bg_music2");
                cc.sys.localStorage.setItem('hallMusic', "hallMusic2");
                break;
            case 'gameMusic1':
                Global.AudioManager.playCommonSoundClickButton();
                Global.AudioManager.startPlayBgMusic("Game/Common/Audio/game_bg_1");
                cc.sys.localStorage.setItem('gameMusic', "gameMusic1");
                break;
            case 'gameMusic2':
                Global.AudioManager.playCommonSoundClickButton();
                Global.AudioManager.startPlayBgMusic("Game/Common/Audio/game_bg_2");
                cc.sys.localStorage.setItem('gameMusic', "gameMusic2");
                break;
            case 'unionBg1':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('unionBg', "unionBg1");
                Global.MessageCallback.emitMessage("UpdateUnionBg");
                break;
            case 'unionBg2':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('unionBg', "unionBg2");
                Global.MessageCallback.emitMessage("UpdateUnionBg");
                break;
            case 'gameBg1':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('gameBg', "gameBg1");
                Global.MessageCallback.emitMessage("UpdateGameBg");
                break;
            case 'gameBg2':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('gameBg', "gameBg2");
                Global.MessageCallback.emitMessage("UpdateGameBg");
                break;
            case 'cardBg1':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('cardBg', "cardBg1");
                Global.MessageCallback.emitMessage("UpdateGameCardBg");
                break;
            case 'cardBg2':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('cardBg', "cardBg2");
                Global.MessageCallback.emitMessage("UpdateGameCardBg");
                break;
            case 'cardBg3':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('cardBg', "cardBg3");
                Global.MessageCallback.emitMessage("UpdateGameCardBg");
                break;
            case 'cardBg4':
                Global.AudioManager.playCommonSoundClickButton();
                cc.sys.localStorage.setItem('cardBg', "cardBg4");
                Global.MessageCallback.emitMessage("UpdateGameCardBg");
                break;
            case 'exit':
                Global.DialogManager.addPopDialog("是否退出游戏", function () {
                    cc.game.end();
                }, function () {});
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
