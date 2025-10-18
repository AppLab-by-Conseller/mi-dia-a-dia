import React, { useState } from 'react';
import { Box, Button, Heading, Input, Select, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddTaskForm = ({ onAddTask }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [recurrence, setRecurrence] = useState('none');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTask(text, time, duration, recurrence);
            setText('');
            setTime('');
            setDuration('');
            setRecurrence('none');
        }
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            p={4}
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            mb={6}
            borderWidth={1}
        >
            <Heading as="h3" size="md" mb={3} color="gray.700">
                Añadir una nueva tarea para cuidarte
            </Heading>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
                <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    w={{ base: '100%', md: 'auto' }}
                />
                <Input
                    placeholder="Ej: Preparar el desayuno"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    flex="1"
                />
                <Input
                    type="number"
                    placeholder="Duración (min)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    w={{ base: '100%', md: '140px' }}
                />
                <Select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                    w={{ base: '100%', md: 'auto' }}
                >
                    <option value="none">No se repite</option>
                    <option value="daily">Todos los días</option>
                    <option value="weekly">Cada semana</option>
                </Select>
                <Button
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                >
                    Añadir
                </Button>
            </Stack>
        </Box>
    );
};

export default AddTaskForm;
