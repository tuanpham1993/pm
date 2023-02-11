import { filter } from 'lodash'
import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer, Input } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency, toLowerCaseNonAccentVietnamese } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import AddCustomerModal from "../../components/customers/addCustomerModal";
import UpdateCustomerModal from "../../components/customers/updateCustomerModal";
import DataTable from "../../components/common/dataTable";

const CustomTableCell = ({ value: initialValue, row, column: { id } }) => {
  if (id === "debt") {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

export default function Customers() {
  const [customers, setCustomers] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState(null);

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
        <>
          <UpdateCustomerModal
            customer={row.original}
            onCustomerUpdated={updateCustomer}
          />
          <Button
            ml="1"
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
        </>
      ),
    },
  ];

  const deleteCustomer = async (id) => {
    await http.delete(`customers/${id}`);
    getCustomers();
  };

  async function getCustomers() {
    const { data: rawCustomers } = await http.get("customers");

    const items = rawCustomers.map((customer, index) => ({
      ...customer,
      index: index + 1,
    }));

    setCustomers(
    items  
    );

    setFilteredCustomers(items)
  }

  const updateCustomer = (partialCustomer) => {
    const items = customers.map((customer) => {
      if (customer.id !== partialCustomer.id) {
        return customer;
      }

      return {
        ...customer,
        ...partialCustomer,
      };
    });

    setCustomers(
      items  
    );

    setFilteredCustomers(items)
  };

  const filterCustomers = (name) => {
    if (name == "") {
      setFilteredCustomers(customers);
    } else { 
      setFilteredCustomers(filter(customers, p => toLowerCaseNonAccentVietnamese(p.name.toLowerCase()).includes(toLowerCaseNonAccentVietnamese(name.toLowerCase()))))
    }
  }

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
          <Heading>Khách hàng</Heading>
          <Spacer />
          <Input
                placeholder="Tên"
                width="100"
                mt="1"
                mr="3"
                onChange={(e) => filterCustomers(e.target.value)}
              />
          <AddCustomerModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={filteredCustomers}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
