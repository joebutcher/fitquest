import React, { useState } from 'react';

function WorkoutLog() {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    intensity: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (formData.type && formData.duration && formData.intensity) {
      setWorkouts([...workouts, { ...formData, date: new Date().toISOString() }]);
      setFormData({ type: '', duration: '', intensity: '', notes: '' });
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Workout Log</h2>
      <form onSubmit={handleAddWorkout} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm">Workout Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Intensity</label>
          <select
            name="intensity"
            value={formData.intensity}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            rows="3"
            placeholder="Add any notes about your workout..."
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
          Add Workout
        </button>
      </form>
      <div>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No workouts logged yet.</p>
        ) : (
          <ul>
            {workouts.map((workout, index) => (
              <li key={index} className="border-b py-2">
                <p><strong>Type:</strong> {workout.type}</p>
                <p><strong>Duration:</strong> {workout.duration} min</p>
                <p><strong>Intensity:</strong> {workout.intensity}</p>
                {workout.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Notes:</strong> {workout.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(workout.date).toLocaleDateString()} {new Date(workout.date).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WorkoutLog;