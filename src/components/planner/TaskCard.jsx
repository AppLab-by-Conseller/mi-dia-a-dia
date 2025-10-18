import React, { useEffect, useState } from 'react';
import {
    Box, Button, Container, Flex, Heading, Text, VStack,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    useDisclosure, FormControl, FormLabel, Input, Select, Textarea, SimpleGrid, IconButton
} from '@chakra-ui/react';
import { EditIcon, Trash2 } from 'lucide-react';
import { FaRegSadTear, FaRegFrown, FaRegMeh, FaRegSmile, FaRegGrinBeam } from 'react-icons/fa';

const moodOptions = {
    terrible: { icon: <FaRegSadTear />, color: 'red.500', label: 'Terrible' },
    mal: { icon: <FaRegFrown />, color: 'orange.500', label: 'Mal' },
    normal: { icon: <FaRegMeh />, color: 'yellow.500', label: 'Normal' },
    bien: { icon: <FaRegSmile />, color: 'teal.500', label: 'Bien' },
    genial: { icon: <FaRegGrinBeam />, color: 'green.500', label: 'Genial' },
};

const completionStatusOptions = {
    pending: { label: 'Pendiente', bg: 'gray.200', color: 'gray.800' },
    completed: { label: 'Realizada', bg: 'green.200', color: 'green.800' },
    partial: { label: 'Parcialmente', bg: 'yellow.200', color: 'yellow.800' },
    abandoned: { label: 'Abandonada', bg: 'red.200', color: 'red.800' },
};

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editedTask, setEditedTask] = useState(task);

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleUpdate = () => {
        onUpdate(task.id, editedTask);
        onClose();
    };

    const handleDelete = () => {
        onDelete(task.id);
        onClose();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    };
    
    const handleMoodChange = (mood) => {
        onUpdate(task.id, { mood });
    };

    const handleStatusChange = (e) => {
        onUpdate(task.id, { completionState: e.target.value });
    };
    
    const handleCommentsChange = (e) => {
        onUpdate(task.id, { comments: e.target.value });
    };

    const currentStatus = completionStatusOptions[task.completionState];

    return (
        <>
            <Box
                p={4}
                bg="white"
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
                _hover={{ shadow: "lg", cursor: "pointer" }}
                onClick={onOpen}
            >
                <Flex justify="space-between" align="center">
                    <Box>
                        {task.scheduledTime && <Text fontSize="sm" color="gray.500">{task.scheduledTime}</Text>}
                        <Text fontWeight="bold">{task.text}</Text>
                    </Box>
                    <Flex gap={2}>
                        <IconButton icon={<EditIcon size="16" />} aria-label="Editar" size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpen(); }} />
                        <IconButton icon={<Trash2 size="16" />} aria-label="Eliminar" size="sm" variant="ghost" colorScheme="red" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} />
                    </Flex>
                </Flex>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Detalles de la Tarea</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Actividad</FormLabel>
                                <Input name="text" value={editedTask.text} onChange={handleInputChange} />
                            </FormControl>
                            <SimpleGrid columns={2} spacing={4}>
                                <FormControl>
                                    <FormLabel>Hora</FormLabel>
                                    <Input type="time" name="scheduledTime" value={editedTask.scheduledTime || ''} onChange={handleInputChange} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Duración (min)</FormLabel>
                                    <Input type="number" name="duration" value={editedTask.duration || ''} onChange={handleInputChange} />
                                </FormControl>
                            </SimpleGrid>
                             <FormControl>
                                <FormLabel>Recurrencia</FormLabel>
                                <Select name="recurrence" value={editedTask.recurrence || 'no-repite'} onChange={handleInputChange}>
                                    <option value="no-repite">No se repite</option>
                                    <option value="diaria">Diaria</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensual">Mensual</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>¿Cómo te sentiste?</FormLabel>
                                <Flex justify="space-around">
                                    {Object.entries(moodOptions).map(([key, { icon, color, label }]) => (
                                        <VStack key={key} spacing={1}>
                                            <IconButton
                                                icon={icon}
                                                isRound
                                                aria-label={label}
                                                onClick={() => handleMoodChange(key)}
                                                color={color}
                                                bg={task.mood === key ? 'blue.100' : 'gray.100'}
                                                transform={task.mood === key ? 'scale(1.15)' : 'none'}
                                                _hover={{ bg: 'gray.200' }}
                                                size="lg"
                                            />
                                            <Text fontSize="xs">{label}</Text>
                                        </VStack>
                                    ))}
                                </Flex>
                            </FormControl>
                             <FormControl>
                                <FormLabel>Estado de la tarea</FormLabel>
                                <Select value={task.completionState} onChange={handleStatusChange}>
                                    {Object.entries(completionStatusOptions).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Comentarios</FormLabel>
                                <Textarea placeholder="Añade un comentario..." value={task.comments || ''} onChange={handleCommentsChange} />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cerrar
                        </Button>
                        <Button colorScheme="red" mr={3} onClick={handleDelete}>
                            Eliminar Tarea
                        </Button>
                        <Button colorScheme="blue" onClick={handleUpdate}>
                            Guardar Cambios
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TaskCard;
