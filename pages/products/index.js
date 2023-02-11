import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer, Input } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency, toLowerCaseNonAccentVietnamese } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import AddProductModal from "../../components/products/addProductModal";
import UpdateProductModal from "../../components/products/updateProductModal";
import DataTable from "../../components/common/dataTable";
import axios from "axios";
import { filter } from "lodash";

const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
}) => {
  if (["inputPrice", "sellPrice", "totalCost"].includes(id)) {
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
      Header: "Giá bán",
      accessor: "sellPrice",
    },
    // {
    //   Header: "Giá trị",
    //   accessor: "totalCost",
    // },
    {
      id: "action",
      Cell: ({ value, row }) => (
        <>
          <UpdateProductModal
            product={row.original}
            onProductUpdated={updateProduct}
          />
          <Button
            ml="1"
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
        </>
      ),
    },
  ];

  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  const deleteProduct = async (id) => {
    await http.delete(`products/${id}`);
    getProducts();
  };

  const getProducts = async () => {
    const { data: rawProducts } = await http.get("products");

    const items = rawProducts.map((product, index) => ({
      ...product,
      index: index + 1,
      totalCost: product.inputPrice * product.quantity,
    }))
    setProducts(items);

    setFilteredProducts(items)
  };

  const updateProduct = (partialProduct) => {
    const items = products.map((product) => {
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
    setProducts(
      items
    );

    setFilteredProducts(items)
  };

  const filterProducts = (name) => {
    if (name == "") {
      setFilteredProducts(products);
    } else { 
      setFilteredProducts(filter(products, p => toLowerCaseNonAccentVietnamese(p.name.toLowerCase()).includes(toLowerCaseNonAccentVietnamese(name.toLowerCase()))))
    }
  }

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
          <Input
                placeholder="Tên"
                // value={name}
                width="100"
                mt="1"
                mr="3"
                onChange={(e) => filterProducts(e.target.value)}
              />
          <AddProductModal onSave={onSave} />
        </Flex>
        <DataTable
          columns={columns}
          data={filteredProducts}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
