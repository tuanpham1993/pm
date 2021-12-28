import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import AddSupplierModal from "../../components/suppliers/addSupplierModal";
import UpdateSupplierModal from "../../components/suppliers/updateSupplierModal";
import DataTable from "../../components/common/dataTable";

const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
}) => {
  if (id === "name") {
    return (
      <UpdateSupplierModal
        supplier={row.original}
        onSupplierUpdated={updateData}
      />
    );
  }

  if (["inputPrice", "totalCost"].includes(id)) {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(null);

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
            if (confirm('Bạn có muốn xoá nhà cung cấp này?')) {
                deleteSupplier(row.original.id)}
            }
          } 
          colorScheme="red"
        >
          Xoá
        </Button>
      ),
    },
  ];

  const deleteSupplier = async (id) => {
    await http.delete(`suppliers/${id}`);
    getSuppliers();
  };

  async function getSuppliers() {
    const { data: rawSuppliers } = await http.get("suppliers");

    setSuppliers(
      rawSuppliers.map((supplier, index) => ({
        ...supplier,
        index: index + 1,
      }))
    );
  }

  const updateSupplier = (partialSupplier) => {
    setSuppliers(
      suppliers.map((supplier) => {
        if (supplier.id !== partialSupplier.id) {
          return supplier;
        }

        return {
          ...supplier,
          ...partialSupplier,
        };
      })
    );
  };

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
          <AddSupplierModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={suppliers}
          updateData={updateSupplier}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
