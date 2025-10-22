import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  Stack,
  Text,
  Radio,
  RadioGroup,
  Input
} from '@chakra-ui/react';

const daysOfWeek = [
  { value: 'L', label: 'Lunes' },
  { value: 'M', label: 'Martes' },
  { value: 'X', label: 'Miércoles' },
  { value: 'J', label: 'Jueves' },
  { value: 'V', label: 'Viernes' },
  { value: 'S', label: 'Sábado' },
  { value: 'D', label: 'Domingo' },
];

const weeksOfMonth = [
  { value: 1, label: 'Primer' },
  { value: 2, label: 'Segundo' },
  { value: 3, label: 'Tercer' },
  { value: 4, label: 'Cuarto' },
];

const RecurrenceModal = ({ isOpen, onClose, onSave, initial }) => {
  const [frequency, setFrequency] = useState(initial?.frequency || 'weekly');
  const [interval, setInterval] = useState(initial?.interval || 1);
  const [days, setDays] = useState(initial?.days || []);
  const [weekOfMonth, setWeekOfMonth] = useState(initial?.weekOfMonth || 1);
  const [endType, setEndType] = useState(initial?.endType || 'never');
  const [endDate, setEndDate] = useState(initial?.endDate || '');
  const [occurrences, setOccurrences] = useState(initial?.occurrences || 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recurrencia personalizada</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <RadioGroup value={frequency} onChange={setFrequency}>
              <Stack direction="row">
                <Radio value="daily">Día</Radio>
                <Radio value="weekly">Semana</Radio>
                <Radio value="monthly">Mes</Radio>
                <Radio value="yearly">Año</Radio>
              </Stack>
            </RadioGroup>
            <Stack direction="row" align="center">
              <Text>Repetir cada</Text>
              <NumberInput min={1} value={interval} onChange={(_, v) => setInterval(v)} w="80px">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text>{frequency === 'daily' ? 'día(s)' : frequency === 'weekly' ? 'semana(s)' : frequency === 'monthly' ? 'mes(es)' : 'año(s)'}</Text>
            </Stack>
            {frequency === 'weekly' && (
              <CheckboxGroup value={days} onChange={setDays}>
                <Stack direction="row">
                  {daysOfWeek.map(d => (
                    <Checkbox key={d.value} value={d.value}>{d.label}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
            {frequency === 'monthly' && (
              <Stack direction="row" align="center">
                <Select value={weekOfMonth} onChange={e => setWeekOfMonth(Number(e.target.value))} w="120px">
                  {weeksOfMonth.map(w => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </Select>
                <Select value={days[0] || ''} onChange={e => setDays([e.target.value])} w="120px">
                  {daysOfWeek.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </Select>
                <Text>del mes</Text>
              </Stack>
            )}
            <RadioGroup value={endType} onChange={setEndType}>
              <Stack direction="row">
                <Radio value="never">Nunca</Radio>
                <Radio value="date">El</Radio>
                <Radio value="count">Después de</Radio>
              </Stack>
            </RadioGroup>
            {endType === 'date' && (
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} w="200px" />
            )}
            {endType === 'count' && (
              <Stack direction="row" align="center">
                <NumberInput min={1} value={occurrences} onChange={(_, v) => setOccurrences(v)} w="80px">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>ocurrencias</Text>
              </Stack>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost">Cancelar</Button>
          <Button colorScheme="blue" onClick={() => onSave({ frequency, interval, days, weekOfMonth, endType, endDate, occurrences })}>Listo</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecurrenceModal;
