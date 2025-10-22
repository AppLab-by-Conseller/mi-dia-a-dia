import React, { useState } from 'react';
import { Box, Button, Heading, Input, Stack, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import RecurrenceSelect from './RecurrenceSelect';
import RecurrenceModal from './RecurrenceModal';
import EditRecurrenceModal from './EditRecurrenceModal';

const AddTaskForm = ({ onAddTask }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const [customRecurrence, setCustomRecurrence] = useState(null);
    const [showEditRecurrenceModal, setShowEditRecurrenceModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskData, setEditTaskData] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleCustomSave = (data) => {
        setCustomRecurrence(data);
        setRecurrence('custom');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTask(text, time, duration, recurrence === 'custom' ? customRecurrence : recurrence);
            setText('');
            setTime('');
            setDuration('');
            setRecurrence('none');
            setCustomRecurrence(null);
        }
    };

    // Simulación de inicio de edición (debería integrarse con la lógica real de edición)
    const handleEditTask = (task) => {
        setEditMode(true);
        setEditTaskId(task.id);
        setEditTaskData(task);
        if (task.recurrence && task.recurrence !== 'none') {
            setShowEditRecurrenceModal(true);
        } else {
            // Editar directamente si no es recurrente
            // ... lógica de edición directa ...
        }
    };

    const handleApplyEdit = () => {
        // Editar solo esta instancia
        // ... lógica para updateTask(editTaskId, updates, { onlyThis: true }) ...
        setShowEditRecurrenceModal(false);
        setEditMode(false);
    };

    const handleApplyEditAll = () => {
        // Editar esta y todas las posteriores
        // ... lógica para updateTask(editTaskId, updates, { allFollowing: true }) ...
        setShowEditRecurrenceModal(false);
        setEditMode(false);
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
                Añade una nueva actividad
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
                <RecurrenceSelect
                    value={recurrence}
                    onChange={setRecurrence}
                    onOpenCustom={onOpen}
                />
                <Button
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                >
                    Añadir
                </Button>
            </Stack>
            <RecurrenceModal
                isOpen={isOpen}
                onClose={onClose}
                onSave={handleCustomSave}
                initial={customRecurrence}
            />
            <EditRecurrenceModal
                isOpen={showEditRecurrenceModal}
                onClose={() => setShowEditRecurrenceModal(false)}
                onApply={handleApplyEdit}
                onApplyAll={handleApplyEditAll}
            />
        </Box>
    );
};

export default AddTaskForm;
