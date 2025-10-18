import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Text } from "@chakra-ui/react";

const WellnessMetrics = () => {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Métricas de Bienestar</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Nivel de Satisfacción</StatLabel>
          <StatNumber>-</StatNumber>
        </Stat>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Nivel de Realización</StatLabel>
          <StatNumber>-</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default WellnessMetrics;
