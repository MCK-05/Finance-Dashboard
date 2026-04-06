import { format, startOfWeek, eachDayOfInterval, subMonths, isWithinInterval, parseISO } from 'date-fns'

export const getFilteredTransactions = (transactions, filters) => {
  if (!transactions || !Array.isArray(transactions)) return []
  let filtered = [...transactions]
  const { searchQuery, typeFilter, categoryFilter, dateRange, sortBy } = filters

  if (searchQuery?.trim()) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(tx => 
      tx.description?.toLowerCase().includes(q) || 
      tx.category?.toLowerCase().includes(q) ||
      (tx.notes && tx.notes.toLowerCase().includes(q))
    )
  }

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter(tx => tx.type === typeFilter)
  }

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter(tx => tx.category === categoryFilter)
  }

  if (dateRange?.start && dateRange?.end) {
    filtered = filtered.filter(tx => 
      isWithinInterval(parseISO(tx.date), { start: parseISO(dateRange.start), end: parseISO(dateRange.end) })
    )
  }

  const sorts = {
    'date-desc': (a, b) => new Date(b.date) - new Date(a.date),
    'date-asc': (a, b) => new Date(a.date) - new Date(b.date),
    'amount-desc': (a, b) => (b.amount || 0) - (a.amount || 0),
    'amount-asc': (a, b) => (a.amount || 0) - (b.amount || 0),
    'category-asc': (a, b) => (a.category || '').localeCompare(b.category || ''),
  }
  return filtered.sort(sorts[sortBy] || sorts['date-desc'])
}

export const calculateStats = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return { income: 0, expense: 0, balance: 0 }
  let income = 0, expense = 0
  transactions.forEach(tx => {
    if (tx.type === 'income') income += tx.amount || 0
    else expense += tx.amount || 0
  })
  return { income, expense, balance: income - expense }
}

export const getSpendingByCategory = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return []
  const spending = {}
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      spending[tx.category] = (spending[tx.category] || 0) + (tx.amount || 0)
    }
  })
  return Object.entries(spending).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export const getIncomeByCategory = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return []
  const income = {}
  transactions.forEach(tx => {
    if (tx.type === 'income') {
      income[tx.category] = (income[tx.category] || 0) + (tx.amount || 0)
    }
  })
  return Object.entries(income).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export const getWeeklyTrend = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return []
  
  // Get the start of current week (Monday)
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  // Get the end of current week (Sunday)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  // Create array of all 7 days in the week
  const weekDays = eachDayOfInterval({ start, end })
  
  return weekDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const net = transactions
      .filter(tx => tx.date === dayStr)
      .reduce((sum, tx) => sum + (tx.type === 'income' ? (tx.amount || 0) : -(tx.amount || 0)), 0)
    return { 
      day: format(day, 'EEE'), 
      fullDay: format(day, 'EEEE'),
      net, 
      fullDate: dayStr,
      isPositive: net >= 0
    }
  })
}

export const getMonthlyComparison = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return { current: 0, last: 0, change: 0, changePercent: 0 }
  const currentMonth = format(new Date(), 'yyyy-MM')
  const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM')
  
  const current = transactions.filter(tx => tx.date?.startsWith(currentMonth)).reduce((sum, tx) => sum + (tx.type === 'income' ? (tx.amount || 0) : -(tx.amount || 0)), 0)
  const last = transactions.filter(tx => tx.date?.startsWith(lastMonth)).reduce((sum, tx) => sum + (tx.type === 'income' ? (tx.amount || 0) : -(tx.amount || 0)), 0)
  
  const changePercent = last !== 0 ? ((current - last) / Math.abs(last)) * 100 : 0
  return { current, last, change: current - last, changePercent }
}

export const getHighestSpendingCategory = (transactions) => {
  const spending = getSpendingByCategory(transactions)
  if (spending.length === 0) return { name: 'None', amount: 0, percentage: 0 }
  const total = spending.reduce((sum, cat) => sum + cat.value, 0)
  const highest = spending[0]
  return { ...highest, percentage: total > 0 ? (highest.value / total) * 100 : 0 }
}

export const getSavingsRate = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return { savings: 0, rate: 0 }
  let income = 0, expense = 0
  const currentMonth = format(new Date(), 'yyyy-MM')
  transactions.filter(tx => tx.date?.startsWith(currentMonth)).forEach(tx => {
    if (tx.type === 'income') income += tx.amount || 0
    else expense += tx.amount || 0
  })
  const savings = income - expense
  const rate = income > 0 ? (savings / income) * 100 : 0
  return { savings, rate }
}

export const getMonthlyTrendData = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return []
  const months = {}
  transactions.forEach(tx => {
    const month = tx.date?.substring(0, 7)
    if (month) {
      if (!months[month]) months[month] = { income: 0, expense: 0, balance: 0 }
      if (tx.type === 'income') months[month].income += tx.amount || 0
      else months[month].expense += tx.amount || 0
      months[month].balance = months[month].income - months[month].expense
    }
  })
  return Object.entries(months)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, data]) => ({ month: month.substring(5), ...data }))
}

export const exportToCSV = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes']
  const rows = transactions.map(tx => [tx.date, tx.description, tx.category, tx.type, tx.amount, tx.notes || ''])
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return
  const json = JSON.stringify(transactions, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
  URL.revokeObjectURL(url)
}