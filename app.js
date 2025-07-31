// 年薪百万小程序主入口
App({
  onLaunch: function () {
    console.log('年薪百万小程序启动')
    
    // 初始化用户数据
    this.initUserData()
    
    // 检查小程序更新
    this.checkForUpdate()
  },

  onShow: function (options) {
    console.log('小程序显示')
  },

  onHide: function () {
    console.log('小程序隐藏')
  },

  // 初始化用户数据
  initUserData: function() {
    const userData = wx.getStorageSync('userData')
    if (!userData) {
      // 设置默认数据
      const defaultData = {
        currentSalary: 0,
        targetSalary: 1000000,
        currentPosition: '',
        targetPosition: '',
        skills: [],
        achievements: [],
        learningPlan: [],
        createdAt: new Date().getTime()
      }
      wx.setStorageSync('userData', defaultData)
      this.globalData.userData = defaultData
    } else {
      this.globalData.userData = userData
    }
  },

  // 检查小程序更新
  checkForUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
  },

  // 全局数据
  globalData: {
    userData: null,
    version: '1.0.0'
  }
})