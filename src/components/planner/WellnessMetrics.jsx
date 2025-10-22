import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Text, Progress } from "@chakra-ui/react";
import { useMemo } from "react";

const moodScore = {
    terrible: 1,
    mal: 2,
    normal: 3,
    bien: 4,
    genial: 5,
};

const WellnessMetrics = ({ tasks }) => {
    const metrics = useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return { satisfaction: 0, realization: 0, satisfactionLabel: "Sin datos" };
        }

        // Cálculo de Satisfacción
        const tasksWithMood = tasks.filter(t => t.mood && moodScore[t.mood]);
        const totalMoodScore = tasksWithMood.reduce((acc, t) => acc + moodScore[t.mood], 0);
        const averageMood = tasksWithMood.length > 0 ? totalMoodScore / tasksWithMood.length : 0;
        
        let satisfactionLabel = "Sin datos";
        if (averageMood > 0) {
            if (averageMood <= 1.5) satisfactionLabel = "Muy Bajo";
            else if (averageMood <= 2.5) satisfactionLabel = "Bajo";
            else if (averageMood <= 3.5) satisfactionLabel = "Normal";
            else if (averageMood <= 4.5) satisfactionLabel = "Alto";
            else satisfactionLabel = "Excelente";
        }

        // Cálculo de Realización
        const completedTasks = tasks.filter(t => t.completionState === 'completed').length;
        const realization = (completedTasks / tasks.length) * 100;

        return {
            satisfaction: (averageMood / 5) * 100,
            realization: realization,
            satisfactionLabel: satisfactionLabel,
        };

    }, [tasks]);

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Métricas de Bienestar del Día</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                    <Stat>
                        <StatLabel>Nivel de Satisfacción</StatLabel>
                        <StatNumber>{metrics.satisfactionLabel}</StatNumber>
                    </Stat>
                    <Progress value={metrics.satisfaction} size="sm" colorScheme="yellow" mt={2} borderRadius="md" />
                </Box>
                <Box>
                    <Stat>
                        <StatLabel>Nivel de Realización</StatLabel>
                        <StatNumber>{metrics.realization.toFixed(0)}%</StatNumber>
                    </Stat>
                    <Progress value={metrics.realization} size="sm" colorScheme="green" mt={2} borderRadius="md" />
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default WellnessMetrics;
