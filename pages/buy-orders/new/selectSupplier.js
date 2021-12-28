import { map } from "lodash";
import { useState, useEffect } from "react";
import { Select, Box, FormLabel, HStack } from "@chakra-ui/react";
import http from "../../http";

export default function SelectSupplier({ onSelect }) {
  const [suppliers, setSuppliers] = useState(null);

  useEffect(async () => {
    if (!suppliers) {
      onSelect((await getSuppliers())[0].id);
    }
  });

  async function getSuppliers() {
    const { data } = await http.get("suppliers");
    setSuppliers(data);
    return data;
  }

  const selectSupplier = (e) => {
    onSelect(e.target.value);
  };

  return (
    <HStack>
      <FormLabel style={{ minWidth: "100px" }}>Nhà cung cấp</FormLabel>

      <Box style={{ width: "200px" }}>
        <Select onChange={selectSupplier}>
          {map(suppliers, (supplier) => (
            <option value={supplier.id}>{supplier.name}</option>
          ))}
        </Select>
      </Box>
    </HStack>
  );
}
