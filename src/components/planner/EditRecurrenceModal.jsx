import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

const EditRecurrenceModal = ({ isOpen, onClose, onApply, onApplyAll }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>¿Cómo deseas aplicar los cambios?</ModalHeader>
      <ModalBody>
        <p>Este evento es parte de una serie recurrente. ¿Quieres aplicar los cambios solo a este evento o a este y todos los posteriores?</p>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onApply}>
          Solo este evento
        </Button>
        <Button colorScheme="green" onClick={onApplyAll}>
          Este y todos los posteriores
        </Button>
        <Button variant="ghost" onClick={onClose} ml={3}>
          Cancelar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EditRecurrenceModal;
