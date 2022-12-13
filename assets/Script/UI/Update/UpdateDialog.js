cc.Class({
    extends: cc.Component,

    properties: {
        //manifestUrl: cc.RawAsset,  //本地project.manifest资源清单文件
        updateInfo: cc.Label,
        updateUI: cc.Node,
        progress: cc.ProgressBar,
        progressText: cc.Label,
        manifestUrl:{
            type:cc.Asset,
            default:null
        },
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                this.updateInfo.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                this.updateInfo.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                this.updateInfo.string = "已是最新版本，正在进入游戏...";
                this.enterGame();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('New version found, please try to update.');
                this.updateInfo.string = '发现更新，开始下载更新';
                if (this.needBigUpdate) {
                    cc.log('this is a big version, please update!');
                    Global.DialogManager.addPopDialog('需要下载最新版本才能进行游戏！点击确定即可下载！', function () {
                        this.downloadGame();
                    }.bind(this));
                } else {
                    this.hotUpdate();
                }
                break;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped...');
                this.updateInfo.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log(event.getPercent());
                cc.log(event.getPercentByFile());
                cc.log(event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                cc.log(event.getDownloadedBytes() + ' / ' + event.getTotalBytes());

                let msg = event.getMessage();
                if (msg) {
                    cc.log('Updated file: ' + msg);
                }
                let percent = parseFloat(event.getDownloadedBytes()) / parseFloat(event.getTotalBytes()) || 0;
                this.updateInfo.string = '下载更新中，请稍后...';
                if (this.progress.progress < percent){
                    this.progress.progress = percent;
                    this.progressText.string = Math.floor(percent * 100) + '%';
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                this.updateInfo.string = 'Fail to download manifest file, hot update skipped.';
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                this.updateInfo.string = 'Already up to date with the latest remote version.';
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                needRestart = true;
                this.updateInfo.string = 'Update finished. ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                this.updateInfo.string = 'Update failed. ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                this.updateInfo.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                this.updateInfo.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._am.getLocalManifest().getSearchPaths();
            cc.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },


    retry: function () {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;

            cc.log('Retry failed Assets...');
            this.updateInfo.string = 'Retry failed Assets...';

            this._am.downloadFailedAssets();
        }
    },

    checkForUpdate: function () {
        cc.log("start checking...");
        if (this._updating) {
            cc.log('Checking or updating ...');
            this.updateInfo.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
            cc.log(this.manifestUrl.nativeUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
            this.updateInfo.string = 'Failed to load local manifest ...';
            return;
        }
        /* descrepate
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);*/
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();

        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am) {
            /*descrepate
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);*/
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
            }

            this.updateUI.active = true;
            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    show: function () {
        // if (this.updateUI.active === false) {
        //     this.updateUI.active = true;
        // }
    },

    closeGame: function () {
        cc.game.end();
    },

    enterGame: function () {
        if (!!this.dialogParameters && !!this.dialogParameters.cb) {
            this.dialogParameters.cb();
        }
        Global.DialogManager.destroyDialog(this);
    },

    downloadGame: function () {
        cc.sys.openURL(this.updateControl.bigUpdateDownloadUrl);
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        /*if (!cc.sys.isNative) {
            return;
        }*/

        this.updateInfo.string = '检测更新中，请稍后...';
        this._updating = false;
        this._canRetry = false;
        this.needBigUpdate = false;
        this.updateControl = {};
        this.updateUI.active = false;

        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            cc.log('收到数据:', JSON.stringify(xhr.responseText));
            if (xhr.status === 200){
                let response = xhr.responseText;
                this.updateControl = JSON.parse(response);
                cc.log(response);
                if (!!this.updateControl.hotUpdate) {
                    this.goCheck();
                } else {
                    this.enterGame();
                }
            }else{
                cc.error("请求失败：status=" + xhr.status);
                Global.DialogManager.addPopDialog("请求错误，请稍后重试", function(){
                    cc.game.restart();
                });
            }
        }.bind(this);
        xhr.timeout = 20000;
        xhr.ontimeout = function () {
            // XMLHttpRequest 超时。在此做某事。
            cc.error("请求超时");
            Global.DialogManager.addPopDialog("请求超时，请检查网络后重试", function(){
                cc.game.restart();
            });
        };
        xhr.onerror = function (e) {
            cc.error("请求错误");
            Global.DialogManager.addPopDialog("请求错误，请稍后重试", function(){
                cc.game.restart();
            });
        };
        xhr.open("GET", Global.Constant.hotUpdateAddress + "/updateControl.json", true);
        xhr.send();
        cc.log(Global.Constant.hotUpdateAddress + "/updateControl.json");
    },

    goCheck: function () {
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'xiaoming-remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            let vA = versionA.split('.');
            let vB = versionB.split('.');
            if (vA[0] < vB[0]) {
                this.needBigUpdate = true;
            }
            for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || 0);
                if (a === b) continue;
                return a - b;
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        }.bind(this);

        console.log(">>>[this._storagePath:]"+this._storagePath);

        // Init with empty manifest url for testing custom manifest

        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            let compressed = asset.compressed;
            // Retrieve the correct md5 value.
            let expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            let relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            let size = asset.size;
            if (compressed) {
                cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });
        cc.log("Hot update is ready, please check or directly update.");

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            cc.log("Max concurrent tasks count have been limited to 2");
        }
        this.checkForUpdate();
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            // this._am.release();
        }
    }
});