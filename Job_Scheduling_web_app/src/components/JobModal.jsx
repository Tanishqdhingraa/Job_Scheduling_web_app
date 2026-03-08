import React, { useState, useEffect } from 'react';
import { useJobContext } from '../context/JobContext';
import { X, Save, Clock, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JobModal({ isOpen, onClose, job }) {
  const { currentUser, updateJob, addJob } = useJobContext();
  const isAdmin = currentUser?.role === 'admin';
  const isCreating = !job;

  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    thingsNeeded: '',
    status: 'Pending',
    duration: '',
    assigneeName: 'Unassigned',
    assigneeId: null,
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        title: '',
        problem: '',
        thingsNeeded: '',
        status: 'Pending',
        duration: '',
        assigneeName: 'Unassigned',
        assigneeId: null,
      });
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssign = (e) => {
    // Mock user list - normally would fetch from API
    const technicians = [
      { id: 'tech1', name: 'Tech 1' },
      { id: 'tech2', name: 'Tech 2' }
    ];
    
    const assignedId = e.target.value;
    const assignedTech = technicians.find(t => t.id === assignedId);
    
    setFormData(prev => ({
      ...prev,
      assigneeId: assignedId || null,
      assigneeName: assignedTech ? assignedTech.name : 'Unassigned',
      status: assignedId ? 'In Progress' : 'Pending'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreating) {
      addJob({
        title: formData.title,
        problem: formData.problem,
        thingsNeeded: formData.thingsNeeded,
      });
    } else {
      updateJob(job.id, formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/80">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            {isCreating ? (
              <><AlertCircle className="text-blue-500" /> <span>Create New Job</span></>
            ) : (
              <><CheckCircle2 className="text-emerald-500" /> <span>Job Details</span></>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/50">
          <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Description - Admin Editable, Tech Readonly */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  readOnly={!isAdmin && !isCreating}
                  className={`w-full bg-slate-800 border ${isAdmin ? 'border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-slate-700 text-slate-300 opacity-80 cursor-not-allowed'} rounded-lg p-3 text-white transition-colors outline-none`}
                  placeholder="E.g., Server installation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Problem Description</label>
                <textarea
                  name="problem"
                  required
                  rows={3}
                  value={formData.problem}
                  onChange={handleChange}
                  readOnly={!isAdmin && !isCreating}
                  className={`w-full bg-slate-800 border ${isAdmin ? 'border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-slate-700 text-slate-300 opacity-80 cursor-not-allowed'} rounded-lg p-3 text-white transition-colors outline-none resize-none`}
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tools / Things Needed</label>
                <input
                  type="text"
                  name="thingsNeeded"
                  value={formData.thingsNeeded}
                  onChange={handleChange}
                  readOnly={!isAdmin && !isCreating}
                  className={`w-full bg-slate-800 border ${isAdmin ? 'border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-slate-700 text-slate-300 opacity-80 cursor-not-allowed'} rounded-lg p-3 text-white transition-colors outline-none`}
                  placeholder="E.g., Screwdriver, replacement filter..."
                />
              </div>
            </div>

            {/* Status & Assignment - Tech Editable, Admin Editable for Assignment */}
            {!isCreating && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-800/80 rounded-xl border border-slate-700/80">
                {isAdmin ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                      <UserCheck size={16} className="mr-2 text-indigo-400" /> Assign To
                    </label>
                    <select
                      value={formData.assigneeId || ''}
                      onChange={handleAssign}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">-- Unassigned --</option>
                      <option value="tech1">Tech 1</option>
                      <option value="tech2">Tech 2</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                      <CheckCircle2 size={16} className="mr-2 text-emerald-400" /> Update Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                    <Clock size={16} className="mr-2 text-amber-400" /> Duration {isAdmin && '(Set by Tech)'}
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    readOnly={isAdmin}
                    placeholder="E.g., 2 hours"
                    className={`w-full bg-slate-900 border ${!isAdmin ? 'border-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' : 'border-slate-700 text-slate-400 opacity-80 cursor-not-allowed'} rounded-lg p-3 text-white transition-colors outline-none`}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="jobForm"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 flex items-center space-x-2 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Save size={16} />
            <span>{isCreating ? 'Create Job' : 'Save Changes'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
