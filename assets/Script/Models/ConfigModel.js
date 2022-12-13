let Data = module.exports = {};

Data.init = function (datas) {
    this.setDatas(datas);
};

Data.getData = function (key) {
    return this[key];
};

Data.setDatas = function (datas) {
    for (let key in datas) {
        if (datas.hasOwnProperty(key)) {
            this[key] = datas[key];
        }
    }
};
