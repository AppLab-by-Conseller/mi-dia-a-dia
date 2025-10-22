import React, { useEffect, useState } from 'react';
import {
    Box, Button, Container, Flex, Heading, Text, VStack,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    useDisclosure, FormControl, FormLabel, Input, Select, Textarea, SimpleGrid, IconButton,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { EditIcon, Trash2 } from 'lucide-react';
import { FaRegSadTear, FaRegFrown, FaRegMeh, FaRegSmile, FaRegGrinBeam } from 'react-icons/fa';
import EditRecurrenceModal from './EditRecurrenceModal';

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
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [editedTask, setEditedTask] = useState(task);
    const [showEditRecurrenceModal, setShowEditRecurrenceModal] = useState(false);
    const [showDeleteRecurrenceModal, setShowDeleteRecurrenceModal] = useState(false);
    const cancelRef = React.useRef();

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleUpdate = () => {
        if (editedTask.recurrence && editedTask.recurrence !== 'no-repite') {
            setShowEditRecurrenceModal(true);
        } else {
            onUpdate(task.id, editedTask);
            onClose();
        }
    };

    const handleDelete = () => {
        if (task.recurrenceGroupId) {
            setShowDeleteRecurrenceModal(true);
        } else {
            onDelete(task.id);
            onDeleteClose();
        }
    };

    const handleApplyDelete = () => {
        // Eliminar solo esta instancia
        onDelete(task.id, { onlyThis: true });
        setShowDeleteRecurrenceModal(false);
        onDeleteClose();
    };

    const handleApplyDeleteAll = async () => {
        // Eliminar esta y todas las posteriores de la serie
        if (task.recurrenceGroupId && task.date) {
            await onDelete(task.id, {
                allFollowing: true,
                recurrenceGroupId: task.recurrenceGroupId,
                date: task.date
            });
        }
        setShowDeleteRecurrenceModal(false);
        onDeleteClose();
    };

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

    const handleApplyEdit = () => {
        // Editar solo esta instancia
        onUpdate(task.id, editedTask, { onlyThis: true });
        setShowEditRecurrenceModal(false);
        onClose();
    };

    const handleApplyEditAll = () => {
        // Editar esta y todas las posteriores
        onUpdate(task.id, editedTask, { allFollowing: true });
        setShowEditRecurrenceModal(false);
        onClose();
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
                        <IconButton icon={<Trash2 size="16" />} aria-label="Eliminar" size="sm" variant="ghost" colorScheme="red" onClick={(e) => { e.stopPropagation(); onDeleteOpen(); }} />
                    </Flex>
                </Flex>
            </Box>

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Tarea
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

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
                                <Select name="recurrence" value={editedTask.recurrence || 'none'} onChange={handleInputChange}>
                                    <option value="none">No se repite</option>
                                    <option value="daily">Todos los días</option>
                                    <option value="weekly">Cada semana, el mismo día</option>
                                    <option value="monthly">Todos los meses, el mismo n° [día de la semana]</option>
                                    <option value="yearly">Anualmente, el mismo día</option>
                                    <option value="weekdays">Todos los días hábiles (lunes a viernes)</option>
                                    <option value="custom">Personalizado...</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Estado</FormLabel>
                                <Select name="completionState" value={editedTask.completionState} onChange={handleInputChange}>
                                    {Object.entries(completionStatusOptions).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
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
                                                size="lg"
                                                aria-label={label}
                                                onClick={() => setEditedTask(prev => ({ ...prev, mood: key }))}
                                                color={color}
                                                bg={editedTask.mood === key ? 'blue.100' : 'gray.100'}
                                                transform={editedTask.mood === key ? 'scale(1.1)' : 'none'}
                                            />
                                            <Text fontSize="xs">{label}</Text>
                                        </VStack>
                                    ))}
                                </Flex>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Comentarios</FormLabel>
                                <Textarea name="comments" value={editedTask.comments || ''} onChange={handleInputChange} />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="blue" onClick={handleUpdate}>Guardar Cambios</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <EditRecurrenceModal
                isOpen={showEditRecurrenceModal}
                onClose={() => setShowEditRecurrenceModal(false)}
                onApply={handleApplyEdit}
                onApplyAll={handleApplyEditAll}
            />

            <EditRecurrenceModal
                isOpen={showDeleteRecurrenceModal}
                onClose={() => setShowDeleteRecurrenceModal(false)}
                onApply={handleApplyDelete}
                onApplyAll={handleApplyDeleteAll}
            />
        </>
    );
};

export default TaskCard;
