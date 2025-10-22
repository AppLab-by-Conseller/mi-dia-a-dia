import React, { useState } from 'react';
import { Select, Button } from '@chakra-ui/react';

const recurrenceOptions = [
  { value: 'none', label: 'No se repite' },
  { value: 'daily', label: 'Todos los días' },
  { value: 'weekly', label: 'Cada semana, el mismo día' },
  { value: 'monthly', label: 'Todos los meses, el mismo n° [día de la semana]' },
  { value: 'yearly', label: 'Anualmente, el mismo día' },
  { value: 'weekdays', label: 'Todos los días hábiles (lunes a viernes)' },
  { value: 'custom', label: 'Personalizado…' },
];

const RecurrenceSelect = ({ value, onChange, onOpenCustom }) => {
  return (
    <Select
      value={value}
      onChange={e => {
        if (e.target.value === 'custom') {
          onOpenCustom();
        } else {
          onChange(e.target.value);
        }
      }}
      w={{ base: '100%', md: 'auto' }}
    >
      {recurrenceOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </Select>
  );
};

export default RecurrenceSelect;
