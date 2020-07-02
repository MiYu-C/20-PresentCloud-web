import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/web/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/web/routes/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/web/routes/404'], resolve),
    hidden: true
  },
  {
    path: '/403',
    component: (resolve) => require(['@/web/routes/403'], resolve),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/web/routes/500'),
    hidden: true
  },

  {
    path: '/def',
    component: () => import('@/web/routes/def'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/web/routes/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/web/routes/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: '标准界面',
    meta: { title: '标准界面', icon: 'example' },
    children: [
      {
        path: 'table',
        name: '表格',
        component: () => import('@/web/routes/table/index'),
        meta: { title: '表格', icon: 'table' }
      },
      {
        path: 'list',
        name: '列表',
        component: () => import('@/web/routes/list/index'),
        meta: { title: '列表', icon: 'list' }
      },
      {
        path: 'form',
        name: '编辑',
        component: () => import('@/web/routes/form/index'),
        meta: { title: '编辑', icon: 'form' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/student',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'center',
        component: () => import('@/web/routes/user/center/index'),
        hidden: true,
        name: '个人中心',
        meta: { title: '个人中心' }
      },
      {
        path: 'manager',
        name: '用户管理',
        component: () => import('@/web/routes/user/manager/index'),
        meta: { title: '用户管理', icon: 'form' }
      },
      {
        path: 'teacher',
        name: '用户管理改',
        component: () => import('@/web/routes/user/teacher/index'),
        meta: { title: '用户管理改', icon: 'form' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/roleList',
    name: '角色管理',
    meta: { title: '角色管理', icon: 'role' },
    children: [
      {
        path: 'roleList',
        name: '角色管理',
        component: () => import('@/web/routes/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/dictionary',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'monitor' },
    children: [
      {
        path: 'dictionary',
        name: '数据字典',
        component: () => import('@/web/routes/system/dictionary/index'),
        meta: { title: '数据字典', icon: 'documentation' }
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/web/routes/system/menu/index'),
        meta: { title: '菜单管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    redirect: '/school/schoolList',
    name: '学校管理',
    meta: { title: '学校管理', icon: 'education' },
    children: [
      {
        path: 'schoolList',
        name: '院校管理',
        component: () => import('@/web/routes/school/school/index'),
        meta: { title: '院校管理', icon: 'school1' }
      },
      {
        path: 'study',
        name: '学习行为管理',
        component: () => import('@/web/routes/school/study/index'),
        meta: { title: '学习行为管理', icon: 'behavior' }
      },
      {
        path: 'subject',
        name: '课程管理',
        component: () => import('@/web/routes/school/subject/index'),
        meta: { title: '课程管理', icon: 'behavior' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
