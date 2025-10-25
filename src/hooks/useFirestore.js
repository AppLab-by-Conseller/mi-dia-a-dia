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
import { isTaskOnDate } from '../utils/recurrence';

export function useFirestore(userId) {
    const [tasks, setTasks] = useState([]);
    
    // CORRECCIÓN: La ruta ahora apunta directamente a la subcolección 'tasks' del usuario.
    const tasksCollectionPath = `users/${userId}/tasks`;

    // Filtra duplicados: solo una instancia por recurrenceGroupId y fecha
    const filterUniqueTasks = (tasksArray) => {
        const seen = {};
        return tasksArray.filter(task => {
            if (!task.recurrenceGroupId) return true;
            const key = `${task.recurrenceGroupId}_${task.date.toISOString().slice(0,10)}`;
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
    };

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
            // Filtra duplicados antes de setear
            setTasks(filterUniqueTasks(tasksData));
        }, (error) => {
            console.error("Error al obtener las tareas:", error);
        });
        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        // Ejecuta la limpieza de duplicados al cargar el hook
        cleanRecurrenceDuplicates();
    }, []);

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
                // Generar fechas únicas según recurrencia
                if (recurrenceConfig?.endType === 'date' && recurrenceConfig?.endDate) {
                    endDate = new Date(recurrenceConfig.endDate);
                }
                if (recurrenceConfig?.endType === 'count' && recurrenceConfig?.occurrences) {
                    let count = 0;
                    while (count < recurrenceConfig.occurrences) {
                        let d = new Date(startDate); // SIEMPRE desde el inicio
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
                            if (isTaskOnDate({ recurrence: recurrenceValue, recurrenceConfig, date: d }, d)) dates.push(new Date(d));
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
                            if (isTaskOnDate({ recurrence: recurrenceValue, recurrenceConfig, date: d }, d)) dates.push(new Date(d));
                        }
                    }
                }
                // Antes de crear, verifica si ya existe una instancia para ese grupo y fecha
                const uniqueDateStrs = Array.from(new Set(dates.map(d => d.toISOString().slice(0,10))));
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
                // Tarea única: solo una vez en ese día
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
            console.error("Error al añadir la tarea:", error);
        }
    };

    const updateTask = async (id, updates, options = {}) => {
        // Bloquea propagación de mood, comments y completionState
        const nonPropagableFields = ['mood', 'comments', 'completionState'];
        const onlyNonPropagable = Object.keys(updates).every(field => nonPropagableFields.includes(field));
        if (options.allFollowing) {
            // Solo actualiza campos estructurales en TODAS las instancias, incluida la actual
            const allowedFields = ['text', 'scheduledTime', 'duration', 'recurrence', 'recurrenceConfig'];
            const structuralUpdates = {};
            allowedFields.forEach(key => {
                if (key in updates) {
                    structuralUpdates[key] = updates[key];
                }
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
                console.error("Error al actualizar la tarea actual:", error);
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
            // Editar solo esta instancia, permite cualquier campo
            const taskRef = doc(db, tasksCollectionPath, id);
            try {
                await updateDoc(taskRef, updates);
            } catch (error) {
                console.error("Error al actualizar la tarea:", error);
            }
        }
    };

    const cleanRecurrenceDuplicates = async () => {
        // Busca todas las tareas recurrentes y elimina duplicados dejando solo una por día por grupo
        const q = query(collection(db, tasksCollectionPath), where('recurrenceGroupId', '!=', null));
        const snapshot = await getDocs(q);
        const tasks = {};
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const group = data.recurrenceGroupId;
            const dateStr = data.date.toDate().toISOString().slice(0, 10);
            if (!tasks[group]) tasks[group] = {};
            if (!tasks[group][dateStr]) {
                tasks[group][dateStr] = docSnap.id;
            } else {
                // Duplicado, eliminar
                deleteDoc(doc(db, tasksCollectionPath, docSnap.id));
            }
        });
    };

    const deleteTask = async (id, options = {}) => {
        if (options.allFollowing && options.recurrenceGroupId && options.date) {
            // Validar que la fecha enviada sea la de la instancia actual
            const fromTimestamp = options.date instanceof Timestamp ? options.date : Timestamp.fromDate(new Date(options.date));
            // Eliminar solo la instancia actual y posteriores
            const q = query(
                collection(db, tasksCollectionPath),
                where('recurrenceGroupId', '==', options.recurrenceGroupId),
                where('date', '>=', fromTimestamp)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.forEach(docSnap => {
                // Solo elimina si la fecha es igual o posterior
                batch.delete(docSnap.ref);
            });
            await batch.commit();
        } else {
            // Eliminar solo esta instancia
            const taskRef = doc(db, tasksCollectionPath, id);
            try {
                await deleteDoc(taskRef);
            } catch (error) {
                console.error("Error al borrar la tarea:", error);
            }
        }
    };

    return { tasks, addTask, updateTask, deleteTask };
}

// Trigger deploy: commit tras cambio de permisos de Actions
