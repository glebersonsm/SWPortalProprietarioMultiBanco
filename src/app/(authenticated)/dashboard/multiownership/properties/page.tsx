"use client";

import LoadingData from "@/components/LoadingData";
import useDebounce from "@/hooks/useDebounce";
import { Divider, Stack } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import WithoutData from "@/components/WithoutData";
import { initialFilters } from "./constants";
import PropertyFilters from "./_components/PropertyFilters";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import { P, match } from "ts-pattern";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Property } from '@/utils/types/multiownership/properties';
import IconOpenModal from "@/components/IconOpenModal";
import { Box } from "@mui/material";

import { getProperties } from "@/services/querys/multiownership/properties";

const PAGE_STORAGE_KEY = "properties_page";
const ROWS_PER_PAGE_STORAGE_KEY = "properties_rows_per_page";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function PropertiesPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const debounceFilters = useDebounce(filters);
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
  

  const { isLoading, data } = useQuery({
    queryKey: ["getProperties", debounceFilters, page, rowsPerPage],
    queryFn: async () => getProperties(debounceFilters, page, rowsPerPage),
  });

  const { properties = [], lastPageNumber } = data ?? {};

  const { action, propertyId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const propertyId = searchParams.get("propertyId");

    return {
      action,
      propertyId,
    };
  }, [searchParams]);



  const selectedProperty = React.useMemo(
    () => properties.find((property) => property.id === Number(propertyId)),
    [properties, propertyId]
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      type: "number",
    },
    {
      field: "enterpriseName",
      headerName: "Empreendimento",
      width: 200,
      flex: 1,
    },
    {
      field: "propertyNumber",
      headerName: "Imóvel",
      width: 120,
    },
    {
      field: "blockCode",
      headerName: "Código do bloco",
      width: 140,
    },
    {
      field: "blockName",
      headerName: "Nome do bloco",
      width: 140,
    },
    {
      field: "propertyFloorName",
      headerName: "Andar",
      width: 100,
    },
    {
      field: "propertyTypeName",
      headerName: "Tipo imóvel",
      width: 120,
    },
    {
      field: "sold",
      headerName: "Vend",
      width: 80,
      type: "number",
    },
    {
      field: "available",
      headerName: "Disp",
      width: 80,
      type: "number",
    },
    {
      field: "blocked",
      headerName: "Bloq",
      width: 80,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Property>) => {
        const property = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>            
            <IconOpenModal
              params={{ propertyId: property.id }}
              sxoverride={{ color: "primary.plainColor" }}
              type="show"
              tooltip="Ver detalhes"
            />
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <PropertyFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : properties.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={properties}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
                toolbar={{
                  enabled: true,
                  title: "Imóveis",
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
                  filename: "propriedades",
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
                  items={properties}
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
      {match({ action, selectedProperty })
        .with(
          { action: "show", selectedProperty: P.not(undefined) },
          ({ selectedProperty }) => (
            <ShowDetailsModal shouldOpen={true} property={selectedProperty} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
