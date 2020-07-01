
export default {
  srcDir: './',
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  manifest: {
    name: 'Sendsay Console',
    short_name: 'Sendsay',
    description: 'Sendsay Console',
    theme_color: '#fff',
    start_url: '/auth'
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/stylesheets/libs/animate.css',
    '@/assets/stylesheets/libs/bootstrap-grid.min.css',
    '@/assets/stylesheets/libs/bootstrap-reboot.min.css',
    '@/assets/stylesheets/app.sass'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '@/plugins/vuex-persist', ssr: false },
    '@/plugins/fullscreen',
    '@/plugins/clipboard'
  ],
  /*
  ** Auto import pages
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/vuetify', {
      theme: {
        options: {
          customProperties: true
        },
        themes: {
          dark: {
            primary: '#ee44aa',
            secondary: '#424242',
            accent: '#82b1ff',
            error: '#ff5252',
            info: '#2196f3',
            success: '#4caf50',
            warning: '#ffc107'
          }
        }
      },
      icons: {
        iconfont: 'mdi'
      }
    }]
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    babel: {
      presets({ isServer }) {
        return [
          [ '@nuxt/babel-preset-app', { loose: true } ]
        ]
      }
    },

    extend: (config) => {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      });
    }
  }
}
