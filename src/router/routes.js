const navLists = [
  {
    alias:'/',
    path:'recommend',
    name:'Recommend',
    component:()=>import('../components/Recommend'),
    meta:{isBottom:true} //显示底部导航栏
  },
   {
    path:'latte',
    name:'Latte',
    component:()=>import('../components/Latte'),
    meta:{isBottom:true} //显示底部导航栏
  },
  {
    path:'coffee',
    name:'Coffee',
    component:()=>import('../components/Coffee'),
    meta:{isBottom:true} //显示底部导航栏
  },
  {
    path:'ruinaice',
    name:'Ruinaice',
    component:()=>import('../components/Ruinaice'),
    meta:{isBottom:true} //显示底部导航栏
  },
]

export const routes = [
    {
      path: '/',
      name: 'Home',
      component:()=>import('../views/Home'),
      children:navLists,
      meta:{isBottom:true} //显示底部导航栏
    },
    {
      path:'/login',
      name:'Login',
      component:()=>import('../views/Login'),
      meta:{isBottom:false} //显示底部导航栏
    },
    {
      path:'/menu',
      name:'Menu',
      component:()=>import('../views/Menu'),
      meta:{isBottom:true} //显示底部导航栏
    },
    {
      path:'/shopbag',
      name:'Shopbag',
      component:()=>import('../views/Shopbag'),
      meta:{isBottom:true} //显示底部导航栏
    },
    {
      path:'/mine',
      name:'Mine',
      component:()=>import('../views/Mine'),
      meta:{isBottom:true} //显示底部导航栏
    },
    {
      path:'/details/:pid',
      name:'Details',
      component:()=>import('../views/Details'),
      meta:{isBottom:false} //不显示底部导航栏
    },
    {
      path:'/address',
      name:'Address',
      component:()=>import('../views/Address'),
      meta:{isBottom:false}
    },
    {
      path:'/site/:aid?',
      name:'Site',
      component:()=>import('../views/Site'),
      meta:{isBottom:false}
    },
    {
      path:'/personal',
      name:'Personal',
      component:()=>import('../views/Personal'),
      meta:{isBottom:false}
    },
    {
      path:'/mylike',
      name:'Mylike',
      component:()=>import('../views/Mylike'),
      meta:{isBottom:false}
    },
    {
      path:'/security',
      name:'Security',
      component:()=>import('../views/Security'),
      meta:{isBottom:false}
    },
    {
      path:'/myorder',
      name:'MyOrder',
      component:()=>import('../views/MyOrder'),
      meta:{isBottom:false}
    },
    {
      path:'/pay',
      name:'Pay',
      component:()=>import('../views/Pay'),
      meta:{isBottom:false}
    },
    {
      path:'/findpass',
      name:'Findpass',
      component:()=>import('../views/Find'),
      meta:{isBottom:false}
    }
]