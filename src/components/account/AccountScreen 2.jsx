import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Flex,
  Text,
  useToast,
  IconButton,
  Tooltip,
  SimpleGrid,
  Select,
  Divider,
  useDisclosure, // Importar useDisclosure
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Cambiado de updateDoc a setDoc
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getRandomAvatar } from '../../utils/avatars';
import { differenceInYears, parseISO } from 'date-fns';
import PasswordChangeModal from './PasswordChangeModal'; // Importar el nuevo modal

const AccountScreen = () => {
  const { user, auth } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure(); // Hook para el modal

  // State for all user profile data
  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [age, setAge] = useState(null);

  useEffect(() => {
    if (user) {
      const initialData = {
        displayName: user.displayName || '',
        photoURL: user.photoURL || getRandomAvatar(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        phone: user.phone || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
      };
      setProfileData(initialData);

      if (user.birthDate) {
        setAge(differenceInYears(new Date(), parseISO(user.birthDate)));
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (name === 'birthDate' && value) {
      setAge(differenceInYears(new Date(), parseISO(value)));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    let newPhotoURL = profileData.photoURL;

    try {
      // 1. Subir nueva imagen si existe
      if (imageFile) {
        const storageRef = ref(storage, `avatars/${user.uid}/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        newPhotoURL = await getDownloadURL(snapshot.ref);
      }

      // 2. Actualizar perfil de Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: newPhotoURL,
      });

      // 3. Preparar datos para Firestore
      const userDocData = {
        ...profileData,
        photoURL: newPhotoURL,
        lastUpdated: serverTimestamp(),
        email: user.email, // Asegurarse de que el email siempre esté
      };

      // 4. Actualizar/Crear documento en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userDocData, { merge: true }); // Usar setDoc con merge

      toast({
        title: 'Perfil actualizado.',
        description: 'Tus datos han sido actualizados correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error al actualizar.',
        description: 'No se pudo guardar los cambios. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
      setImageFile(null);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <VStack spacing={8} align="stretch">
        {/* Perfil de Usuario */}
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Heading as="h1" size="xl" mb={6}>
            Mi Cuenta
          </Heading>
          <Flex direction="column" align="center" mb={8}>
            <Box position="relative">
              <Avatar size="2xl" name={profileData.displayName || user.email} src={profileData.photoURL} />
              <Tooltip label="Cambiar foto" placement="right">
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  isRound
                  position="absolute"
                  bottom="0"
                  right="-10px"
                  onClick={handleAvatarClick}
                  aria-label="Cambiar foto de perfil"
                />
              </Tooltip>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
            </Box>
            <VStack align="center" mt={4}>
              <Heading size="lg">{profileData.displayName || 'Usuario'}</Heading>
              <Text color="gray.500">{user.email}</Text>
            </VStack>
          </Flex>

          {/* Datos Personales */}
          <Heading as="h2" size="lg" mb={4}>
            Datos Personales
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            <FormControl>
              <FormLabel>Nombre para mostrar</FormLabel>
              <Input name="displayName" value={profileData.displayName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input value={user.email} isReadOnly disabled _disabled={{ color: 'gray.500' }} />
            </FormControl>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input name="firstName" value={profileData.firstName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input name="lastName" value={profileData.lastName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <Input type="date" name="birthDate" value={profileData.birthDate} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Edad</FormLabel>
              <Text fontSize="lg" pt={2}>{age !== null ? `${age} años` : 'No especificada'}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Género</FormLabel>
              <Select name="gender" value={profileData.gender} onChange={handleInputChange} placeholder="Seleccionar género">
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="no_especificar">Prefiero no especificar</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <Input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} />
            </FormControl>
          </SimpleGrid>

          <Divider my={6} />

          {/* Contacto de Emergencia */}
          <Heading as="h2" size="lg" mb={4}>
            Contacto de Emergencia (Opcional)
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            <FormControl>
              <FormLabel>Nombre del Contacto</FormLabel>
              <Input name="emergencyContactName" value={profileData.emergencyContactName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Teléfono del Contacto</FormLabel>
              <Input type="tel" name="emergencyContactPhone" value={profileData.emergencyContactPhone} onChange={handleInputChange} />
            </FormControl>
          </SimpleGrid>

          <Button
            colorScheme="blue"
            onClick={handleSaveChanges}
            isLoading={isSaving}
          >
            Guardar Cambios
          </Button>
        </Box>

        {/* Seguridad */}
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Heading as="h2" size="lg" mb={6}>
            Seguridad
          </Heading>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <Text>Cambiar contraseña</Text>
              <Button onClick={onModalOpen}>Cambiar</Button>
            </Flex>
          </VStack>
        </Box>
      </VStack>

      <PasswordChangeModal isOpen={isModalOpen} onClose={onModalClose} auth={auth} />
    </>
  );
};

export default AccountScreen;
