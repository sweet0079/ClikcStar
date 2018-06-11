declare var wx: wx
interface wx {
    startRecord: wx.startRecord
    stopRecord: wx.stopRecord
    uploadVoice: wx.uploadVoice
    downloadVoice: wx.downloadVoice
    onMenuShareAppMessage: wx.onMenuShareAppMessage
    onMenuShareTimeline: wx.onMenuShareTimeline
    playVoice: wx.playVoice
    onVoicePlayEnd: wx.onVoicePlayEnd
}

declare namespace wx {
    interface startRecord {
        (para:startRecordAug):void
    }
    interface startRecordAug {
        cancel: _li.errCallBack
    }

    interface stopRecord{
        (para:stopRecordAug):void
    }
    interface stopRecordAug {
        success: _li.errCallBack
        fail: _li.errCallBack
    }

    interface uploadVoice{
        (para:uploadVoiceAug):void
    }
    interface uploadVoiceAug {
        localId: number
        // 0不显示 1显示
        isShowProgressTips: number
        success: _li.errCallBack
    }

    interface downloadVoice {
        (para:downloadVoiceAug):void
    }
    interface downloadVoiceAug {
        serverId: string
        // 0不显示 1显示
        isShowProgressTips: number
        success: _li.errCallBack
    }
    interface playVoice {
        (para:playVoiceAug):void
    }
    interface playVoiceAug {
        localId:number
    }
    interface onMenuShareAppMessage{
        (para:onMenuShareAppMessageAug):void
    }
    interface onMenuShareAppMessageAug {
        title: string
        desc: string
        link: string
        imgUrl: string
        type: string
        dataUrl: string
        success: _li.errCallBack
        cancel: _li.errCallBack
    }
    interface onMenuShareTimeline {
        (para: onMenuShareTimelineAug): void
    }
    interface onMenuShareTimelineAug {
        title: string
        link: string
        imgUrl: string
        success: _li.errCallBack
        cancel: _li.errCallBack
    }
    interface onVoicePlayEnd {
        (para: onVoicePlayEndAug): void;
    }
    interface onVoicePlayEndAug {
        complete: Function
    }
}