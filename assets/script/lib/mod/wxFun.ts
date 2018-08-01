export let showShareMenu = function () {
    if(typeof wx !== 'undefined')
    {
        return new Promise((resolve, reject) => {
            wx.showShareMenu({
            withShareTicket: true,
            success: res => {
                console.log("showShareMenu true");
            },
            fail: res => {
                console.log("showShareMenu fail");
                console.log(res);
            },
            complete: res => {
                console.log("showShareMenu complete");
                console.log(res);
            },
            })
        })
    }
}

export let onShareAppMessage = function (titlestr:string,imgurl:string) {
    if(typeof wx !== 'undefined')
    {
        console.log("onShareAppMessage");
        wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
                title:titlestr,
                imageUrl:imgurl,
            }
          })
    }
}

export let getUserInfo = function (success:Function,fail:Function,complete:Function){
    if(typeof wx !== 'undefined')
    {
        wx.login({
            success: function () {
                wx.getUserInfo({
                    openIdList:[],
                    lang:"zh_CN",
                    success: res => {
                        success(res);
                    },
                    fail: res => {
                        fail(res);
                    },
                    complete: res => {
                        complete(res);
                    },
                });
            }
          })
    }
}

export let setUserCloudStorage = function(score:number){
    let timestamp:number = new Date().getTime();
    let kvdata = {
        key: "score",
        value: score.toString(),
      };
    if(typeof wx !== 'undefined')
    {
        wx.setUserCloudStorage({
            KVDataList:[kvdata],
              success: res => {
                  console.log("setUserCloudStorage true");
                  console.log(res);
              },
              fail: res => {
                  console.log("setUserCloudStorage fail");
                  console.log(res);
              },
              complete: res => {
                  console.log("setUserCloudStorage complete");
                  console.log(res);
              },
        })
    }
}