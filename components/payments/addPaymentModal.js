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

export default function AddPaymentModal({ suppliers, onSave }) {
  const supplierOptions = map(suppliers, (supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));
  const [supplierId, setSupplierId] = useState(null);
  const [amount, setAmount] = useState(null);

  const clear = () => {
    setSupplierId(null);
    setAmount(0);
  };

  useEffect(async () => {
    if (!supplierId) {
      setSupplierId(suppliers?.[0].id);
    }
  });

  const addPayment = async () => {
    await http.post("payments", {
      supplierId: supplierId.value,
      amount,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addPayment();
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
          <ModalHeader>Thêm sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nhà cung cấp</FormLabel>
              <Select
                name="suppliers"
                options={supplierOptions}
                placeholder="Chọn nhà cung cấp"
                size="md"
                closeMenuOnSelect={true}
                value={supplierId}
                onChange={setSupplierId}
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
