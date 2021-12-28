import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import http from "../http";


export default function UpdateCustomerModal({ customer, onCustomerUpdated }) {
  const [name, setName] = useState(customer.name);
  const [debt, setDebt] = useState(customer.debt);

  const updateCustomer = async () => {
    await http.patch(`customers/${customer.id}`, {
      name,
      debt,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await updateCustomer();
    onCustomerUpdated({ id: customer.id, name, debt });
    // onSave();
    onClose();
  };

  return (
    <>
      <a
        onClick={onOpen}
        style={{ color: "var(--chakra-colors-teal-500)", cursor: "pointer" }}
      >
        {customer.name}
      </a>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật khách hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tên</FormLabel>
              <Input
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Dư nợ</FormLabel>
              <Input
                placeholder="Dư nợ"
                value={debt}
                onChange={(e) => setDebt(+e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Lưu
            </Button>
            <Button onClick={onClose}>Huỷ</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
