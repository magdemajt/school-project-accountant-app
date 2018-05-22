import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/change',
      name: 'add-or-edit',
      component: require('@/components/NewInput').default
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/MainBalance').default
    }
  ]
})
