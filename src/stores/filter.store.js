import { defineStore } from 'pinia'

const DEFAULT_FILTER = () => ({
  title: null,
  filters: [],
  year: null,
  range: [],
  currentPage: 1,
  perPage: 5,
  order: 'DESC',
})

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filter: DEFAULT_FILTER(),
    jurisprudences: [],
    legislations: [],
  }),

  getters: {
    getFilter:          (s) => s.filter,
    getJurisprudences:  (s) => s.jurisprudences,
    getLegislations:    (s) => s.legislations,
    currentPage:        (s) => s.filter.currentPage,
  },

  actions: {
    setFilter(patch) {
      this.filter = { ...this.filter, ...patch }
    },
    resetFilter() {
      this.filter = DEFAULT_FILTER()
    },
    setPage(page) {
      this.filter.currentPage = page
    },
    setJurisprudences(data) {
      this.jurisprudences = data
    },
    setLegislations(data) {
      this.legislations = data
    },
    clear() {
      this.filter = DEFAULT_FILTER()
      this.jurisprudences = []
      this.legislations = []
    },
  },
})
