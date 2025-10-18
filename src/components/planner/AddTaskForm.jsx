import React, { useState } from 'react';
import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddTaskForm = ({ onAddTask }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTask(text, time);
            setText('');
            setTime('');
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
                    flexShrink={0}
                />
                <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ej: Preparar el desayuno"
                />
                <Button
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                    px={8}
                >
                    Añadir
                </Button>
            </Stack>
        </Box>
    );
};

export default AddTaskForm;
