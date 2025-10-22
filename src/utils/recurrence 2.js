// Devuelve true si la tarea debe mostrarse en la fecha dada según la configuración de recurrencia
export function isTaskOnDate(task, date) {
  if (!task.recurrence || task.recurrence === 'none') {
    // Solo se muestra si la fecha coincide exactamente
    return sameDay(task.date, date);
  }
  if (task.recurrence === 'daily') {
    return isInRecurrenceRange(task, date, 'days', 1);
  }
  if (task.recurrence === 'weekly') {
    return isInRecurrenceRange(task, date, 'weeks', 1) && task.date.getDay() === date.getDay();
  }
  if (task.recurrence === 'weekdays') {
    return isInRecurrenceRange(task, date, 'days', 1) && date.getDay() >= 1 && date.getDay() <= 5;
  }
  if (task.recurrence === 'monthly') {
    // Ejemplo: segundo lunes del mes
    const { weekOfMonth, days } = task.recurrenceConfig || {};
    if (!weekOfMonth || !days) return false;
    return isNthWeekdayOfMonth(date, weekOfMonth, days[0]);
  }
  if (task.recurrence === 'yearly') {
    return task.date.getDate() === date.getDate() && task.date.getMonth() === date.getMonth();
  }
  if (typeof task.recurrence === 'object') {
    // Recurrencia personalizada
    return matchCustomRecurrence(task, date);
  }
  return false;
}

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isInRecurrenceRange(task, date, unit, interval) {
  const start = new Date(task.date);
  const endType = task.recurrenceConfig?.endType || 'never';
  if (endType === 'date' && task.recurrenceConfig?.endDate) {
    if (date > new Date(task.recurrenceConfig.endDate)) return false;
  }
  if (endType === 'count' && task.recurrenceConfig?.occurrences) {
    // Opcional: calcular si la ocurrencia está dentro del rango
  }
  // Calcular diferencia en días/semanas/meses/años
  if (unit === 'days') {
    const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff % interval === 0;
  }
  if (unit === 'weeks') {
    const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24 * 7));
    return diff >= 0 && diff % interval === 0;
  }
  // ...agregar lógica para meses/años si es necesario
  return false;
}

function isNthWeekdayOfMonth(date, n, weekday) {
  // weekday: 0=domingo, 1=lunes, ...
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const current = new Date(date.getFullYear(), date.getMonth(), d);
    if (current.getMonth() !== date.getMonth()) break;
    if (current.getDay() === weekday) {
      count++;
      if (count === n && sameDay(current, date)) return true;
    }
  }
  return false;
}

function matchCustomRecurrence(task, date) {
  const cfg = task.recurrence;
  // Frecuencia: daily, weekly, monthly, yearly
  // Intervalo: cada X
  // Días: [L, M, X, ...]
  // weekOfMonth, endType, endDate, occurrences
  // Implementar lógica similar a las funciones anteriores, pero usando cfg
  // ...
  return false; // Implementar según la estructura final
}
