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

export default function UpdateProductModal({ product, onProductUpdated }) {
  const [name, setName] = useState(product.name);
  const [unit, setUnit] = useState(product.unit);
  const [quantity, setQuantity] = useState(product.quantity);
  const [inputPrice, setInputPrice] = useState(product.inputPrice);

  const updateProduct = async () => {
    await http.patch(`products/${product.id}`, {
      name,
      unit,
      quantity,
      inputPrice,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    await updateProduct();
    onProductUpdated({ id: product.id, name, unit, quantity, inputPrice });
    onClose();
  };

  return (
    <>
      <a
        onClick={onOpen}
        style={{ color: "var(--chakra-colors-teal-500)", cursor: "pointer" }}
      >
        {product.name}
      </a>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật sản phẩm</ModalHeader>
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
