import { map } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Heading,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable } from "react-table";
import http from "../../http";
import { formatCurrency } from "../../../shared/util/formatter";
import Header from "../../../shared/component/header";
import AddProductModal from "./addProductModal";
import SelectSupplier from "./selectSupplier";
import UpdateProductModal from "./updateItemModal";
import AddBuyOrder from "./addBuyOrder";
// Create an editable cell renderer
const CustomTableCell = ({
  value: initialValue,
  row,
  column: { id },
  products,
  updateProduct,
}) => {
  if (id === "name") {
    return (
      <UpdateProductModal
        product={row.original}
        products={products}
        onProductUpdated={updateProduct}
      />
    );
  }

  if (["price", "totalCost"].includes(id)) {
    return formatCurrency(initialValue);
  }

  return initialValue;
};

function DataTable({ columns, data, products, updateProduct }) {
  const tableInstance = useTable({
    columns,
    defaultColumn: {
      Cell: CustomTableCell,
    },
    data: data || [],
    products,
    updateProduct,
  });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps()} isNumeric={column.isNumeric}>
                {column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default function BuyOrderItems() {
  const [items, setItems] = useState([]);
  const [supplierId, setSupplierId] = useState(null);

  const deleteItem = (index) => {
    const clonedItems = items.slice();
    clonedItems.splice(index, 1);
    setItems(clonedItems);
  };

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Tên",
      accessor: "name", // accessor is the "key" in the data
    },
    {
      Header: "Số lượng",
      accessor: "quantity",
    },
    {
      Header: "Giá mua",
      accessor: "price",
    },
    {
      Header: "Thành tiền",
      accessor: "totalCost",
    },
    {
      id: "action",
      Cell: ({ value, row }) => (
        <Button
          size="xs"
          onClick={() => {
            if (confirm("Bạn có muốn xoá?")) {
              deleteItem(row.original.id);
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

  async function getProducts() {
    const { data: products } = await http.get("products");

    setProducts(products);
  }

  const updateProduct = (partialProduct) => {
    setItems(
      items.map((item) => {
        if (item.id !== partialProduct.id) {
          return item;
        }

        const mergedItem = {
          ...item,
          ...partialProduct,
        };

        return {
          ...mergedItem,
          totalCost: mergedItem.quantity * mergedItem.price,
        };
      })
    );
  };

  useEffect(() => {
    if (!products) {
      getProducts();
    }
  });

  const onSave = async (item) => {
    const clonedItems = items.slice();
    clonedItems.push(item);

    setItems(
      map(clonedItems, (item, index) => ({
        ...item,
        index: index + 1,
        totalCost: item.price * item.quantity,
      }))
    );
  };

  const selectSupplier = (supplierId) => {
    setSupplierId(supplierId);
  };

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Đơn mua mới</Heading>
          <Spacer />
        </Flex>

        <Box mb={5}>
          <SelectSupplier onSelect={selectSupplier} />
        </Box>

        <Box mb={5}>
          <DataTable
            columns={columns}
            data={items}
            products={products}
            updateProduct={updateProduct}
          />
        </Box>

        <Flex>
          <Spacer />
          <Box mr="2">
            <AddProductModal products={products} onSave={onSave} />
          </Box>
          <AddBuyOrder buyOrder={{ supplierId, items }} />
        </Flex>
      </Box>
    </Box>
  );
}
