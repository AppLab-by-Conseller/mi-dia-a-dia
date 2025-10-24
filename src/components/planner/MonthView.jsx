import { Grid, GridItem, Box, Text, VStack } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { isTaskOnDate } from '../../utils/recurrence';

const moodOptions = {
  happy: { color: "yellow.200" },
  sad: { color: "blue.200" },
  angry: { color: "red.200" },
  surprised: { color: "orange.200" },
  neutral: { color: "gray.200" },
};

const MonthView = ({ tasks, onUpdate, onDelete, currentDate, setCurrentDate, setViewMode }) => {
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

  const handleDayClick = (date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  return (
    <Box w="full">
        <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2} textAlign="center" fontWeight="bold">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <GridItem key={day} p={2}>{day}</GridItem>)}
        </Grid>
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {monthDays.map(({ date, isCurrentMonth }) => (
            <GridItem
            key={date.toISOString()}
            bg={isCurrentMonth ? "white" : "gray.50"}
            p={2}
            borderRadius="md"
            border="1px"
            borderColor={isCurrentMonth ? "gray.200" : "transparent"}
            minH="120px"
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={() => handleDayClick(date)}
            display="flex"
            flexDirection="column"
            >
            <Text
                fontSize="sm"
                fontWeight="bold"
                color={isCurrentMonth ? "gray.700" : "gray.400"}
                alignSelf="flex-start"
            >
                {date.getDate()}
            </Text>
            <Box flex="1" w="full" overflowY="auto" mt={2}>
                {tasks.filter(task => isTaskOnDate(task, date)).map((task) => {
                    // Color de emoción
                    let bgColor = "blue.100";
                    if (task.mood && moodOptions[task.mood]) {
                        bgColor = moodOptions[task.mood].color;
                    }
                    return (
                        <Box key={task.id} bg={bgColor} p={1} borderRadius="sm" fontSize="xs" mb={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                            {task.text}
                        </Box>
                    );
                })}
            </Box>
            </GridItem>
        ))}
        </Grid>
    </Box>
  );
};

export default MonthView;
