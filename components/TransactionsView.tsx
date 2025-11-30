import React, { useState } from 'react';
import { Transaction, Custodian, User, TransactionType } from '../types';
import { CheckCircle2, XCircle, Filter, Trash2, Plus, Calendar } from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  custodians: Custodian[];
  currentUser: User;
  onValidate: (id: string, status: 'VALIDATED' | 'REJECTED') => void;
  onDelete: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ 
  transactions, 
  custodians, 
  currentUser,
  onValidate, 
  onDelete,
  onAddTransaction
}) => {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE' as TransactionType,
    custodianId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(t => 
    filterType === 'ALL' || t.type === filterType
  );

  const canValidate = currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT';
  const canCreate = currentUser.role !== 'ACCOUNTANT'; // Accountant usually validates, Operator does manual tasks

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      type: newTx.type,
      custodianId: newTx.custodianId,
      date: newTx.date,
      status: 'PENDING'
    });
    setIsModalOpen(false);
    setNewTx({ description: '', amount: '', type: 'EXPENSE', custodianId: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Registro de Transacciones</h2>
        
        <div className="flex gap-2">
           <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === 'ALL' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ingresos
            </button>
            <button 
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === 'EXPENSE' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Egresos
            </button>
          </div>
          
          {canCreate && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus size={16} /> Nueva
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Fecha</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Custodio</th>
                <th className="p-4 text-right">Monto</th>
                <th className="p-4 text-center">Tipo</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => {
                const custodianName = custodians.find(c => c.id === t.custodianId)?.name || 'Desconocido';
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 text-sm whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-900 font-medium">{t.description}</td>
                    <td className="p-4 text-slate-600 text-sm">{custodianName}</td>
                    <td className={`p-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${t.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                         {t.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                       </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.status === 'VALIDATED' ? 'bg-blue-100 text-blue-800' :
                        t.status === 'REJECTED' ? 'bg-gray-100 text-gray-500 line-through' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status === 'VALIDATED' && <CheckCircle2 size={12} />}
                        {t.status === 'PENDING' && "Pendiente"}
                        {t.status === 'VALIDATED' && "Validado"}
                        {t.status === 'REJECTED' && "Denegado"}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {t.status === 'PENDING' && canValidate && (
                        <>
                          <button 
                            onClick={() => onValidate(t.id, 'VALIDATED')}
                            title="Validar"
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button 
                            onClick={() => onValidate(t.id, 'REJECTED')}
                            title="Denegar"
                            className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {(t.status === 'PENDING' || t.status === 'REJECTED') && (
                        <button 
                          onClick={() => onDelete(t.id)}
                          title="Eliminar"
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Nueva Transacción Manual</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                   <input required type="number" step="0.01" className="w-full p-2 border border-slate-300 rounded-lg" 
                     value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                   <input required type="date" className="w-full p-2 border border-slate-300 rounded-lg" 
                     value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg"
                    value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})}>
                    <option value="EXPENSE">Egreso (Gasto)</option>
                    <option value="INCOME">Ingreso (Abono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custodio</label>
                  <select required className="w-full p-2 border border-slate-300 rounded-lg"
                    value={newTx.custodianId} onChange={e => setNewTx({...newTx, custodianId: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {custodians.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};