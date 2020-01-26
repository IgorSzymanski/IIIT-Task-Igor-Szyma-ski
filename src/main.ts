import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCompositionApi from '@vue/composition-api'
import Buefy from 'buefy'
import { parseDate } from '@/components/scheduler/utility'

Vue.use(VueCompositionApi)
Vue.use(Buefy, {
	defaultDateParser: parseDate,
	defaultFirstDayOfWeek: 1,
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
