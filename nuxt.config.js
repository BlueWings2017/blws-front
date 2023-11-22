require("dotenv").config();

module.exports = {
  ssr: false,
  head: {
    titleTemplate: "%s",
    title: "MES",
    htmlAttrs: {
      lang: "ko",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      { type: "text/javascript", src: "/jquery-1.12.3.min.js" },
      { type: "text/javascript", src: "/kendo.all.min.js" },
    ],
  },
  env: {
    ENV: process.env.ENV,
    BASE_URL: process.env.BASE_URL,
  },
  css: ["~assets/css/SpoqaHanSansNeo.css"],

  plugins: [
    "~/plugins/axios",
    "~/plugins/routerTab",
    "~/plugins/session",
    "~/plugins/auth",
  ],
  router: {
    middleware: ["middleRouter", "auth"],
    // middleware: ["middleRouter"],
    extendRoutes(routes, resolve) {
      routes.push({
        name: "iframe",
        path: "/iframe/:src/:title?/:icon?",
        component: resolve(__dirname, "pages/-Iframe.js"),
        props: true,
      });
    },
  },

  components: false,

  buildModules: ["@nuxtjs/vuetify", "@nuxt/postcss8"],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dayjs",
    "@nuxtjs/style-resources",
    "@nuxtjs/i18n",
    "@nuxtjs/auth-next",
  ],

  // auth: {
  //   strategies: {
  //     local: {
  //       token: {
  //         required: false,
  //         type: false,
  //         global: true
  //       },
  //       endpoints: {
  //         login: { url: '/api/signin', method: 'post' },
  //         user: { url: '​/api​/common​/user​/info', method: 'get' },
  //         logout: { url: '/api/common/auth/logout', method: 'get' }
  //       },
  //     },
  //   },
  // },

  // auth: {
  //   strategies: {
  //     local: {
  //       token: {
  //         required: false,
  //         type: false
  //       },
  //       endpoints: {
  //         login: {url: '/api/signin', method: 'post' },
  //         logout: false,
  //         user: false
  //       },
  //     },
  //   },
  // },

  auth: {
    redirect: {
      login: "/login",
      logout: "/",
      callback: "/login",
      home: "/",
    },
    strategies: {
      local: {
        // scheme: 'refresh',
        token: {
          property: "accessToken",
          maxAge: 60 * 60 * 24 * 30 * 365,
          // global: true,
          // required: true,
          required: false,
        },
        refreshToken: {
          // property: 'refreshToken',
          // data: 'refreshToken',
          // maxAge: 60 * 60 * 24 * 30
          required: false,
        },
        // user: {
        // property: 'user',
        //  autoFetch: true
        // },
        endpoints: {
          login: { url: "/api/common/auth/signin", method: "post" },
          // login: { url: '/api/signin', method: 'post' },
          refresh: false,
          user: false,
          logout: { url: "/api/common/auth/signout", method: "get" },
        },
        // autoLogout: false
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },

  styleResources: {
    scss: [
      "~assets/scss/common.scss",
      "./assets/scss/*.scss",
      "~assets/scss/new_common.scss",
    ],
  },
  proxy: {
    "/api/": {
      target: process.env.BASE_URL,
      // target: 'http://210.179.106.123:8080',
      //target: "http://58.121.116.161:8088/",
      // target: 'http://192.168.1.143:8080/',
      // target: 'http://192.168.0.194:8080/',
      // target: 'http://172.20.10.10:8080/',
      changeOrigin: true,
    },
  },
  axios: {
    proxy: true,
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true;
    },
    headers: {
      common: {
        "X-Requested-With": "XMLHttpRequest",
      },
    },
  },

  dayjs: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    defaultTimeZone: "Asia/Seoul",
    plugins: ["utc", "timezone"],
  },

  i18n: {
    locales: [
      { code: "ko", name: "Korean", iso: "ko-KR", file: "ko/ko.js" },
      { code: "en", name: "English", iso: "en-US", file: "en/en.js" },
    ],
    defaultLocale: "ko",
    langDir: "locales/",
    strategy: "no_prefix",
    vueI18n: {
      fallbackLocale: "ko",
    },
    lazy: false,
    vueI18nLoader: true,
    vuex: false,
  },

  vuetify: {
    lang: {
      locales: ["ko", "en"],
      current: "ko",
    },
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    optionsPath: "~/plugins/vuetify.js",
  },

  build: {
    transpile: [/echarts/, /zrender/, /vue-router-tab/],
    styleResources: {
      scss: "./assets/scss/**/*.scss",
    },
    publicPath: "/_nuxt/",
    parallel: true,
    cache: true,
  },
  env: {},
  server: {
    host: "0.0.0.0",
  },
};
