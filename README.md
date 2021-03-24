# 基础规范

### 1.  规范目的

统一编码风格，命名规范，注释要求，在团队写作中输出可读性强，易维护，风格一致的代码。



### 2. 目录/文件规范

`Vue项目(vue-cli 3.x以上，vue 2.x)`

❗❗❗每个项目下的readme.md，必须在里面做好说明，各个文件夹/文件的功能以及使用，注意每次在新建或者更新当前的目录时，需要做好批注。

一、目录

1. store >Vuex全局状态树配置
2. router >Vue-router路由配置
3. views >主路由页面组件，注意命名规范
4. components >基础组件，注意复用拓展性，注意命名规范
5. api >axios相关全局请求配置
6. assets >资源文件夹（font,image...）
7. plugin >第三方插件文件夹(elementUI...)
8. styles >全局公共样式文件夹，全局变量，函数，公共类
9. utils >工具函数文件夹
10. I18n >国际化配置文件夹



二、使用规范

1. Vuex使用规范

   - 单/多模块状态树的配置
   - 结合使用this.$store选择和使用

2. router使用规范

   - 路由名称的可读性和注释
   - 注意懒加载
   - 全局/局部路由钩子拦截处理逻辑

3. views使用规范

   - 对于样式，必须处于scoped 私有域开发，有需要修改第三方样式使用/deep/，不能影响全局样式。
   - css预处理器选择less

4. component使用规范

   - css预处理器选择less

   - 要保证组件耦合度低，独立性好，复用性高。

   - 子组件或者tab组件文件夹children

   - 静态资源文件夹 resources，文件目录基本如下

     |—  dicName

     ​	|— resources

     ​	|— children

     ​	|— index.vue

5. api使用规范

   - 统一采用axios方式
   - 和后端统一返回码，快速定位问题
   - 请求拦截，响应拦截
   - GET,POST,PUT,DELETE请求规范

6. utils使用规范

   - 以用途定义文件名(request.js,tool.js....)
   - 方法要合理定义参数和返回值，便于复用

### 3. 命名规范

1. 组件命名

   组件命名为多个单词组成。

   `views`组件使用小写，不同单词间使用“-”隔开；

   `components`组件使用大驼峰命名。

   - 基础组件

     通用展示类的，统一以App为前缀，例：AppButton

   - 单例组件

     只针对于特定的某个页面，以The为前缀，后加特定页面名，例：TheHomeHeader

   - 组件单词顺序

     ❗按照 “功能控件名”+“业务名”，例：SearchButtonHeader,SearchButtonSider，便于在组织目录中区分和维护。

2. 函数命名

   `Vue项目`

   - data/computed

     一致采用 “业务名”+“功能后缀”。

     列表/表格/树形数据，以List结尾，例：userList,reportList;
       选择器/级联数据，以options结尾，例：typeOptions;

   - method

     以动词命名开头

     | can | 判断是否可以执行动作 |
     | --- | -------------------- |
     | has | 判断是否存在某个值   |
     | is  | 判断是否为某个值     |
     | get | 获取值               |
     | set | 设置值               |
     | del | 删除                 |

     例：getUserList,setName

   - api函数命名

     遵从常用的几种请求方式命名(GET,POST,PUT,DELETE)

     函数请求也以此开头，方式+业务名+Api,例：getUserApi，putNameApi

     

# 本项目备注

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