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
import http from "../../shared/util/http";

export default function AddSupplierModal({ onSave }) {
  const [name, setName] = useState("");
  const [debt, setDebt] = useState(0);

  const addSupplier = async () => {
    await http.post("suppliers", {
      name,
      debt,
    });
  };

  const clear = () => {
    setName("");
    setDebt(0);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addSupplier();
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
          <ModalHeader>Thêm nhà cung cấp</ModalHeader>
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
