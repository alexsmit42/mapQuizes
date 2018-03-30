import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import $ from 'jquery';
import jQuery from 'jquery';
window.$ = jQuery;
window.jQuery = jQuery;

import App from './App.vue'

import CitiesQuiz from './components/CitiesQuiz.vue'
import RegionsQuiz from './components/RegionsQuiz.vue'

const routes = [
  {
    path: '/', redirect: {name: 'cities'}
  },
  {
    path: '/cities', component: CitiesQuiz, name: 'cities'
  },
  {
    path: '/regions', component: RegionsQuiz, name: 'regions'
  },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

require('./assets/jquery-jvectormap-2.0.3.min')
require('./assets/jquery-jvectormap-pl-merc')
require('./assets/jquery-jvectormap-2.0.3.css')

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})