import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { useMemo } from "react";

const WeekView = ({ tasks, onUpdate, onDelete, currentDate }) => {
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

  const tasksByDay = useMemo(() => {
    const tasksMap = {};
    weekDays.forEach(day => {
      tasksMap[day.toDateString()] = [];
    });
    tasks.forEach(task => {
      const taskDate = task.date.toDate().toDateString();
      if (tasksMap[taskDate]) {
        tasksMap[taskDate].push(task);
      }
    });
    return tasksMap;
  }, [tasks, weekDays]);

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
      {weekDays.map((day) => (
        <GridItem key={day.toISOString()} bg="gray.100" p={2} borderRadius="md">
          <Text fontWeight="bold" textAlign="center" mb={2}>
            {day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })}
          </Text>
          <Box>
            {(tasksByDay[day.toDateString()] || []).map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default WeekView;
