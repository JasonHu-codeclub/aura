# vue-element-template

1. 别名设置
   项目已经设置别名
   - @:代表'src'
   - @styles:代表'src/styles'
   - ...如上
2. 封装 axios,文件 utils/request.js
   请求拦截,响应拦截.集中处理业务
3. 设置多环境
   无需设置.env文件
   - 开发环境切换请求url,只需修改vue.config.js文件中target
   - 生产环境会根据打包所在的域名自动补全,如需要特别指定,到.env.production中修改
4. js-cookie
   处理用户token的增删改
5. nprogress 网页加载进度
6. 侧边栏配置
   ```
   // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面
   hidden: true // (默认 false)
   //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
   redirect: 'noRedirect'
   // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
   // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
   // 若你想不管路由下面的 children 声明的个数都显示你的根路由
   // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由  
   alwaysShow: true
   name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
   meta: {
   role: 'admin' // 设置该路由的标识名,和后端对应传来的标识进行辨别权限
   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
   icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
   affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)
   // 当路由设置了该属性，则会高亮相对应的侧边栏。
   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
   activeMenu: '/article/list'
   ```
7. 页码组件pagination
   只需传入limt(每页数),page(当前页),total(总数),change(变化回调方法)