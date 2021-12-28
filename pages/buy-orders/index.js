import { map } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import DataTable from "../../components/common/dataTable";
import ViewDetail from "../../components/buy-orders/viewDetail";

const CustomTableCell = ({ value: initialValue, column: { id } }) => {
  if (id === "totalCost") {
    return formatCurrency(initialValue);
  }

  return initialValue || "";
};

export default function BuyOOrders() {
  const [buyOrders, setBuyOrders] = useState(null);
  const [suppliers, setSuppliers] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Nhà cung cấp",
      accessor: "supplierName", // accessor is the "key" in the data
    },
    {
      Header: "Giá trị",
      accessor: "totalCost",
    },
    {
      Header: 'Thời gian',
      accessor: 'createdAt'
    },
    {
      id: "action",
      Cell: ({ value, row }) => {
        return (
          <>
            <ViewDetail
              totalCost={row.original.totalCost}
              items={map(row.original.items, (item, index) => ({
                ...item,
                index: index + 1,
              }))}
            />
          </>
        );
      },
    },
  ];

  async function getBuyOrders() {
    const { data: rawProducts } = await http.get("buy-orders");

    setBuyOrders(
      rawProducts.map((product, index) => ({
        ...product,
        index: index + 1,
      }))
    );
  }

  async function getSuppliers() {
    const { data: suppliers } = await http.get("suppliers");

    setSuppliers(suppliers);
  }

  const deleteBuyOrder = async (id) => {
    await http.delete(`buy-orders/${id}`);
    getBuyOrders();
  };

  useEffect(() => {
    if (!buyOrders) {
      getBuyOrders();
    }

    if (!suppliers) {
      getSuppliers();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Đơn mua</Heading>
          <Spacer />
          <Link href="/buy-orders/new">
            <Button colorScheme="teal" size="lg">Thêm</Button>
          </Link>
        </Flex>
        <DataTable
          columns={columns}
          data={buyOrders}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
