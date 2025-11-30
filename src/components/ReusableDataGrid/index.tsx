'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Paper,
} from '@mui/material';
import { Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';
import ModernPaginatedList from '../ModernPaginatedList';
import { ReusableDataGridProps, DataGridState } from './types';
import { dataGridLocaleText } from '../../utils/dataGridLocale';

// Função para exportar dados para CSV
const exportToCSV = (data: readonly any[], columns: GridColDef[], filename: string, excludeColumns: string[] = []) => {
  const filteredColumns = columns.filter(col => !excludeColumns.includes(col.field));
  
  const headers = filteredColumns.map(col => col.headerName || col.field).join(';');
  const rows = data.map(row => 
    filteredColumns.map(col => {
      const value = row[col.field];
      // Escapar aspas duplas e envolver em aspas se contém vírgula
      const stringValue = String(value || '').replace(/"/g, '""');
      return stringValue.includes(';') ? `"${stringValue}"` : stringValue;
    }).join(';')
  ).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Função para imprimir apenas a grid
const printGrid = (rows: readonly any[], columns: GridColDef[], title?: string) => {
  // Filtrar colunas visíveis (excluir actions e outras colunas não imprimíveis)
  const printableColumns = columns.filter(col => 
    col.field !== 'actions' && 
    !col.field.startsWith('__')
  );

  // Criar cabeçalhos da tabela
  const headers = printableColumns.map(col => col.headerName || col.field);
  
  // Criar linhas da tabela
  const tableRows = rows.map(row => 
    printableColumns.map(col => {
      // Se a coluna tem renderCell, tentar extrair o valor formatado
      if (col.renderCell) {
        // Casos específicos para colunas conhecidas
        if (col.field === 'document') {
          return row.documents?.[0]?.formattedNumber ?? '-';
        }
        if (col.field === 'userType') {
          return row?.isAdm
            ? "Administrador"
            : [
                row?.gestorFinanceiro === 1 ? "Gestor Financeiro" : null,
                row?.gestorReservasAgendamentos === 1
                  ? "Gestor Reservas e Agendamentos"
                  : null,
              ]
                .filter(Boolean)
                .join(" e ") || "Cliente";
        }
        if (col.field === 'isActive') {
          return row.isActive ? "Sim" : "Não";
        }
        // Para outras colunas com renderCell, tentar usar o valor direto
        const value = row[col.field];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object' && value.toString) return value.toString();
        return String(value);
      }
      
      // Para colunas sem renderCell, usar o valor direto
      const value = row[col.field];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object' && value.toString) return value.toString();
      return String(value);
    })
  );

  // Criar HTML para impressão
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title || 'Relatório'}</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
            size: A4 landscape;
          }
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: black;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1e7a9c;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          color: #1e7a9c;
          font-size: 24px;
          font-weight: 600;
        }
        .print-date {
          margin-top: 10px;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #1e7a9c;
          color: white;
          font-weight: 600;
          text-align: center;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        @media screen {
          body {
            max-width: 1200px;
            margin: 0 auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title || 'Relatório de Dados'}</h1>
        <div class="print-date">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        <div class="print-date">Total de registros: ${rows.length}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Relatório gerado automaticamente pelo sistema</p>
      </div>
    </body>
    </html>
  `;

  // Abrir nova janela para impressão
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Aguardar o carregamento e imprimir
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Fechar a janela após impressão (opcional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  } else {
    alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
  }
};

// Componente de Toolbar customizada
interface CustomToolbarProps {
  title?: string;
  showToolbar?: boolean;
  showQuickFilter?: boolean;
  showColumnsButton?: boolean;
  showFiltersButton?: boolean;
  showDensitySelector?: boolean;
  showExportButton?: boolean;
  showPrintButton?: boolean;
  customActions?: React.ReactNode;
  onExport?: () => void;
  onPrint?: () => void;
  exportEnabled?: boolean;
  exportButtonText?: string;
  printButtonText?: string;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  showToolbar = true,
  showColumnsButton = true,
  showFiltersButton = true,
  showPrintButton = true,
  customActions,
  onExport,
  onPrint,
  exportButtonText = 'Exportar CSV',
  printButtonText = 'Imprimir'
}) => {

  return (
    <Box
          sx={{
            padding: '8px 16px',
            background: 'var(--card-bg-gradient, linear-gradient(180deg, var(--color-primary, #015a67) 0%, var(--color-secondary, #00c8ec) 100%))',
            borderBottom: '1px solid var(--card-border-color, rgba(30, 122, 156, 0.3))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 1.5,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, var(--color-primary, #1e7a9c) 50%, transparent 100%)',
            },
          }}
        >
      
      {/* Linha principal: Controles e ações */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        minHeight: '40px'
      }}>
        {/* Controles da esquerda */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {showColumnsButton && showToolbar && (
             <Box
               component="span"
               sx={{
                 display: 'inline-flex',
                 '& .MuiButton-root': {
                   color: 'var(--color-text-light, #ffffff)',
                   borderColor: 'rgba(255, 255, 255, 0.35)',
                   backgroundColor: 'rgba(255, 255, 255, 0.12)',
                   fontFamily: 'var(--font-puffin), sans-serif',
                   fontWeight: 600,
                   fontSize: '0.875rem',
                   textTransform: 'none',
                   minWidth: 'auto',
                   padding: '8px 16px',
                   borderRadius: '10px',
                   boxShadow: '0 2px 8px rgba(1, 90, 103, 0.15)',
                   transition: 'all 0.2s ease-in-out',
                   '&:hover': {
                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
                     borderColor: 'rgba(255, 255, 255, 0.5)',
                     transform: 'translateY(-1px)',
                     boxShadow: '0 4px 16px rgba(1, 90, 103, 0.25)',
                   },
                 },
               }}
             >
               <ColumnsPanelTrigger>Colunas</ColumnsPanelTrigger>
             </Box>
           )}
          {showFiltersButton && showToolbar && (
             <Box
               component="span"
               sx={{
                 display: 'inline-flex',
                 '& .MuiButton-root': {
                   color: 'var(--color-text-light, #ffffff)',
                   borderColor: 'rgba(255, 255, 255, 0.35)',
                   backgroundColor: 'rgba(255, 255, 255, 0.12)',
                   fontFamily: 'var(--font-puffin), sans-serif',
                   fontWeight: 600,
                   fontSize: '0.875rem',
                   textTransform: 'none',
                   minWidth: 'auto',
                   padding: '8px 16px',
                   borderRadius: '10px',
                   boxShadow: '0 2px 8px rgba(1, 90, 103, 0.15)',
                   transition: 'all 0.2s ease-in-out',
                   '&:hover': {
                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
                     borderColor: 'rgba(255, 255, 255, 0.5)',
                     transform: 'translateY(-1px)',
                     boxShadow: '0 4px 16px rgba(1, 90, 103, 0.25)',
                   },
                 },
               }}
             >
               <FilterPanelTrigger>Filtros</FilterPanelTrigger>
             </Box>
           )}
        </Box>
        
        {/* Filtro rápido no centro */}
        <Box sx={{ flex: 1, maxWidth: '320px', minWidth: '220px' }}>
          <QuickFilter
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                color: 'var(--card-text-color, #ffffff)',
                backgroundColor: 'var(--form-input-bg, #ffffff)',
                border: '1px solid var(--card-border-color, rgba(30, 122, 156, 0.3))',
                borderRadius: '12px',
                fontSize: '0.875rem',
                height: '40px',
                fontFamily: 'var(--font-puffin), sans-serif',
                boxShadow: '0 2px 8px var(--card-shadow-color, rgba(30, 122, 156, 0.08))',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'var(--color-primary, #1e7a9c)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 16px var(--card-shadow-color-hover, rgba(30, 122, 156, 0.15))',
                },
                '&.Mui-focused': {
                  borderColor: 'var(--color-primary, #1e7a9c)',
                  borderWidth: '2px',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 16px var(--card-shadow-color-expanded, rgba(30, 122, 156, 0.2))',
                },
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
                fontWeight: 500,
                '&::placeholder': {
                  color: 'var(--color-text-tertiary, rgba(158, 158, 158, 0.6))',
                  opacity: 1,
                  fontWeight: 400,
                },
              },
            }}
          />
        </Box>
        
        {/* Ações da direita */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Botão de exportação CSV customizado */}
          {onExport && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExport}
              size="medium"
              sx={{
                color: 'var(--color-text-light, #ffffff)',
                borderColor: 'var(--card-border-color, rgba(30, 122, 156, 0.3))',
                backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.12))',
                fontFamily: 'var(--font-puffin), sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                minWidth: 'auto',
                padding: '8px 16px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px var(--card-shadow-color, rgba(30, 122, 156, 0.08))',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'var(--card-bg-gradient-hover, rgba(30, 122, 156, 0.15))',
                  borderColor: 'var(--color-primary, #1e7a9c)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 16px var(--card-shadow-color-hover, rgba(30, 122, 156, 0.15))',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.1rem',
                },
              }}
            >
              {exportButtonText}
            </Button>
          )}
          
          {/* Botão de impressão */}
          {showPrintButton && onPrint && (
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={onPrint}
              size="medium"
              sx={{
                   color: 'var(--color-text-light, #ffffff)',
                   borderColor: 'var(--card-border-color, rgba(30, 122, 156, 0.3))',
                   backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.12))',
                   fontFamily: 'var(--font-puffin), sans-serif',
                   fontWeight: 600,
                   fontSize: '0.875rem',
                   textTransform: 'none',
                   minWidth: 'auto',
                   padding: '8px 16px',
                   borderRadius: '10px',
                   boxShadow: '0 2px 8px var(--card-shadow-color, rgba(30, 122, 156, 0.08))',
                   transition: 'all 0.2s ease-in-out',
                   '&:hover': {
                     backgroundColor: 'var(--card-bg-gradient-hover, rgba(30, 122, 156, 0.15))',
                     borderColor: 'var(--color-primary, #1e7a9c)',
                     transform: 'translateY(-1px)',
                     boxShadow: '0 4px 16px var(--card-shadow-color-hover, rgba(30, 122, 156, 0.15))',
                   },
                 }}
            >
              {printButtonText}
            </Button>
          )}
          
          {customActions}
        </Box>
      </Box>
    </Box>
  );
};

export const ReusableDataGrid: React.FC<ReusableDataGridProps> = ({
  rows,
  columns,
  loading = false,
  getRowId,
  pagination = { enabled: true },
  export: exportConfig = { enabled: true },
  filters = { enabled: true, quickFilter: true, columnFilters: true },
  toolbar = { enabled: true, showQuickFilter: true, showColumnsButton: true, showFiltersButton: true, showDensitySelector: true, showExportButton: true, showPrintButton: true },
  print = { enabled: true },
  height = 600,
  density = 'standard',
  checkboxSelection = false,
  disableRowSelectionOnClick = false,
  rowSelectionModel,
  onRowClick,
  onSelectionModelChange,
  additionalProps = {}
}) => {
  // Estado da paginação
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(
    pagination.defaultRowsPerPage || 10
  );

  // Carregar estado do localStorage se configurado
  useEffect(() => {
    if (pagination.enabled && pagination.useLocalStorage && pagination.storageKeys) {
      const savedPage = localStorage.getItem(pagination.storageKeys.page);
      const savedRowsPerPage = localStorage.getItem(pagination.storageKeys.rowsPerPage);
      
      if (savedPage) setPage(parseInt(savedPage));
      if (savedRowsPerPage) setRowsPerPage(parseInt(savedRowsPerPage));
    }
  }, [pagination]);

  // Salvar estado no localStorage
  useEffect(() => {
    if (pagination.enabled && pagination.useLocalStorage && pagination.storageKeys) {
      localStorage.setItem(pagination.storageKeys.page, page.toString());
      localStorage.setItem(pagination.storageKeys.rowsPerPage, rowsPerPage.toString());
    }
  }, [page, rowsPerPage, pagination]);

  // Calcular dados paginados (apenas para paginação local)
  const paginatedRows = useMemo(() => {
    if (!pagination.enabled) return rows;
    
    // Se for paginação externa, retorna os dados como estão
    if (pagination.external) return rows;
    
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [rows, page, rowsPerPage, pagination.enabled, pagination.external]);

  // Função de exportação
  const handleExport = () => {
    if (exportConfig.enabled) {
      exportToCSV(
        rows,
        columns,
        exportConfig.filename || 'export',
        exportConfig.excludeColumns
      );
    }
  };

  // Configurações do DataGrid
  const dataGridProps: any = {
    rows: pagination.enabled ? paginatedRows : rows,
    columns,
    loading,
    getRowId,
    density,
    checkboxSelection,
    disableRowSelectionOnClick,
    onRowClick,
    onRowSelectionModelChange: onSelectionModelChange,
    // Configurações de paginação
    hideFooter: true, // Sempre ocultar footer interno
    ...(pagination.enabled ? {
      paginationMode: 'server' as const,
      rowCount: (pagination.totalCount || 0),
    } : {
      paginationMode: 'client' as const,
    }),
    // Configurações de filtros
    disableColumnFilter: !filters.columnFilters,
    filterMode: 'client' as const,
    // Localização em português
    localeText: dataGridLocaleText,
    // Toolbar customizada - exibida quando habilitada
    ...(toolbar.enabled !== false ? {
      slots: {
        toolbar: () => (
          <CustomToolbar
            title={toolbar.title}
            showToolbar={toolbar.enabled !== false}
            showQuickFilter={toolbar.showQuickFilter !== false && filters.quickFilter}
            showColumnsButton={toolbar.showColumnsButton !== false}
            showFiltersButton={toolbar.showFiltersButton !== false && filters.columnFilters}
            showDensitySelector={toolbar.showDensitySelector !== false}
            showExportButton={toolbar.showExportButton !== false}
            showPrintButton={toolbar.showPrintButton !== false}
            customActions={toolbar.customActions}
            onExport={exportConfig.enabled ? handleExport : undefined}
            onPrint={print?.enabled ? (print?.onPrint || (() => printGrid(rows, columns, print?.title || toolbar.title))) : undefined}
            exportEnabled={exportConfig.enabled}
            exportButtonText={exportConfig.buttonText || 'Exportar CSV'}
            printButtonText={print?.buttonText || 'Imprimir'}
          />
        )
      }
    } : {}),
    sx: {
      '& .MuiDataGrid-root': {
        border: 'none',
        backgroundColor: 'var(--card-bg-paper, #ffffff)',
        color: 'var(--card-text-color, #1a1a1a)',
        fontFamily: 'var(--font-puffin), sans-serif',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px var(--card-shadow-color, rgba(0, 0, 0, 0.08))',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.3))',
        wordWrap: 'break-word',
        maxWidth: 'none !important',
        minWidth: '0 !important',
        color: 'var(--card-text-color, #2c3e50)',
        fontSize: '0.455rem !important',
        fontWeight: 400,
        padding: '12px 16px',
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
          outline: '2px solid var(--color-primary, rgba(30, 122, 156, 0.3))',
          outlineOffset: '-2px',
        },
      },
      '& .MuiDataGrid-columnHeaders': {
        background: 'var(--card-bg-gradient, linear-gradient(180deg, var(--color-primary, #015a67) 0%, var(--color-secondary, #00c8ec) 100%))',
        borderBottom: 'none',
        color: 'var(--color-text-light, #ffffff)',
        fontWeight: 700,
        fontSize: '0.455rem !important',
        minHeight: '56px !important',
        '& .MuiDataGrid-columnHeader': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
          color: 'var(--color-text-light, #ffffff)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '& .MuiDataGrid-iconSeparator': {
          color: 'var(--color-text-light, rgba(255, 255, 255, 0.7))',
        },
        '& .MuiDataGrid-menuIcon': {
          color: 'var(--color-text-light, #ffffff)',
          '&:hover': {
            backgroundColor: 'var(--card-bg-hover, rgba(255, 255, 255, 0.1))',
            borderRadius: '4px',
          },
        },
        '& .MuiDataGrid-sortIcon': {
          color: 'var(--color-text-light, #ffffff)',
        },
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          padding: '0 8px',
        },
      },
      '& .MuiDataGrid-row': {
        transition: 'all 0.2s ease-in-out',
        '&:nth-of-type(even)': {
          backgroundColor: 'var(--zebra-stripe-color, rgba(30, 122, 156, 0.06))',
        },
        '&:nth-of-type(odd)': {
          backgroundColor: 'var(--card-bg-paper, #ffffff)',
        },
        '&:hover': {
          backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.12)) !important',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px var(--card-shadow-color, rgba(0, 0, 0, 0.1))',
          '& .MuiDataGrid-cell': {
            color: 'var(--card-text-color, #2c3e50)',
          },
        },
        '&.Mui-selected': {
          backgroundColor: 'var(--card-bg-gradient-expanded, rgba(30, 122, 156, 0.18)) !important',
          color: 'var(--card-text-color, #2c3e50)',
          '&:hover': {
            backgroundColor: 'var(--card-bg-gradient-hover, rgba(30, 122, 156, 0.25)) !important',
          },
        },
        '&:last-child': {
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
        },
      },
      '& .MuiDataGrid-footerContainer': {
        background: 'var(--card-bg-surface, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%))',
        borderTop: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.3))',
        color: 'var(--card-text-color, #2c3e50)',
        minHeight: '52px',
        '& .MuiTablePagination-root': {
          color: 'var(--card-text-color, #2c3e50)',
        },
        '& .MuiIconButton-root': {
          color: 'var(--color-primary, #1e7a9c)',
          '&:hover': {
            backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.1))',
          },
          '&.Mui-disabled': {
            color: 'var(--color-text-tertiary, rgba(158, 158, 158, 0.3))',
          },
        },
      },
      '& .MuiDataGrid-toolbarContainer': {
        background: 'var(--card-bg-gradient, linear-gradient(180deg, var(--color-primary, #015a67) 0%, var(--color-secondary, #00c8ec) 100%))',
        borderBottom: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.3))',
        color: 'var(--card-text-color, #ffffff)',
        padding: '0',
        '& .MuiButton-root': {
          color: 'var(--color-text-light, #ffffff)',
          borderColor: 'var(--color-primary, #1e7a9c)',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.1))',
            borderColor: 'var(--color-secondary, #00c8ec)',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px var(--card-shadow-color-hover, rgba(30, 122, 156, 0.15))',
          },
        },
      },
      '& .MuiDataGrid-filterForm': {
        backgroundColor: 'var(--card-bg-paper, #ffffff)',
        color: 'var(--card-text-color, #2c3e50)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px var(--card-shadow-color, rgba(0, 0, 0, 0.1))',
        border: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.3))',
      },
      '& .MuiDataGrid-filterFormDeleteIcon': {
        color: '#e53e3e',
        '&:hover': {
          backgroundColor: 'rgba(229, 62, 62, 0.1)',
          borderRadius: '4px',
        },
      },
      '& .MuiDataGrid-menuIcon': {
        color: 'var(--color-primary, #1e7a9c)',
        '&:hover': {
          backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.1))',
          borderRadius: '4px',
        },
      },
      '& .MuiDataGrid-sortIcon': {
        color: 'var(--color-primary, #1e7a9c)',
      },
      '& .MuiCheckbox-root': {
        color: 'var(--color-primary, #1e7a9c)',
        '&.Mui-checked': {
          color: 'var(--color-primary, #1e7a9c)',
        },
        '&:hover': {
          backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.1))',
        },
      },
      '& .MuiDataGrid-columnSeparator': {
        color: 'var(--color-text-light, rgba(255, 255, 255, 0.3))',
      },
      '& .MuiDataGrid-panel': {
        borderRadius: '12px',
        boxShadow: '0 8px 32px var(--card-shadow-color-expanded, rgba(0, 0, 0, 0.12))',
        border: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.3))',
      },
      '& .MuiDataGrid-panelHeader': {
        background: 'var(--card-bg-gradient, linear-gradient(180deg, var(--color-primary, #015a67) 0%, var(--color-secondary, #00c8ec) 100%))',
        color: 'var(--color-text-light, #ffffff)',
        fontWeight: 600,
        fontFamily: 'var(--font-puffin), sans-serif',
        fontSize: '0.875rem',
        padding: '12px 16px',
        '& .MuiTypography-root': {
          color: 'var(--color-text-light, #ffffff) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontWeight: '600 !important',
          fontSize: '0.875rem !important',
        },
      },
      '& .MuiDataGrid-panelContent': {
        backgroundColor: 'var(--card-bg-paper, #ffffff)',
        color: 'var(--card-text-color, #2c3e50)',
        fontFamily: 'var(--font-puffin), sans-serif',
        '& .MuiTypography-root': {
          color: 'var(--card-text-color, #2c3e50) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontSize: '0.875rem !important',
        },
        '& .MuiFormControlLabel-root': {
          color: 'var(--card-text-color, #2c3e50) !important',
          '& .MuiTypography-root': {
            color: 'var(--card-text-color, #2c3e50) !important',
            fontFamily: 'var(--font-puffin), sans-serif !important',
            fontSize: '0.875rem !important',
            fontWeight: 500,
          },
        },
        '& .MuiFormLabel-root': {
          color: 'var(--card-text-color, #2c3e50) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontSize: '0.875rem !important',
          fontWeight: 600,
        },
        '& .MuiInputBase-root': {
          color: 'var(--card-text-color, #2c3e50) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontSize: '0.875rem !important',
          '& input': {
            color: 'var(--card-text-color, #2c3e50) !important',
          },
        },
        '& .MuiSelect-select': {
          color: 'var(--card-text-color, #2c3e50) !important',
        },
        '& .MuiMenuItem-root': {
          color: 'var(--card-text-color, #2c3e50) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontSize: '0.875rem !important',
          '&:hover': {
            backgroundColor: 'var(--card-bg-hover, rgba(30, 122, 156, 0.1)) !important',
          },
        },
        '& .MuiButton-root': {
          color: 'var(--color-primary, #1e7a9c) !important',
          fontFamily: 'var(--font-puffin), sans-serif !important',
          fontSize: '0.875rem !important',
          fontWeight: 600,
          textTransform: 'none',
        },
      },
      // Estilos específicos para diferentes densidades
      '&.MuiDataGrid-root--densityCompact': {
        '& .MuiDataGrid-cell': {
          fontSize: '0.455rem !important',
          padding: '8px 12px !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontSize: '0.455rem !important',
        },
      },
      '&.MuiDataGrid-root--densityStandard': {
        '& .MuiDataGrid-cell': {
          fontSize: '0.455rem !important',
          padding: '12px 16px !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontSize: '0.455rem !important',
        },
      },
      '&.MuiDataGrid-root--densityComfortable': {
        '& .MuiDataGrid-cell': {
          fontSize: '0.455rem !important',
          padding: '16px 20px !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontSize: '0.455rem !important',
        },
      },
      '@media print': {
        '& .MuiDataGrid-cell': {
          wordWrap: 'break-word',
          maxWidth: 'none !important',
          minWidth: '0 !important',
        },
      },
    },
    ...additionalProps
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%',
        background: 'var(--card-bg-gradient, linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%))',
        border: '1px solid var(--card-border-color, rgba(30, 122, 156, 0.3))',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px var(--card-shadow-color, rgba(30, 122, 156, 0.08)), 0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--card-bg-gradient, linear-gradient(90deg, #1e7a9c 0%, #155a73 50%, #2ca2cc 100%))',
          zIndex: 1,
        },
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 60px var(--card-shadow-color-hover, rgba(30, 122, 156, 0.15)), 0 8px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ height, width: '100%' }}>
        <DataGrid 
          {...dataGridProps}
          disableColumnMenu={false} // Enable column menu for better functionality
          disableVirtualization={false} // Keep virtualization enabled for performance
          showToolbar={true}
          sx={{
            '.MuiDataGrid-root': {
              border: 'none',
            },
          }}
          {...additionalProps}
        />
      </Box>
      
      {pagination.enabled && (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid var(--card-border-color, rgba(224, 224, 224, 0.5))',
          backgroundColor: 'var(--card-bg-surface, #fafafa)',
        }}>
          <ModernPaginatedList
            items={rows}
            lastPageNumber={Math.ceil((pagination.totalCount || 0) / rowsPerPage)
            }
            handleChangePage={(event, value) => {
              setPage(value);
              if (pagination.onPageChange) {
                pagination.onPageChange(value);
              }
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(newRowsPerPage) => {
              const actualValue = typeof newRowsPerPage === 'function' 
                ? newRowsPerPage(rowsPerPage) 
                : newRowsPerPage;
              setRowsPerPage(actualValue);
              if (pagination.onRowsPerPageChange) {
                pagination.onRowsPerPageChange(actualValue);
              }
            }}
            useLocalStorage={pagination.useLocalStorage}
            storageKeys={pagination.storageKeys ? {
              pageKey: pagination.storageKeys.page,
              rowsPerPageKey: pagination.storageKeys.rowsPerPage
            } : undefined}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ReusableDataGrid;
export type { ReusableDataGridProps, DataGridState } from './types';
