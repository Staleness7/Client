const Fs = require('fs');
const { dialog } = require('electron').remote;

Editor.Panel.extend({
    style: Fs.readFileSync(Editor.url('packages://bitmapfont/panel/index.css', 'utf8')),
    template: Fs.readFileSync(Editor.url('packages://bitmapfont/panel/index.html', 'utf8')),
    $: {
        fontCanvas: "#fontCanvas"
    },


    ready() {
        let self = this;
        this.plugin = new window.Vue({
            el: this.shadowRoot,
            data() {
                return {
                    filePath: "",
                    imageList: [],
                    updateImageList: [],
                    canvasWidth: 256,
                    canvasHeight: 256,
                    fontInfo: '',
                }
            },
            methods: {
                dragEnter(e) {
                    e.stopPropagation();
                    e.preventDefault();
                },
                dragOver(e) {
                    e.stopPropagation();
                    e.preventDefault();
                },
                onDrop(e) {
                    this.removeAll();
                    this.canvasWidth = 256;
                    this.canvasHeight = 256;
                    e.stopPropagation();
                    e.preventDefault();
                    let dt = e.dataTransfer;
                    let files = dt.files;
                    this.showImgData(files);
                },
                showImgData(files) {
                    let that = this;
                    if (files.length) {
                        let successCount = 0;
                        for (let i = 0; i < files.length; i++) {
                            let file = files[i];
                            if (!/^image\//.test(file.type)) continue;
                            let fileReader = new FileReader();
                            fileReader.onload = (function() {
                                return function(e) {
                                    if (that.updateImageList.indexOf(e.target.result) !== -1) return;
                                    const img = new Image();
                                    img.src = e.target.result;
                                    img.onload = () => {
                                        let fileName = file.name.split('.')[0];
                                        that.imageList.push({
                                            img: e.target.result,
                                            char: fileName.substr(fileName.length - 1, 1),
                                            width: img.width,
                                            height: img.height,
                                            x: 0,
                                            y: 0,
                                        });
                                        that.updateImageList.push(e.target.result);
                                        that.updateCanvas(null, (maxX, maxY) => {
                                            successCount++;
                                            if (successCount >= files.length) {
                                                that.canvasWidth = maxX + 2;
                                                that.canvasHeight = maxY;
                                                setTimeout(() => {
                                                    that.updateCanvas(null)
                                                }, 10)
                                            }
                                        });
                                    };
                                };
                            })();
                            fileReader.readAsDataURL(file);
                        }
                    }
                },
                updateCanvas(data, func) {
                    if (!this.imageList.length) return;
                    let that = this;
                    let height = 0;
                    let space = 2;
                    let x = space;
                    let y = space;
                    let maxX = x;
                    let maxY = y;
                    this.imageList.forEach(img => {
                        if (img.height > height) height = img.height;
                    });
                    height = Math.ceil(height);
                    this.fontSize = height;
                    let content = self.$fontCanvas.getContext('2d');
                    content.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    this.imageList.forEach(img2 => {
                        let img = new Image();
                        img.src = img2.img;
                        if (x + img2.width + space > that.canvasWidth) {
                            y += height + space;
                            if (y + height + space > that.canvasHeight) {
                                that.canvasWidth += (x + img2.width + space);
                                that.canvasHeight += y;
                            }
                            x = space;
                        }
                        content.drawImage(img, x, y);
                        img2.x = x;
                        img2.y = y;
                        x += img2.width + space;
                        if (maxX < x) {
                            maxX = x;
                        }
                        if (maxY < y + height + space) {
                            maxY = y + height + space;
                        }
                    });
                    func && func(maxX, maxY);

                },
                loadFileData() {
                    let str = `info size=${this.fontSize} unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0
common lineHeight=${this.fontSize} base=23 scaleW=${this.canvasWidth} scaleH=${this.canvasHeight} pages=1 packed=0
page id=0 file="${this.fontName}.png"
chars count=${this.imageList.length}`;
                    this.imageList.forEach(img => {
                        str += `char id=${this.caseConvertEasy(img.char).charCodeAt(0)} x=${img.x} y=${img.y} width=${img.width} height=${img.height} xoffset=0 yoffset=0 xadvance=${img.width} \n`;
                    })
                    this.fontInfo = str;
                },
                caseConvertEasy(str) {
                    return str.split('').map(s => {
                        if (s.charCodeAt() <= 90) {
                            return s.toUpperCase()
                        }
                        return s.toLowerCase()
                    }).join('')
                },
                removeAll() {
                    this.imageList = [];
                    this.updateImageList = [];
                    this.updateCanvas();
                },
                save() {
                    this.selectFolder(() => {
                        this.loadFileData();
                        this.savePng();
                        this.saveFnt();
                    })
                },
                selectFolder(func) {
                    let self = this;
                    Editor.Scene.callSceneScript('bitmapfont', 'getCocosVersion', function(err, version) {
                        let result = self.compareVersion(version, "2.4.5");
                        Editor.log("版本号： ", version, "结果", result);
                        if (result >= 0) { //大于等于2.4.5版本
                            dialog.showSaveDialog({ properties: ['openDirectory'] }).then(result => {
                                let fontPath = result.filePath;
                                Editor.log("保存路径： ", fontPath);
                                self.selectSuccess(fontPath, func);
                            }).catch(err => {
                                Editor.log(err)
                            })
                        } else { //
                            let fontPath = dialog.showSaveDialog({ properties: ['openDirectory', ] });
                            Editor.log("保存路径： ", fontPath);
                            self.selectSuccess(fontPath, func);
                        }
                    });
                },
                compareVersion(v1, v2) {
                    let vers1 = v1.split('.');
                    let vers2 = v2.split('.');
                    const len = Math.max(v1.length, v2.length)
                    while (vers1.length < len) {
                        vers1.push('0')
                    }
                    while (vers2.length < len) {
                        vers2.push('0')
                    }
                    for (let i = 0; i < len; i++) {
                        const num1 = parseInt(vers1[i])
                        const num2 = parseInt(vers2[i])
                        if (num1 > num2) {
                            return 1
                        } else if (num1 < num2) {
                            return -1
                        }
                    }
                    return 0
                },
                selectSuccess(fontPath, func) {
                    if (fontPath) {
                        const agent = navigator.userAgent.toLowerCase();
                        let fontArr = [];
                        const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
                        /**32或者64位 windoiws系统 */
                        let isWindows = (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) || (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0)
                        if (isWindows) {
                            fontArr = fontPath.split("\\");
                        }
                        if (isMac) {
                            fontArr = fontPath.split("/");
                        }
                        this.fontName = fontArr[fontArr.length - 1];
                        this.filePath = fontPath.replace("\\" + this.fontName, "");
                        if (this.filePath) {
                            Editor.log("选择完成，保存中");
                            func();
                        }
                    }
                },
                saveFnt() {
                    Fs.writeFileSync(this.filePath.replace(/\\/g, "/") + '/' + this.fontName + '.fnt', this.fontInfo);
                },
                savePng() {
                    let src = self.$fontCanvas.toDataURL("image/png");
                    let data = src.replace(/^data:image\/\w+;base64,/, "");
                    let buffer = new window.Buffer(data, 'base64');
                    Fs.writeFileSync(this.filePath.replace(/\\/g, "/") + '/' + this.fontName + '.png', buffer);
                    Editor.log("保存成功");
                }
            }
        })
    },
});