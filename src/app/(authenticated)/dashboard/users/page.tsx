"use client";

import { Box, Divider, Stack } from "@mui/joy";
import React, { useEffect, useState } from "react";
import UserFilters from "./_components/UserFilters";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/querys/users";
import { initialFilters } from "./constants";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import ResetUserModal from "./_components/ResetUserModal";
import useDebounce from "@/hooks/useDebounce";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { CompleteUser } from "@/utils/types/users";
import IconOpenModal from "@/components/IconOpenModal";
import ButtonLink from "@/components/ButtonLink";
import useUser from "@/hooks/useUser";
import { Box as MuiBox } from "@mui/material";
import { toast } from "react-toastify";
import { resetPassword } from "@/services/querys/users";

const PAGE_STORAGE_KEY = "users_page";
const ROWS_PER_PAGE_STORAGE_KEY = "users_rows_per_page";

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function UsersPage() {
  const { isAdm } = useUser();
  const [filters, setFilters] = React.useState(initialFilters);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => {
        return thereIsLocalStorage ? Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1 : 1;
      });
    const [rowsPerPage, setRowsPerPage] = useState(() => {
        return thereIsLocalStorage ? Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10 : 10;
      });

    useEffect(() => {
      if (thereIsLocalStorage)
        localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
      }, [page]);
    
    useEffect(() => {
      if (thereIsLocalStorage)
      localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
    }, [rowsPerPage]);

  const debounceFilters = useDebounce(filters);

  const { isLoading, data } = useQuery({
    queryKey: ["getUsers", debounceFilters, page, rowsPerPage],
    queryFn: async () => getUsers({ filters: debounceFilters, page, rowsPerPage }),
  });

  const { users = [], lastPageNumber } = data ?? {};

  const { action, userId } = React.useMemo(() => {
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");

    return {
      action,
      userId,
    };
  }, [searchParams]);

  const selectedUser = React.useMemo(
    () => users.find((item) => item.id === Number(userId)),
    [users, userId]
  );



  const handleResetPassword = async (login: string) => {
    try {
      await resetPassword(login);
      toast.success("Senha resetada com sucesso!");
    } catch (error) {
      toast.error("Erro ao resetar senha do usuário");
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number',
    },
    {
      field: 'login',
      headerName: 'Login',
      width: 120,
    },
    {
      field: 'name',
      headerName: 'Nome',
      width: 200,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      flex: 1,
    },
    {
      field: 'document',
      headerName: 'CPF/CNPJ',
      width: 140,
      renderCell: (params: GridRenderCellParams<CompleteUser>) => {
        return params.row.documents?.[0]?.formattedNumber ?? "-";
      },
    },
    {
      field: 'userType',
      headerName: 'Tipo acesso',
      width: 180,
      renderCell: (params: GridRenderCellParams<CompleteUser>) => {
        const user = params.row;
        return user?.isAdm
          ? "Administrador"
          : [
              user?.gestorFinanceiro === 1 ? "Gestor Financeiro" : null,
              user?.gestorReservasAgendamentos === 1
                ? "Gestor Reservas e Agendamentos"
                : null,
            ]
              .filter(Boolean)
              .join(" e ") || "Cliente";
      },
    },
    {
      field: 'isActive',
      headerName: 'Ativo?',
      width: 80,
      renderCell: (params: GridRenderCellParams<CompleteUser>) => {
        return params.row.isActive ? "Sim" : "Não";
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<CompleteUser>) => {
        const user = params.row;
        return (
          <MuiBox sx={{ display: "flex", gap: 1 }}>
            {isAdm && (
              <ButtonLink
                href={`/dashboard/users/${user.id}/edit`}
                type="edit"
                colorIcon="primary.plainColor"
                tooltip="Editar usuário"
              />
            )}
            <IconOpenModal
              params={{ userId: user.id }}
              sxoverride={{ color: "primary.plainColor" }}
              type="reset"
              tooltip="Resetar senha do usuário"
            />
          </MuiBox>
        );
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <UserFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : users.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={users}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
                toolbar={{
                  enabled: true,
                  title: "Usuários",
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
                  filename: "usuarios",
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
                  items={users}
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
      {match({ action, selectedUser })
        .with(
          { action: "reset", selectedUser: P.not(undefined) },
          ({ selectedUser }) => (
            <ResetUserModal shouldOpen={true} user={selectedUser} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}