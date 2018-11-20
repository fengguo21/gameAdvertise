import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
// let rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: '1' })
// rewardedVideoAd.load()
// rewardedVideoAd.onError(err => {
//   console.log(err,'----------------')
// })
// rewardedVideoAd.show()
// console.log(rewardedVideoAd,1)


// rewardedVideoAd.show().then(() => console.log('激励视频 广告显示'))
// import ren from './js/index.js'

// const  = require('renyakun')

// ad.printMSg()
// console.log(Advertise)
// let advertise = new Advertise()

// import Advertise from './js/index.js'
// var canvas = wx.createCanvas()
var screenContext = canvas.getContext('2d')
wx.setPreferredFramesPerSecond(60)


new Main()



// var screenContext = screenCanvas.getContext('2d')