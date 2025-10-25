import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { isTaskOnDate } from '../utils/recurrence';

export function useFirestore(userId) {
  const [tasks, setTasks] = useState([]);
  const tasksCollectionPath = `users/${userId}/tasks`;

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }
    const q = query(collection(db, tasksCollectionPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      setTasks(tasksData);
    }, (error) => {
      console.error('Error al obtener las tareas:', error);
    });
    return () => unsubscribe();
  }, [userId]);

  // --- EDICIÓN ---
  const updateTask = async (id, updates, options = {}) => {
    const structuralFields = ['text', 'scheduledTime', 'duration', 'recurrence', 'recurrenceConfig'];
    const nonStructuralFields = ['mood', 'comments', 'completionState'];
    if (options.allFollowing) {
      // Solo propagar estructurales
      const structuralUpdates = {};
      structuralFields.forEach(key => {
        if (key in updates) structuralUpdates[key] = updates[key];
      });
      if (!updates.recurrenceGroupId || !updates.date) {
        console.warn('Faltan recurrenceGroupId o date para edición masiva.');
        return;
      }
      // Actualiza la instancia actual SOLO con los estructurales
      const taskRef = doc(db, tasksCollectionPath, id);
      try {
        await updateDoc(taskRef, structuralUpdates);
      } catch (error) {
        console.error('Error al actualizar la tarea actual:', error);
      }
      // Propaga solo los estructurales a las posteriores
      const q = query(
        collection(db, tasksCollectionPath),
        where('recurrenceGroupId', '==', updates.recurrenceGroupId),
        where('date', '>', updates.date)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach(docSnap => {
        batch.update(docSnap.ref, structuralUpdates);
      });
      await batch.commit();
    } else {
      // Edición individual: permite cualquier campo
      const taskRef = doc(db, tasksCollectionPath, id);
      try {
        await updateDoc(taskRef, updates);
      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
      }
    }
  };

  // --- ELIMINACIÓN ---
  const deleteTask = async (id, options = {}) => {
    if (options.allFollowing && options.recurrenceGroupId && options.date) {
      const fromTimestamp = options.date instanceof Timestamp ? options.date : Timestamp.fromDate(new Date(options.date));
      // Elimina la instancia actual y posteriores
      const q = query(
        collection(db, tasksCollectionPath),
        where('recurrenceGroupId', '==', options.recurrenceGroupId),
        where('date', '>=', fromTimestamp)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } else {
      // Elimina solo la instancia actual
      const taskRef = doc(db, tasksCollectionPath, id);
      try {
        await deleteDoc(taskRef);
      } catch (error) {
        console.error('Error al borrar la tarea:', error);
      }
    }
  };

  // --- CREACIÓN ---
  const addTask = async (text, scheduledTime, currentDate, duration, recurrence) => {
    if (!userId) return;
    try {
      let recurrenceValue = recurrence;
      let recurrenceConfig = null;
      let recurrenceGroupId = null;
      if (typeof recurrence === 'object') {
        recurrenceValue = 'custom';
        recurrenceConfig = recurrence;
      }
      if (recurrenceValue && recurrenceValue !== 'none') {
        recurrenceGroupId = Math.random().toString(36).substr(2, 9) + Date.now();
        const startDate = new Date(currentDate);
        let endDate = new Date(currentDate);
        let dates = [];
        if (recurrenceConfig?.endType === 'date' && recurrenceConfig?.endDate) {
          endDate = new Date(recurrenceConfig.endDate);
        }
        if (recurrenceConfig?.endType === 'count' && recurrenceConfig?.occurrences) {
          let count = 0;
          while (count < recurrenceConfig.occurrences) {
            let d = new Date(startDate);
            if (recurrenceValue === 'daily') {
              d.setDate(startDate.getDate() + count);
              dates.push(new Date(d));
            } else if (recurrenceValue === 'weekly') {
              d.setDate(startDate.getDate() + count * 7);
              dates.push(new Date(d));
            } else if (recurrenceValue === 'weekdays') {
              d.setDate(startDate.getDate() + count);
              if (d.getDay() >= 1 && d.getDay() <= 5) dates.push(new Date(d));
            } else if (recurrenceValue === 'monthly') {
              d.setMonth(startDate.getMonth() + count);
              dates.push(new Date(d));
            } else if (recurrenceValue === 'yearly') {
              d.setFullYear(startDate.getFullYear() + count);
              dates.push(new Date(d));
            } else if (recurrenceValue === 'custom') {
              d.setDate(startDate.getDate() + count);
              dates.push(new Date(d)); // Personalizado: agregar lógica si es necesario
            }
            count++;
          }
        } else {
          // Por defecto, generar fechas hasta 1 mes adelante
          const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          for (let i = 0; i <= daysDiff; i++) {
            let d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            if (recurrenceValue === 'daily') {
              dates.push(new Date(d));
            } else if (recurrenceValue === 'weekly') {
              if (d.getDay() === startDate.getDay()) dates.push(new Date(d));
            } else if (recurrenceValue === 'weekdays') {
              if (d.getDay() >= 1 && d.getDay() <= 5) dates.push(new Date(d));
            } else if (recurrenceValue === 'monthly') {
              if (d.getDate() === startDate.getDate()) dates.push(new Date(d));
            } else if (recurrenceValue === 'yearly') {
              if (d.getDate() === startDate.getDate() && d.getMonth() === startDate.getMonth()) dates.push(new Date(d));
            } else if (recurrenceValue === 'custom') {
              dates.push(new Date(d)); // Personalizado: agregar lógica si es necesario
            }
          }
        }
        // Crear instancias únicas
        const uniqueDateStrs = Array.from(new Set(dates.map(d => d.toISOString().slice(0, 10))));
        for (const dateStr of uniqueDateStrs) {
          const dateObj = new Date(dateStr);
          const q = query(collection(db, tasksCollectionPath), where('recurrenceGroupId', '==', recurrenceGroupId), where('date', '==', Timestamp.fromDate(dateObj)));
          const existing = await getDocs(q);
          if (existing.empty) {
            await addDoc(collection(db, tasksCollectionPath), {
              text,
              scheduledTime,
              duration,
              recurrence: recurrenceValue,
              recurrenceConfig,
              recurrenceGroupId,
              completionState: 'pending',
              mood: null,
              comments: '',
              createdAt: serverTimestamp(),
              date: Timestamp.fromDate(dateObj),
            });
          }
        }
      } else {
        // Tarea única
        await addDoc(collection(db, tasksCollectionPath), {
          text,
          scheduledTime,
          duration,
          recurrence: recurrenceValue,
          recurrenceConfig,
          recurrenceGroupId: null,
          completionState: 'pending',
          mood: null,
          comments: '',
          createdAt: serverTimestamp(),
          date: Timestamp.fromDate(new Date(currentDate)),
        });
      }
    } catch (error) {
      console.error('Error al añadir la tarea:', error);
    }
  };

  return { tasks, addTask, updateTask, deleteTask };
}

// Trigger deploy: commit tras cambio de permisos de Actions
