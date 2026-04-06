import React from 'react'
import { Search, Filter, X, Calendar } from 'lucide-react'
import { useFinanceStore } from '../store/financeStore'
import { categories } from '../data/mockData'

export const Filters = () => {
  const { 
    searchQuery, setSearchQuery, typeFilter, setTypeFilter, 
    categoryFilter, setCategoryFilter, sortBy, setSortBy, 
    dateRange, setDateRange, isAdvancedFiltersOpen, toggleAdvancedFilters 
  } = useFinanceStore()

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setSortBy('date-desc')
    setDateRange('', '')
  }

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || dateRange.start || dateRange.end

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
        
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="date-desc">📅 Newest First</option>
          <option value="date-asc">📅 Oldest First</option>
          <option value="amount-desc">💰 Amount: High-Low</option>
          <option value="amount-asc">💰 Amount: Low-High</option>
          <option value="category-asc">📁 Category A-Z</option>
        </select>
        
        <button 
          onClick={toggleAdvancedFilters} 
          className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 ${isAdvancedFiltersOpen ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 text-indigo-600' : 'bg-white dark:bg-slate-800'}`}
        >
          <Filter size={16} /> Advanced
        </button>
        
        {hasActiveFilters && (
          <button onClick={clearFilters} className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 text-sm">
            <X size={14} /> Clear
          </button>
        )}
      </div>
      
      {isAdvancedFiltersOpen && (
        <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl animate-slide-down">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar size={16} className="text-gray-400" />
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={(e) => setDateRange(e.target.value, dateRange.end)} 
              className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm" 
              placeholder="Start date" 
            />
            <span className="text-gray-400">—</span>
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={(e) => setDateRange(dateRange.start, e.target.value)} 
              className="px-3 py-2 rounded-xl border dark:bg-slate-800 text-sm" 
              placeholder="End date" 
            />
          </div>
        </div>
      )}
    </div>
  )
}