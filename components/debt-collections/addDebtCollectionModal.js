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
  Input,
} from "@chakra-ui/react";
import { map } from "lodash";
import { Select } from "chakra-react-select";

export default function AddDebtCollectionModal({ customers, onSave }) {
  const customerOptions = map(customers, (customer) => ({
    value: customer.id,
    label: customer.name,
  }));
  const [customerId, setCustomerId] = useState(null);
  const [amount, setAmount] = useState(null);

  const clear = () => {
    setCustomerId(null);
    setAmount(0);
  };

  useEffect(async () => {
    if (!customerId) {
      setCustomerId(customers?.[0].id);
    }
  });

  const addDebtCollection = async () => {
    await http.post("debt-collections", {
      customerId: customerId.value,
      amount,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addDebtCollection();
    onSave();
    onClose();
    clear();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" size="lg">
        Thêm
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Khách hàng</FormLabel>
              <Select
                name="customers"
                options={customerOptions}
                placeholder="Chọn khách hàng"
                size="md"
                closeMenuOnSelect={true}
                value={customerId}
                onChange={setCustomerId}
              ></Select>
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
            <Button colorScheme="teal" mr={3} onClick={handleSave}>
              Lưu
            </Button>
            <Button onClick={onClose}>Huỷ</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
