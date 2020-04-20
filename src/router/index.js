import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/web/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/web/routes/login/index'),
    hidden: true
  },

  {
    path: '/findPwd',
    component: () => import('@/web/routes/login/findPwd/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/web/routes/404'),
    hidden: true
  },

  {
    path: '/403',
    component: () => import('@/web/routes/403'),
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'DashboardAdmin',
      component: () => import('@/web/routes/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: '标准界面',
    meta: { title: '标准界面', icon: 'example' },
    children: [
      // {
      //   path: 'table',
      //   name: '表格',
      //   component: () => import('@/web/routes/table/index'),
      //   meta: { title: '表格', icon: 'table' }
      // },
      {
        path: 'list',
        name: '列表',
        component: () => import('@/web/routes/list/index'),
        meta: { title: '列表', icon: 'list' }
      },
      /* {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/web/routes/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }, */
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
        path: 'student',
        name: '学生管理',
        component: () => import('@/web/routes/user/student/index'),
        meta: { title: '学生管理', icon: 'peoples' }
      },
      {
        path: 'teacher',
        name: '教师管理',
        component: () => import('@/web/routes/user/teacher/index'),
        meta: { title: '教师管理', icon: 'peoples' }
      },
      {
        path: 'manager',
        name: '管理员',
        component: () => import('@/web/routes/user/manager/index'),
        meta: { title: '管理员', icon: 'form' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/role',
    name: '角色管理',
    meta: { title: '角色管理', icon: 'role' },
    children: [
      {
        path: 'role',
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
    redirect: '/school/school',
    name: '学校管理',
    meta: { title: '学校管理', icon: 'education' },
    children: [
      {
        path: 'school',
        name: '院校管理',
        component: () => import('@/web/routes/school/school/index'),
        meta: { title: '院校管理', icon: 'school1' }
      },
      {
        path: 'study',
        name: '学习行为管理',
        component: () => import('@/web/routes/school/study/index'),
        meta: { title: '学习行为管理', icon: 'behavior' }
      }
    ]
  },
  {
    path: '/routes',
    component: Layout,
    redirect: 'noRedirect',
    name: '异常管理',
    meta: { title: '异常管理', icon: 'error' },
    children: [
      {
        path: '404',
        name: '404异常',
        component: () => import('@/web/routes/404'),
        meta: { title: '404', icon: '404' }
      },
      {
        path: '403',
        name: '403异常',
        component: () => import('@/web/routes/403'),
        meta: { title: '403', icon: '403' }
      },
      {
        path: '500',
        name: '500异常',
        component: () => import('@/web/routes/500'),
        meta: { title: '500', icon: '500' }
      },
      {
        path: 'def1',
        name: '自定义',
        component: () => import('@/web/routes/def'),
        meta: { title: '自定义异常', icon: 'bug' }
      }
    ]
  },

  /*   {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/web/routes/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/web/routes/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/web/routes/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/web/routes/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/web/routes/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/web/routes/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/web/routes/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  }, */

  /* {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }, */

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
