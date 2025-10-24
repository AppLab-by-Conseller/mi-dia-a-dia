import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const MembershipScreen = () => (
  <Box p={8} bg="white" borderRadius="lg" boxShadow="md" maxW="md" mx="auto" mt={10}>
    <VStack spacing={4} align="center">
      <Heading size="lg" color="blue.600">Membresía</Heading>
      <Text fontSize="xl" fontWeight="bold" color="green.500">Plan Freemium</Text>
      <Text fontSize="md" color="gray.700">
        Disfruta de todas las funcionalidades actuales sin costo.<br />
        Próximamente podrás acceder a opciones premium.
      </Text>
    </VStack>
  </Box>
);

export default MembershipScreen;
