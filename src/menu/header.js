// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '主控功能',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '传感图表' },
      { path: '/page2', title: '视频展示' },
      { title: '地图展示',
        icon: 'folder-o',
        children: [
          { path: '/page-leaflet', title: '历史轨迹' },
          { path: '/page-map', title: '实时轨迹' }
        ]
      },
      { path: '/page-ssh', title: 'WEB SSH' }
    ]
  }
]
