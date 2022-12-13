cc.Class({
    extends: cc.Component,

    properties: {
        loadingGroup: cc.ProgressBar,
    },

    start: function () {
        this.isLoadingFinished = false;

        this.loadDirArr = this.dialogParameters.loadDirArr || [];
        this.callback = this.dialogParameters.cb;

        //加载资源
        this.loading();
    },

    loading: function () {
        let loadDirArr = this.loadDirArr;
        let allTotalCount = 0;
        let allCompletedCount = 0;
        let finishedCount = 0;
        this.loadingGroup.progress = 0;
        let self = this;

        function loadDir(dir) {
            let lastTotalCount = 0;
            let lastCompletedCount = 0;
            cc.loader.loadResDir(dir, function (completedCount , totalCount ){
                if (!self.isValid) return;
                if ((finishedCount === loadDirArr.length) && (self.loadingGroup.progress === 1))  return;
                if (self.isLoadingFinished) return;
                if (lastTotalCount === 0) {
                    allTotalCount += totalCount;
                    allCompletedCount += completedCount;
                }else{
                    allTotalCount += (totalCount - lastTotalCount);
                    allCompletedCount += (completedCount - lastCompletedCount);
                }
                if (allTotalCount < 10) allTotalCount = 10;
                lastTotalCount = totalCount;
                lastCompletedCount = completedCount;
                if (totalCount === completedCount){
                    finishedCount++;
                }
                let newProgress = 0;
                if (allTotalCount === 0){
                    newProgress = finishedCount / loadDirArr.length;
                }else{
                    newProgress = allCompletedCount / allTotalCount;
                }
                if (newProgress > self.loadingGroup.progress){
                    self.loadingGroup.progress = newProgress;
                }

                if (newProgress * 1.1 >= 1){
                    self.loadingFinished();
                }
            },
            function (err) {
                if (!!err) {
                    cc.error(err);
                }
            });
        }
        for (let i = 0; i < loadDirArr.length; ++i){
            loadDir(loadDirArr[i]);
        }
    },

    loadingFinished: function () {
        if (this.isLoadingFinished) return;
        this.isLoadingFinished = true;
        this.loadingGroup.progress = 1;

        this.callback();
    }
});
