import PaginationComponent from './index.vue'

const Pagination = {
  install: function(Vue) {
    Vue.Component('Pagination', PaginationComponent)
  }
}

export default Pagination
