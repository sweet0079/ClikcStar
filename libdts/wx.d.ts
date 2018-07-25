declare var wx: wx
interface wx {
    showShareMenu:wx.showShareMenu
    getUserInfo:wx.getUserInfo
    login:wx.login
    setUserCloudStorage:wx.setUserCloudStorage
    postMessage:wx.postMessage
}

declare namespace wx {
    interface postMessage{
        (para:postMessageAug):void
    }
    interface setUserCloudStorage{
        (para:setUserCloudStorageAug):void
    }
    interface login{
        (para:loginAug):void
    }
    interface getUserInfo{
        (para:getUserInfoAug):void
    }
    interface showShareMenu {
        (para:showShareMenuAug):void
    }
    interface postMessageAug{
        message:string
    }
    interface loginAug{
        success: _li.errCallBack
    }
    interface setUserCloudStorageAug{
        KVDataList:Array<any>
        success: _li.errCallBack
        fail: _li.errCallBack
        complete: _li.errCallBack
    }
    interface getUserInfoAug{
        openIdList:Array<string>
        lang:string
        success: _li.errCallBack
        fail: _li.errCallBack
        complete: _li.errCallBack
    }
    interface showShareMenuAug {
        withShareTicket:boolean
        success: _li.errCallBack
        fail: _li.errCallBack
        complete: _li.errCallBack
    }
}