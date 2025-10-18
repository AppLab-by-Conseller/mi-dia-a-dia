import { VStack, Box, Text } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import WeekView from "./WeekView";
import MonthView from "./MonthView";

const TaskList = ({ tasks, onUpdate, onDelete, viewMode, currentDate }) => {
  if (viewMode === 'week') {
    return <WeekView tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} currentDate={currentDate} />;
  }

  if (viewMode === 'month') {
    return <MonthView tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} currentDate={currentDate} />;
  }

  // Day view
  if (tasks.length === 0) {
    return (
      <Box textAlign="center" p={10} bg="white" borderRadius="lg" shadow="md">
        <Text color="gray.500">No hay actividades para este día.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </VStack>
  );
};

export default TaskList;
