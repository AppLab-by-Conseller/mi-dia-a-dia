import { Box, Text, Textarea, Button, VStack, useToast, List, ListItem, ListIcon, Heading, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaRegCommentDots } from "react-icons/fa";

const DailyReflection = ({ userId, date }) => {
  const [reflections, setReflections] = useState([]);
  const [newReflection, setNewReflection] = useState("");
  const toast = useToast();

  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

  useEffect(() => {
    if (!userId) {
      setReflections([]);
      return;
    }

    const reflectionsCollectionRef = collection(db, "users", userId, "reflections", dateString, "entries");
    const q = query(reflectionsCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reflectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReflections(reflectionsData);
    }, (error) => {
      console.error("Error fetching reflections: ", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reflexiones.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });

    return () => unsubscribe();
  }, [userId, dateString, toast]);

  const handleSave = async () => {
    if (!userId || newReflection.trim() === "") return;

    const reflectionsCollectionRef = collection(db, "users", userId, "reflections", dateString, "entries");
    try {
      await addDoc(reflectionsCollectionRef, {
        text: newReflection,
        createdAt: serverTimestamp()
      });
      setNewReflection(""); // Limpiar el textarea
      toast({
        title: "Reflexión guardada.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving reflection: ", error);
      toast({
        title: "Error al guardar.",
        description: "No se pudo guardar la reflexión.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box p={4} bg="white" borderRadius="lg" shadow="md">
      <Heading size="lg" mb={4}>Reflexiones del Día</Heading>
      <VStack align="stretch" spacing={4}>
        {reflections.length > 0 && (
          <Box 
            borderWidth="1px" 
            borderRadius="md" 
            p={3} 
            maxH="200px" 
            overflowY="auto"
            bg="gray.50"
          >
            <List spacing={3}>
              {reflections.map(ref => (
                <ListItem key={ref.id} display="flex" alignItems="flex-start">
                  <ListIcon as={FaRegCommentDots} color="blue.500" mt={1} />
                  <Flex direction="column">
                    <Text fontSize="sm">{ref.text}</Text>
                    <Text fontSize="xs" color="gray.500">{formatTimestamp(ref.createdAt)}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Textarea
          placeholder="Escribe un nuevo pensamiento, sentimiento o cualquier cosa importante de hoy..."
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          size="lg"
          minH="100px"
        />
        <Button 
          colorScheme="blue" 
          onClick={handleSave}
          isDisabled={newReflection.trim() === ""}
        >
          Guardar Reflexión
        </Button>
      </VStack>
    </Box>
  );
};

export default DailyReflection;
