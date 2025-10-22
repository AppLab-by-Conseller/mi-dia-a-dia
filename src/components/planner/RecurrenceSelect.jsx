import React, { useState } from 'react';
import { Select, Button } from '@chakra-ui/react';
import { format, getDay } from 'date-fns';
import { es } from 'date-fns/locale';

const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const RecurrenceSelect = ({ value, onChange, onOpenCustom, selectedDate }) => {
  let monthlyLabel = 'Todos los meses, el mismo n° [día de la semana]';
  if (selectedDate) {
    const dateObj = new Date(selectedDate);
    const dayName = dayNames[dateObj.getDay()];
    const weekOfMonth = Math.ceil(dateObj.getDate() / 7);
    monthlyLabel = `Todos los meses, el ${weekOfMonth}º ${dayName}`;
  }

  const recurrenceOptions = [
    { value: 'none', label: 'No se repite' },
    { value: 'daily', label: 'Todos los días' },
    { value: 'weekly', label: 'Cada semana, el mismo día' },
    { value: 'monthly', label: monthlyLabel },
    { value: 'yearly', label: 'Anualmente, el mismo día' },
    { value: 'weekdays', label: 'Todos los días hábiles (lunes a viernes)' },
    { value: 'custom', label: 'Personalizado…' },
  ];

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
