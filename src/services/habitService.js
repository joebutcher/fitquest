import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const habitService = {
  async addHabit(habitData) {
    try {
      const userHabitsRef = collection(db, 'habits');
      const habit = {
        ...habitData,
        userId: auth.currentUser.uid,
        completions: {},
        streak: 0,
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

  async updateHabit(habitId, updates) {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating habit:', error);
      return false;
    }
  },

  async deleteHabit(habitId) {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await deleteDoc(habitRef);
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  }
}; 