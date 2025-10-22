import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const PasswordChangeModal = ({ isOpen, onClose, auth }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const toast = useToast();

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword || !confirmPassword) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, rellena todos los campos.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas nuevas no coinciden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Contraseña débil',
        description: 'La nueva contraseña debe tener al menos 6 caracteres.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsChanging(true);
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast({
        title: 'Contraseña actualizada.',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      let errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'La contraseña actual es incorrecta.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde.';
      }
      toast({
        title: 'Error al cambiar la contraseña.',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cambiar Contraseña</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Contraseña Actual</FormLabel>
              <InputGroup>
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <InputRightElement className="eye-icon-group">
                  <Button className="eye-icon-btn" h="1.5rem" size="sm" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nueva Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement className="eye-icon-group">
                  <Button className="eye-icon-btn" h="1.5rem" size="sm" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
              <Input
                type={showNew ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isChanging}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleChangePassword}
            isLoading={isChanging}
          >
            Cambiar Contraseña
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordChangeModal;
