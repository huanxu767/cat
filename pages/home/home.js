// 首页逻辑
const app = getApp()

Page({
  data: {
    greeting: '早上好',
    userData: {},
    updateTime: '',
    progressPercentage: 0,
    salaryGap: 0,
    completedGoals: 0,
    totalGoals: 10,
    todayTasks: [],
    motivationQuote: '成功不是终点，失败不是末日，继续前进的勇气才最可贵。',
    quoteAuthor: '温斯顿·丘吉尔'
  },

  onLoad: function (options) {
    console.log('首页加载')
    this.initPage()
  },

  onShow: function () {
    console.log('首页显示')
    this.refreshData()
  },

  // 初始化页面
  initPage: function() {
    this.setGreeting()
    this.loadUserData()
    this.loadTodayTasks()
    this.generateMotivationQuote()
  },

  // 设置问候语
  setGreeting: function() {
    const hour = new Date().getHours()
    let greeting = '早上好'
    
    if (hour >= 6 && hour < 12) {
      greeting = '早上好'
    } else if (hour >= 12 && hour < 18) {
      greeting = '下午好'
    } else {
      greeting = '晚上好'
    }
    
    this.setData({ greeting })
  },

  // 加载用户数据
  loadUserData: function() {
    const userData = app.globalData.userData || wx.getStorageSync('userData')
    const updateTime = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    // 计算进度
    const progress = this.calculateProgress(userData)
    
    this.setData({
      userData,
      updateTime,
      progressPercentage: progress.percentage,
      salaryGap: progress.gap,
      completedGoals: progress.completed
    })
  },

  // 计算进度
  calculateProgress: function(userData) {
    const current = userData.currentSalary || 0
    const target = userData.targetSalary || 1000000
    const gap = Math.max(0, target - current)
    const percentage = current >= target ? 100 : Math.round((current / target) * 100)
    
    // 根据技能和成就计算完成的目标数
    const skillsCount = (userData.skills || []).length
    const achievementsCount = (userData.achievements || []).length
    const completed = Math.min(10, skillsCount + achievementsCount)
    
    return {
      percentage,
      gap,
      completed
    }
  },

  // 加载今日任务
  loadTodayTasks: function() {
    const tasks = wx.getStorageSync('todayTasks') || []
    const today = new Date().toDateString()
    
    // 过滤出今天的任务
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.date).toDateString()
      return taskDate === today
    })
    
    this.setData({ todayTasks })
  },

  // 生成励志语录
  generateMotivationQuote: function() {
    const quotes = [
      { text: '成功不是终点，失败不是末日，继续前进的勇气才最可贵。', author: '温斯顿·丘吉尔' },
      { text: '不要等待机会，而要创造机会。', author: '拿破仑' },
      { text: '成功的秘诀在于坚持自己的目标和信念。', author: '迪斯雷利' },
      { text: '只有不断学习，才能不断进步。', author: '毛泽东' },
      { text: '机会总是垂青有准备的头脑。', author: '路易·巴斯德' },
      { text: '成功是99%的汗水加上1%的灵感。', author: '爱迪生' },
      { text: '天才就是无止境刻苦勤奋的能力。', author: '卡莱尔' },
      { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈' }
    ]
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    this.setData({
      motivationQuote: randomQuote.text,
      quoteAuthor: randomQuote.author
    })
  },

  // 刷新数据
  refreshData: function() {
    this.loadUserData()
    this.loadTodayTasks()
  },

  // 格式化薪资显示
  formatSalary: function(salary) {
    if (!salary) return '0'
    
    if (salary >= 10000) {
      return (salary / 10000).toFixed(1) + '万'
    }
    return salary.toLocaleString()
  },

  // 切换任务状态
  toggleTask: function(e) {
    const taskId = e.currentTarget.dataset.id
    const tasks = this.data.todayTasks.map(task => {
      if (task.id === taskId) {
        task.completed = !task.completed
      }
      return task
    })
    
    this.setData({ todayTasks: tasks })
    
    // 保存到本地存储
    wx.setStorageSync('todayTasks', tasks)
    
    // 显示完成提示
    if (tasks.find(t => t.id === taskId).completed) {
      wx.showToast({
        title: '任务完成！',
        icon: 'success'
      })
    }
  },

  // 更新薪资
  updateSalary: function() {
    wx.showModal({
      title: '更新薪资',
      content: '请输入您的当前年薪（万元）',
      editable: true,
      placeholderText: this.data.userData.currentSalary / 10000 || '0',
      success: (res) => {
        if (res.confirm && res.content) {
          const salary = parseFloat(res.content) * 10000
          if (salary > 0) {
            const userData = { ...this.data.userData, currentSalary: salary }
            wx.setStorageSync('userData', userData)
            app.globalData.userData = userData
            this.loadUserData()
            
            wx.showToast({
              title: '更新成功',
              icon: 'success'
            })
          }
        }
      }
    })
  },

  // 添加技能
  addSkill: function() {
    wx.navigateTo({
      url: '/pages/plan/plan?tab=skills'
    })
  },

  // 查看详细进度
  viewProgress: function() {
    wx.switchTab({
      url: '/pages/progress/progress'
    })
  },

  // 分享进度
  shareProgress: function() {
    const { progressPercentage, userData } = this.data
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 去制定计划
  goToPlan: function() {
    wx.switchTab({
      url: '/pages/plan/plan'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 分享给朋友
  onShareAppMessage: function() {
    const { progressPercentage } = this.data
    return {
      title: `我的年薪百万进度已达${progressPercentage}%，一起来规划职业发展吧！`,
      path: '/pages/home/home',
      imageUrl: '/images/share-image.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    const { progressPercentage } = this.data
    return {
      title: `年薪百万进度${progressPercentage}%，持续努力中！`,
      imageUrl: '/images/share-image.png'
    }
  }
})