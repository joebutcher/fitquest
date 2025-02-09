import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import WorkoutLog from '../components/WorkoutLog';
import HabitTracker from '../components/HabitTracker';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          FitQuest 💪
        </h1>
        <button onClick={handleLogout} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
          Logout
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HabitTracker />
        <WorkoutLog />
      </div>
    </div>
  );
}

export default Dashboard;