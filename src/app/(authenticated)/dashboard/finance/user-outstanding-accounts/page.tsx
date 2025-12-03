"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import WithoutData from "@/components/WithoutData";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getUserOutstandingBills, downloadBill } from "@/services/querys/finance-users"; // downloadBill importado corretamente
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import UserOutstandingBillsFilters from "./_components/UserOutstandingBillsFilters";
import DownloadCertificatesModal from "./_components/DownloadCertificatesModal";

// Importar modais com SSR desabilitado para evitar renderização no servidor
const PayPerPixModal = dynamic(
  () => import("./_components/PayPerPixModal"),
  { ssr: false }
);

const PayByCreditCard = dynamic(
  () => import("./_components/PayByCreditCardModal"),
  { ssr: false }
);
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { Button } from "@mui/joy";
import useUser from "@/hooks/useUser";

import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
// Use GridRowId para tipar o array de IDs
import { GridColDef, GridRenderCellParams, GridRowClassNameParams, GridRowId } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import { IconButton, Box as MuiBox, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Button as MuiButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import PixIcon from "@mui/icons-material/Pix";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { isDateBeforeToday } from "@/utils/dates";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_rows_per_page";

// Simplificando a verificação de localStorage
const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function OutstandingAccountsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // Onde o DataGrid armazena os IDs selecionados
  const [selectedRowIds, setSelectedRowIds] = React.useState<GridRowId[]>([]);
  
  // Contas selecionadas diretamente (seguindo padrão HotBeach)
  const [selectedAccounts, setSelectedAccounts] = React.useState<UserOutstandingBill[]>([]);
  
  // Estados para pagamento
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [paymentType, setPaymentType] = useState<'card' | 'pix' | null>(null);
  
  const router = useRouter();
  
  // --- Lógica de Local Storage (Mantida) ---
  useEffect(() => {
    if (thereIsLocalStorage) {
      try { localStorage.setItem(PAGE_STORAGE_KEY, page.toString()); } catch {}
    }
  }, [page]);
  
  useEffect(() => {
    if (thereIsLocalStorage) {
      try { localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString()); } catch {}
    }
  }, [rowsPerPage]);

  useEffect(() => {
    if (thereIsLocalStorage) {
      try {
        const p = Number(localStorage.getItem(PAGE_STORAGE_KEY));
        if (p) setPage(p);
        const rpp = Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY));
        if (rpp) setRowsPerPage(rpp);
      } catch {}
    }
  }, []);
  // ----------------------------------------

  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();

  const { settingsParams, isAdm } = useUser();

  // Verificações de configurações de pagamento
  const onlinePaymentEnabled = settingsParams?.enableOnlinePayment === true;
  const cardPaymentEnabled = settingsParams?.enableCardPayment === true;
  const pixPaymentEnabled = settingsParams?.enablePixPayment === true;
  const canOpenCardModal = onlinePaymentEnabled && cardPaymentEnabled;
  const canOpenPixModal = onlinePaymentEnabled && pixPaymentEnabled;
  const canShowPaymentOptions = canOpenCardModal || canOpenPixModal;

  const { isLoading, data } = useQuery({
    queryKey: ["getUserOutstandingBills", debounceFilters, page, rowsPerPage],
    queryFn: async () => getUserOutstandingBills(debounceFilters, page, rowsPerPage)
  });

  const { outstandingBills = [], lastPageNumber } = data ?? {};
  

  // Função para checar se a conta está "Em Aberto" (pode ser selecionada e paga)
  const isOpenStatus = (status: any) => String(status || "").toLowerCase().includes("em aberto");

  // Verificar se há contas "Em aberto" selecionadas
  const hasOpenStatusBills = useMemo(() => {
    if (selectedAccounts.length === 0) return false;
    // Verificar se TODAS as contas selecionadas estão "Em aberto"
    return selectedAccounts.every(bill => {
      const status = String(bill.status || "").toLowerCase();
      return status.includes("em aberto");
    });
  }, [selectedAccounts]);

  // Botão de pagamento só aparece se:
  // 1. Houver contas selecionadas
  // 2. TODAS as contas selecionadas estejam "Em aberto"
  // 3. Pelo menos uma opção de pagamento (PIX ou Cartão) estiver habilitada
  const shouldShowPaymentButton =
    selectedAccounts.length > 0 && 
    hasOpenStatusBills && 
    onlinePaymentEnabled && 
    (cardPaymentEnabled || pixPaymentEnabled);

  // Função que retorna se uma linha pode ser selecionada
  const canSelectBill = React.useCallback((bill: UserOutstandingBill): boolean => {
    return isOpenStatus(bill.status);
  }, []);

  // --- LÓGICA DE SELEÇÃO CORRIGIDA (seguindo padrão HotBeach) ---
  const handleSelectionModelChange = React.useCallback((newSelection: any) => {
      try {
        // Extrair IDs corretamente - pode vir como array ou objeto com Set
        let selectionIds: any[] = [];
        
        if (Array.isArray(newSelection)) {
          selectionIds = newSelection;
        } else if (newSelection && newSelection.ids instanceof Set) {
          selectionIds = Array.from(newSelection.ids);
        } else if (newSelection && typeof newSelection === 'object') {
          selectionIds = Object.values(newSelection);
        }
        
        // Filtrar contas selecionadas - usar comparação direta sem conversão forçada
        const selectedBills = outstandingBills.filter((bill) => {
          // Comparar diretamente, permitindo que o JavaScript faça a coerção de tipo
          return selectionIds.some(id => id == bill.id || Number(id) === Number(bill.id));
        });
        
        // Filtrar apenas contas que podem ser selecionadas
        const validBills = selectedBills.filter(bill => canSelectBill(bill));
        
        if (validBills.length === 0) {
          setSelectedAccounts([]);
          setSelectedRowIds([]);
          return;
        }
        
        // Se há apenas 1 conta, aceita sem validação
        if (validBills.length === 1) {
          setSelectedAccounts(validBills);
          setSelectedRowIds(validBills.map(b => b.id));
          return;
        }
        
        // Para múltiplas contas, validar se todas são da mesma empresa
        const companyIds = Array.from(new Set(validBills.map(b => b.companyId)));
        if (companyIds.length > 1) {
          alert("Você só pode selecionar contas da mesma empresa.");
          setSelectedAccounts([validBills[0]]);
          setSelectedRowIds([validBills[0].id]);
          return;
        }
        
        // Se passou todas as validações, atualizar estados
        setSelectedAccounts(validBills);
        setSelectedRowIds(validBills.map(b => b.id));
      } catch (error) {
        setSelectedAccounts([]);
        setSelectedRowIds([]);
      }
  }, [outstandingBills, canSelectBill]);
  // ----------------------------------------


  // Cálculo dos totais para exibição
  const totalOriginal = outstandingBills.reduce((acc, item) => acc + item.value, 0);
  const totalAtualizado = outstandingBills.reduce((acc, item) => acc + item.currentValue, 0);

  // selectedAccounts agora é um estado gerenciado diretamente no callback
  // Removido o useMemo que calculava a partir de selectedRowIds

  const totalSelecionado = useMemo(() => {
    if (selectedAccounts.length === 0) {
      return 0;
    }
    
    return selectedAccounts.reduce((acc, item) => {
      // Somar apenas o currentValue (valor atualizado) dos itens selecionados
      const currentValue = Number(item.currentValue) || 0;
      return acc + currentValue;
    }, 0);
  }, [selectedAccounts]);

  // Funções de controle do menu de pagamento
  const handleOpenPaymentMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePaymentMenu = () => {
    setAnchorEl(null);
  };

  const handlePaymentOption = (type: 'card' | 'pix') => {
    if (!onlinePaymentEnabled) {
      toast.warning("O pagamento online está desabilitado.");
      return;
    }

    setPaymentType(type);
    handleClosePaymentMenu();
    if (type === 'card') {
      if (!canOpenCardModal) {
        toast.warning("Pagamento com cartão indisponível.");
        return;
      }
      setShowPaymentModal(true);
    } else {
      if (!canOpenPixModal) {
        toast.warning("Pagamento via PIX indisponível.");
        return;
      }
      // PIX - usar lógica existente
      const billsIds = selectedAccounts.map(b => b.id).join(',');
      router.push(`?action=payPerPix&bills=${billsIds}`);
    }
  };




  function handleChangePage(event: ChangeEvent<unknown>, value: number): void {
    setPage(value);
  }


  const action = React.useMemo(() => {
    return searchParams.get("action");
  }, [searchParams]);

  // Obter selectedBills dos searchParams para PIX
  const selectedBills = React.useMemo(() => {
    if (action === "payPerPix") {
      const billsParam = searchParams.get("bills");
      if (billsParam) {
        const billIds = billsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
        return outstandingBills.filter(bill => billIds.includes(Number(bill.id)));
      }
    }
    return undefined;
  }, [action, searchParams, outstandingBills]);

  // Função para limpar seleção
  const clearSelectedAccounts = React.useCallback(() => {
    setSelectedAccounts([]);
    setSelectedRowIds([]);
  }, []);

  // Definição das colunas com melhor responsividade
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 70,
      maxWidth: 90,
      flex: 0.3,
      type: 'number',
    },
    {
      field: 'companyName',
      headerName: 'Empresa',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'contrato',
      headerName: 'Contrato',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'accountTypeName',
      headerName: 'Detalhes',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Valor original',
      minWidth: 130,
      flex: 0.7,
      type: 'number',
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return formatMoney(params.row.value);
      },
    },
    {
      field: 'currentValue',
      headerName: 'Valor atualizado',
      minWidth: 130,
      flex: 0.7,
      type: 'number',
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return formatMoney(params.row.currentValue);
      },
    },
    {
      field: 'dueDate',
      headerName: 'Vencimento',
      minWidth: 110,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return params.row.processingDate ?? params.row.dueDate;
      },
    },
    {
      field: 'paymentDate',
      headerName: 'Pagamento',
      minWidth: 110,
      flex: 0.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 110,
      flex: 0.5,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      minWidth: 80,
      maxWidth: 100,
      flex: 0.3,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        const bill = params.row;
        return (
          <MuiBox sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {bill.typeableBillLine &&
            settingsParams?.enableBillDownload &&
            String(bill.status || "").toLowerCase().includes("em aberto") ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // Função downloadBill é importada
                  downloadBill(bill.typeableBillLine, bill.id); 
                }}
                title="Baixar boleto simplificado"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            ) : null}
          </MuiBox>
        );
      },
    },
  ];


  return (
    <>
      {!mounted ? <LoadingData /> : (
        <>
        <Stack spacing={{ xs: 2, sm: 3 }} divider={<Divider />} sx={{ px: { xs: 1, sm: 0 } }}>
        <UserOutstandingBillsFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : outstandingBills.length === 0 ? (
          <WithoutData />
        ) : (
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <MuiBox sx={{ 
              mb: 2, 
              p: { xs: 1.5, sm: 2 }, 
              bgcolor: 'background.paper', 
              borderRadius: 1 
            }}>
              <MuiBox sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', md: 'center' }, 
                gap: 2 
              }}>
                <MuiBox sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.5, sm: 4 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  <MuiBox>
                    <strong>Total Original: {formatMoney(totalOriginal)}</strong>
                  </MuiBox>
                  <MuiBox>
                    <strong>Total Atualizado: {formatMoney(totalAtualizado)}</strong>
                  </MuiBox>
                </MuiBox>

                {/* Botão de Pagamento no Cabeçalho */}
                {shouldShowPaymentButton && (
                  <MuiBox sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2, 
                    alignItems: { xs: 'stretch', sm: 'center' } 
                  }}>
                    <MuiBox sx={{ 
                      background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: 'white',
                      px: 2, 
                      py: 1, 
                      borderRadius: 1,
                      fontFamily: 'var(--font-puffin), sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      textAlign: 'center',
                    }}>
                      {selectedAccounts.length} {selectedAccounts.length === 1 ? 'conta' : 'contas'} selecionada{selectedAccounts.length === 1 ? '' : 's'} - Total: {formatMoney(totalSelecionado)}
                    </MuiBox>
                    <MuiButton
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={handleOpenPaymentMenu}
                      fullWidth={false}
                      sx={{
                        bgcolor: 'var(--color-primary)',
                        color: 'var(--color-text-light, #ffffff) !important',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        textTransform: 'none',
                        px: { xs: 2, sm: 3 },
                        py: 1,
                        borderRadius: '8px',
                        boxShadow: '0 6px 18px rgba(1, 90, 103, 0.25)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        minWidth: { xs: '100%', sm: 'auto' },
                        '& .MuiButton-startIcon': {
                          color: 'var(--color-text-light, #ffffff) !important',
                        },
                        '& svg': {
                          color: 'var(--color-text-light, #ffffff) !important',
                        },
                        '&:hover': {
                          bgcolor: 'var(--color-secondary) !important',
                          color: 'var(--color-text-light, #ffffff) !important',
                          boxShadow: '0 10px 26px rgba(0, 200, 236, 0.35)',
                          transform: 'translateY(-2px)',
                          '& .MuiButton-startIcon': {
                            color: 'var(--color-text-light, #ffffff) !important',
                          },
                          '& svg': {
                            color: 'var(--color-text-light, #ffffff) !important',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                          boxShadow: '0 4px 12px rgba(1, 90, 103, 0.2)',
                        },
                      }}
                    >
                      Opções de Pagamento
                    </MuiButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClosePaymentMenu}
                      slotProps={{
                        paper: {
                          sx: {
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            mt: 1,
                            minWidth: anchorEl?.offsetWidth || 'auto',
                          },
                        },
                      }}
                    >
                      {canOpenCardModal && (
                        <MenuItem 
                          onClick={() => handlePaymentOption('card')}
                          sx={{
                            fontFamily: 'var(--font-puffin), sans-serif',
                            py: 1.5,
                            px: 2,
                            transition: 'all 0.15s ease-in-out',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.08)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <CreditCardIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Cartão de Crédito</ListItemText>
                        </MenuItem>
                      )}
                      {canOpenPixModal && (
                        <MenuItem 
                          onClick={() => handlePaymentOption('pix')}
                          sx={{
                            fontFamily: 'var(--font-puffin), sans-serif',
                            py: 1.5,
                            px: 2,
                            transition: 'all 0.15s ease-in-out',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.08)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <PixIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>PIX</ListItemText>
                        </MenuItem>
                      )}
                    </Menu>
                  </MuiBox>
                )}
              </MuiBox>
            </MuiBox>

            <ReusableDataGrid
              rows={outstandingBills}
              columns={columns}
              loading={isLoading}
              checkboxSelection={true}
              onSelectionModelChange={handleSelectionModelChange}
              additionalProps={{
                 // Garante que só contas "em aberto" podem ser selecionadas
                isRowSelectable: (params: any) => { 
                  const bill = params.row as UserOutstandingBill;
                  return canSelectBill(bill);
                },
                getRowClassName: (params: GridRowClassNameParams<UserOutstandingBill>) => {
                  const status = params.row?.status?.toLowerCase();
                   if (status && status.includes("em aberto") && isDateBeforeToday(params.row?.dueDate)) {
                     return "overdue-row";
                   }
                   if (status?.includes("paga")) {
                     return "paid-row";
                   }
                   return "";
                 }
               }}
              pagination={{
                enabled: false,
              }}
              toolbar={{
                title: "Contas",
                showQuickFilter: true,
                showColumnsButton: true,
                showFiltersButton: true,
                showExportButton: true,
                showPrintButton: true,
              }}
              export={{
                enabled: true,
                filename: "Parcelas",
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
            <MuiBox 
              sx={{ 
                alignSelf: { xs: 'stretch', sm: 'flex-end' },
                marginTop: '8px',
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-end' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <ModernPaginatedList
                items={outstandingBills}
                lastPageNumber={lastPageNumber ?? 1}
                handleChangePage={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
              />
            </MuiBox>
          </Stack>
        )}
      </Stack>
      {action === "download-certificates" ? (
        <DownloadCertificatesModal shouldOpen={true} />
      ) : null}
      
      {/* Modal de Pagamento com Cartão */}
      {showPaymentModal && selectedAccounts.length > 0 && canOpenCardModal && (
        <PayByCreditCard
          shouldOpen={showPaymentModal}
          selectedBills={selectedAccounts}
          clearSelectedAccounts={() => {
            clearSelectedAccounts();
            setShowPaymentModal(false);
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Modal de Pagamento PIX */}
      {action === "payPerPix" && selectedBills && canOpenPixModal && (
        <PayPerPixModal
          shouldOpen={true}
          selectedBills={selectedBills}
          clearSelectedAccounts={clearSelectedAccounts}
        />
      )}
        </> 
      )}
    </>
  );
}
