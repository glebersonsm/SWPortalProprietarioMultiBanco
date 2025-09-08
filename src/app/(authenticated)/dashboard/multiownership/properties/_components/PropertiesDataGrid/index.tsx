'use client';

import React from 'react';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import IconOpenModal from '@/components/IconOpenModal';
import { Property } from '@/utils/types/multiownership/properties';

export default function PropertiesDataGrid({
  properties,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  properties: Property[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}) {


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
      headerName: "",
      width: 80,
      sortable: true,
      filterable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconOpenModal
            params={{ propertyId: params.row.id }}
            type="show"
            sxoverride={{ color: "primary.plainColor" }}
            tooltip="Ver detalhes"
          />
        </Box>
      ),
    },
  ];



  return (
    <ReusableDataGrid
      rows={properties}
      columns={columns}
      height={600}
      checkboxSelection={false}
      disableRowSelectionOnClick={true}
      density="standard"
      toolbar={{
        enabled: true,
        title: "Imóveis",
        showQuickFilter: true,
        showColumnsButton: true,
        showFiltersButton: true,
        showDensitySelector: true,
        showExportButton: true,
        showPrintButton: true,
      }}
      filters={{
        enabled: true,
        quickFilter: true,
        columnFilters: true,
      }}
      export={{
        enabled: true,
        filename: "propriedades",
        buttonText: "Exportar CSV",
      }}
      print={{
        enabled: true,
        buttonText: "Imprimir",
      }}
      pagination={{
        enabled: true,
        external: true,
        totalCount,
        onPageChange,
        onRowsPerPageChange,
        useLocalStorage: true,
        storageKeys: {
          page: "multiownership-properties-page",
          rowsPerPage: "multiownership-properties-rowsPerPage"
        },
        rowsPerPageOptions: [5, 10, 25, 50],
      }}
    />
  );
}