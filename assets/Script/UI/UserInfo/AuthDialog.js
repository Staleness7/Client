// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nameEdit: cc.EditBox,
        idCardEdit: cc.EditBox,

        nameLabel: cc.Node,
        idCardLabel: cc.Node,

        commitBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let realName = Global.UserModel.realName;
        if (!!realName){
            realName = JSON.parse(realName);

            this.nameEdit.string = realName.name;
            this.idCardEdit.string = realName.idCard;

            this.nameLabel.active = true;
            this.idCardLabel.active = true;

            this.commitBtn.active = false;
        }
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'auth':
                let name = this.nameEdit.string;
                if(Global.Utils.getStringRealLength(name) < 4 || Global.Utils.getStringRealLength(name) > 20){
                    Global.DialogManager.addPopDialog("请输入真实有效的姓名");
                    return;
                }
                if (!this.checkID(this.idCardEdit.string)){
                    return;
                }
                Global.DialogManager.addLoadingCircle();
                Global.API.hall.authRealNameRequest(name, this.idCardEdit.string, function () {
                    Global.DialogManager.addPopDialog('认证成功！', function () {
                        Global.DialogManager.destroyDialog(this);
                    }.bind(this));
                    Global.DialogManager.removeLoadingCircle();
                }.bind(this));
                break;
        }
    },
    
    checkID: function (code) {
        /*
        根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
            地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
            出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
            顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
            校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

        出生日期计算方法。
            15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
            2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
        下面是正则表达式:
         出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
         身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
         15位校验规则 6位地址编码+6位出生日期+3位顺序号
         18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

         校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                        公式(1)中：
                        i----表示号码字符从由至左包括校验码在内的位置序号；
                        ai----表示第i位置上的号码字符值；
                        Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                        i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                        Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

                        */
        //身份证号合法性验证
        //支持15位和18位身份证号
        //支持地址编码、出生日期、校验位验证
        let city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        let tip = "";
        let pass = true;

        let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        // reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;

        if(!code || !reg.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        } else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length === 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (let i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }

                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }

        if(!pass) {
            Global.DialogManager.addPopDialog(tip);
        }

        return pass;
    }
});
