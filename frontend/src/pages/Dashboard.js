import React from 'react';
import { useAuth } from '../context/AuthContext';
import Home from './Home';

const Dashboard = () => {
  const { currentUser } = useAuth();
   console.log('Dashboard currentUser =', currentUser); // <-- check here

  return (
    <div className="dashboard">
      <Home />
    </div>
  );
};

export default Dashboard;