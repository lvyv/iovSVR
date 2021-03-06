// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'index',
        name: 'index',
        meta: { meta, title: '易通星云' },
        component: () => import('@/pages/index')
      },
      {
        path: '/page-dev-realtime',
        name: 'page-dev-realtime',
        component: () => import('@/pages/page-dev-realtime'),
        meta: { meta, title: '传感器实时数据' }
      },
      {
        path: '/page-dev-history',
        name: 'page-dev-history',
        component: () => import('@/pages/page-dev-history'),
        meta: { meta, title: '传感器历史数据' }
      },
      {
        path: '/page-video',
        name: 'page-video',
        component: () => import('@/pages/page-video'),
        meta: { meta, title: '视频展示' }
      },
      {
        path: '/page-ssh',
        name: 'page-ssh',
        component: () => import('@/pages/page-ssh'),
        meta: { meta, title: 'WEB SSH' }
      },
      {
        path: '/page-map',
        name: 'page-map',
        component: () => import('@/pages/page-map'),
        meta: { meta, title: '历史轨迹' }
      },
      {
        path: '/page-leaflet',
        name: 'page-leaflet',
        component: () => import('@/pages/page-leaflet'),
        meta: { meta, title: '实时轨迹' }
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登陆
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
