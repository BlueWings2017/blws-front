
import Vue from 'vue';
import VueSession from 'vue-session'

var sessionOptions = {
    persist: false
}
export default ({ $session, res }) => {
};

Vue.use(VueSession, sessionOptions)
