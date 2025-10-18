import React, { useState } from 'react';
import { Box, Button, Flex, Heading, IconButton, Input, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Smile, Meh, Frown } from '../icons';

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editTime, setEditTime] = useState(task.scheduledTime || '');

    const handleUpdate = () => {
        onUpdate(task.id, { text: editText, scheduledTime: editTime });
        setIsEditing(false);
    };

    const completionStatusOptions = {
        pending: { label: 'Pendiente', bg: 'gray.200', color: 'gray.800' },
        completed: { label: 'Realizada', bg: 'green.200', color: 'green.800' },
        partial: { label: 'Parcialmente', bg: 'yellow.200', color: 'yellow.800' },
        abandoned: { label: 'Abandonada', bg: 'red.200', color: 'red.800' },
    };

    const moodOptions = {
        happy: { icon: <Smile />, color: 'green.500' },
        neutral: { icon: <Meh />, color: 'yellow.500' },
        sad: { icon: <Frown />, color: 'blue.500' },
    };

    const currentStatus = completionStatusOptions[task.completionState];

    return (
        <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            mb={4}
            borderWidth="1px"
            transition="box-shadow 0.3s"
            _hover={{ boxShadow: 'lg' }}
        >
            {isEditing ? (
                <Stack spacing={3}>
                    <Input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                    />
                    <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                    />
                    <Flex justify="flex-end" gap={2}>
                        <Button size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button size="sm" colorScheme="blue" onClick={handleUpdate}>Guardar</Button>
                    </Flex>
                </Stack>
            ) : (
                <Stack spacing={4}>
                    <Flex justify="space-between" align="flex-start">
                        <Box>
                            {task.scheduledTime && <Heading as="p" size="md" color="blue.600">{task.scheduledTime}</Heading>}
                            <Text fontSize="lg" wordBreak="break-word">{task.text}</Text>
                        </Box>
                        <Flex gap={2}>
                           <IconButton icon={<EditIcon />} size="sm" aria-label="Editar tarea" onClick={() => setIsEditing(true)} />
                           <IconButton icon={<DeleteIcon />} size="sm" aria-label="Eliminar tarea" colorScheme="red" variant="ghost" onClick={() => onDelete(task.id)} />
                        </Flex>
                    </Flex>

                    <Box>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>¿Cómo te sentiste?</Text>
                        <Stack direction="row" spacing={3}>
                            {Object.entries(moodOptions).map(([key, { icon, color }]) => (
                                <IconButton
                                    key={key}
                                    icon={icon}
                                    isRound
                                    aria-label={`Estado de ánimo ${key}`}
                                    onClick={() => onUpdate(task.id, { mood: key })}
                                    color={color}
                                    bg={task.mood === key ? 'blue.100' : 'gray.100'}
                                    transform={task.mood === key ? 'scale(1.1)' : 'none'}
                                    _hover={{ bg: 'gray.200' }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                         <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>Estado de la tarea</Text>
                         <Select
                            value={task.completionState}
                            onChange={(e) => onUpdate(task.id, { completionState: e.target.value })}
                            bg={currentStatus.bg}
                            color={currentStatus.color}
                            fontWeight="medium"
                            border="none"
                        >
                            {Object.entries(completionStatusOptions).map(([key, { label }]) => (
                                <option key={key} value={key} style={{ backgroundColor: 'white', color: 'black' }}>{label}</option>
                            ))}
                        </Select>
                    </Box>

                    <Box>
                        <Textarea
                            placeholder="Añade un comentario..."
                            value={task.comments || ''}
                            onChange={(e) => onUpdate(task.id, { comments: e.target.value })}
                            fontSize="sm"
                            bg="gray.50"
                            _focus={{ bg: 'white' }}
                            rows={2}
                        />
                    </Box>
                </Stack>
            )}
        </Box>
    );
};

export default TaskCard;
