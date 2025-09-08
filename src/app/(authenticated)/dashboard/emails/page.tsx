"use client";

import React, { useEffect, useState } from "react";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEmails, sendEmail } from "@/services/querys/emails";
import LoadingData from "@/components/LoadingData";
import { Box, Divider, Stack, IconButton } from "@mui/joy";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { P, match } from "ts-pattern";
import WithoutData from "@/components/WithoutData";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import EmailFilters from "./_components/EmailFilters";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Email } from "@/utils/types/emails";
import IconOpenModal from "@/components/IconOpenModal";
import { SendOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

const PAGE_STORAGE_KEY = "emails_page";
const ROWS_PER_PAGE_STORAGE_KEY = "emails_rows_per_page";
const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function EmailsPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();

  const handleSendEmail = async (emailId: number) => {
    try {
      await sendEmail(emailId);
      toast.success("E-mail adicionado na fila para envio com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar o e-mail na fila de envio. Tente novamente mais tarde.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      type: "number",
    },
    {
      field: "recipient",
      headerName: "Destinatário",
      width: 200,
      flex: 1,
    },
    {
      field: "subject",
      headerName: "Assunto",
      width: 200,
      flex: 1,
    },
    {
      field: "sent",
      headerName: "Enviado",
      width: 80,
      type: "boolean",
      valueFormatter: (params: any) => params.value ? "Sim" : "Não",
    },
    {
      field: "creationDate",
      headerName: "Data de criação",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Email>) => {
        const email = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconOpenModal
              params={{ emailId: email.id }}
              sxoverride={{ color: "primary.plainColor" }}
              type="show"
              tooltip="Ver detalhes"
            />
            {!email.sent && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendEmail(email.id);
                }}
                title="Enviar e-mail"
                color="primary"
              >
                <SendOutlined />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];
  const [page, setPage] = useState(() => {
       if (thereIsLocalStorage)
       {
        return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
       }
       return 1;
      });
    const [rowsPerPage, setRowsPerPage] = useState(() => {
       if (thereIsLocalStorage)
       {
        return Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10;
       }
       return 10;
      });

  useEffect(() => {
     if (thereIsLocalStorage)
        localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
    }, [page]);
  
  useEffect(() => {
    if (thereIsLocalStorage)
    localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const { isLoading, data } = useQuery({
    queryKey: ["getEmails", debounceFilters, page, rowsPerPage],
    queryFn: async () => getEmails(debounceFilters, page, rowsPerPage),
  });

  const { emails = [], lastPageNumber } = data ?? {};

  const { action, emailId } = React.useMemo(() => {
  const action = searchParams.get("action");
  const emailId = searchParams.get("emailId");

    return {
      action,
      emailId,
    };
  }, [searchParams]);

  const selectedEmail = React.useMemo(
    () => emails.find((email) => email.id === Number(emailId)),
    [emails, emailId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider /> }>
        <EmailFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : emails.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={emails}
                columns={columns}
                loading={isLoading}
                toolbar={{
                  enabled: true,
                  title: "Lista de E-mails",
                  showToolbar: true,
                  showQuickFilter: true,
                  showColumnsButton: true,
                  showFiltersButton: true,
                  showExportButton: true,
                  showPrintButton: true,
                }}
                pagination={{
                  enabled: false,
                }}
                export={{
                  enabled: true,
                  filename: "emails",
                }}
                print={{
                  enabled: true,
                   buttonText: "Imprimir",
                }}
                filters={{
                  enabled: true,
                  quickFilter: true,
                  columnFilters: true,
                }}
              />
              <Box alignSelf="flex-end" marginTop="8px">
                <ModernPaginatedList
                  items={emails}
                  lastPageNumber={lastPageNumber ?? 1}
                  handleChangePage={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={(value) => {
                    setRowsPerPage(value);
                    setPage(1);
                  }}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedEmail })
        .with(
          { action: "show", selectedEmail: P.not(undefined) },
          ({ selectedEmail }) => (
            <ShowDetailsModal shouldOpen={true} email={selectedEmail} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
