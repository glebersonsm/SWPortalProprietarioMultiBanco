import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

export interface PaginationConfig {
  enabled: boolean;
  useLocalStorage?: boolean;
  storageKeys?: {
    page: string;
    rowsPerPage: string;
  };
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  // Configurações para paginação externa
  external?: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export interface ExportConfig {
  enabled: boolean;
  filename?: string;
  buttonText?: string;
  excludeColumns?: string[];
}

export interface FilterConfig {
  enabled: boolean;
  quickFilter?: boolean;
  columnFilters?: boolean;
}

export interface ToolbarConfig {
  enabled: boolean;
  title?: string;
  showQuickFilter?: boolean;
  showColumnsButton?: boolean;
  showFiltersButton?: boolean;
  showDensitySelector?: boolean;
  showExportButton?: boolean;
  showPrintButton?: boolean;
  customActions?: React.ReactNode;
}

export interface ResponsiveConfig {
  enabled: boolean;
  autoHideColumns?: boolean;
  minColumnWidth?: number;
  breakpoints?: {
    xs?: string[];
    sm?: string[];
    md?: string[];
    lg?: string[];
    xl?: string[];
  };
  priorityColumns?: string[];
}

export interface ReusableDataGridProps {
  // Dados essenciais
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  getRowId?: (row: any) => string | number;
  
  // Configurações
  pagination?: PaginationConfig;
  export?: ExportConfig;
  filters?: FilterConfig;
  responsive?: ResponsiveConfig;
  toolbar?: {
    enabled?: boolean;
    title?: string;
    showToolbar?: boolean;
    showQuickFilter?: boolean;
    showColumnsButton?: boolean;
    showFiltersButton?: boolean;
    showDensitySelector?: boolean;
    showExportButton?: boolean;
    showPrintButton?: boolean;
    customActions?: React.ReactNode;
  };
  print?: {
    enabled?: boolean;
    buttonText?: string;
    title?: string;
    onPrint?: () => void;
  };
  
  // Configurações visuais
  height?: number | string;
  density?: 'compact' | 'standard' | 'comfortable';
  
  // Configurações de seleção
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  
  // Callbacks
  onRowClick?: (params: any) => void;
  onSelectionModelChange?: (selectionModel: any) => void;
  
  // Props adicionais do DataGrid
  additionalProps?: Record<string, any>;
}

export interface DataGridState {
  page: number;
  rowsPerPage: number;
  filterModel?: any;
  sortModel?: any;
  selectionModel?: any;
}