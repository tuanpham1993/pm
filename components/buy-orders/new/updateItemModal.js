import { map } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Heading,
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
  Flex,
  Spacer,
} from "@chakra-ui/react";

export default function UpdateProductModal({
  products,
  product,
  onProductUpdated,
}) {
  const [productId, setProductId] = useState(product.id);
  const [quantity, setQuantity] = useState(product.quantity);
  const [price, setPrice] = useState(product.price);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    onProductUpdated({ id: productId, quantity, price });
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
              <Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {map(products, (product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt="3">
              <FormLabel>Số lượng</FormLabel>
              <Input
                placeholder="Số lượng"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </FormControl>
            <FormControl mt="3">
              <FormLabel>Giá bán</FormLabel>
              <Input
                placeholder="Giá bán"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
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
