// 个人中心页面逻辑
const app = getApp()

Page({
  data: {
    userInfo: {},
    userLevel: 1,
    userPoints: 0,
    isPremium: false,
    premiumExpiry: '',
    stats: {
      totalDays: 0,
      completedTasks: 0,
      studyHours: 0,
      achievements: 0
    },
    showAdRevenue: false, // 是否显示广告收益（开发者模式）
    adRevenue: {
      today: 0,
      thisMonth: 0,
      total: 0
    }
  },

  onLoad: function (options) {
    console.log('个人中心页面加载')
    this.initPage()
  },

  onShow: function () {
    this.loadUserData()
  },

  // 初始化页面
  initPage: function() {
    this.loadUserData()
    this.loadUserStats()
    this.checkPremiumStatus()
    this.loadAdRevenue()
  },

  // 加载用户数据
  loadUserData: function() {
    const userData = app.globalData.userData || wx.getStorageSync('userData')
    const userPoints = wx.getStorageSync('userPoints') || 0
    
    // 获取微信用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          userPoints: userPoints,
          userLevel: this.calculateUserLevel(userPoints)
        })
      },
      fail: () => {
        // 如果获取失败，使用默认信息
        this.setData({
          userInfo: { nickName: '用户' },
          userPoints: userPoints,
          userLevel: this.calculateUserLevel(userPoints)
        })
      }
    })
  },

  // 计算用户等级
  calculateUserLevel: function(points) {
    if (points < 100) return 1
    if (points < 500) return 2
    if (points < 1000) return 3
    if (points < 2000) return 4
    return 5
  },

  // 加载用户统计数据
  loadUserStats: function() {
    const stats = wx.getStorageSync('userStats') || {
      totalDays: Math.floor((Date.now() - (wx.getStorageSync('userData')?.createdAt || Date.now())) / (24 * 60 * 60 * 1000)),
      completedTasks: 23,
      studyHours: 156,
      achievements: 8
    }
    
    this.setData({ stats })
  },

  // 检查会员状态
  checkPremiumStatus: function() {
    const userData = app.globalData.userData || wx.getStorageSync('userData')
    const isPremium = userData.premiumUnlocked && userData.premiumExpiry > Date.now()
    
    let premiumExpiry = ''
    if (isPremium) {
      const expiry = new Date(userData.premiumExpiry)
      premiumExpiry = expiry.toLocaleDateString('zh-CN')
    }
    
    this.setData({ 
      isPremium,
      premiumExpiry
    })
  },

  // 加载广告收益数据（开发者功能）
  loadAdRevenue: function() {
    // 检查是否为开发者模式
    const isDeveloper = wx.getStorageSync('isDeveloper') || false
    
    if (isDeveloper) {
      const adRevenue = {
        today: 12.5,
        thisMonth: 268.9,
        total: 1456.7
      }
      
      this.setData({
        showAdRevenue: true,
        adRevenue
      })
    }
  },

  // 编辑个人资料
  editProfile: function() {
    wx.showModal({
      title: '编辑个人资料',
      content: '请在微信中更新您的头像和昵称',
      showCancel: false
    })
  },

  // 升级高级会员
  upgradePremium: function() {
    wx.showModal({
      title: '升级高级会员',
      content: '升级后将享受无广告体验和所有高级功能，确定要升级吗？',
      confirmText: '立即升级',
      success: (res) => {
        if (res.confirm) {
          // 这里应该调用支付接口
          this.simulatePremiumUpgrade()
        }
      }
    })
  },

  // 模拟会员升级（实际应用中应该接入支付）
  simulatePremiumUpgrade: function() {
    wx.showLoading({
      title: '处理中...'
    })

    setTimeout(() => {
      wx.hideLoading()
      
      // 更新用户数据
      const userData = app.globalData.userData || wx.getStorageSync('userData')
      userData.premiumUnlocked = true
      userData.premiumExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天
      
      wx.setStorageSync('userData', userData)
      app.globalData.userData = userData
      
      // 隐藏所有广告
      if (app.globalData.adManager) {
        app.globalData.adManager.hideBannerAd()
      }
      
      this.checkPremiumStatus()
      
      wx.showModal({
        title: '升级成功！',
        content: '恭喜您成为高级会员，已为您去除所有广告！',
        showCancel: false,
        confirmText: '太棒了'
      })
    }, 2000)
  },

  // 跳转到设置页面
  goToSettings: function() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    })
  },

  // 跳转到广告设置
  goToAdSettings: function() {
    wx.showActionSheet({
      itemList: ['广告频率设置', '广告类型偏好', '举报广告', '广告收益查看'],
      success: (res) => {
        const options = ['广告频率设置', '广告类型偏好', '举报广告', '广告收益查看']
        
        switch (res.tapIndex) {
          case 0:
            this.setAdFrequency()
            break
          case 1:
            this.setAdPreference()
            break
          case 2:
            this.reportAd()
            break
          case 3:
            this.viewAdRevenue()
            break
        }
      }
    })
  },

  // 设置广告频率
  setAdFrequency: function() {
    wx.showActionSheet({
      itemList: ['低频率', '正常频率', '高频率'],
      success: (res) => {
        const frequencies = ['低频率', '正常频率', '高频率']
        wx.setStorageSync('adFrequency', res.tapIndex)
        wx.showToast({
          title: `已设置为${frequencies[res.tapIndex]}`,
          icon: 'success'
        })
      }
    })
  },

  // 设置广告偏好
  setAdPreference: function() {
    wx.showModal({
      title: '广告偏好设置',
      content: '我们会根据您的偏好推送相关广告',
      showCancel: false
    })
  },

  // 举报广告
  reportAd: function() {
    wx.showModal({
      title: '举报广告',
      content: '请描述您要举报的广告内容',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({
            title: '举报已提交',
            icon: 'success'
          })
        }
      }
    })
  },

  // 查看广告收益
  viewAdRevenue: function() {
    wx.showModal({
      title: '广告收益说明',
      content: '观看广告可以获得积分奖励，积分可用于解锁高级功能',
      showCancel: false
    })
  },

  // 数据备份
  goToDataBackup: function() {
    wx.showActionSheet({
      itemList: ['备份到云端', '从云端恢复', '导出数据'],
      success: (res) => {
        const options = ['备份到云端', '从云端恢复', '导出数据']
        wx.showToast({
          title: `${options[res.tapIndex]}功能开发中`,
          icon: 'none'
        })
      }
    })
  },

  // 帮助与反馈
  goToHelp: function() {
    wx.showActionSheet({
      itemList: ['使用帮助', '意见反馈', '联系客服'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.showModal({
              title: '使用帮助',
              content: '1. 设置当前薪资和目标薪资\n2. 制定职业发展规划\n3. 完成学习任务获得积分\n4. 观看广告解锁高级功能',
              showCancel: false
            })
            break
          case 1:
            wx.showModal({
              title: '意见反馈',
              content: '请输入您的意见和建议',
              editable: true,
              success: (res) => {
                if (res.confirm && res.content) {
                  wx.showToast({
                    title: '反馈已提交',
                    icon: 'success'
                  })
                }
              }
            })
            break
          case 2:
            wx.showModal({
              title: '联系客服',
              content: '客服微信：support_career\n工作时间：9:00-18:00',
              showCancel: false
            })
            break
        }
      }
    })
  },

  // 关于我们
  goToAbout: function() {
    wx.showModal({
      title: '关于年薪百万',
      content: '版本：1.0.0\n\n年薪百万是一款专业的职业发展规划小程序，帮助用户制定和追踪职业目标，实现薪资增长。\n\n开发团队致力于为用户提供最优质的服务体验。',
      showCancel: false
    })
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '我在使用年薪百万规划职业发展，一起来试试吧！',
      path: '/pages/home/home',
      imageUrl: '/images/share-profile.png'
    }
  }
})