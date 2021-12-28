import { Spacer, Button, Flex } from "@chakra-ui/react";
import { map } from "lodash";
import http from "../../http";
export default function AddBuyOrder({ buyOrder }) {
  const save = async () => {
    await http.post("buy-orders", {
      ...buyOrder,
      items: map(buyOrder.items, (item) => ({
        ...item,
        productId: item.id,
      })),
    });
  };

  return (
    <Flex>
      <Spacer />
      <Button onClick={save} colorScheme="teal" size="lg">
        Tạo
      </Button>
    </Flex>
  );
}
