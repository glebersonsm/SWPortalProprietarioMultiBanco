import type { GridLocaleText } from '@mui/x-data-grid';

// Localização completa em português brasileiro para o DataGrid
// Baseada na localização oficial ptBR do MUI X Data Grid
export const dataGridLocaleText: Partial<GridLocaleText> = {
  // No rows overlay
  noRowsLabel: 'Nenhuma linha',
  noResultsOverlayLabel: 'Nenhum resultado encontrado.',

  // Error overlay
  //errorOverlayDefaultLabel: 'Ocorreu um erro.',

  // Toolbar
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacta',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Selecionar colunas',
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Baixar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarQuickFilterPlaceholder: 'Pesquisar…',
  toolbarQuickFilterLabel: 'Pesquisar',
  toolbarQuickFilterDeleteIconLabel: 'Limpar',
  columnsManagementShowHideAllText: 'Mostrar/ocultar todas',
  columnsManagementReset: 'Resetar',
  

  // Filter panel
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelDeleteIconLabel: 'Excluir',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor do filtro',

  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorEquals: 'é igual a',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorAfter: 'depois de',
  filterOperatorOnOrAfter: 'em ou depois de',
  filterOperatorBefore: 'antes de',
  filterOperatorOnOrBefore: 'em ou antes de',
  filterOperatorIsEmpty: 'está vazio',
  filterOperatorIsNotEmpty: 'não está vazio',
  filterOperatorIsAnyOf: 'é qualquer um de',
  filterOperatorDoesNotContain: 'não contém',
  filterOperatorDoesNotEqual: 'não é igual a',
    // Filter values text
  filterValueAny: 'qualquer',
  filterValueTrue: 'verdadeiro',
  filterValueFalse: 'falso',

  // Column menu
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Exibir colunas',
  columnMenuManageColumns: 'Gerenciar colunas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Desfazer ordenação',
  columnMenuSortAsc: 'Ordenar do menor para o maior',
  columnMenuSortDesc: 'Ordenar do maior para o menor',

  // Column header
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  columnHeaderFiltersLabel: 'Exibir Filtros',
  columnHeaderSortIconLabel: 'Ordenar',

  // Rows
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} linhas selecionadas`
      : `${count.toLocaleString()} linha selecionada`,

  // Total row amount footer text
  footerTotalRows: 'Total de linhas:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleção',
  checkboxSelectionSelectAllRows: 'Selecionar todas linhas',
  checkboxSelectionUnselectAllRows: 'Deselecionar todas linhas',
  checkboxSelectionSelectRow: 'Selecionar linha',
  checkboxSelectionUnselectRow: 'Deselecionar linha',

  // Boolean cell text
  booleanCellTrueLabel: 'sim',
  booleanCellFalseLabel: 'não',

  // Actions cell more text
  actionsCellMore: 'mais',

  // Column pinning text
  pinToLeft: 'Fixar à esquerda',
  pinToRight: 'Fixar à direita',
  unpin: 'Desafixar',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupo',
  treeDataExpand: 'ver filhos',
  treeDataCollapse: 'ocultar filhos',

  // Grouping columns
  groupingColumnHeaderName: 'Grupo',
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Parar de agrupar por ${name}`,

  // Master/detail
  detailPanelToggle: 'Painel de detalhes',
  expandDetailPanel: 'Expandir',
  collapseDetailPanel: 'Esconder',

  // Pagination
  paginationRowsPerPage: 'Linhas por página:',

  // Row reordering text
  rowReorderingHeaderName: 'Reorganizar linhas',

  // Aggregation
  aggregationMenuItemHeader: 'Agrupar',
  aggregationFunctionLabelSum: 'soma',
  aggregationFunctionLabelAvg: 'média',
  aggregationFunctionLabelMin: 'mín',
  aggregationFunctionLabelMax: 'máx',
  aggregationFunctionLabelSize: 'tamanho',

  // AI Prompt (for newer versions)
  promptFieldLabel: 'Prompt',
  promptFieldPlaceholder: 'Digite um prompt…',
  promptFieldPlaceholderWithRecording: 'Digite ou grave um prompt…',
  promptFieldPlaceholderListening: 'Ouvindo o prompt…',
  promptFieldSend: 'Enviar',
  promptFieldRecord: 'Gravar',
  promptFieldStopRecording: 'Parar gravação',
};

// Localização completa em português brasileiro para o DataGrid
// Compatível com MUI X Data Grid v8.10.2