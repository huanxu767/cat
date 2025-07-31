/**
 * 广告管理器
 * 统一管理小程序中的各种广告
 */
class AdManager {
  constructor() {
    // Banner广告实例
    this.bannerAd = null
    // 激励视频广告实例
    this.rewardedVideoAd = null
    // 插屏广告实例
    this.interstitialAd = null
    
    // 广告配置
    this.adConfig = {
      // Banner广告位ID（需要在微信广告后台申请）
      bannerAdUnitId: 'adunit-2693364c5e8e2ac5',
      // 激励视频广告位ID
      rewardedVideoAdUnitId: 'adunit-c893364c5e8e2ac5',
      // 插屏广告位ID
      interstitialAdUnitId: 'adunit-d893364c5e8e2ac5'
    }
    
    // 广告展示控制
    this.adControl = {
      bannerVisible: false,
      lastInterstitialTime: 0,
      interstitialInterval: 60000, // 插屏广告最小间隔1分钟
      rewardedVideoReady: false
    }
    
    this.init()
  }

  /**
   * 初始化广告
   */
  init() {
    // 检查广告API是否可用
    if (!wx.createBannerAd) {
      console.log('当前微信版本过低，无法使用广告能力')
      return
    }
    
    this.initBannerAd()
    this.initRewardedVideoAd()
    this.initInterstitialAd()
  }

  /**
   * 初始化Banner广告
   */
  initBannerAd() {
    if (!wx.createBannerAd) return
    
    try {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync()
      
      this.bannerAd = wx.createBannerAd({
        adUnitId: this.adConfig.bannerAdUnitId,
        style: {
          left: 0,
          top: systemInfo.windowHeight - 100,
          width: systemInfo.windowWidth
        }
      })

      // 监听Banner广告加载事件
      this.bannerAd.onLoad(() => {
        console.log('Banner广告加载成功')
      })

      // 监听Banner广告错误事件
      this.bannerAd.onError((err) => {
        console.error('Banner广告加载失败', err)
      })

      // 监听Banner广告尺寸变化
      this.bannerAd.onResize((size) => {
        this.bannerAd.style.top = systemInfo.windowHeight - size.height
      })
    } catch (error) {
      console.error('Banner广告初始化失败', error)
    }
  }

  /**
   * 初始化激励视频广告
   */
  initRewardedVideoAd() {
    if (!wx.createRewardedVideoAd) return

    try {
      this.rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: this.adConfig.rewardedVideoAdUnitId
      })

      // 监听激励视频广告加载事件
      this.rewardedVideoAd.onLoad(() => {
        console.log('激励视频广告加载成功')
        this.adControl.rewardedVideoReady = true
      })

      // 监听激励视频广告错误事件
      this.rewardedVideoAd.onError((err) => {
        console.error('激励视频广告加载失败', err)
        this.adControl.rewardedVideoReady = false
      })

      // 监听激励视频广告关闭事件
      this.rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          console.log('激励视频广告完整播放')
          return true // 返回true表示用户看完了广告
        } else {
          console.log('激励视频广告未完整播放')
          return false
        }
      })

      // 预加载激励视频广告
      this.rewardedVideoAd.load()
    } catch (error) {
      console.error('激励视频广告初始化失败', error)
    }
  }

  /**
   * 初始化插屏广告
   */
  initInterstitialAd() {
    if (!wx.createInterstitialAd) return

    try {
      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: this.adConfig.interstitialAdUnitId
      })

      // 监听插屏广告加载事件
      this.interstitialAd.onLoad(() => {
        console.log('插屏广告加载成功')
      })

      // 监听插屏广告错误事件
      this.interstitialAd.onError((err) => {
        console.error('插屏广告加载失败', err)
      })

      // 监听插屏广告关闭事件
      this.interstitialAd.onClose(() => {
        console.log('插屏广告关闭')
      })
    } catch (error) {
      console.error('插屏广告初始化失败', error)
    }
  }

  /**
   * 显示Banner广告
   */
  showBannerAd() {
    if (!this.bannerAd) return

    try {
      this.bannerAd.show()
      this.adControl.bannerVisible = true
      console.log('显示Banner广告')
    } catch (error) {
      console.error('显示Banner广告失败', error)
    }
  }

  /**
   * 隐藏Banner广告
   */
  hideBannerAd() {
    if (!this.bannerAd) return

    try {
      this.bannerAd.hide()
      this.adControl.bannerVisible = false
      console.log('隐藏Banner广告')
    } catch (error) {
      console.error('隐藏Banner广告失败', error)
    }
  }

  /**
   * 显示激励视频广告
   * @param {Function} onReward 观看完成回调
   * @param {Function} onError 错误回调
   */
  showRewardedVideoAd(onReward, onError) {
    if (!this.rewardedVideoAd) {
      onError && onError('激励视频广告未初始化')
      return
    }

    // 先加载广告
    this.rewardedVideoAd.load().then(() => {
      return this.rewardedVideoAd.show()
    }).then(() => {
      console.log('激励视频广告显示成功')
    }).catch((err) => {
      console.error('激励视频广告显示失败', err)
      onError && onError(err)
    })

    // 设置一次性监听器
    const closeHandler = (res) => {
      this.rewardedVideoAd.offClose(closeHandler)
      
      if (res && res.isEnded) {
        onReward && onReward()
      } else {
        onError && onError('用户未完整观看广告')
      }
      
      // 重新加载广告
      this.rewardedVideoAd.load()
    }

    this.rewardedVideoAd.onClose(closeHandler)
  }

  /**
   * 显示插屏广告
   */
  showInterstitialAd() {
    if (!this.interstitialAd) return

    // 检查时间间隔
    const now = Date.now()
    if (now - this.adControl.lastInterstitialTime < this.adControl.interstitialInterval) {
      console.log('插屏广告展示间隔未到')
      return
    }

    try {
      this.interstitialAd.show().then(() => {
        console.log('插屏广告显示成功')
        this.adControl.lastInterstitialTime = now
      }).catch((err) => {
        console.error('插屏广告显示失败', err)
      })
    } catch (error) {
      console.error('插屏广告显示异常', error)
    }
  }

  /**
   * 销毁Banner广告
   */
  destroyBannerAd() {
    if (this.bannerAd) {
      this.bannerAd.destroy()
      this.bannerAd = null
      this.adControl.bannerVisible = false
      console.log('Banner广告已销毁')
    }
  }

  /**
   * 销毁所有广告
   */
  destroyAllAds() {
    this.destroyBannerAd()
    
    if (this.rewardedVideoAd) {
      this.rewardedVideoAd = null
    }
    
    if (this.interstitialAd) {
      this.interstitialAd = null
    }
    
    console.log('所有广告已销毁')
  }

  /**
   * 获取广告状态
   */
  getAdStatus() {
    return {
      bannerVisible: this.adControl.bannerVisible,
      rewardedVideoReady: this.adControl.rewardedVideoReady,
      lastInterstitialTime: this.adControl.lastInterstitialTime
    }
  }
}

// 创建全局广告管理器实例
const adManager = new AdManager()

module.exports = adManager