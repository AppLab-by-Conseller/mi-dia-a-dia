import { Box, Text, Textarea } from "@chakra-ui/react";

const DailyReflection = () => {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Reflexión del Día</Text>
      <Textarea
        placeholder="Escribe tus pensamientos, sentimientos o cualquier cosa importante de hoy..."
        size="lg"
        bg="white"
      />
    </Box>
  );
};

export default DailyReflection;
