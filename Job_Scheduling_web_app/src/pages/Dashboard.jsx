import React, { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { LogOut, Plus, Search, User as UserIcon, CalendarDays } from 'lucide-react';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';

export default function Dashboard() {
  const { currentUser, logout, jobs } = useJobContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Filter jobs based on role and search
  const displayJobs = jobs.filter(job => {
    // Role filter
    if (!isAdmin && job.assigneeId !== currentUser.id) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) || 
        job.problem.toLowerCase().includes(q) ||
        (job.assigneeName && job.assigneeName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navigation Bar */}
      <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <CalendarDays size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">JobSync</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700/50">
                <UserIcon size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  {currentUser.name} <span className="text-slate-500 ml-1">({isAdmin ? 'Admin' : 'Tech'})</span>
                </span>
              </div>
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-400 transition-colors flex items-center"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {isAdmin ? 'All Jobs' : 'My Assigned Jobs'}
            </h1>
            <p className="text-slate-400 text-sm">
              Manage and track task progression efficiently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            {isAdmin && (
              <button 
                onClick={handleCreateJob}
                className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Job</span>
              </button>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {displayJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={handleOpenJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/30 border border-slate-800 rounded-2xl border-dashed">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <CalendarDays size={24} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No jobs found</h3>
            <p className="text-slate-400">
              {searchQuery ? "We couldn't find anything matching your search." : (isAdmin ? "You haven't created any jobs yet." : "You don't have any jobs assigned to you right now.")}
            </p>
            {isAdmin && !searchQuery && (
              <button 
                onClick={handleCreateJob}
                className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center justify-center mx-auto"
              >
                <Plus size={16} className="mr-1" /> Create your first job
              </button>
            )}
          </div>
        )}

      </main>

      {/* Modal Overlay */}
      <JobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        job={selectedJob} 
      />
    </div>
  );
}
