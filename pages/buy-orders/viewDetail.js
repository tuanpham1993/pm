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
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import DataTable from "../../shared/component/dataTable";
import { formatCurrency } from "../../shared/util/formatter";

const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
}) => {
  if (["price", "cost"].includes(id)) {
    return formatCurrency(initialValue);
  }

  return `${initialValue}`;
};

export default function ViewDetail({ items, totalCost }) {
  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Sản phẩm",
      accessor: "productName", // accessor is the "key" in the data
    },
    {
      Header: "Số lượng",
      accessor: "quantity",
    },
    {
      Header: "Giá mua",
      accessor: "price",
    },
    {
      Header: "Giá trị",
      accessor: "cost",
    },
    // {
    //   id: "action",
    //   Cell: ({ value, row }) => (
    //     <Button
    //     size="xs"
    //       onClick={() => {
    //         if (confirm('Bạn có muốn xoá đơn hàng này?')) {
    //           deleteSellOrder(row.original.id)}
    //         }
    //       }
    //       colorScheme="red"
    //     >
    //       Xoá
    //     </Button>
    //   ),
    // },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex>
        <Spacer />
        <Button onClick={onOpen} colorScheme="teal" size="xs">
          Xem
        </Button>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết đơn hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <DataTable
              columns={columns}
              data={items}
              customTableCell={CustomTableCell}
            />
          </ModalBody>

          <Flex>
            <Spacer /> <Box mr="5">Tổng: {formatCurrency(totalCost)}</Box>
          </Flex>

          <ModalFooter>
            <Button onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
