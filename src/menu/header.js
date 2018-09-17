// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '主控功能',
    icon: 'folder-o',
    children: [
      { title: '传感视图',
        icon: 'folder-o',
        children: [
          { path: '/page-dev-realtime', title: '传感器实时数据' },
          { path: '/page-dev-history', title: '传感器历史数据' }
        ]
      },
      { path: '/page-video', title: '视频展示' },
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
