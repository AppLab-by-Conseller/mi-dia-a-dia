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
import { Box, Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import ExportButton from './ExportButton';

const PlannerScreen = ({ user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
    const { tasks, addTask, updateTask, deleteTask, loading } = useFirestore(user?.uid);
    
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

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = task.date.toDate();
            return taskDate.getFullYear() === currentDate.getFullYear() &&
                   taskDate.getMonth() === currentDate.getMonth() &&
                   taskDate.getDate() === currentDate.getDate();
        });
    }, [tasks, currentDate, viewMode]);

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(currentDate);

    return (
        <Box bg="gray.50" minH="100vh" py="8">
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Heading as="h1" size="xl">
                            Hola, {user?.displayName || 'Usuario'}
                        </Heading>
                        <Button colorScheme="red" onClick={() => auth.signOut()}>
                            Cerrar Sesión
                        </Button>
                    </Flex>

                    <DateNavigator 
                        currentDate={currentDate}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        changeDate={changeDate}
                    />

                    {viewMode === 'day' && <AddTaskForm onAddTask={handleAddTask} />}

                    <TaskList tasks={filteredTasks} onUpdate={updateTask} onDelete={deleteTask} />

                    <WellnessMetrics />

                    <DailyReflection />

                    <Button colorScheme="green">Descargar Vista como PDF</Button>

                </VStack>
            </Container>
            <Box as="footer" py="4" mt="8" textAlign="center" borderTop="1px" borderColor="gray.200">
                <Text fontSize="sm">©2025. Desarrollado por AppLab by Conseller. Todos los derechos reservados.</Text>
            </Box>
        </Box>
    );
};

export default PlannerScreen;
