import { find, isEmpty, map } from "lodash";
import { useState, useEffect } from "react";
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

export default function AddProductModal({ products, onSave }) {
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!productId && !isEmpty(products)) {
      setProductId(products[0].id);
    }
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    onSave({
      id: productId,
      name: find(products, { id: productId })?.name,
      quantity,
      price,
    });
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" size="lg">
        Thêm sản phẩm
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tên</FormLabel>
              <Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {map(products, (product) => (
                  <option value={product.id}>{product.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt="5">
              <FormLabel>Số lượng</FormLabel>
              <Input
                placeholder="Số lượng"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </FormControl>
            <FormControl mt="5">
              <FormLabel>Giá mua</FormLabel>
              <Input
                placeholder="Giá mua"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
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
