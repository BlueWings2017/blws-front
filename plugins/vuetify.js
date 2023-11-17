import colors from "vuetify/es5/util/colors";
import Depth3rdBulletDark from "~/components/icons/Depth3rdBulletDark";
import icoDarkDashCharge from "~/components/icons/icoDarkDashCharge";
import icoDarkDashChargeWidget from "~/components/icons/icoDarkDashChargeWidget";
import icoDarkDashPeak from "~/components/icons/icoDarkDashPeak";
import icoDarkDashPeakWidget from "~/components/icons/icoDarkDashPeakWidget";
import icoCalendar from "~/components/icons/icoCalendar";
import icoAdminMenu from "~/components/icons/icoAdminMenu";

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "#196dcb",
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      },
      light: {
        primary: "#4777d9"
      }
    }
  },
  icons: {
    iconfont: 'md', // default - only for display purposes
    values: {
      depth3rdBulletDark: {
        component: Depth3rdBulletDark
      },
      darkDashCharge: {
        component: icoDarkDashCharge
      },
      darkDashPeak: {
        component: icoDarkDashPeak
      },
      icoCalendar: {
        component: icoCalendar
      },
      icoAdminMenu: {
        component: icoAdminMenu
      },
      darkDashPeakWidget: {
        component: icoDarkDashPeakWidget
      },
      darkDashChargeWidget: {
        component: icoDarkDashChargeWidget
      },
    }
  }
});
