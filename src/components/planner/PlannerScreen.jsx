import React, { useState, useMemo } from 'react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useFirestore } from '../../hooks/useFirestore';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import WellnessMetrics from './WellnessMetrics';
import DailyReflection from './DailyReflection';
import DateNavigator from './DateNavigator';
import { Button, Flex, Heading, VStack } from '@chakra-ui/react';
import ExportButton from './ExportButton';
import { es } from 'date-fns/locale';

const PlannerScreen = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const { tasks, addTask, updateTask, deleteTask } = useFirestore(user.uid);

  const handleAddTask = (text, scheduledTime, duration, recurrence) => {
    addTask(text, scheduledTime, currentDate, parseInt(duration, 10) || 0, recurrence);
  };

  const changeDate = (amount) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewMode === 'day') newDate.setDate(newDate.getDate() + amount);
      if (viewMode === 'week') newDate.setDate(newDate.getDate() + amount * 7);
      if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const handleSetDate = (date) => {
    setCurrentDate(date);
  };

  const filteredTasks = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return tasks.filter(task => {
      // La fecha ya es un objeto Date de JS gracias a la transformación en useFirestore
      if (!task.date || typeof task.date.getFullYear !== 'function') {
        return false; // Ignorar tareas sin fecha válida
      }
      const taskDate = task.date; 
      if (viewMode === 'day') {
        return taskDate.getFullYear() === currentDate.getFullYear() &&
               taskDate.getMonth() === currentDate.getMonth() &&
               taskDate.getDate() === currentDate.getDate();
      }
      if (viewMode === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      }
      if (viewMode === 'month') {
        return taskDate >= startOfMonth && taskDate <= endOfMonth;
      }
      return false;
    });
  }, [tasks, currentDate, viewMode]);

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  return (
    <VStack spacing={6} align="stretch" w="full" h="full" bg="white" p={6} borderRadius="lg" boxShadow="sm">
      <DateNavigator 
        currentDate={currentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        changeDate={changeDate}
        setCurrentDate={handleSetDate}
      />

      {viewMode === 'day' && <AddTaskForm onAddTask={handleAddTask} />}

      <TaskList 
        tasks={filteredTasks} 
        onUpdate={updateTask} 
        onDelete={deleteTask} 
        viewMode={viewMode}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setViewMode={setViewMode}
      />

      {viewMode === 'day' && (
        <>
          <WellnessMetrics tasks={filteredTasks} />
          <DailyReflection userId={user?.uid} date={currentDate} />
        </>
      )}
    </VStack>
  );
};

export default PlannerScreen;
