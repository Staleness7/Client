let exp = module.exports = {};

exp.init = function (data) {
    this.allGames = data;
};

exp.getGameInfoByGameTypeID = function (gameTypeID) {
    for(let i = 0; i < this.allGames.length; ++i){
        let gameTypeInfo = this.allGames[i];
        if (gameTypeInfo.gameTypeID === gameTypeID) return gameTypeInfo;
    }
    return null;
};


exp.getLevelsByKind = function (kind) {
    let levels = [];

    for(let key in this.allGames) {
        if (this.allGames.hasOwnProperty(key)) {
            if (this.allGames[key].kind === kind) {
                levels.push(this.allGames[key]);
            }
        }
    }

    levels.sort(function (a, b) {
        return a.level > b.level?1:-1;
    });

    return levels;
};

exp.getGameInfoByKindAndLevel = function(kind, level){
    for (let key in this.allGames) {
        if (this.allGames.hasOwnProperty(key)) {
            if ((this.allGames[key].kind === kind) && (this.allGames[key].level === level)) {
                return this.allGames[key];
            }
        }
    }
    return null;
};