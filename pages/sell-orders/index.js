import { map } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../shared/component/header";
import DataTable from "../../shared/component/dataTable";
import ViewDetail from "./viewDetail";

const CustomTableCell = ({ value: initialValue, column: { id } }) => {
  if (id === "totalCost") {
    return formatCurrency(initialValue);
  }

  return initialValue || "";
};

export default function SellOOrders() {
  const [sellOrders, setSellOrders] = useState(null);
  const [customers, setCustomers] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Khách hàng",
      accessor: "customerName", // accessor is the "key" in the data
    },
    {
      Header: "Giá trị",
      accessor: "totalCost",
    },
    {
      Header: "Thời gian",
      accessor: "createdAt",
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

  async function getSellOrders() {
    const { data: rawProducts } = await http.get("sell-orders");

    setSellOrders(
      rawProducts.map((product, index) => ({
        ...product,
        index: index + 1,
      }))
    );
  }

  async function getCustomers() {
    const { data: customers } = await http.get("customers");

    setCustomers(customers);
  }

  const deleteSellOrder = async (id) => {
    await http.delete(`sell-orders/${id}`);
    getSellOrders();
  };

  useEffect(() => {
    if (!sellOrders) {
      getSellOrders();
    }

    if (!customers) {
      getCustomers();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Đơn bán</Heading>
          <Spacer />
          <Link href="/sell-orders/new">
            <Button colorScheme="teal" size="lg">
              Thêm
            </Button>
          </Link>
        </Flex>
        <DataTable
          columns={columns}
          data={sellOrders}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
