import React from 'react';
import { 
  Users as UsersIcon, 
  Plus, 
  Shield, 
  Mail, 
  Key, 
  MoreVertical, 
  UserPlus, 
  Hotel,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Users = () => {
  const { t } = useTranslation();

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin': return 'bg-slate-900 text-white shadow-lg shadow-slate-900/20';
      case 'Hotel Manager': return 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 border border-primary-100/50';
      default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Team Management 👥</h2>
          <p className="text-slate-500 font-medium mt-1">Control access levels and manage your property staff across territories.</p>
        </div>
        <button className="flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[3px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 hover:-translate-y-1 active:translate-y-0 group">
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between group relative overflow-hidden">
             {/* Decorative Background Element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

             <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-[28px] flex items-center justify-center text-slate-400 font-black text-2xl group-hover:rotate-6 transition-all duration-500 shadow-inner group-hover:shadow-lg border border-white dark:border-slate-700">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-primary-600 transition-colors">{user.name}</h3>
                  <div className="flex flex-wrap items-center gap-6 mt-2">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100/50">
                      <Mail className="w-3.5 h-3.5 text-primary-400" /> {user.email}
                    </div>
                    {user.hotelId && (
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100/50">
                        <Hotel className="w-3.5 h-3.5 text-indigo-400" /> Hotel ID: {user.hotelId}
                      </div>
                    )}
                  </div>
              </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
              <div className="hidden md:block">
                 <span className={`px-5 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-[2px] transition-all ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100/50">
                <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}>{user.status}</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100/50 shadow-inner">
                <button className="p-3 hover:bg-white dark:hover:bg-slate-700 hover:text-primary-600 rounded-xl text-slate-400 transition-all hover:shadow-md">
                   <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-3 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 rounded-xl text-slate-400 transition-all hover:shadow-md">
                   <Shield className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1"></div>
                <button className="p-3 hover:bg-rose-500 hover:text-white rounded-xl text-slate-400 transition-all hover:shadow-lg active:scale-90">
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
