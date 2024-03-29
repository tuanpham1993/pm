import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import DataTable from "../../components/common/dataTable";
import AddDebtCollectionModal from "../../components/debt-collections/addDebtCollectionModal";

const CustomTableCell = ({ value: initialValue, column: { id } }) => {
  if (id === "amount") {
    return formatCurrency(initialValue);
  }

  return initialValue || "";
};

export default function DebtCollections() {
  const [debtCollections, setDebtCollections] = useState(null);
  const [customers, setCustomers] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Khách hàng",
      accessor: "customerName",
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

  async function getDebtCollections() {
    const { data: rawDebtCollections } = await http.get("debt-collections");

    setDebtCollections(
      rawDebtCollections.map((debtCollection, index) => ({
        ...debtCollection,
        index: index + 1,
      }))
    );
  }

  async function getCustomers() {
    const { data: customers } = await http.get("customers");

    setCustomers(customers);
  }

  const onSave = async () => {
    getDebtCollections();
  };

  useEffect(() => {
    if (!debtCollections) {
      getDebtCollections();
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
          <Heading>Thu nợ</Heading>
          <Spacer />
          <AddDebtCollectionModal customers={customers} onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={debtCollections}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
