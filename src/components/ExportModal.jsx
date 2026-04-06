import React, { useState } from 'react'
import { Download, FileText, FileJson, X, Loader2 } from 'lucide-react'
import { exportToCSV, exportToJSON } from '../utils/helpers'

export const ExportModal = ({ transactions, onClose }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format) => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    if (format === 'csv') exportToCSV(transactions)
    else if (format === 'json') exportToJSON(transactions)
    setIsExporting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Export Data</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Export {transactions.length} transactions</p>
        <div className="space-y-3">
          <button 
            onClick={() => handleExport('csv')} 
            disabled={isExporting} 
            className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-green-500" />
              <span>CSV Format</span>
            </div>
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
          <button 
            onClick={() => handleExport('json')} 
            disabled={isExporting} 
            className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileJson size={20} className="text-yellow-500" />
              <span>JSON Format</span>
            </div>
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}