import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../shared/component/header";
import AddProductModal from "./addProductModal";
import UpdateProductModal from "./updateProductModal";
import DataTable from "../../shared/component/dataTable";

const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
}) => {
  if (id === "name") {
    return (
      <UpdateProductModal
        product={row.original}
        onProductUpdated={updateData}
      />
    );
  }

  if (["inputPrice", "totalCost"].includes(id)) {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

export default function Products() {
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
      Header: "Số lượng",
      accessor: "quantity",
    },
    {
      Header: "Giá nhập",
      accessor: "inputPrice",
    },
    {
      Header: "Giá trị",
      accessor: "totalCost",
    },
    {
      id: "action",
      Cell: ({ value, row }) => (
        <Button
          size="xs"
          onClick={() => {
            if (confirm("Bạn có muốn xoá sản phẩm này?")) {
              deleteProduct(row.original.id);
            }
          }}
          colorScheme="red"
        >
          Xoá
        </Button>
      ),
    },
  ];

  const [products, setProducts] = useState(null);

  const deleteProduct = async (id) => {
    await http.delete(`products/${id}`);
    getProducts();
  };

  const getProducts = async () => {
    const { data: rawProducts } = await http.get("products");

    setProducts(
      rawProducts.map((product, index) => ({
        ...product,
        index: index + 1,
        totalCost: product.inputPrice * product.quantity,
      }))
    );
  };

  const updateProduct = (partialProduct) => {
    setProducts(
      products.map((product) => {
        if (product.id !== partialProduct.id) {
          return product;
        }

        const mergedProduct = {
          ...product,
          ...partialProduct,
        };

        return {
          ...mergedProduct,
          totalCost: mergedProduct.inputPrice * mergedProduct.quantity,
        };
      })
    );
  };

  const onSave = async () => {
    getProducts();
  };

  useEffect(() => {
    if (!products) {
      getProducts();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Sản phẩm</Heading>
          <Spacer />
          <AddProductModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={products}
          customTableCell={CustomTableCell}
          updateData={updateProduct}
        />
      </Box>
    </Box>
  );
}
