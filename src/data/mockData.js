export const mockTransactions = [
  { id: '1', date: '2026-03-28', description: 'Salary Deposit - March', amount: 4850.00, category: 'Salary', type: 'income', notes: 'Monthly salary from Tech Corp' },
  { id: '2', date: '2026-03-25', description: 'Whole Foods Market', amount: 142.50, category: 'Food', type: 'expense', notes: 'Weekly groceries' },
  { id: '3', date: '2026-03-22', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense', notes: 'Monthly streaming' },
  { id: '4', date: '2026-03-20', description: 'Freelance Web Project', amount: 320.00, category: 'Freelance', type: 'income', notes: 'Client payment - Portfolio site' },
  { id: '5', date: '2026-03-18', description: 'The Italian Restaurant', amount: 78.40, category: 'Food', type: 'expense', notes: 'Dinner with friends' },
  { id: '6', date: '2026-03-15', description: 'Electricity Bill', amount: 95.00, category: 'Bills', type: 'expense', notes: 'March utility' },
  { id: '7', date: '2026-03-12', description: 'Stock Dividend', amount: 210.00, category: 'Investments', type: 'income', notes: 'Quarterly dividend payout' },
  { id: '8', date: '2026-03-10', description: 'Sony Headphones', amount: 89.99, category: 'Shopping', type: 'expense', notes: 'Online purchase - Amazon' },
  { id: '9', date: '2026-03-07', description: 'Starbucks Coffee', amount: 24.50, category: 'Food', type: 'expense', notes: 'Weekly coffee runs' },
  { id: '10', date: '2026-03-03', description: 'Gym Membership', amount: 45.00, category: 'Health', type: 'expense', notes: 'Monthly fitness' },
  { id: '11', date: '2026-02-28', description: 'Salary Deposit - February', amount: 4800.00, category: 'Salary', type: 'income', notes: 'Monthly salary' },
  { id: '12', date: '2026-02-25', description: 'Amazon Shopping', amount: 67.30, category: 'Shopping', type: 'expense', notes: 'Household essentials' },
  { id: '13', date: '2026-02-20', description: 'Udemy Course', amount: 120.00, category: 'Education', type: 'expense', notes: 'React advanced course' },
  { id: '14', date: '2026-02-18', description: 'Freelance Design', amount: 450.00, category: 'Freelance', type: 'income', notes: 'Logo design project' },
  { id: '15', date: '2026-02-15', description: 'Internet Bill', amount: 65.00, category: 'Bills', type: 'expense', notes: 'Fiber connection' },
  { id: '16', date: '2026-02-10', description: 'Movie Night', amount: 32.50, category: 'Entertainment', type: 'expense', notes: 'Cinema tickets' },
  { id: '17', date: '2026-02-05', description: 'Doctor Appointment', amount: 150.00, category: 'Health', type: 'expense', notes: 'Annual checkup' },
  { id: '18', date: '2026-01-28', description: 'Performance Bonus', amount: 1200.00, category: 'Salary', type: 'income', notes: 'Year-end bonus' },
  { id: '19', date: '2026-01-20', description: 'New Laptop', amount: 1299.99, category: 'Shopping', type: 'expense', notes: 'Work laptop upgrade' },
  { id: '20', date: '2026-01-15', description: 'Tax Refund', amount: 350.00, category: 'Income', type: 'income', notes: 'Annual refund' },
]

export const categories = ['Food', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Salary', 'Freelance', 'Investments', 'Education', 'Transport', 'Income']

export const categoryColors = {
  Food: '#10b981', Bills: '#f59e0b', Entertainment: '#8b5cf6', Shopping: '#ec4899', 
  Health: '#06b6d4', Salary: '#6366f1', Freelance: '#14b8a6', Investments: '#f97316', 
  Education: '#a855f7', Transport: '#3b82f6', Income: '#22c55e'
}