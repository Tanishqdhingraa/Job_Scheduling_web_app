import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import { Hammer, ShieldCheck, Wrench } from 'lucide-react';

export default function Login() {
  const { login } = useJobContext();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 text-white">
            <Hammer size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">JobSync Pro</h1>
          <p className="text-slate-400 text-center text-sm">Select your role to continue to the scheduling dashboard</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('admin')}
            className="w-full relative group overflow-hidden bg-slate-800 hover:bg-slate-700 border-2 border-indigo-500/30 hover:border-indigo-500 rounded-xl p-4 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-indigo-500/20 p-3 rounded-lg text-indigo-400">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Admin Access</h3>
                <p className="text-xs text-slate-400">Create, assign and manage all jobs</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleLogin('technician')}
            className="w-full relative group overflow-hidden bg-slate-800 hover:bg-slate-700 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-xl p-4 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400">
                <Wrench size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Technician Portal</h3>
                <p className="text-xs text-slate-400">View tasks, update status and duration</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
