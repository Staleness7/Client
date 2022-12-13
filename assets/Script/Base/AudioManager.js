let AudioManager = module.exports = {};

AudioManager.commonSoundPath = {
    clickButtonSound: 'Common/button'
};

AudioManager.commonSound = {
    clickButton: null
};

//0为静音，1为开启声音
AudioManager.init = function () {
    this.currentBgMusic = -1;
    //初始化音乐和音效的音量
    if (!cc.sys.localStorage.getItem('MusicVolume')) {
        this.musicVolume = 1;
        this.soundVolume = 1;
        cc.sys.localStorage.setItem('MusicVolume', this.musicVolume.toString());
        cc.sys.localStorage.setItem('SoundVolume', this.soundVolume.toString());
    } else {
        this.musicVolume = parseFloat(cc.sys.localStorage.getItem('MusicVolume'));
        this.soundVolume = parseFloat(cc.sys.localStorage.getItem('SoundVolume'));
    }
};

AudioManager.startPlayBgMusic = function (url, cb){
    if (!url){
        cc.error("startPlayBgMusic", "url:" + url);
        Global.Utils.invokeCallback(cb, Global.Code.FAIL);
        return;
    }
    AudioManager.stopBgMusic();
    cc.loader.loadRes(url, function (err, clip) {
        if (!!err){
            cc.error('startPlayBgMusic failed:' + err);
        }else{
            this.currentBgMusic = cc.audioEngine.play(clip, true, this.musicVolume);
            if (!this.musicVolume){
                cc.audioEngine.pause(this.currentBgMusic);
            }
        }
        Global.Utils.invokeCallback(cb, err);
    }.bind(this));
};

AudioManager.stopBgMusic = function(){
    if (this.currentBgMusic < 0) return;
    cc.audioEngine.stop(this.currentBgMusic);
    this.currentBgMusic = -1;
};

AudioManager.playSound = function(url, loop){
    if (!url || !this.soundVolume) return;
    if (loop !== true) loop = false;
    cc.loader.loadRes(url, function (err, clip) {
        if (!!err){
            cc.error('playSound failed:' + url);
        }else{
            cc.audioEngine.play(clip, loop, this.soundVolume);
        }
    }.bind(this));
};

AudioManager.playCommonSoundClickButton = function (){
    if (!this.soundVolume) return;
    if (AudioManager.commonSound.clickButton !== null && AudioManager.commonSound.clickButton.isValid){
        cc.audioEngine.play(AudioManager.commonSound.clickButton, false, this.soundVolume);
    }else {
        cc.loader.loadRes(AudioManager.commonSoundPath.clickButtonSound, function (err, clip) {
            if (!!err){
                cc.error("playCommonSoundClickButton failed");
            }else{
                AudioManager.commonSound.clickButton = clip;
                cc.audioEngine.play(AudioManager.commonSound.clickButton, false, this.soundVolume);
            }
        }.bind(this));
    }
};

AudioManager.setMusicVolume = function (volume) {
    this.musicVolume = parseFloat(volume.toFixed(1));
    cc.sys.localStorage.setItem('MusicVolume', this.musicVolume);

    if (volume === 0){
        cc.audioEngine.pause(this.currentBgMusic);
    }else{
        if (this.currentBgMusic >= 0){
            cc.audioEngine.setVolume(this.currentBgMusic, this.musicVolume);
        }
    }
};

AudioManager.getMusicVolume = function () {
    return this.musicVolume;
};

AudioManager.setSoundVolume = function (volume) {
    this.soundVolume = parseFloat(volume.toFixed(1));
    cc.sys.localStorage.setItem('SoundVolume', this.soundVolume);
};

AudioManager.getSoundVolume = function () {
    return this.soundVolume;
};
