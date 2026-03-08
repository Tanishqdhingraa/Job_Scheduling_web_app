import React from 'react';
import { Calendar, Clock, Wrench, User } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  'Pending': { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  'In Progress': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  'Completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' }
};

export default function JobCard({ job, onClick }) {
  const statusClass = statusConfig[job.status] || statusConfig['Pending'];
  const formattedDate = format(new Date(job.createdAt), 'MMM d, yyyy');

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 pr-4">{job.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusClass.bg} ${statusClass.text} ${statusClass.border}`}>
          {job.status}
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-6 line-clamp-2">
        {job.problem}
      </p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300">
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-slate-500" />
          <span className="truncate">{formattedDate}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <User size={14} className="text-slate-500" />
          <span className="truncate">{job.assigneeName || 'Unassigned'}</span>
        </div>

        <div className="flex items-center space-x-2 col-span-2">
          <Wrench size={14} className="text-slate-500 shrink-0" />
          <span className="truncate text-xs">{job.thingsNeeded || 'None listed'}</span>
        </div>

        {job.duration && (
          <div className="flex items-center space-x-2 col-span-2 pt-2 mt-2 border-t border-slate-700/50">
            <Clock size={14} className="text-indigo-400" />
            <span className="text-indigo-300 font-medium text-xs">Duration: {job.duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}
