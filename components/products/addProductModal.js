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
  Select,
  Input,
} from "@chakra-ui/react";
import http from "../../shared/util/http";

export default function AddProductModal({ onSave }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("Thùng");
  const [quantity, setQuantity] = useState(0);
  const [inputPrice, setInputPrice] = useState(0);

  const addProduct = async () => {
    await http.post("products", {
      name,
      unit,
      quantity,
      inputPrice,
    });
  };

  const clear = () => {
    setName("");
    setUnit("Thùng");
    setQuantity(0);
    setInputPrice(0);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await addProduct();
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
              <FormLabel>Tên</FormLabel>
              <Input
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            {/* <FormControl mt={5}>
              <FormLabel>Đơn vị</FormLabel>
              <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option>Thùng</option>
                <option>Bì</option>
              </Select>
            </FormControl> */}
            <FormControl mt={5}>
              <FormLabel>Số lượng</FormLabel>
              <Input
                placeholder="Số lượng"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Giá vốn</FormLabel>
              <Input
                placeholder="Giá vốn"
                value={inputPrice}
                onChange={(e) => setInputPrice(+e.target.value)}
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
