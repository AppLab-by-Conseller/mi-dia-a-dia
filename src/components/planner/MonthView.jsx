import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { useMemo } from "react";

const MonthView = ({ tasks, onUpdate, onDelete, currentDate }) => {
  const monthDays = useMemo(() => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysToPadStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    for (let i = daysToPadStart; i > 0; i--) {
      const padDay = new Date(firstDayOfMonth);
      padDay.setDate(padDay.getDate() - i);
      days.push({ date: padDay, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const endDayOfWeek = lastDayOfMonth.getDay();
    const daysToPadEnd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;

    for (let i = 1; i <= daysToPadEnd; i++) {
        const padDay = new Date(lastDayOfMonth);
        padDay.setDate(padDay.getDate() + i);
        days.push({ date: padDay, isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  const tasksByDay = useMemo(() => {
    const tasksMap = {};
    monthDays.forEach(({ date }) => {
      tasksMap[date.toDateString()] = [];
    });
    tasks.forEach(task => {
      const taskDate = task.date.toDate().toDateString();
      if (tasksMap[taskDate]) {
        tasksMap[taskDate].push(task);
      }
    });
    return tasksMap;
  }, [tasks, monthDays]);

  return (
    <Box>
        <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2} textAlign="center" fontWeight="bold">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <GridItem key={day}>{day}</GridItem>)}
        </Grid>
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {monthDays.map(({ date, isCurrentMonth }) => (
            <GridItem
            key={date.toISOString()}
            bg={isCurrentMonth ? "white" : "gray.50"}
            p={1}
            borderRadius="md"
            border="1px"
            borderColor={isCurrentMonth ? "gray.200" : "gray.100"}
            minH="120px"
            >
            <Text
                fontSize="sm"
                fontWeight="bold"
                color={isCurrentMonth ? "gray.700" : "gray.400"}
            >
                {date.getDate()}
            </Text>
            <Box>
                {(tasksByDay[date.toDateString()] || []).map((task) => (
                <Box key={task.id} bg="blue.100" p={1} borderRadius="sm" fontSize="xs" mb={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {task.text}
                </Box>
                ))}
            </Box>
            </GridItem>
        ))}
        </Grid>
    </Box>
  );
};

export default MonthView;
