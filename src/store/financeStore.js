import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockData'

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      isLoading: false,
      role: 'admin',
      searchQuery: '',
      typeFilter: 'all',
      categoryFilter: 'all',
      dateRange: { start: '', end: '' },
      sortBy: 'date-desc',
      isDarkMode: false,
      isAdvancedFiltersOpen: false,

      setRole: (role) => set({ role }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTypeFilter: (filter) => set({ typeFilter: filter }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setDateRange: (start, end) => set({ dateRange: { start, end } }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleAdvancedFilters: () => set((state) => ({ isAdvancedFiltersOpen: !state.isAdvancedFiltersOpen })),

      addTransaction: (transaction) => {
        const { role, transactions } = get()
        if (role !== 'admin') return false
        const newTransaction = { 
          ...transaction, 
          id: Date.now().toString(),
          date: transaction.date || new Date().toISOString().split('T')[0]
        }
        set({ transactions: [newTransaction, ...transactions] })
        return true
      },

      editTransaction: (id, updates) => {
        const { role, transactions } = get()
        if (role !== 'admin') return false
        set({ transactions: transactions.map(tx => tx.id === id ? { ...tx, ...updates } : tx) })
        return true
      },

      deleteTransaction: (id) => {
        const { role, transactions } = get()
        if (role !== 'admin') return false
        set({ transactions: transactions.filter(tx => tx.id !== id) })
        return true
      },

      resetData: () => {
        const { role } = get()
        if (role !== 'admin') return false
        set({ transactions: [...mockTransactions] })
        return true
      },
    }),
    { 
      name: 'finance-dashboard-storage',
      partialize: (state) => ({ 
        transactions: state.transactions, 
        isDarkMode: state.isDarkMode 
      })
    }
  )
)