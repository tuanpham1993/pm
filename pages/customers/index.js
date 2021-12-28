import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import AddCustomerModal from "../../components/customers/addCustomerModal";
import UpdateCustomerModal from "../../components/customers/updateCustomerModal";
import DataTable from "../../components/common/dataTable";

const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
}) => {
  if (id === "name") {
    return (
      <UpdateCustomerModal
        customer={row.original}
        onCustomerUpdated={updateData}
      />
    );
  }

  if (id === "debt") {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

export default function Customers() {
  const [customers, setCustomers] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Tên",
      accessor: "name",
    },
    {
      Header: "Dư nợ",
      accessor: "debt",
    },
    {
      id: "action",
      Cell: ({ value, row }) => (
        <Button
          size="xs"
          onClick={() => {
            if (confirm("Bạn có muốn xoá khách hàng này?")) {
              deleteCustomer(row.original.id);
            }
          }}
          colorScheme="red"
        >
          Xoá
        </Button>
      ),
    },
  ];

  const deleteCustomer = async (id) => {
    await http.delete(`customers/${id}`);
    getCustomers();
  };

  async function getCustomers() {
    const { data: rawCustomers } = await http.get("customers");

    setCustomers(
      rawCustomers.map((customer, index) => ({
        ...customer,
        index: index + 1,
      }))
    );
  }

  const updateCustomer = (partialCustomer) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id !== partialCustomer.id) {
          return customer;
        }

        return {
          ...customer,
          ...partialCustomer,
        };
      })
    );
  };

  const onSave = async () => {
    getCustomers();
  };

  useEffect(() => {
    if (!customers) {
      getCustomers();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>khách hàng</Heading>
          <Spacer />
          <AddCustomerModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={customers}
          customTableCell={CustomTableCell}
          updateData={updateCustomer}
        />
      </Box>
    </Box>
  );
}
