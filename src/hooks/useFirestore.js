import { useState, useEffect, useMemo } from 'react';
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
    Timestamp
} from 'firebase/firestore';

export function useFirestore(userId) {
    const [tasks, setTasks] = useState([]);
    
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const tasksCollectionPath = `artifacts/${appId}/users/${userId}/tasks`;

    useEffect(() => {
        if (!userId) {
            setTasks([]);
            return;
        }

        const q = query(collection(db, tasksCollectionPath), where("userId", "==", userId));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate()
            }));
            tasksData.sort((a, b) => {
                if (a.scheduledTime && b.scheduledTime) {
                    return a.scheduledTime.localeCompare(b.scheduledTime);
                }
                return a.createdAt - b.createdAt;
            });
            setTasks(tasksData);
        }, (error) => {
            console.error("Error al obtener las tareas:", error);
        });

        return () => unsubscribe();
    }, [userId]);

    const addTask = async (text, scheduledTime, currentDate, duration, recurrence) => {
        if (!userId) return;
        try {
            await addDoc(collection(db, 'tasks'), {
                text,
                scheduledTime,
                duration,
                recurrence,
                completionState: 'pending',
                mood: null,
                comments: '',
                userId: userId,
                createdAt: serverTimestamp(),
                date: Timestamp.fromDate(currentDate),
            });
        } catch (error) {
            console.error("Error al añadir la tarea:", error);
        }
    };

    const updateTask = async (id, updates) => {
        const taskRef = doc(db, tasksCollectionPath, id);
        try {
            await updateDoc(taskRef, updates);
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    const deleteTask = async (id) => {
        const taskRef = doc(db, tasksCollectionPath, id);
        try {
            await deleteDoc(taskRef);
        } catch (error) {
            console.error("Error al borrar la tarea:", error);
        }
    };

    return { tasks, addTask, updateTask, deleteTask };
}
