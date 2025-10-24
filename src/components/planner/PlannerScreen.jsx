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
import { isTaskOnDate } from '../../utils/recurrence';

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
    return tasks.filter(task => isTaskOnDate(task, currentDate));
  }, [tasks, currentDate]);

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

      {viewMode === 'day' && <AddTaskForm onAddTask={handleAddTask} selectedDate={currentDate} />}

      <TaskList 
        tasks={tasks} // pasa todas las tareas, el filtrado se hace en TaskList
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
