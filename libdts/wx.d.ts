declare var wx: wx
interface wx {
    showShareMenu:wx.showShareMenu
}

declare namespace wx {
    interface showShareMenu {
        (para:startRecordAug):void
    }
    interface startRecordAug {
        withShareTicket:boolean
        success: _li.errCallBack
        fail: _li.errCallBack
        complete: _li.errCallBack
    }
}