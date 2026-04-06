import React from 'react'
import { TrendingUp, Award, Calendar, AlertCircle, Zap, Target, BarChart3 } from 'lucide-react'
import { useFinanceStore } from '../store/financeStore'
import { getHighestSpendingCategory, getMonthlyComparison, getSpendingByCategory, getSavingsRate, getIncomeByCategory } from '../utils/helpers'

export const Insights = () => {
  const { transactions } = useFinanceStore()
  
  const highest = getHighestSpendingCategory(transactions)
  const monthly = getMonthlyComparison(transactions)
  const totalSpending = getSpendingByCategory(transactions).reduce((sum, cat) => sum + (cat.value || 0), 0)
  const savings = getSavingsRate(transactions)
  const incomeByCat = getIncomeByCategory(transactions)
  const topIncomeSource = incomeByCat.length > 0 ? incomeByCat[0] : { name: 'None', value: 0 }
  
  const insights = [
    { 
      icon: Award, title: "Highest Spending", 
      value: highest.name || 'None', 
      subtitle: `$${(highest.amount || 0).toFixed(2)} · ${(highest.percentage || 0).toFixed(0)}% of expenses`, 
      color: "from-orange-500 to-red-500" 
    },
    { 
      icon: TrendingUp, title: "Monthly Trend", 
      value: (monthly.change || 0) >= 0 ? `+$${(monthly.change || 0).toFixed(2)}` : `-$${Math.abs(monthly.change || 0).toFixed(2)}`, 
      subtitle: `${(monthly.changePercent || 0) >= 0 ? '↑' : '↓'} ${Math.abs(monthly.changePercent || 0).toFixed(1)}% vs last month`, 
      color: (monthly.change || 0) >= 0 ? "from-emerald-500 to-green-500" : "from-rose-500 to-red-500" 
    },
    { 
      icon: Target, title: "Savings Rate", 
      value: `${(savings.rate || 0).toFixed(1)}%`, 
      subtitle: `$${(savings.savings || 0).toFixed(2)} saved this month`, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      icon: Zap, title: "Top Income", 
      value: topIncomeSource.name || 'None', 
      subtitle: `$${(topIncomeSource.value || 0).toFixed(2)}`, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      icon: Calendar, title: "Avg Daily Spend", 
      value: `$${(totalSpending / 30).toFixed(2)}`, 
      subtitle: "Last 30 days average", 
      color: "from-teal-500 to-emerald-500" 
    },
    { 
      icon: BarChart3, title: "Monthly Net Flow", 
      value: (monthly.current || 0) >= 0 ? `+$${(monthly.current || 0).toFixed(2)}` : `-$${Math.abs(monthly.current || 0).toFixed(2)}`, 
      subtitle: `${(monthly.current || 0) >= 0 ? 'Surplus' : 'Deficit'} this month`, 
      color: (monthly.current || 0) >= 0 ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500" 
    },
  ]

  if (getSpendingByCategory(transactions).length === 0 && incomeByCat.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Add transactions to see personalized insights</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {insights.map((insight, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-slate-700 card-hover animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{insight.title}</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-1">{insight.value}</p>
              <p className="text-xs text-gray-400 mt-1">{insight.subtitle}</p>
            </div>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${insight.color} shadow-md shrink-0`}>
              <insight.icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}