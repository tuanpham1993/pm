import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../shared/component/header";
import DataTable from "../../shared/component/dataTable";
import AddPaymentModal from "./addPaymentModal";

const CustomTableCell = ({ value: initialValue, column: { id } }) => {
  if (id === "amount") {
    return formatCurrency(initialValue);
  }

  return initialValue || "";
};

export default function Paymens() {
  const [payments, setPayments] = useState(null);
  const [suppliers, setSuppliers] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Nhà cung cấp",
      accessor: "supplierName",
    },
    {
      Header: "Thanh toán",
      accessor: "amount",
    },
    {
      Header: 'Thời gian',
      accessor: 'createdAt'
    }
  ];

  async function getPayments() {
    const { data: rawPayments } = await http.get("payments");

    setPayments(
      rawPayments.map((payment, index) => ({
        ...payment,
        index: index + 1,
      }))
    );
  }

  async function getSuppliers() {
    const { data: suppliers } = await http.get("suppliers");

    setSuppliers(suppliers);
  }

  const onSave = async () => {
    getPayments();
  };

  useEffect(() => {
    if (!payments) {
      getPayments();
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
          <Heading>Trả nợ</Heading>
          <Spacer />
          <AddPaymentModal suppliers={suppliers} onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={payments}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
