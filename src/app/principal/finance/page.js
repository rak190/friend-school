'use client';
import { useState, useEffect, useMemo } from 'react';
import { Download, ArrowUpRight, ArrowDownRight, Search, Filter, Plus, X, Save } from 'lucide-react';

export default function PrincipalFinancePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrx, setNewTrx] = useState({ description: '', amount: '', type: 'income', category: 'Tuition', status: 'ជោគជ័យ' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/finance');
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic calculations & Categorization
  const { totalIncome, totalExpense, balance, incomeByCategory, expenseByCategory } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    let incCat = { Tuition: 0, Other: 0 };
    let expCat = { Salaries: 0, Utilities: 0, Maintenance: 0, Other: 0 };

    transactions.forEach(t => {
      if (t.type === 'income') {
        inc += t.amount;
        if (incCat[t.category] !== undefined) incCat[t.category] += t.amount;
        else incCat.Other += t.amount;
      }
      if (t.type === 'expense') {
        exp += t.amount;
        if (expCat[t.category] !== undefined) expCat[t.category] += t.amount;
        else expCat.Other += t.amount;
      }
    });

    const baseBalance = 45000;
    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: baseBalance + inc - exp,
      incomeByCategory: incCat,
      expenseByCategory: expCat
    };
  }, [transactions]);

  const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSaveTransaction = async () => {
    if (!newTrx.description || !newTrx.amount) return;
    
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrx)
      });
      if (res.ok) {
        fetchTransactions();
        setIsModalOpen(false);
        setNewTrx({ description: '', amount: '', type: 'income', category: 'Tuition', status: 'ជោគជ័យ' });
      }
    } catch (err) {
      console.error('Failed to save transaction', err);
    }
  };

  const calculateWidth = (amount, total) => total === 0 ? '0%' : `${Math.min(100, (amount / total) * 100)}%`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ហិរញ្ញវត្ថុ</h1>
          <p className="text-brand-muted font-medium mt-1">របាយការណ៍ចំណូល និងចំណាយលម្អិត</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> ទាញយក (PDF)
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> ថ្មី
          </button>
        </div>
      </header>

      {/* Overview Cards (Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 relative">
          <p className="text-sm font-semibold text-slate-500 mb-2">សមតុល្យសរុប</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(balance)}</h2>
          <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-2">
            <ArrowUpRight className="w-4 h-4" /> ទិន្នន័យផ្ទាល់
          </div>
        </div>
        <div className="bg-emerald-50 rounded-[20px] p-6 border border-emerald-100 relative">
          <p className="text-sm font-semibold text-emerald-700 mb-2">ចំណូលសរុប (ខែនេះ)</p>
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">{formatCurrency(totalIncome)}</h2>
          {/* Income Breakdown Bar */}
          <div className="w-full bg-emerald-200/50 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: calculateWidth(incomeByCategory.Tuition, totalIncome) }} title="Tuition"></div>
            <div className="bg-emerald-400 h-full" style={{ width: calculateWidth(incomeByCategory.Other, totalIncome) }} title="Other"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-emerald-700 mt-1 uppercase">
            <span>Tuition</span><span>Other</span>
          </div>
        </div>
        <div className="bg-red-50 rounded-[20px] p-6 border border-red-100 relative">
          <p className="text-sm font-semibold text-red-700 mb-2">ចំណាយសរុប (ខែនេះ)</p>
          <h2 className="text-3xl font-bold text-red-900 mb-2">{formatCurrency(totalExpense)}</h2>
          {/* Expense Breakdown Bar */}
          <div className="w-full bg-red-200/50 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-red-500 h-full" style={{ width: calculateWidth(expenseByCategory.Salaries, totalExpense) }} title="Salaries"></div>
            <div className="bg-red-400 h-full" style={{ width: calculateWidth(expenseByCategory.Utilities, totalExpense) }} title="Utilities"></div>
            <div className="bg-orange-400 h-full" style={{ width: calculateWidth(expenseByCategory.Maintenance, totalExpense) }} title="Maintenance"></div>
            <div className="bg-red-300 h-full" style={{ width: calculateWidth(expenseByCategory.Other, totalExpense) }} title="Other"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-red-700 mt-1 uppercase">
            <span>Salaries</span><span>Utilities</span><span>Maint.</span><span>Other</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col relative z-0">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button onClick={() => setActiveTab('all')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>ទាំងអស់</button>
            <button onClick={() => setActiveTab('income')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}>ចំណូល</button>
            <button onClick={() => setActiveTab('expense')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-red-600'}`}>ចំណាយ</button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="ស្វែងរកប្រតិបត្តិការ..." className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">កាលបរិច្ឆេទ</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">ការពិពណ៌នា</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">ប្រភេទ (Category)</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">ស្ថានភាព</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase text-right">ចំនួនទឹកប្រាក់</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10 text-slate-400">កំពុងទាញយកទិន្នន័យ...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-slate-400">មិនមានប្រតិបត្តិការទេ</td></tr>
              ) : (
                transactions.filter(trx => activeTab === 'all' || trx.type === activeTab).map((trx, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-slate-600">{trx.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{trx.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">{trx.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${trx.status === 'ជោគជ័យ' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">បន្ថែមប្រតិបត្តិការថ្មី</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ប្រភេទ (Type)</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full">
                  <button onClick={() => setNewTrx({...newTrx, type: 'income', category: 'Tuition'})} className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${newTrx.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}>
                    ចំណូល
                  </button>
                  <button onClick={() => setNewTrx({...newTrx, type: 'expense', category: 'Salaries'})} className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${newTrx.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-red-600'}`}>
                    ចំណាយ
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">ចំណាត់ថ្នាក់ (Category)</label>
                  <select 
                    value={newTrx.category}
                    onChange={(e) => setNewTrx({...newTrx, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium"
                  >
                    {newTrx.type === 'income' ? (
                      <>
                        <option value="Tuition">Tuition</option>
                        <option value="Other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Salaries">Salaries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">ចំនួនទឹកប្រាក់ ($)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={newTrx.amount}
                    onChange={(e) => setNewTrx({...newTrx, amount: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ការពិពណ៌នា</label>
                <input 
                  type="text" 
                  placeholder="ឧ. បង់ថ្លៃសិក្សា, ប្រាក់ខែ..."
                  value={newTrx.description}
                  onChange={(e) => setNewTrx({...newTrx, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-medium" 
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">បោះបង់</button>
              <button onClick={handleSaveTransaction} className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-brand-blue/30 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
