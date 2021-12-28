import { map } from "lodash";
import { useState, useEffect } from "react";
import { Select, Box, FormLabel, HStack } from "@chakra-ui/react";
import http from "../../http";

export default function SelectCustomer({ onSelect }) {
  const [customers, setCustomers] = useState(null);

  useEffect(async () => {
    if (!customers) {
      onSelect((await getCustomers())[0].id);
    }
  });

  async function getCustomers() {
    const { data } = await http.get("customers");

    data.splice(0, 0, { id: null, name: "Khách lẻ" });

    setCustomers(data);
    return data;
  }

  const selectCustomer = (e) => {
    onSelect(e.target.value);
  };

  return (
    <HStack>
      <FormLabel style={{ minWidth: "100px" }}>Khách hàng</FormLabel>

      <Box style={{ width: "200px" }}>
        <Select onChange={selectCustomer}>
          {map(customers, (customer) => (
            <option value={customer.id}>{customer.name}</option>
          ))}
        </Select>
      </Box>
    </HStack>
  );
}
