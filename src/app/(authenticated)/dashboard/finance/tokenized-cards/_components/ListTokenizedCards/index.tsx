import React from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet } from "@mui/joy";
import { TokenizedCard } from "@/utils/types/finance";
import IconOpenModal from "@/components/IconOpenModal";

export default function ListTokenizedCards({
  tokenizedCards,
}: {
  tokenizedCards: TokenizedCard[];
}) {
  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "90px",
        "--Table-lastColumnWidth": "50px",
        overflow: "auto",
        backgroundSize:
          "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundPosition:
          "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
        backgroundColor: "background.surface",
      }}
    >
      <Table
        borderAxis="bothBetween"
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
            bgcolor: "background.surface",
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
          "& th:nth-of-type(1)": {
            width: "var(--Table-firstColumnWidth)",
          },
          "& th:nth-of-type(2)": {
            width: "80px",
          },
          "& th:nth-of-type(3)": {
            width: "150px",
          },
          "& th:nth-of-type(4)": {
            width: "130px",
          },
          "& th:nth-of-type(5)": {
            width: "var(--Table-lastColumnWidth)",
          },
          "& thead th": {
            color: "primary.solidHoverBg",
          },
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Id da pessoa</th>
            <th>Nome</th>
            <th>Data de criação</th>
            <th aria-label="last" />
          </tr>
        </thead>
        <tbody>
          {tokenizedCards.map((tokenizedCard) => (
            <tr key={tokenizedCard.id}>
              <td>{tokenizedCard.id}</td>
              <td>{tokenizedCard.personId}</td>
              <td>{tokenizedCard.personName}</td>
              <td>{tokenizedCard.creationDate}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{ tokenizedCardId: tokenizedCard.id }}
                    type="show"
                    tooltip="Ver detalhes"
                  />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
