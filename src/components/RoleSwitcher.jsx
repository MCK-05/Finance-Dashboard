import React, { useState } from 'react'
import { Shield, Eye, ChevronDown } from 'lucide-react'
import { useFinanceStore } from '../store/financeStore'

export const RoleSwitcher = () => {
  const { role, setRole } = useFinanceStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
      >
        {role === 'admin' ? <Shield size={16} className="text-indigo-500" /> : <Eye size={16} className="text-gray-500" />}
        <span className="text-sm font-medium capitalize">{role}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-20 animate-slide-down">
          <button 
            onClick={() => { setRole('viewer'); setIsOpen(false) }} 
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${role === 'viewer' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : ''}`}
          >
            <Eye size={14} /> Viewer (Read only)
          </button>
          <button 
            onClick={() => { setRole('admin'); setIsOpen(false) }} 
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${role === 'admin' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : ''}`}
          >
            <Shield size={14} /> Admin (Full access)
          </button>
        </div>
      )}
      
      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
    </div>
  )
}