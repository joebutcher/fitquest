import React, { useState, useEffect } from 'react';
import { habitService } from '../services/habitService';

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabitData, setNewHabitData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [editingHabit, setEditingHabit] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const userHabits = await habitService.getUserHabits();
    setHabits(userHabits);
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (newHabitData.name.trim()) {
      const success = await habitService.addHabit(newHabitData);
      if (success) {
        await loadHabits();
        setNewHabitData({
          name: '',
          startDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const handleUpdateHabit = async (e) => {
    e.preventDefault();
    if (newHabitData.name.trim()) {
      const success = await habitService.updateHabit(editingHabit.id, {
        name: newHabitData.name.trim(),
        startDate: newHabitData.startDate
      });
      if (success) {
        await loadHabits();
        setEditingHabit(null);
        setNewHabitData({
          name: '',
          startDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const success = await habitService.deleteHabit(habitId);
      if (success) {
        await loadHabits();
      }
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabitData({
      name: habit.name,
      startDate: habit.startDate
    });
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
    setNewHabitData({
      name: '',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const getLast7Days = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    // Calculate Sunday of the current week
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const startDate = new Date(today);
    if (currentDay === 0) {
      // If today is Sunday, use today as start date
      startDate.setDate(today.getDate());
    } else {
      // Otherwise, get the previous Sunday
      startDate.setDate(today.getDate() - currentDay + (currentDay === 6 ? 7 : 0));
    }
    
    // Get dates for this week (Sunday through Saturday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const last7Days = getLast7Days();

  const WeekProgress = () => {
    const completedDays = habits.reduce((acc, habit) => {
      const todayCompletions = Object.keys(habit.completions).length;
      return acc + todayCompletions;
    }, 0);
    
    const totalPossible = habits.length * 7;
    const percentage = totalPossible > 0 ? (completedDays / totalPossible) * 100 : 0;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Week Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const markComplete = async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newCompletions = { ...habit.completions };
    if (newCompletions[date]) {
      delete newCompletions[date];
    } else {
      newCompletions[date] = true;
    }

    const success = await habitService.updateHabit(habitId, {
      completions: newCompletions
    });

    if (success) {
      await loadHabits();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Habit Tracker</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {showHistory ? 'Current Week' : 'View History'}
        </button>
      </div>
      
      <form onSubmit={editingHabit ? handleUpdateHabit : handleAddHabit} className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={newHabitData.name}
            onChange={(e) => setNewHabitData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Add a new habit (e.g., pushups)"
            className="flex-grow border border-gray-300 p-1 rounded-l"
            required
          />
          <button 
            type="submit" 
            className={`${editingHabit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 rounded-r`}
          >
            {editingHabit ? 'Update' : 'Add'}
          </button>
        </div>
        <div className="flex items-center mb-2">
          <label className="mr-2 text-sm">Start Date:</label>
          <input
            type="date"
            value={newHabitData.startDate}
            onChange={(e) => setNewHabitData(prev => ({ ...prev, startDate: e.target.value }))}
            className="border border-gray-300 p-1 rounded"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        {editingHabit && (
          <button 
            type="button" 
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {habits.length === 0 ? (
        <p className="text-gray-500">No habits added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Habit</th>
                {last7Days.map(date => (
                  <th key={date} className="p-2">
                    <div className="flex flex-col items-center">
                      <span className="text-base text-purple-600 font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(date).getDate()}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t">
                  <td className="p-2">
                    <div className="text-lg font-semibold flex items-center gap-2">
                      {habit.name}
                      {habit.streak > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gradient-to-r from-orange-400 to-red-500 text-white animate-pulse">
                          🔥 {habit.streak} days
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Streak: {habit.streak}</div>
                      <div className="text-xs">Started: {new Date(habit.startDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  {last7Days.map(date => {
                    const isPastDate = new Date(date) < new Date(new Date().toISOString().split('T')[0]);
                    const isBeforeStart = new Date(date) < new Date(habit.startDate);
                    return (
                      <td key={date} className="p-2 text-center">
                        {isBeforeStart ? (
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                            -
                          </div>
                        ) : isPastDate ? (
                          <div className="w-6 h-6 rounded-full bg-red-200 text-red-600 flex items-center justify-center">
                            ✕
                          </div>
                        ) : (
                          <button
                            onClick={() => markComplete(habit.id, date)}
                            className={`w-6 h-6 rounded-full ${
                              habit.completions[date]
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {habit.completions[date] ? '✓' : ''}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <WeekProgress />
    </div>
  );
}

export default HabitTracker;