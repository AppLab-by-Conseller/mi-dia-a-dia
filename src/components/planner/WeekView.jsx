import { Grid, GridItem, Box, Text, VStack } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { isTaskOnDate } from '../../utils/recurrence';

const WeekView = ({ tasks, onUpdate, onDelete, currentDate, setCurrentDate, setViewMode }) => {
  const weekDays = useMemo(() => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when week starts
    startOfWeek.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const dayInWeek = new Date(startOfWeek);
      dayInWeek.setDate(startOfWeek.getDate() + i);
      week.push(dayInWeek);
    }
    return week;
  }, [currentDate]);

  const handleDayClick = (date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(7, 1fr)" }} gap={4} flex="1">
      {weekDays.map((day) => {
        const dayTasks = tasks.filter(task => isTaskOnDate(task, day));
        return (
          <GridItem 
            key={day.toISOString()} 
            bg="gray.50" 
            p={4} 
            borderRadius="lg" 
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={() => handleDayClick(day)}
          >
            <Text fontWeight="bold" textAlign="center" mb={4} fontSize="lg">
              {day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })}
            </Text>
            <VStack spacing={4} align="stretch">
              {dayTasks.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>Sin tareas</Text>
              ) : (
                dayTasks.map(task => (
                  <TaskCard key={task.id + day.toISOString()} task={task} onUpdate={onUpdate} onDelete={onDelete} />
                ))
              )}
            </VStack>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default WeekView;
