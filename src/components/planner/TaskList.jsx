import { VStack, Box, Text } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { isTaskOnDate } from '../../utils/recurrence';

const TaskList = ({ tasks, onUpdate, onDelete, viewMode, currentDate, setCurrentDate, setViewMode }) => {
  // Filtrar tareas según recurrencia y fecha actual
  const filteredTasks = tasks.filter(task => isTaskOnDate(task, currentDate));

  if (viewMode === 'week') {
    return <WeekView tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} currentDate={currentDate} setCurrentDate={setCurrentDate} setViewMode={setViewMode} />;
  }

  if (viewMode === 'month') {
    return <MonthView tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} currentDate={currentDate} setCurrentDate={setCurrentDate} setViewMode={setViewMode} />;
  }

  // Vista diaria
  if (filteredTasks.length === 0) {
    return (
      <Box textAlign="center" p={10} borderRadius="lg">
        <Text color="gray.500">No hay actividades para este día.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </VStack>
  );
};

export default TaskList;
