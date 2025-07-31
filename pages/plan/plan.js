// 规划页面逻辑
const app = getApp()

Page({
  data: {
    activeTab: 'career',
    userData: {},
    careerGoals: [],
    careerPath: [],
    userSkills: [],
    recommendedSkills: [],
    currentMonth: '',
    calendarDays: [],
    learningStats: {
      totalHours: 0,
      completedCourses: 0,
      currentStreak: 0
    },
    weeklyHours: [],
    recommendedResources: []
  },

  onLoad: function (options) {
    console.log('规划页面加载')
    
    // 如果有传入的tab参数，设置对应的tab
    if (options.tab) {
      this.setData({ activeTab: options.tab })
    }
    
    this.initPage()
  },

  onShow: function () {
    this.loadUserData()
  },

  // 初始化页面
  initPage: function() {
    this.loadUserData()
    this.initCareerData()
    this.initSkillsData()
    this.initLearningData()
  },

  // 加载用户数据
  loadUserData: function() {
    const userData = app.globalData.userData || wx.getStorageSync('userData')
    this.setData({ userData })
  },

  // 初始化职业规划数据
  initCareerData: function() {
    // 模拟职业目标数据
    const careerGoals = [
      {
        id: 1,
        title: '获得高级工程师职位',
        description: '在当前公司或跳槽到更好的公司，获得高级工程师职位',
        deadline: '2024年底',
        progress: 65,
        completed: false
      },
      {
        id: 2,
        title: '年薪达到50万',
        description: '通过技能提升和职位晋升，实现年薪50万的目标',
        deadline: '2025年中',
        progress: 30,
        completed: false
      },
      {
        id: 3,
        title: '成为技术团队负责人',
        description: '带领5-10人的技术团队，负责核心项目开发',
        deadline: '2026年',
        progress: 15,
        completed: false
      }
    ]

    // 职业发展路径
    const careerPath = [
      {
        id: 1,
        title: '初级开发工程师',
        salary: 200000,
        timeframe: '1-2年',
        completed: true,
        current: false
      },
      {
        id: 2,
        title: '中级开发工程师',
        salary: 350000,
        timeframe: '2-3年',
        completed: false,
        current: true
      },
      {
        id: 3,
        title: '高级开发工程师',
        salary: 500000,
        timeframe: '1-2年',
        completed: false,
        current: false
      },
      {
        id: 4,
        title: '技术专家/Team Lead',
        salary: 800000,
        timeframe: '2-3年',
        completed: false,
        current: false
      },
      {
        id: 5,
        title: '技术总监',
        salary: 1000000,
        timeframe: '3-5年',
        completed: false,
        current: false
      }
    ]

    this.setData({ careerGoals, careerPath })
  },

  // 初始化技能数据
  initSkillsData: function() {
    // 用户当前技能
    const userSkills = [
      { id: 1, name: 'JavaScript', level: 4, category: '前端开发' },
      { id: 2, name: 'React', level: 3, category: '前端框架' },
      { id: 3, name: 'Node.js', level: 3, category: '后端开发' },
      { id: 4, name: 'Python', level: 2, category: '编程语言' },
      { id: 5, name: '项目管理', level: 2, category: '软技能' },
      { id: 6, name: 'SQL', level: 3, category: '数据库' }
    ]

    // 推荐学习技能
    const recommendedSkills = [
      {
        id: 1,
        name: 'TypeScript',
        reason: '提升代码质量和开发效率',
        salaryIncrease: 15,
        category: '编程语言'
      },
      {
        id: 2,
        name: 'Docker',
        reason: '容器化部署，提升运维能力',
        salaryIncrease: 20,
        category: '运维工具'
      },
      {
        id: 3,
        name: '架构设计',
        reason: '系统架构能力是高级工程师必备',
        salaryIncrease: 30,
        category: '架构能力'
      },
      {
        id: 4,
        name: 'AWS/云计算',
        reason: '云原生开发是未来趋势',
        salaryIncrease: 25,
        category: '云计算'
      }
    ]

    this.setData({ userSkills, recommendedSkills })
  },

  // 初始化学习数据
  initLearningData: function() {
    const now = new Date()
    const currentMonth = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    
    // 生成日历数据
    const calendarDays = this.generateCalendarDays(now)
    
    // 学习统计数据
    const learningStats = {
      totalHours: 156,
      completedCourses: 8,
      currentStreak: 12
    }

    // 每周学习时长数据
    const weeklyHours = [
      { week: 1, hours: 15, percentage: 75 },
      { week: 2, hours: 18, percentage: 90 },
      { week: 3, hours: 12, percentage: 60 },
      { week: 4, hours: 20, percentage: 100 }
    ]

    // 推荐学习资源
    const recommendedResources = [
      {
        id: 1,
        title: 'TypeScript 完整教程',
        description: '从基础到高级，全面掌握TypeScript',
        type: '视频课程',
        duration: '12小时',
        rating: 4.8,
        icon: '/images/typescript-icon.png',
        url: 'https://example.com/typescript-course'
      },
      {
        id: 2,
        title: '系统设计面试指南',
        description: '大厂系统设计面试必备知识',
        type: '电子书',
        duration: '300页',
        rating: 4.9,
        icon: '/images/system-design-icon.png',
        url: 'https://example.com/system-design-book'
      },
      {
        id: 3,
        title: 'Docker实战教程',
        description: '容器化技术从入门到精通',
        type: '实战项目',
        duration: '8小时',
        rating: 4.7,
        icon: '/images/docker-icon.png',
        url: 'https://example.com/docker-course'
      }
    ]

    this.setData({
      currentMonth,
      calendarDays,
      learningStats,
      weeklyHours,
      recommendedResources
    })
  },

  // 生成日历数据
  generateCalendarDays: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    for (let i = 1; i <= daysInMonth; i++) {
      // 模拟一些学习任务
      const tasks = []
      if (i % 3 === 0) {
        tasks.push({ id: 1, title: '学习TypeScript' })
      }
      if (i % 5 === 0) {
        tasks.push({ id: 2, title: '练习算法' })
      }

      days.push({
        date: `${year}-${month + 1}-${i}`,
        day: i,
        tasks: tasks
      })
    }

    return days
  },

  // 切换Tab
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  // 编辑当前状态
  editCurrentStatus: function() {
    wx.showModal({
      title: '编辑当前状态',
      content: '请在个人中心页面完善您的基本信息',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/profile/profile'
          })
        }
      }
    })
  },

  // 编辑目标
  editTargetGoals: function() {
    wx.showActionSheet({
      itemList: ['添加新目标', '编辑现有目标', '删除目标'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.addCareerGoal()
            break
          case 1:
            this.editCareerGoal()
            break
          case 2:
            this.deleteCareerGoal()
            break
        }
      }
    })
  },

  // 添加职业目标
  addCareerGoal: function() {
    wx.navigateTo({
      url: '/pages/goal-editor/goal-editor?type=add'
    })
  },

  // 编辑职业目标
  editCareerGoal: function() {
    wx.showModal({
      title: '提示',
      content: '请选择要编辑的目标',
      showCancel: false
    })
  },

  // 删除职业目标
  deleteCareerGoal: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除选中的目标吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 添加技能
  addSkill: function() {
    wx.showModal({
      title: '添加技能',
      content: '请输入技能名称',
      editable: true,
      placeholderText: '如：Python、项目管理等',
      success: (res) => {
        if (res.confirm && res.content) {
          const newSkill = {
            id: Date.now(),
            name: res.content,
            level: 1,
            category: '其他'
          }
          
          const userSkills = [...this.data.userSkills, newSkill]
          this.setData({ userSkills })
          
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 开始学习技能
  startLearning: function(e) {
    const skill = e.currentTarget.dataset.skill
    wx.showModal({
      title: '开始学习',
      content: `确定要开始学习"${skill.name}"吗？我们将为您制定学习计划。`,
      success: (res) => {
        if (res.confirm) {
          // 添加到学习计划
          wx.showToast({
            title: '已添加到学习计划',
            icon: 'success'
          })
          
          // 切换到学习计划tab
          this.setData({ activeTab: 'learning' })
        }
      }
    })
  },

  // 制定学习计划
  createLearningPlan: function() {
    wx.navigateTo({
      url: '/pages/learning-plan/learning-plan'
    })
  },

  // 打开学习资源
  openResource: function(e) {
    const url = e.currentTarget.dataset.url
    wx.showModal({
      title: '打开资源',
      content: '将跳转到外部链接查看学习资源',
      success: (res) => {
        if (res.confirm) {
          // 在实际应用中，这里可以打开web-view或复制链接
          wx.setClipboardData({
            data: url,
            success: () => {
              wx.showToast({
                title: '链接已复制',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  // 快速规划
  quickAction: function() {
    wx.showActionSheet({
      itemList: ['AI智能规划', '导入简历', '行业分析', '薪资对比'],
      success: (res) => {
        const actions = ['AI智能规划', '导入简历', '行业分析', '薪资对比']
        wx.showToast({
          title: `${actions[res.tapIndex]}功能开发中`,
          icon: 'none'
        })
      }
    })
  },

  // 格式化薪资显示
  formatSalary: function(salary) {
    if (salary >= 10000) {
      return (salary / 10000).toFixed(1) + '万'
    }
    return salary.toLocaleString()
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '我正在使用年薪百万小程序规划职业发展',
      path: '/pages/plan/plan',
      imageUrl: '/images/share-plan.png'
    }
  }
})