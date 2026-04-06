import React from 'react'
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

const SummaryCard = ({ title, amount, icon: Icon, color, trend, delay }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 card-hover animate-slide-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        {trend !== undefined && trend !== 0 && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
)

export const SummaryCards = ({ stats, monthlyChange, savingsRate }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
    <SummaryCard title="Total Balance" amount={stats.balance} icon={Wallet} color="from-indigo-500 to-indigo-600" trend={monthlyChange} delay={0} />
    <SummaryCard title="Total Income" amount={stats.income} icon={TrendingUp} color="from-emerald-500 to-emerald-600" delay={100} />
    <SummaryCard title="Total Expenses" amount={stats.expense} icon={TrendingDown} color="from-rose-500 to-rose-600" delay={200} />
    <SummaryCard title="Savings Rate" amount={savingsRate.rate} icon={PiggyBank} color="from-blue-500 to-blue-600" delay={300} />
  </div>
)