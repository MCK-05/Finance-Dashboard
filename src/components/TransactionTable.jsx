import React, { useState } from 'react'
import { Edit2, Trash2, Plus, X, Check, Loader2, Inbox } from 'lucide-react'
import { useFinanceStore } from '../store/financeStore'
import { getFilteredTransactions } from '../utils/helpers'
import { categories } from '../data/mockData'

export const TransactionTable = () => {
  const { transactions, role, isLoading, searchQuery, typeFilter, categoryFilter, dateRange, sortBy, addTransaction, editTransaction, deleteTransaction } = useFinanceStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  
  const filters = { searchQuery, typeFilter, categoryFilter, dateRange, sortBy }
  const filtered = getFilteredTransactions(transactions, filters)
  const isAdmin = role === 'admin'

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new transaction</p>
        {isAdmin && (
          <button onClick={() => setShowAddForm(true)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            + Add Your First Transaction
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden animate-slide-up">
      <div className="overflow-x-auto responsive-table">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Amount</th>
              {isAdmin && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {filtered.map((tx, idx) => (
              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                {editingId === tx.id ? (
                  <>
                    <td className="px-4 py-2"><input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} className="w-full p-1.5 rounded-lg border dark:bg-slate-700 text-sm" /></td>
                    <td className="px-4 py-2"><input type="text" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full p-1.5 rounded-lg border dark:bg-slate-700 text-sm" /></td>
                    <td className="px-4 py-2"><select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full p-1.5 rounded-lg border dark:bg-slate-700 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select></td>
                    <td className="px-4 py-2 text-right"><input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})} className="w-28 p-1.5 rounded-lg border text-right dark:bg-slate-700 text-sm" /></td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => { editTransaction(editingId, editForm); setEditingId(null) }} className="text-green-600 hover:text-green-700 transition-colors"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{tx.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {tx.description}
                      {tx.notes && <span className="text-xs text-gray-400 ml-1">({tx.notes})</span>}
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">{tx.category}</span></td>
                    <td className={`px-4 py-3 text-right text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => { setEditingId(tx.id); setEditForm(tx) }} className="text-indigo-500 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => deleteTransaction(tx.id)} className="text-rose-500 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && <AddTransactionForm onAdd={addTransaction} onClose={() => setShowAddForm(false)} />}
      {isAdmin && filtered.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30">
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            <Plus size={18} /> Add New Transaction
          </button>
        </div>
      )}
    </div>
  )
}

const AddTransactionForm = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0], notes: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount || parseFloat(form.amount) <= 0) return
    setIsSubmitting(true)
    await onAdd({ ...form, amount: parseFloat(form.amount) })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">➕ Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Description *" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <input type="number" step="0.01" placeholder="Amount *" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}