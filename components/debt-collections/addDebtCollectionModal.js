import React, { useEffect, useState } from "react";
import http from "../../shared/util/http";
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
  Select,
  Input,
} from "@chakra-ui/react";
import { map } from "lodash";

export default function AddDebtCollectionModal({ customers, onSave }) {
  const [customerId, setCustomerId] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(async () => {
    if (!customerId) {
      setCustomerId(customers?.[0].id);
    }
  });

  const addDebtCollection = async () => {
    await http.post("debt-collections", {
      customerId,
      amount,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addDebtCollection();
    onSave();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" size="lg">
        Thêm
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Khách hàng</FormLabel>
              <Select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                {map(customers, (customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Số tiền</FormLabel>
              <Input
                placeholder="Số tiền"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
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
