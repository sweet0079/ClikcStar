declare var wx: wx
interface wx {
    showShareMenu:wx.showShareMenu
    getUserInfo:wx.getUserInfo
    login:wx.login
    setUserCloudStorage:wx.setUserCloudStorage
}

declare namespace wx {
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