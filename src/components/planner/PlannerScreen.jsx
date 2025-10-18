import React, { useState, useMemo } from 'react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useFirestore } from '../../hooks/useFirestore';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import { Box, Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import ExportButton from './ExportButton';

const PlannerScreen = ({ user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { tasks, addTask, updateTask, deleteTask } = useFirestore(user.uid);
    
    const handleAddTask = (text, scheduledTime) => {
        addTask(text, scheduledTime, currentDate);
    };

    const changeDate = (days) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };
    
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = task.date;
            return taskDate.getFullYear() === currentDate.getFullYear() &&
                   taskDate.getMonth() === currentDate.getMonth() &&
                   taskDate.getDate() === currentDate.getDate();
        });
    }, [tasks, currentDate]);

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(currentDate);

    return (
        <Box bg="gray.50" minH="100vh" p={{ base: 4, sm: 6, lg: 8 }}>
            <Container maxW="3xl">
                <Box id="content-to-export" bg="gray.50">
                    <Flex as="header" justify="space-between" align="center" mb={6}>
                        <Heading as="h1" size={{ base: 'lg', sm: 'xl' }} color="gray.800">
                            Mi Día a Día
                        </Heading>
                        <Button colorScheme="red" onClick={() => signOut(auth)}>
                            Cerrar Sesión
                        </Button>
                    </Flex>
                    
                    <VStack spacing={6} align="stretch">
                        <Flex 
                            bg="white" 
                            p={4} 
                            borderRadius="xl" 
                            boxShadow="md" 
                            justify="space-between" 
                            align="center"
                        >
                            <Button onClick={() => changeDate(-1)}>Anterior</Button>
                            <Heading as="h2" size="lg" textAlign="center" color="blue.700">
                                {formattedDate}
                            </Heading>
                            <Button onClick={() => changeDate(1)}>Siguiente</Button>
                        </Flex>

                        <AddTaskForm onAddTask={handleAddTask} />

                        <Box>
                            {filteredTasks.length > 0 ? (
                                <VStack spacing={4} align="stretch">
                                    {filteredTasks.map(task => (
                                        <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                                    ))}
                                </VStack>
                            ) : (
                                <Box 
                                    textAlign="center" 
                                    p={10} 
                                    bg="white" 
                                    borderRadius="xl" 
                                    boxShadow="md" 
                                    borderWidth="1px"
                                >
                                    <Text color="gray.500">No hay tareas para este día.</Text>
                                    <Text color="gray.500" mt={2}>¡Añade una para empezar a planificar tu bienestar!</Text>
                                </Box>
                            )}
                        </Box>
                    </VStack>
                </Box>
                <Flex justify="center" mt={8}>
                    <ExportButton elementId="content-to-export" />
                </Flex>
            </Container>
        </Box>
    );
};

export default PlannerScreen;
