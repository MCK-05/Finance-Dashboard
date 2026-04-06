import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts'
import { categoryColors } from '../data/mockData'

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7']

export const SpendingPieChart = ({ data, title }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  
  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400 animate-pulse">No expense data available</div>
  }

  // Custom label to show all categories, even small ones
  const renderCustomLabel = ({ name, value, percent }) => {
    // Always show label if percentage is > 2%, otherwise show only on hover
    if (percent > 0.02) {
      return `${name} ${(percent * 100).toFixed(0)}%`
    }
    return ''
  }

  // Custom tooltip to show all details
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = data.reduce((sum, item) => sum + item.value, 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Amount: ${data.value.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Percentage: {percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="animate-fade-in">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            label={renderCustomLabel}
            labelLine={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={categoryColors[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                className="transition-all duration-300 cursor-pointer"
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                stroke={activeIndex === index ? '#fff' : 'none'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {title && <p className="text-center text-sm text-gray-500 mt-2">{title}</p>}
      
      {/* Legend for all categories including small ones */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {data.map((entry, index) => {
          const total = data.reduce((sum, item) => sum + item.value, 0)
          const percentage = ((entry.value / total) * 100).toFixed(1)
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: categoryColors[entry.name] || CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-gray-600 dark:text-gray-400">{entry.name}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const WeeklyTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} className="animate-fade-in" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
        <XAxis dataKey="day" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
        <Tooltip 
          formatter={(value) => [`$${value.toFixed(2)}`, 'Net Flow']}
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
          cursor={{ fill: '#334155', opacity: 0.3 }}
        />
        <Bar dataKey="net" radius={[8, 8, 0, 0]} animationDuration={800}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.net >= 0 ? '#10b981' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export const MonthlyTrendChart = ({ data }) => {
  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No monthly data available</div>
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} className="animate-fade-in" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
        <Tooltip 
          formatter={(value) => [`$${value.toFixed(2)}`, '']}
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
        />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Expense" />
        <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Balance" />
      </LineChart>
    </ResponsiveContainer>
  )
}