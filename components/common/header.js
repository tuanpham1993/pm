import React from "react";
import { Box, Stack, Heading, Flex, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";

const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="#ECEFF1"
      color="#424242"
      {...props}
    >
      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
        spacing="20px"
      >
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/" style={{ cursor: "pointer" }}>
            Sản phẩm
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/customers" style={{ cursor: "pointer" }}>
            Khách hàng
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/suppliers" style={{ cursor: "pointer" }}>
            Nhà cung cấp
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/sell-orders" style={{ cursor: "pointer" }}>
            Bán hàng
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/buy-orders" style={{ cursor: "pointer" }}>
            Mua hàng
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/payments" style={{ cursor: "pointer" }}>
            Trả nợ
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/debt-collections" style={{ cursor: "pointer" }}>
            Thu nợ
          </Link>
        </Heading>
        <Heading as="h1" size="sm" letterSpacing={"tighter"}>
          <Link href="/profits" style={{ cursor: "pointer" }}>
            Lợi nhuận
          </Link>
        </Heading>
      </Stack>
    </Flex>
  );
};

export default Header;
