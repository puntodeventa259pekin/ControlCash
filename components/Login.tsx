import React from 'react';
import { User } from '../types';
import { ShieldCheck } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">CashGuard</h1>
          <p className="text-indigo-100 text-sm">Sistema de Control Financiero</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 text-center">Selecciona tu Usuario</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-200" />
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-700">{user.name}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{user.role}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2023 CashGuard Enterprise
          </div>
        </div>
      </div>
    </div>
  );
};