import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Stack } from '@chakra-ui/react';

const EditRecurrenceModal = ({ isOpen, onClose, onApply, onApplyAll }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent maxW="sm">
      <ModalHeader>¿Cómo deseas aplicar los cambios?</ModalHeader>
      <ModalBody>
        <Text whiteSpace="normal" wordBreak="break-word">
          Este evento es parte de una serie recurrente. ¿Quieres aplicar los cambios solo a este evento o a este y todos los posteriores?
        </Text>
      </ModalBody>
      <ModalFooter>
        <Stack direction="column" spacing={3} width="100%">
          <Button onClick={onApply} colorScheme="blue" isFullWidth>
            Solo este evento
          </Button>
          <Button onClick={onApplyAll} colorScheme="green" isFullWidth>
            Este y todos los posteriores
          </Button>
          <Button onClick={onClose} variant="ghost" isFullWidth>
            Cancelar
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EditRecurrenceModal;
