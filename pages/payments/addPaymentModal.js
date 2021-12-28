import React, { useEffect, useState } from "react";
import http from "../http";
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

export default function AddPaymentModal({ suppliers, onSave }) {
  const [supplierId, setSupplierId] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(async () => {
    if (!supplierId) {
      setSupplierId(suppliers?.[0].id);
    }
  });

  const addPayment = async () => {
    await http.post("payments", {
      supplierId,
      amount,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addPayment();
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
              <FormLabel>Nhà cung cấp</FormLabel>
              <Select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                {map(suppliers, (supplier) => (
                  <option value={supplier.id}>{supplier.name}</option>
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
