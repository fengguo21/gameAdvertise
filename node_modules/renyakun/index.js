let version = "1.0.5";
var CryptoJS = require("./crypto-js");
let addata = "";
let systemInfo = "";
let btnArea = "";
let closeBtn = "";
let i = 1;
//class
export default class Advertise {
  constructor({
    ctx,
    // canvas,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo,
    hasUUid
  }) {
    this.ctx = ctx;
    this.unClick = true;
    this.appid = appid;

    this.advertise({
      canvas: canvas,
      ctx: ctx,
      appid: appid,
      slotid,
      uuid,
      wxopt,
      hasUUid
    });
  }
  //用户未设置uuid,则设置临时uuid
  setTempUuid() {
    let self = this;
    let uuid = "";
    for (let i = 0; i < 8; i++) {
      let str = Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
      uuid += str;
    }
    if (wx.getStorageSync("aduuid")) {
      // self.properties.adInfo.uuid = wx.getStorageSync("aduuid");
    } else {
      wx.setStorageSync("aduuid", uuid);
      // self.properties.adInfo.uuid = uuid;
    }
  }
  // 获取网络类型
  getNetworkType() {
    return new Promise(function (resolve, reject) {
      wx.getNetworkType({
        success(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = 0;
          switch (res.networkType) {
            case "unknown":
              networkType = 0;
              break;
            case "wifi":
              networkType = 1;
              break;
            case "2g":
              networkType = 2;
              break;
            case "3g":
              networkType = 3;
              break;
            case "4g":
              networkType = 4;
              break;
          }
          resolve(networkType);
        }
      });
    });
  }

  //获取设备类型
  getCellphoneSystemInfo() {
    return new Promise(function (resolve, reject) {
      wx.getSystemInfo({
        success: function (res) {
          systemInfo = res;
          console.log(res);
          resolve(res);
        }
      });
    });
  }

  // 获取随机字符串
  randomString(len) {
    len = len || 32;
    var $chars =
      "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = "";
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
  // 加密
  encode(str) {
    let key = CryptoJS.enc.Utf8.parse("Zyz#Wx1820&&2468");

    var ciphertext = CryptoJS.AES.encrypt(str, key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return ciphertext.ciphertext.toString(CryptoJS.enc.Hex);
  }
  // 交互类型: 0-预览图 1-跳转⼩小程序 2-跳转⻚页⾯面   目前仅支持跳转小程序
  clickType(e) {
    var type = e.currentTarget.dataset.type;
    if (parseInt(type) === 0) {
      var url = e.currentTarget.dataset.url;
      var ext = e.currentTarget.dataset.ext;
      var sign = e.currentTarget.dataset.sign;
      this.previewImgFun(url, ext, sign);
    }
  }
  previewImgFunfunction(url, ext, sign) {
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
    // 平台点击接口请求参数
    this.ck(ext, sign);
  }
  // 平台曝光
  im(params) {
    var self = this;
    let t = parseInt(Date.parse(new Date()) / 1000);
    console.log(t);
    let replaceStr = params.sign + "|" + t;
    console.log(typeof replaceStr);
    let encodeStr = self.encode(replaceStr);
    let url = params.ims[0].replace("__EXT__", params.ext); //接口地址
    url = url.replace("__SIGN__", encodeStr); //接口地址
    wx.request({
      url: url, //接口地址
      header: {
        "content-type": "application/json", // 默认值
        "x-api-version": "1.0.0"
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res);
        }
      },
      fail: function (err) {
        console.log("im接口加载失败", err);
      }
    });
  }
  // 平台点击
  ck(params) {
    var self = this;

    // 获取广告图片
    let t = parseInt(Date.parse(new Date()) / 1000);
    let replaceStr = params.sign + "|" + t;
    let encodeStr = self.encode(replaceStr);
    let url = params.cks[0].replace("__EXT__", params.ext); //接口地址
    url = url.replace("__SIGN__", encodeStr); //接口地址
    wx.request({
      url: url, //接口地址
      header: {
        "content-type": "application/json" // 默认值
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res);
        }
      },
      fail: function (err) {
        console.log("ck接口加载失败", err);
      }
    });
  }

  // 关闭弹窗广告
  clickClose(e) {
    this.setData({
      isHide: true
    });
  }
  // 统计浮层
  hideCover(e) {
    this.setData({
      "resultData.stat": null
    });
  }

  //点击

  click(e) {
    var self = this;

    // e.preventDefault();

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    console.log(x, y)
    if (y >= btnArea.top) {
      self.unClick = false;
      i++;
      console.log(i);
      wx.navigateToMiniProgram({
        appId: "wxc96364a5c458629e",
        path: "pages/nav/nav?slotid=slotid&adid=2",
        complete: function (res) {}
      });
      self.ck(self.addata);
      return;
    }
  }

  advertise({
    ctx,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo,
    hasUUid
  }) {
    wx.onTouchStart((e) => {
      self.click(e)
    })
    var self = this;
    var appid = appid;
    console.log(ctx, "ctx");
    // 判断openid是否必填,不必填随机32位字符串存入缓存作为uuid的值
    if (hasUUid === false) {
      this.setTempUuid();
    }
    // 获取网络类型,获取设备类型
    Promise.all([this.getNetworkType(), this.getCellphoneSystemInfo()])
      .then(results => {
        console.log(results, 'results---------------')
        this.results = results;
        this.getContent({
          canvas: canvas,
          ctx: ctx,
          results: results,
          appid: appid,
          slotid,
          uuid,
          wxopt,
          hasUUid
        }).then(res => {
          console.log(res, "ren-------------");
        });
      })
      .then(function (res) {
        console.log("test==========");
      });

    console.log("This is a message from the demo package");
  }
  getContent({
    ctx,
    results,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo
  }) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // 请求参数
      var requestParams = {
        plugv: version,
        appid: appid,
        slotid: slotid,
        uuid: uuid,
        wxopt: wxopt,
        userinfo: userinfo,
        //   // 请求ID
        reqid: new Date().getTime() + self.randomString(17),
        //   // 设备型号
        model: results[1].model,
        //   // 操作系统
        os: results[1].system.indexOf("iOS") != -1 ?
          1 : results[1].system.indexOf("Android") != -1 ?
          2 : 0,
        //   // 操作系统版本
        osv: results[1].system,
        //   // 微信版本
        wxv: results[1].version,
        //   // 小程序接口版本
        wxpv: results[1].SDKVersion,
        //   // 网络类型
        net: results[0].networkType
      };
      console.log(requestParams);

      // // 获取广告图片
      wx.request({
        url: "https://api-sailfish.optaim.com/wx", //接口地址
        data: requestParams,
        header: {
          "content-type": "application/json", // 默认值
          "x-api-version": "1.0.0"
        },
        method: "POST",
        success: function (res) {
          self.addata = res.data;
          resolve(res.data);
          console.log("微信", res.data);
          self.im(self.addata);
        },
        fail: function (err) {
          console.log("广告接口加载失败", err);
        }
      });
    });
  }

  drawBottomBanner() {
    let self = this;
    const screenWidth = this.results[1].windowWidth;
    const screenHeight = this.results[1].windowHeight;
    const imgWidth = screenWidth;
    const imgHeight = screenWidth / 3.8;
    btnArea = {
      top: this.results[1].windowHeight - this.results[1].windowWidth / 3.8,
      left: 0,
      right: screenWidth,
      bottom: screenHeight
    };
    var image = wx.createImage();
    image.src = this.addata.main.url;
    let adicon = wx.createImage();
    adicon.src = "https://s1.ax1x.com/2018/10/23/ir8XU1.png";
    self.ctx.drawImage(image, 0, screenHeight - imgHeight, imgWidth, imgHeight);
    self.ctx.drawImage(adicon, 0, screenHeight - imgHeight, 30, 25);
    // wx.onTouchStart(this.click.bind(this))
    // canvas.addEventListener("touchstart", this.click.bind(this));
  }
  playVideo(cb) {
    let advideo = wx.createVideo({
      x: 0,
      y: 0,
      autoplay: true,
      // controls: false,

      width: canvas.width - 100,
      height: canvas.height - 100,
      src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
    })
    advideo.onPlay(() => {
      advideo.seek(327)
      advideo.requestFullScreen()
    })

    advideo.onEnded(() => {
      advideo.destroy()
      cb()
    })



  }

  draw() {
    let self = this;
    const screenWidth = this.results[1].windowWidth;
    const imgWidth = screenWidth * 0.73;
    const screenHeight = this.results[1].windowHeight;
    const imgHeight = screenHeight / 3;
    const posLeft = screenWidth / 2 - imgWidth / 2;
    const posRight = posLeft + imgWidth - 40;
    const posTop = screenHeight / 2 - imgHeight / 2;
    btnArea = {
      top: posTop,
      left: posLeft,
      right: posLeft + imgWidth,
      bottom: posTop + imgHeight
    };
    closeBtn = {
      top: posTop,
      left: posLeft + imgWidth - 40,
      right: posLeft + imgWidth,
      bottom: posTop + 40
    };

    // canvas.addEventListener("touchstart", this.click.bind(this));
    var image = wx.createImage();
    image.src = this.addata.main.url;
    var close = wx.createImage();
    close.src =
      "http://intention.image.yaocaimaimai.com/tmp/wx11948e15ebecf897.o6zAJs53xG-aCh7q1YzZGZ9arYeU.8FOtdLSwpWXQ5b2bee812d7794ad6caf6f0564eba896.png";
    self.ctx.drawImage(image, posLeft, posTop, imgWidth, imgHeight);
    self.ctx.drawImage(close, posLeft + imgWidth - 35 - 3, posTop + 3, 35, 35);
  }
}