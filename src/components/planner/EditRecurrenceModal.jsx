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
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2} w="100%">
          <Button colorScheme="blue" isFullWidth minW={0} onClick={onApply} whiteSpace="normal">
            Solo este evento
          </Button>
          <Button colorScheme="green" isFullWidth minW={0} onClick={onApplyAll} whiteSpace="normal">
            Este y todos los posteriores
          </Button>
          <Button variant="ghost" isFullWidth minW={0} onClick={onClose} whiteSpace="normal">
            Cancelar
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EditRecurrenceModal;
