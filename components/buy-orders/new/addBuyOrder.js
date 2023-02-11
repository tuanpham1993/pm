import { useRouter } from 'next/router'
import { Spacer, Button, Flex } from "@chakra-ui/react";
import { map } from "lodash";
import http from "../../../shared/util/http";

export default function AddBuyOrder({ buyOrder }) {
  const router = useRouter()

  const save = async () => {
    await http.post("buy-orders", {
      ...buyOrder,
      items: map(buyOrder.items, (item) => ({
        ...item,
        productId: item.id,
      })),
    });

    router.push("/buy-orders");
  };

  return (
    <Flex>
      <Spacer />
      <Button onClick={save} colorScheme="teal" size="lg">
        Lưu
      </Button>
    </Flex>
  );
}
