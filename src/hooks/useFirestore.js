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
    Timestamp,
    serverTimestamp,
    getDocs,
    writeBatch
} from 'firebase/firestore';

export function useFirestore(userId) {
    const [tasks, setTasks] = useState([]);
    
    // CORRECCIÓN: La ruta ahora apunta directamente a la subcolección 'tasks' del usuario.
    const tasksCollectionPath = `users/${userId}/tasks`;

    useEffect(() => {
        if (!userId) {
            setTasks([]);
            return;
        }

        // La consulta ya no necesita un 'where("userId", "==", userId)' porque la ruta de la colección es específica del usuario.
        const q = query(collection(db, tasksCollectionPath));
        
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
            let recurrenceValue = recurrence;
            let recurrenceConfig = null;
            if (typeof recurrence === 'object') {
                recurrenceValue = 'custom';
                recurrenceConfig = recurrence;
            }
            await addDoc(collection(db, tasksCollectionPath), {
                text,
                scheduledTime,
                duration,
                recurrence: recurrenceValue,
                recurrenceConfig,
                completionState: 'pending',
                mood: null,
                comments: '',
                createdAt: serverTimestamp(),
                date: Timestamp.fromDate(currentDate),
            });
        } catch (error) {
            console.error("Error al añadir la tarea:", error);
            // Fallback por si serverTimestamp() falla en el entorno de build
            if (error instanceof ReferenceError) {
                console.log("serverTimestamp no definido, usando new Date() como fallback.");
                try {
                    await addDoc(collection(db, tasksCollectionPath), {
                        text,
                        scheduledTime,
                        duration,
                        recurrence,
                        completionState: 'pending',
                        mood: null,
                        comments: '',
                        // userId: userId,
                        createdAt: new Date(), // Fallback a la fecha del cliente
                        date: Timestamp.fromDate(currentDate),
                    });
                } catch (fallbackError) {
                    console.error("Error en el fallback al añadir la tarea:", fallbackError);
                }
            }
        }
    };

    const updateTask = async (id, updates, options = {}) => {
        if (options.allFollowing) {
            // Buscar todas las tareas recurrentes con el mismo grupo/serie y fecha >= a la seleccionada
            // Suponiendo que cada tarea recurrente tiene un campo recurrenceGroupId y date
            const q = query(
                collection(db, tasksCollectionPath),
                where('recurrenceGroupId', '==', updates.recurrenceGroupId),
                where('date', '>=', updates.date)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.forEach(docSnap => {
                batch.update(docSnap.ref, updates);
            });
            await batch.commit();
        } else {
            // Editar solo esta instancia
            const taskRef = doc(db, tasksCollectionPath, id);
            try {
                await updateDoc(taskRef, updates);
            } catch (error) {
                console.error("Error al actualizar la tarea:", error);
            }
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
