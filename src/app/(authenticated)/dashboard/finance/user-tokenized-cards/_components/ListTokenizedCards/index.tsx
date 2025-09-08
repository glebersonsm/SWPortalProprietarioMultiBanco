import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet, Stack, useTheme } from "@mui/joy";
import { TokenizedCard } from "@/utils/types/finance";
import IconOpenModal from "@/components/IconOpenModal";

export default function ListTokenizedCards({
  tokenizedCards,
}: {
  tokenizedCards: TokenizedCard[];
}) {

  const LAST_SELECTED_ROW_INDEX = "user_multiownership_tokenizedCards_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const theme = useTheme();
  const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

  useEffect(() => {
    const savedRow = localStorage.getItem(LAST_SELECTED_ROW_INDEX);
    if (savedRow) {
      setSelectedRow(Number(savedRow));
    }
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    if (thereIsLocalStorage)
    localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
  };

  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "90px",
        "--Table-lastColumnWidth": "100px",
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
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
          "& th.first-column": {
            width: "var(--Table-firstColumnWidth)",
          },
          "& th.name-column": {
            width: "150px",
          },
          "& th.card-name-column": {
            width: "150px",
          },
          "& th.brand-column": {
            width: "60px",
          },
          "& th.card-column": {
            width: "130px",
          },
          "& th.creation-date-column": {
            width: "130px",
          },
          "& th.last-column": {
            width: "var(--Table-lastColumnWidth)",
          },
          "& thead th": {
            color: "primary.solidHoverBg",
          },
        }}
      >
        <thead>
          <tr>
            <th className="first-column">ID</th>
            <th className="name-column">Nome</th>
            <th className="card-name-column">Nome no cartão</th>
            <th className="brand-column">Bandeira</th>
            <th className="card-column">Cartão</th>
            <th className="creation-date-column">Data de criação</th>
            <th className="last-column" aria-label="last" />
          </tr>
        </thead>
        <tbody>
          {tokenizedCards.map((tokenizedCard) => (
            <tr key={tokenizedCard.id}
            data-selected={tokenizedCard.id === selectedRow}
            onClick={() => handleRowClick(tokenizedCard.id)}
          style={{
            cursor: "pointer",
            backgroundColor: tokenizedCard.id === selectedRow ? "#e0f7fa" : "transparent",
            color: tokenizedCard.id === selectedRow ? "black" : theme.palette.text.primary,
          }}>
              <td>{tokenizedCard.id}</td>
              <td>{tokenizedCard.personName}</td>
              <td>{tokenizedCard.card.card_holder}</td>
              <td>{tokenizedCard.card.brand}</td>
              <td>{tokenizedCard.card.card_number}</td>
              <td>{tokenizedCard.creationDate}</td>
              <td>
                <Stack direction="row" alignItems="center">
                  <IconOpenModal
                    params={{ tokenizedCardId: tokenizedCard.id }}
                    type="show"
                       sxoverride={{
                        color: "primary.plainColor",}}
                    tooltip="Ver detalhes"
                  />
                  <IconOpenModal
                    params={{ tokenizedCardId: tokenizedCard.id }}
                    type="delete"
                    sxoverride={{
                      color: "red",
                    }}
                    tooltip="Deletar token"
                  />
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
