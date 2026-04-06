import React, { useEffect, useState } from 'react'
import { useFinanceStore } from './store/financeStore'
import { SummaryCards } from './components/SummaryCards'
import { SpendingPieChart, WeeklyTrendChart, MonthlyTrendChart } from './components/Charts'
import { TransactionTable } from './components/TransactionTable'
import { Filters } from './components/Filters'
import { RoleSwitcher } from './components/RoleSwitcher'
import { Insights } from './components/Insights'
import { ExportModal } from './components/ExportModal'
import { calculateStats, getWeeklyTrend, getSpendingByCategory, getMonthlyComparison, getSavingsRate, getMonthlyTrendData } from './utils/helpers'
import { Sun, Moon, RefreshCw, Download, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'

function App() {
  const { transactions, isDarkMode, setDarkMode, role, resetData } = useFinanceStore()
  const [showExportModal, setShowExportModal] = useState(false)
  const [activeChart, setActiveChart] = useState('spending')
  
  const stats = calculateStats(transactions)
  const weeklyData = getWeeklyTrend(transactions)
  const spendingData = getSpendingByCategory(transactions)
  const monthlyComp = getMonthlyComparison(transactions)
  const savingsRate = getSavingsRate(transactions)
  const monthlyTrendData = getMonthlyTrendData(transactions)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 animate-slide-down">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              FinWise Pro
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Smart Financial Dashboard</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {role === 'admin' && (
              <>
                <button 
                  onClick={() => resetData()} 
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all" 
                  title="Reset to mock data"
                >
                  <RefreshCw size={18} />
                </button>
                <button 
                  onClick={() => setShowExportModal(true)} 
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all" 
                  title="Export data"
                >
                  <Download size={18} />
                </button>
              </>
            )}
            <button 
              onClick={() => setDarkMode(!isDarkMode)} 
              className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} />}
            </button>
            <RoleSwitcher />
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards stats={stats} monthlyChange={monthlyComp.changePercent} savingsRate={savingsRate} />

        {/* Charts Section with Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-slate-700">
            <button 
              onClick={() => setActiveChart('spending')} 
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeChart === 'spending' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <PieChartIcon size={16} /> Spending Breakdown
            </button>
            <button 
              onClick={() => setActiveChart('weekly')} 
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeChart === 'weekly' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <TrendingUp size={16} /> Weekly Trend
            </button>
            <button 
              onClick={() => setActiveChart('monthly')} 
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeChart === 'monthly' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📈 Monthly Comparison
            </button>
          </div>
          <div className="p-4 sm:p-5">
            {activeChart === 'spending' && <SpendingPieChart data={spendingData} title="Expense Distribution by Category" />}
            {activeChart === 'weekly' && <WeeklyTrendChart data={weeklyData} />}
            {activeChart === 'monthly' && <MonthlyTrendChart data={monthlyTrendData} />}
          </div>
        </div>

        {/* Insights Section */}
        <Insights />

        {/* Transactions Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">📋 Transaction History</h2>
            <Filters />
          </div>
          <TransactionTable />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4 sm:pt-6 pb-2 border-t border-gray-200 dark:border-slate-700">
          {role === 'admin' ? '👑 Admin Mode: Full CRUD operations enabled' : '👁️ Viewer Mode: Read-only access'}
          {' · '}Data persists in localStorage
          {' · '}Made with ❤️ for Finance Dashboard
        </div>
      </div>
      
      {showExportModal && <ExportModal transactions={transactions} onClose={() => setShowExportModal(false)} />}
    </div>
  )
}

export default App