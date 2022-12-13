let utils = require("./utils");

let exp = module.exports = {};

/**
 * @param res 资源路径(不带后缀,带resources)
 * @param cb 异步创建，function(err, node)
 */
exp.createFrameAnimationNode = function (res, cb) {
    cc.loader.loadRes(res + "_config", cc.JsonAsset, function (err, data) {
        if (!!err){
            cc.error("createFrameAnimation err: load file fail url=" + res + '.json');
            cb("load file fail");
        }else{
            data = data.json;
            let width = data["width"] || 0;
            let height = data["height"] || 0;
            let count = data["count"] || 0;
            let intervalTime = (data["intervalTime"] || 0);
            if (width <= 0 || height <= 0 || count <= 0 || intervalTime <= 0){
                cc.error("animation data err");
                cb("animation data err");
                return;
            }
            cc.loader.loadRes(cc.url.raw(res + '.png'), function (err, texture) {
                if (!!err){
                    cc.error("createFrameAnimation err: load file fail url=" + res + '.png');
                    cb("load file fail");
                }else{
                    let wCount = Math.floor(texture.width/width) || 1;
                    let hCount = Math.floor(texture.height/height) || 1;

                    let node = new cc.Node();
                    let sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = new cc.SpriteFrame(texture, new cc.Rect(0, 64, width, height));
                    /**
                     * @param loop 是否循环，默认false
                     * @param speed 播放速度，默认1
                     * @param completeCallback，每完成一次的回调
                     */
                    node.startAnimation = function (loop, speed, completeCallback) {
                        if (!speed || speed <= 0) speed = 1;
                        intervalTime = intervalTime/speed;
                        node.stopAllActions();
                        let index = 0;
                        function callback() {
                            let curIndex = index++ % data.count;
                            let rect = new cc.Rect((curIndex%wCount) * width, Math.floor(curIndex/hCount) * height, width, height);
                            sprite.spriteFrame = new cc.SpriteFrame(texture, rect);
                            if(!!completeCallback && (curIndex === (data.count - 1))){
                                completeCallback();
                            }
                        }
                        if (!!loop){
                            node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)])));
                        }else{
                            node.runAction(cc.repeat(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)]), data.count));
                        }
                    };
                    node.stopAnimation = function () {
                        node.stopAllActions();
                    };
                    cb(null, node);
                }
            })
        }
    });
};

exp.loadRes = function (dirArr, cb) {
    let loadingCount = 0;
    for (let i = 0; i < dirArr.length; i ++) {
        cc.loader.loadResDir(dirArr[i], function (err) {
            loadingCount += 1;
            if (loadingCount >= (dirArr.length)) {
                utils.invokeCallback(cb, err);
            }
        }.bind(this));
    }
};

// 获取单位向量
exp.getUnitVector = function (startPoint, endPoint) {
    let point = cc.v2(0, 0);
    let distance;
    distance = Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y),2);
    distance = Math.sqrt(distance);
    if(distance === 0) return point;
    point.x = (endPoint.x - startPoint.x)/distance;
    point.y = (endPoint.y - startPoint.y)/distance;
    return point;
};

exp.getRelativePosition = function (childNode, parentNode) {
    return parentNode.convertToNodeSpace(childNode.parent.convertToWorldSpace(childNode.position));
};

//检查是不是微信浏览器
exp.isWechatBrowser = function () {
    //安卓的微信webview由qq浏览器x5内核提供技术支持，所以加BROWSER_TYPE_MOBILE_QQ
    return false;
    //return (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT || cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ);
};

exp.setPageTitle = function(titleText) {
    if(!cc.sys.isBrowser) return;
    document.title = titleText;
};

//跨域图片或者本地图片
exp.updateSpriteFrame = function (imgUrl, target_, cb) {
    let target = target_;
    if ((imgUrl && imgUrl.indexOf('http') >= 0)) {
        if (cc.sys.isNative){
            let dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
            let filepath = dirpath + hex_md5(imgUrl) + '.png';

            function loadEnd(){
                cc.loader.load(filepath, function(err, tex){
                    if (!!err){
                        console.error("load remote end", imgUrl );
                        utils.invokeCallback(cb, err);
                    }else{
                        if (target.isValid){
                            target.spriteFrame = new cc.SpriteFrame(tex);
                            utils.invokeCallback(cb);
                        }
                    }
                });

            }

            if( jsb.fileUtils.isFileExist(filepath) ){
                loadEnd();
                return;
            }

            let saveFile = function(data){
                if( typeof data !== 'undefined' ){
                    if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                        jsb.fileUtils.createDirectory(dirpath);
                    }
                    let saveData = new Uint8Array(data);
                    if(!saveData) {
                        utils.invokeCallback(cb, "Remote write file failed");
                        return;
                    }
                    if( jsb.fileUtils.writeDataToFile( saveData , filepath) ){
                        loadEnd();
                    }else{
                        utils.invokeCallback(cb, "Remote write file failed");
                    }
                }else{
                    utils.invokeCallback(cb, "Remote write file failed");
                }
            };

            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 ) {
                    if(xhr.status === 200){
                        saveFile(xhr.response);
                    }else{
                        saveFile(null);
                    }
                }
            }.bind(this);
            xhr.responseType = 'arraybuffer';
            xhr.open("GET", imgUrl, true);
            xhr.send();
        } else{
            cc.loader.load({url: imgUrl, type: "png"}, function (err, texture) {
                if (!!err) {
                    cc.error(err);
                    utils.invokeCallback(cb, err);
                } else {
                    if (target.isValid) {
                        target.spriteFrame = new cc.SpriteFrame(texture);
                        utils.invokeCallback(cb);
                    }
                }
            });
        }
        //加载本地图片
    } else {
        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame){
            if (!!err){
                console.error("load local img fail", imgUrl);
                utils.invokeCallback(cb, err);
            }else{
                if (target.isValid){
                    target.spriteFrame = spriteFrame;
                    utils.invokeCallback(cb);
                }
            }
        });
    }
};

exp.createSpriteNode = function (src) {
    let node = new cc.Node();
    let sprite = node.addComponent(cc.Sprite);
    sprite.spriteFrame = new cc.SpriteFrame();
    exp.updateSpriteFrame(src, sprite);
    return node;
};

/**
 * http请求
 * @param params = {
 *      url： 请求地址
 *      method: GET,POST 默认 GET
 *      async: 是否异步，默认异步
 *      data：请求数据
 *      withCredentials: 默认false
 *      responseType: 默认false
 *      cb：请求回调
 * }
 */
exp.httpRequest = function (params) {
    console.log('请求url:' + params.url, params.data);
    let urlStr = params.url;
    let methodStr = params.method || 'GET';
    let responseType = params.responseType || 'json';
    //let withCredentials = params.withCredentials || false;

    let xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    xhr.onload = function () {
        console.log('收到数据:', xhr.response);
        if (xhr.status === 200){
            utils.invokeCallback(params.cb, null, xhr.response);
        }else{
            cc.error("请求失败：status=" + xhr.status);
            utils.invokeCallback(params.cb, Global.Code.FAIL);
        }
    };
    xhr.timeout = 20000;
    xhr.ontimeout = function () {
        // XMLHttpRequest 超时。在此做某事。
        cc.error("请求超时");
        utils.invokeCallback(params.cb, Global.Code.FAIL);
    };
    xhr.onerror = function (e) {
        cc.error("请求错误");
        utils.invokeCallback(params.cb, Global.Code.FAIL);
    };
    xhr.open(methodStr, urlStr, true);
    xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
    //xhr.withCredentials = withCredentials;
    if (!!params.data) {
        let data = "";
        for (let key in params.data){
            if (params.data.hasOwnProperty(key)){
                if (data.length > 0){
                    data += "&";
                }
                data += (key + "=" + params.data[key]);
            }
        }
        if(data.length > 0){
            xhr.send(data);
        }else{
            xhr.send();
        }
    } else {
        xhr.send();
    }
};

// 截屏
exp.capScreen = function(parent) {
    if (CC_JSB) {
        let node = new cc.Node();
        node.parent = parent;
        let camera = node.addComponent(cc.Camera);

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render();

        function filpYImage (data, width, height) {
            // create the data array
            let picData = new Uint8Array(width * height * 4);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let start = srow * width * 4;
                let reStart = row * width * 4;
                // save the piexls data
                for (let i = 0; i < rowBytes; i++) {
                    picData[reStart + i] = data[start + i];
                }
            }
            return picData;
        }
        let oldData = texture.readPixels();
        let width = texture.width;
        let height = texture.height;
        let newData = filpYImage(oldData, width, height);
        let filePath = jsb.fileUtils.getWritablePath() + "screen_shoot_share.jpg";
        if (jsb.fileUtils.isFileExist(filePath)) {
            jsb.fileUtils.removeFile(filePath);
        }
        let success = jsb.saveImageData(newData, width, height, filePath);
        node.destroy();
        if (success) {
            console.log("save image data success", filePath);
            return filePath;
        }
        else {
            cc.error("save image data failed!");
            return null;
        }
    }else{
        return null;
    }
};
// 刷新对齐
exp.updateNodeAlignment = function (node) {
    let widget = node.getComponent(cc.Widget);
    if (!!widget){
        widget.updateAlignment();
    }
    for (let i = 0; i < node.children.length; ++i) {
        exp.updateNodeAlignment(node.children[i]);
    }
};

// 屏幕适配
exp.screenAdaptation = function (baseSize, canvas) {
    let size = new cc.size(baseSize.width, baseSize.height);
    let frameSize = cc.view.getFrameSize();
    /*if (size.height/size.width < frameSize.height/frameSize.width){
        size.height = size.width * (frameSize.height / frameSize.width);
    } else {
        return;
    }*/
    //size.width = size.height * (frameSize.width/frameSize.height);
    if (size.height/size.width < frameSize.height/frameSize.width){
        //size.height = size.width * (frameSize.height / frameSize.width);`
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    } else{
        size.width = size.height * (frameSize.width/frameSize.height);
        canvas.designResolution = size;

        canvas.node.width = size.width;
        canvas.node.height = size.height;
    }

    if(cc.sys.isNative || true) return;
    cc.view.setResizeCallback(function (){
        size = new cc.size(baseSize.width, baseSize.height);
        frameSize = cc.view.getFrameSize();
        if (size.height/size.width < frameSize.height/frameSize.width){
            size.height = size.width * (frameSize.height / frameSize.width);
        } else{
            size.width = size.height * (frameSize.width/frameSize.height);
        }
        canvas.designResolution = size;
        canvas.node.width = size.width;
        canvas.node.height = size.height;

        Global.MessageCallback.emitMessage("DesignResolutionChanged", size);

        exp.updateNodeAlignment(canvas.node);
    });
};

exp.getChatEmotionNode = function (index, cb) {
	let node = new cc.Node();
	node.name = 'emotion';
	node.addComponent(cc.Sprite);
	let animation = node.addComponent(cc.Animation);
	cc.loader.loadRes(`Chat/Emotion/${index}/${index}`, cc.JsonAsset, (err, jsonAsset) => {
		if (err) {
			console.log(err);
			return;
		}
		let data = jsonAsset.json;
		let count = data.count;
		let turn = data.turn;
		let time = data.time;
		let urls = [];
		for (let i = 0; i < count; ++i) {
			urls.push(`Chat/Emotion/${index}/${i}`);
		}
		cc.loader.loadResArray(urls, cc.SpriteFrame, (err, frames) => {
			if (err) {
				console.log(urls, 'load error');
				return;
			}
			let clip = cc.AnimationClip.createWithSpriteFrames(frames, count);
			clip.name = 'emotion';
			clip.speed = 1;
			if (node && node.isValid) {
				animation.addClip(clip);
				clip.wrapMode = cc.WrapMode.Loop;
				animation.play('emotion');
			}
		});
		node.runAction(cc.sequence(
			cc.delayTime(time),
			cc.callFunc(() => {
				if (cb) { cb(); }
				node.destroy();
			})
		));
	});
	return node;
};
