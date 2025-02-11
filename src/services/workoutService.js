import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const workoutService = {
  async addWorkout(workoutData) {
    try {
      const userWorkoutsRef = collection(db, 'workouts');
      const workout = {
        ...workoutData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };
      await addDoc(userWorkoutsRef, workout);
      return true;
    } catch (error) {
      console.error('Error adding workout:', error);
      return false;
    }
  },

  async getUserWorkouts() {
    try {
      const userWorkoutsRef = collection(db, 'workouts');
      const q = query(userWorkoutsRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  }
};

export const habitService = {
  async addHabit(habitData) {
    try {
      const userHabitsRef = collection(db, 'habits');
      const habit = {
        ...habitData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };
      await addDoc(userHabitsRef, habit);
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  },

  async getUserHabits() {
    try {
      const userHabitsRef = collection(db, 'habits');
      const q = query(userHabitsRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  },

  async updateHabitCompletions(habitId, completions) {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, { completions });
      return true;
    } catch (error) {
      console.error('Error updating habit completions:', error);
      return false;
    }
  }
}; 