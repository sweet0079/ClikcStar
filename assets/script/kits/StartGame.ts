import * as lib from '../lib/lib'

/** 用于控制大厅 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {

    // onLoad () {}

    start () {
        this.showShareMenu();
        this.getUserInfo();
        // let button = wx.createUserInfoButton({
        //     type: 'text',
        //     text: '获取用户信息',
        //     style: {
        //         left: 10,
        //         top: 76,
        //         width: 200,
        //         height: 40,
        //         lineHeight: 40,
        //         backgroundColor: '#ff0000',
        //         color: '#ffffff',
        //         textAlign: 'center',
        //         fontSize: 16,
        //         borderRadius: 4
        //     }
        // })
        // button.onTap((res) => {
        //     console.log(res)    
        // })
    }

    // update (dt) {}
    //----- 按钮回调 -----//
    startGame(){
        cc.director.loadScene("MainScene");
    }

    //----- 私有方法 -----//
    private getUserInfo(){
        if(typeof wx !== 'undefined')
        {
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        openIdList:[],
                        lang:"zh_CN",
                        success: res => {
                            console.log(res.data);
                            console.log("getUserInfo fail");
                        },
                        fail: res => {
                            console.log(res);
                            console.log("getUserInfo fail");
                            if(res.errMsg == "getUserInfo:ok")
                            {
                                let url = res.userInfo.avatarUrl;
                                lib.userInfo.getinstance().setuserAvatar(url);
                            }
                        },
                        complete: res => {
                            console.log(res);
                            console.log("getUserInfo complete");
                            if(res.errMsg == "getUserInfo:ok")
                            {
                                let url = res.userInfo.avatarUrl;
                                lib.userInfo.getinstance().setuserAvatar(url);
                            }
                        },
                    });
                }
              })
        }
    }

    private showShareMenu() {
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
}
