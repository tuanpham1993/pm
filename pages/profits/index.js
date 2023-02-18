import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, Spacer } from "@chakra-ui/react";
import http from "../../shared/util/http";
import { formatCurrency } from "../../shared/util/formatter";
import Header from "../../components/common/header";
import DataTable from "../../components/common/dataTable";
import AddPaymentModal from "../../components/payments/addPaymentModal";
import { map, orderBy, sortBy } from "lodash";
import { format, compareDesc, parse } from "date-fns";

const CustomTableCell = ({ value: initialValue, column: { id } }) => {
  if (id === "number") {
    return formatCurrency(initialValue);
  }

  return initialValue || "";
};

export default function Profits() {
  const [profits, setProfits] = useState(null);

  const columns = [
    {
      Header: "TT",
      accessor: "index",
    },
    {
      Header: "Ngày",
      accessor: "day",
    },
    {
      Header: "Lợi nhuận",
      accessor: "number",
    },
  ];

  async function getProfits() {
    const { data: rawProfits } = await http.get("profits");

    const withParseDate = map(rawProfits, (x) => ({
      ...x,
      time: parse(x.day, "dd/MM/yyyy", new Date()).getTime(),
    }));

    setProfits(
      orderBy(withParseDate, (profit) => profit.time, "desc").map(
        (profit, index) => ({
          ...profit,
          index: index + 1,
        })
      )
    );
  }

  useEffect(() => {
    if (!profits) {
      getProfits();
    }
  });

  return (
    <Box>
      <Header />
      <Box m={5}>
        <Flex mb={5}>
          <Heading>Lợi nhuận theo ngày</Heading>
          <Spacer />
        </Flex>
        <DataTable
          columns={columns}
          data={profits}
          customTableCell={CustomTableCell}
        />
      </Box>
    </Box>
  );
}
