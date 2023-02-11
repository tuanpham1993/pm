import React, { useEffect, useState } from "react";
import { filter } from 'lodash';
import { Box, Heading, Button, Flex, Spacer, Input } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency, toLowerCaseNonAccentVietnamese } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import AddSupplierModal from "../../components/suppliers/addSupplierModal";
import UpdateSupplierModal from "../../components/suppliers/updateSupplierModal";
import DataTable from "../../components/common/dataTable";

const CustomTableCell = ({ value: initialValue, row, column: { id } }) => {
  if (id === "debt") {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState(null);

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
          <UpdateSupplierModal
            supplier={row.original}
            onSupplierUpdated={updateSupplier}
          />
          <Button
            ml="1"
            size="xs"
            onClick={() => {
              if (confirm("Bạn có muốn xoá nhà cung cấp này?")) {
                deleteSupplier(row.original.id);
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

  const deleteSupplier = async (id) => {
    await http.delete(`suppliers/${id}`);
    getSuppliers();
  };

  async function getSuppliers() {
    const { data: rawSuppliers } = await http.get("suppliers");

    const items = rawSuppliers.map((supplier, index) => ({
      ...supplier,
      index: index + 1,
    }))

    setSuppliers(
    items  
    );

    setFilteredSuppliers(items)
  }

  const updateSupplier = (partialSupplier) => {
    const items = suppliers.map((supplier) => {
      if (supplier.id !== partialSupplier.id) {
        return supplier;
      }

      return {
        ...supplier,
        ...partialSupplier,
      };
    })

    setSuppliers(
      items
    );

    setFilteredSuppliers(items)
  };

  const filterSuppliers = (name) => {
    if (name == "") {
      setFilteredSuppliers(suppliers);
    } else { 
      setFilteredSuppliers(filter(suppliers, p => toLowerCaseNonAccentVietnamese(p.name.toLowerCase()).includes(toLowerCaseNonAccentVietnamese(name.toLowerCase()))))
    }
  }

  const onSave = async () => {
    getSuppliers();
  };

  useEffect(() => {
    if (!suppliers) {
      getSuppliers();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Nhà cung cấp</Heading>
          <Spacer />
          <Input
                placeholder="Tên"
                width="100"
                mt="1"
                mr="3"
                onChange={(e) => filterSuppliers(e.target.value)}
              />
          <AddSupplierModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          updateData={updateSupplier}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
