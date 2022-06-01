const backendServer = 'http://localhost:8002';

module.exports = {
  base: '/',
  webpackBase: '/jygl/',
  backendServer,
  devServerPort: 8102,
  devServerProxy: {
    '/apijygl': {
      target: backendServer,
      changeOrigin: true,
    },
    '/jygl': {
      target: backendServer,
      changeOrigin: true,
    },
    '/template': {
      target: backendServer,
      changeOrigin: true,
    },
    '/report': {
      target: backendServer,
      changeOrigin: true,
    },
  },
  templatePath: 'build/vite/index.html',
  pagePath: 'src/pages',
};
