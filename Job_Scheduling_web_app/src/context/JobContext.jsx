import React, { createContext, useState, useContext } from 'react';

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // { name: 'Admin User', role: 'admin' } or { name: 'Tech 1', role: 'technician' }
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Fix AC Unit in Building A',
      problem: 'AC is blowing warm air',
      thingsNeeded: 'Freon, Manifold Gauge Set',
      status: 'Pending', // Pending, In Progress, Completed
      duration: '',
      assigneeId: null,
      assigneeName: 'Unassigned',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Replace networking switch',
      problem: 'Switch in rack 3 is dropping packets occasionally.',
      thingsNeeded: 'New 24-port Gigabit Switch, CAT6 Cables',
      status: 'In Progress',
      duration: '2 hours',
      assigneeId: 'tech1',
      assigneeName: 'Tech 1',
      createdAt: new Date().toISOString()
    }
  ]);

  const login = (role) => {
    if (role === 'admin') {
      setCurrentUser({ id: 'admin1', name: 'Admin', role: 'admin' });
    } else {
      setCurrentUser({ id: 'tech1', name: 'Tech 1', role: 'technician' });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      status: 'Pending',
      duration: '',
      createdAt: new Date().toISOString(),
    };
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (jobId, updates) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const assignJob = (jobId, assigneeUser) => {
    updateJob(jobId, { 
      assigneeId: assigneeUser.id, 
      assigneeName: assigneeUser.name,
      status: 'In Progress' 
    });
  };

  return (
    <JobContext.Provider value={{ 
      currentUser, 
      login, 
      logout,
      jobs, 
      addJob, 
      updateJob,
      assignJob
    }}>
      {children}
    </JobContext.Provider>
  );
};
