// {
//   package: '需要使用的依赖包',
//   jsUrls: [
//     {
//       name: 'externals的名称',
//       alias: 'externals的别名',
//       devUrl: '开发环境下需要的引入的js路径',
//       prodUrl: '生产环境下需要引入的js路径'
//     }
//   ],
//   cssUrls: [
//     'css的路径'
//   ]
// }
module.exports = [
  {
    package: 'vue',
    jsUrls: [
      {
        name: 'vue',
        alias: 'Vue',
        devUrl: '/vue/dist/vue.global.js',
        prodUrl: '/vue/dist/vue.global.prod.js',
      },
    ],
  },
  {
    package: 'dayjs',
    jsUrls: [
      {
        name: 'dayjs',
        alias: 'dayjs',
        devUrl: '/dayjs/dayjs.min.js',
        prodUrl: '/dayjs/dayjs.min.js',
      },
      {
        name: 'dayjs/locale/zh-cn',
        alias: '\'zhCn\'',
        devUrl: '/dayjs/locale/zh-cn.js',
        prodUrl: '/dayjs/locale/zh-cn.js',
      },
    ],
  },
  {
    package: 'ant-design-vue',
    jsUrls: [
      {
        name: 'ant-design-vue',
        alias: 'antd',
        devUrl: '/ant-design-vue/dist/antd.min.js',
        prodUrl: '/ant-design-vue/dist/antd.min.js',
      },
    ],
    cssUrls: [
      '/ant-design-vue/dist/antd.min.css',
    ],
  },
  {
    package: 'vue-router',
    jsUrls: [
      {
        name: 'vue-router',
        alias: 'VueRouter',
        devUrl: '/vue-router/dist/vue-router.global.js',
        prodUrl: '/vue-router/dist/vue-router.global.prod.js',
      },
    ],
  },
  {
    package: 'lodash',
    jsUrls: [
      {
        name: 'lodash',
        alias: '_',
        devUrl: '/lodash/lodash.min.js',
        prodUrl: '/lodash/lodash.min.js',
      },
    ],
  },
];
