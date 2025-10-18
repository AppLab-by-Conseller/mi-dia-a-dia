import { Button, ButtonGroup, Flex, Heading, IconButton, Spacer, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const DateNavigator = ({ currentDate, viewMode, setViewMode, changeDate }) => {

  const formattedDate = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (viewMode === 'month') {
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})} - ${endOfWeek.toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}`;
    }
  };

  return (
    <Flex align="center" p={4} bg="white" borderRadius="lg" shadow="md">
      <IconButton
        aria-label="Fecha anterior"
        icon={<ChevronLeftIcon />}
        onClick={() => changeDate(-1)}
      />
      <Spacer />
      <Flex direction="column" align="center">
        <Heading as="h2" size="md">{formattedDate()}</Heading>
        <ButtonGroup size="sm" isAttached mt={2}>
          <Button onClick={() => setViewMode('day')} isActive={viewMode === 'day'}>Día</Button>
          <Button onClick={() => setViewMode('week')} isActive={viewMode === 'week'}>Semana</Button>
          <Button onClick={() => setViewMode('month')} isActive={viewMode === 'month'}>Mes</Button>
        </ButtonGroup>
      </Flex>
      <Spacer />
      <IconButton
        aria-label="Fecha siguiente"
        icon={<ChevronRightIcon />}
        onClick={() => changeDate(1)}
      />
    </Flex>
  );
};

export default DateNavigator;
