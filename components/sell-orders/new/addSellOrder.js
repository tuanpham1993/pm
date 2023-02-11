import { useRouter } from 'next/router'
import { Button, Flex, Spacer } from "@chakra-ui/react";
import { map } from "lodash";
import http from "../../../shared/util/http";

export default function AddSellOrder({ sellOrder }) {
  const router = useRouter()

  const save = async () => {
    await http.post("sell-orders", {
      ...sellOrder,
      items: map(sellOrder.items, (item) => ({
        ...item,
        productId: item.id,
      })),
    });
    
    router.push('/sell-orders')
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
