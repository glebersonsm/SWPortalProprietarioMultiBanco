"use client";

import useCloseModal from "@/hooks/useCloseModal";
import useUser from "@/hooks/useUser";
import {
  getUserTokenizedCards,
  payByCreditCard,
  getSavedCards,
  payWithSavedCard,
  payWithNewCard,
  saveCard,
  getBandeirasAceitas,
} from "@/services/querys/finance-users";
import {
  UserOutstandingBill,
  UserTokenizedCard,
  SavedCardTse,
  BandeiraAceita,
} from "@/utils/types/finance-users";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Typography,
  Tabs,
  Checkbox,
  Divider,
} from "@mui/joy";
import { DialogContent, DialogTitle, Modal, ModalDialog, ModalOverflow } from "@/components/CompatModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { formatMoney } from "@/utils/money";
import { useRouter } from "next/navigation";
import { Grid } from "@mui/material";

type PayByCreditCardProps = {
  shouldOpen: boolean;
  selectedBills: UserOutstandingBill[];
  clearSelectedAccounts: () => void;
  onClose?: () => void;
};

export default function PayByCreditCard({
  shouldOpen,
  selectedBills = [],
  clearSelectedAccounts,
  onClose,
}: PayByCreditCardProps) {
  const { userData } = useUser();
  const closeModal = useCloseModal();
  const router = useRouter();

  const [tabValue, setTabValue] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<UserTokenizedCard | null>(
    null
  );
  const [selectedSavedCardTse, setSelectedSavedCardTse] = useState<SavedCardTse | null>(null);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para novo cartÃ£o
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    idBandeira: null as number | null,
  });

  const { data: cards = [] } = useQuery({
    queryKey: ["getUserTokenizedCards"],
    queryFn: async () => getUserTokenizedCards(),
  });

  const empresaId = selectedBills[0]?.companyId;
  const torreId = selectedBills[0]?.idTorre;
  const contratoId = selectedBills[0]?.idContrato;

  const { 
    data: savedCardsTse = [], 
    refetch: refetchSavedCards, 
    isLoading: isLoadingSavedCardsTse, 
    error: errorSavedCardsTse 
  } = useQuery({
    queryKey: ["getSavedCards", shouldOpen, empresaId, torreId, contratoId],
    queryFn: async () => {
      let allCards: SavedCardTse[] = [];
      try {
        allCards = await getSavedCards();
      } catch (allCardsError: any) {
        allCards = [];
      }

      if (!allCards || allCards.length === 0) {
        return [];
      }

      if (empresaId) {
        const filterParams: any = { idEmpresa: empresaId };
        if (torreId) filterParams.idTorre = torreId;
        if (contratoId) filterParams.idContrato = contratoId;

        try {
          const filtered = await getSavedCards(filterParams);
          if (filtered && filtered.length > 0) {
            return filtered;
          }
        } catch {}
      }

      return allCards;
    },
    enabled: shouldOpen, // Sempre executa quando o modal abrir
    staleTime: 30_000, // Reduzido para 30 segundos
    retry: 2, // Tenta 2 vezes em caso de erro
    refetchOnWindowFocus: false, // Evita refetch desnecessÃ¡rio
  });

  useEffect(() => {
    if (shouldOpen && tabValue === 0) {
      refetchSavedCards();
    }
  }, [shouldOpen, tabValue, refetchSavedCards]);

  useEffect(() => {
    if (!isLoadingSavedCardsTse && savedCardsTse.length > 0 && selectedSavedCardId === null) {
      setSelectedSavedCardId(savedCardsTse[0].id);
    }
  }, [isLoadingSavedCardsTse, savedCardsTse, selectedSavedCardId]);

  // Sincronizar selectedSavedCardTse quando selectedSavedCardId muda
  useEffect(() => {
    if (selectedSavedCardId !== null) {
      const card = savedCardsTse.find(c => c.id === selectedSavedCardId);
      if (card) {
        setSelectedSavedCardTse(card);
      } else {
        setSelectedSavedCardTse(null);
      }
    } else {
      setSelectedSavedCardTse(null);
    }
  }, [selectedSavedCardId, savedCardsTse]);

  // Resetar seleÃ§Ã£o quando modal fecha
  useEffect(() => {
    if (!shouldOpen) {
      setSelectedSavedCardId(null);
      setSelectedSavedCardTse(null);
    }
  }, [shouldOpen]);

  const { data: bandeirasAceitas = [], refetch: refetchBandeiras } = useQuery({
    queryKey: ["getBandeirasAceitas"],
    queryFn: getBandeirasAceitas,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: shouldOpen,
  });

  useEffect(() => {
    if (shouldOpen && tabValue === 1) {
      refetchBandeiras();
    }
  }, [shouldOpen, tabValue, refetchBandeiras]);

  // Bloquear atualizaÃ§Ã£o da pÃ¡gina durante processamento
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = 'HÃ¡ um processamento em andamento. Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isProcessing]);

  // FunÃ§Ã£o para aplicar mÃ¡scara no nÃºmero do cartÃ£o
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que nÃ£o Ã© dÃ­gito
    value = value.substring(0, 16); // Limita a 16 dÃ­gitos
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaÃ§o a cada 4 dÃ­gitos
    setNewCardData({ ...newCardData, cardNumber: formatted });
  };

  // FunÃ§Ã£o para aplicar mÃ¡scara e validaÃ§Ã£o na validade (MM/AA)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    let mm = digits.slice(0, 2);
    let yy = digits.slice(2, 4);

    if (mm.length === 2) {
      let month = parseInt(mm, 10);
      if (isNaN(month) || month <= 0) month = 1;
      if (month > 12) month = 12;
      mm = month.toString().padStart(2, '0');
    }

    const formatted = yy ? `${mm}/${yy}` : mm.length === 2 ? `${mm}/` : mm;
    setNewCardData({ ...newCardData, expiryDate: formatted });
  };

  // FunÃ§Ã£o para aplicar mÃ¡scara no CVV (3 ou 4 dÃ­gitos)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setNewCardData({ ...newCardData, cvv: digits });
  };

  const queryClient = useQueryClient();
  const handlePayByCreditCard = useMutation({
    mutationFn: payByCreditCard,
  });

  const totalValue = () =>
    selectedBills.reduce((acc, bill) => acc + bill.currentValue, 0);

  const selectedBillsIds = () => selectedBills.map((bill) => bill.id);

  const handleClose = () => {
    // Bloquear fechamento se estiver processando
    if (isProcessing) {
      toast.warning("â³ OperaÃ§Ã£o em andamento. Aguarde a conclusÃ£o do processamento.");
      return;
    }
    
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  const onSubmitSavedCard = () => {
    if (!selectedCard) {
      toast.error("Selecione um cartÃ£o");
      return;
    }
    
    // TODO: Implementar pagamento com cartÃ£o tokenizado
    toast.info("ðŸ’³ IntegraÃ§Ã£o de pagamento com cartÃ£o tokenizado em desenvolvimento");
    // handlePayByCreditCard.mutate(
    //   {
    //     ids: selectedBillsIds(),
    //     totalValue: totalValue(),
    //     tokenizedCardId: selectedCard.id,
    //   },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({
    //         queryKey: ["getUserOutstandingBills"],
    //       });
    //       toast.success(
    //         `Pagamento de ${formatMoney(
    //           totalValue()
    //         )} realizado com sucesso!`
    //       );
    //       clearSelectedAccounts();
    //       handleClose();
    //     },
    //     onError: () => {
    //       toast.error(
    //         "NÃ£o foi possÃ­vel fazer o pagamento nesse momento, por favor tente novamente mais tarde!"
    //       );
    //       handleClose();
    //     },
    //   }
    // );
  };

  const onSubmitSavedCardTse = async () => {
    if (!selectedSavedCardTse) {
      toast.error("Selecione um cartÃ£o salvo");
      return;
    }
    
    if (selectedBills.length === 0) {
      toast.error("Nenhuma conta selecionada");
      return;
    }

    const empresaId = selectedBills[0].companyId;  // Corrigido: companyId ao invÃ©s de idEmpresa
    const torreId = selectedBills[0].idTorre;      // Torre vem direto do selectedBills
    const contratoId = selectedBills[0].idContrato || torreId; // Fallback para torre se nÃ£o tiver contrato

    

    setIsProcessing(true);

    try {
      // Removido toast de processamento - usuÃ¡rio vÃª apenas resultado final
      
      const payload = {
        idCartaoSalvo: selectedSavedCardTse.id,
        contasFinanceiras: selectedBills.map(bill => ({
          idContaFinanceira: bill.id,
          valor: bill.currentValue,
          dataVencimento: bill.dueDate,
          valorJuros: bill.juros || 0,
          valorMulta: bill.multa || 0
        })),
        idEmpresa: empresaId,
        idTorre: torreId,
        idContrato: contratoId,
        numeroParcelas: 1
      };
      
      
      
      const resultado = await payWithSavedCard(payload);
      
      // Verificar se o pagamento foi autorizado
      if (resultado?.autorizado) {
        queryClient.invalidateQueries({
          queryKey: ["getUserOutstandingBills"],
        });
        
        toast.success("âœ… Pagamento aprovado com sucesso");
        clearSelectedAccounts();
        handleClose();
      } else {
        // Exibir mensagem de retorno da operadora
        const mensagemOperadora = resultado?.mensagemAutorizacao || "Pagamento nÃ£o aprovado";
        toast.error(`âŒ ${mensagemOperadora}`);
      }
    } catch (error: any) {
      // Erro de sistema
      const mensagemErro = error?.response?.data?.mensagemAutorizacao 
        || error?.response?.data?.message
        || "NÃ£o foi possÃ­vel processar seu pagamento";
      
      toast.error(`âŒ ${mensagemErro}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const onSubmitNewCard = async () => {
    // ValidaÃ§Ãµes
    if (!newCardData.cardNumber || !newCardData.cardHolder || !newCardData.expiryDate || !newCardData.cvv || !newCardData.idBandeira) {
      toast.error("Preencha todos os campos do cartÃ£o");
      return;
    }

    if (selectedBills.length === 0) {
      toast.error("Nenhuma conta selecionada");
      return;
    }

    const empresaId = selectedBills[0].companyId;
    const torreId = selectedBills[0].idTorre;
    const contratoId = selectedBills[0].idContrato || torreId;

    // Separar mÃªs e ano da data de validade
    const [mes, ano] = newCardData.expiryDate.split('/');

    setIsProcessing(true);

    try {
      const payload = {
        cartao: {
          numeroCartao: newCardData.cardNumber.replace(/\s/g, ''),
          codigoSeguranca: newCardData.cvv,
          mesValidade: mes,
          anoValidade: ano,
          nomeNoCartao: newCardData.cardHolder,
          idBandeira: newCardData.idBandeira
        },
        salvarCartao: newCardData.saveCard,
        contasFinanceiras: selectedBills.map(bill => ({
          idContaFinanceira: bill.id,
          valor: bill.currentValue,
          dataVencimento: bill.dueDate,
          valorJuros: bill.juros || 0,
          valorMulta: bill.multa || 0
        })),
        idEmpresa: empresaId,
        idTorre: torreId,
        idContrato: contratoId,
        numeroParcelas: 1
      };

      const resultado = await payWithNewCard(payload);

      // Verificar se o pagamento foi autorizado
      if (resultado?.autorizado) {
        queryClient.invalidateQueries({
          queryKey: ["getUserOutstandingBills"],
        });
        
        if (newCardData.saveCard) {
          refetchSavedCards(); // Atualizar lista de cartÃµes salvos
        }
        
        toast.success("âœ… Pagamento aprovado com sucesso");
        clearSelectedAccounts();
        handleClose();
      } else {
        // Exibir mensagem de retorno da operadora
        const mensagemOperadora = resultado?.mensagemAutorizacao || "Pagamento nÃ£o aprovado";
        toast.error(`âŒ ${mensagemOperadora}`);
      }
    } catch (error: any) {
      // Erro de sistema
      const mensagemErro = error?.response?.data?.mensagemAutorizacao 
        || error?.response?.data?.message
        || "NÃ£o foi possÃ­vel processar seu pagamento";
      
      toast.error(`âŒ ${mensagemErro}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal 
      open={shouldOpen} 
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          width: { xs: 'calc(100vw - 20px)', sm: 'calc(100vw - 40px)', md: '700px' },
          maxWidth: { xs: 'calc(100vw - 20px)', sm: 'calc(100vw - 40px)', md: '700px' },
          overflowX: 'hidden',
          maxHeight: '90vh',
          mt: { xs: 4, sm: 6 }
        }
      }}
      onClose={(event, reason) => {
        // Prevenir fechamento clicando fora do modal ou ESC
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        handleClose();
      }}
    >
      <ModalOverflow sx={{ 
        width: '100%', 
        maxWidth: '100vw', 
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: '95vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: { xs: 2, sm: 4 }
      }}>
        <ModalDialog sx={{ 
          width: '100%',
          maxWidth: '100%',
          minHeight: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          boxSizing: 'border-box',
          margin: 0
        }}>
          <DialogTitle sx={{ 
            color: 'var(--color-primary)', 
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            fontFamily: 'var(--font-puffin), sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            pb: 2,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            flexShrink: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            wordBreak: 'break-word',
            overflow: 'hidden'
          }}>
            Pagamento por CartÃ£o de CrÃ©dito
            {isProcessing && (
              <Typography level="body-sm" sx={{ 
                color: 'var(--color-secondary)',
                fontWeight: 600,
                animation: 'pulse 1.5s ease-in-out infinite',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                â³ Processando...
              </Typography>
            )}
          </DialogTitle>

          <DialogContent sx={{ 
            mt: 0, 
            position: 'relative',
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            pt: 0,
            overflow: 'visible',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            '& > *': {
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden'
            },
            '& *': {
              maxWidth: '100%',
              boxSizing: 'border-box'
            },
            '& .MuiStack-root': {
              width: '100% !important',
              maxWidth: '100% !important',
              boxSizing: 'border-box !important',
              overflow: 'hidden !important'
            },
            '& .joy-nmo3nj-JoyStack-root': {
              width: '100% !important',
              maxWidth: '100% !important',
              boxSizing: 'border-box !important',
              overflow: 'hidden !important'
            }
          }}>
            {/* Overlay de processamento */}
            {isProcessing && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                borderRadius: '12px'
              }}>
                <CircularProgress size="lg" sx={{ '--CircularProgress-size': '60px' }} />
                <Typography level="title-lg" sx={{ 
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-puffin), sans-serif',
                  fontWeight: 700
                }}>
                  Processando...
                </Typography>
                <Typography level="body-sm" sx={{ 
                  color: 'var(--color-secondary)',
                  fontFamily: 'var(--font-puffin), sans-serif',
                  textAlign: 'center'
                }}>
                  Aguarde, nÃ£o feche esta janela
                </Typography>
              </Box>
            )}
            
            <Stack spacing={2.5} sx={{ 
              width: '100%', 
              maxWidth: '100%', 
              boxSizing: 'border-box',
              overflow: 'hidden',
              '&.MuiStack-root': {
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }
            }}>
              {/* Resumo das Contas Selecionadas */}
              <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <Typography level="title-md" sx={{ 
                  mb: 1.5,
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-puffin), sans-serif',
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}>
                  Contas Selecionadas
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'var(--color-primary)' }} />
                {selectedBills.length > 0 && (
                  <Stack spacing={1} sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    bgcolor: 'rgba(0, 200, 236, 0.12)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(1, 90, 103, 0.24)',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    '&.MuiStack-root': {
                      width: '100% !important',
                      maxWidth: '100% !important',
                      boxSizing: 'border-box !important',
                      overflow: 'hidden !important'
                    },
                    '&.joy-nmo3nj-JoyStack-root': {
                      width: '100% !important',
                      maxWidth: '100% !important',
                      boxSizing: 'border-box !important',
                      overflow: 'hidden !important'
                    }
                  }}>
                    <Typography level="body-sm" sx={{ 
                      fontFamily: 'var(--font-puffin), sans-serif',
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      wordBreak: 'break-word'
                    }}>
                      <strong style={{ color: 'var(--color-primary)' }}>Empresa:</strong> {selectedBills[0].companyName}
                    </Typography>
                    <Typography level="body-sm" sx={{ 
                      fontFamily: 'var(--font-puffin), sans-serif',
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      wordBreak: 'break-word'
                    }}>
                      <strong style={{ color: 'var(--color-primary)' }}>Contrato:</strong> {selectedBills[0].contrato}
                    </Typography>
                  </Stack>
                )}
                <Box sx={{ 
                  mt: 2, 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  maxHeight: { xs: 200, sm: 220 },
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 0.5
                }}>
                  {selectedBills.map((bill, index) => (
                    <Box 
                      key={bill.id} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        mb: 1.5, 
                        bgcolor: 'rgba(245, 150, 0, 0.15)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(245, 150, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                        transition: 'all 0.2s',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        '&:hover': {
                          bgcolor: 'rgba(245, 150, 0, 0.22)'
                        }
                      }}
                    >
                      <Stack spacing={0.5} sx={{ 
                        flex: 1, 
                        minWidth: 0, 
                        maxWidth: { xs: '100%', sm: 'calc(100% - 120px)' }, 
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        '&.MuiStack-root': {
                          width: '100% !important',
                          maxWidth: { xs: '100% !important', sm: 'calc(100% - 120px) !important' },
                          boxSizing: 'border-box !important',
                          overflow: 'hidden !important'
                        },
                        '&.joy-nmo3nj-JoyStack-root': {
                          width: '100% !important',
                          maxWidth: { xs: '100% !important', sm: 'calc(100% - 120px) !important' },
                          boxSizing: 'border-box !important',
                          overflow: 'hidden !important'
                        },
                        '& *': {
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}>
                        <Typography level="body-sm" sx={{ 
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          <strong>ID:</strong> {bill.id}
                        </Typography>
                        <Typography level="body-sm" sx={{ 
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-word'
                        }}>
                          {bill.accountTypeName}
                        </Typography>
                        <Typography level="body-sm" sx={{ 
                          fontFamily: 'var(--font-puffin), sans-serif', 
                          color: 'var(--color-text-tertiary)',
                          fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                        }}>
                          Vencimento: {bill.dueDate}
                        </Typography>
                      </Stack>
                      <Typography level="body-md" fontWeight="bold" sx={{ 
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        ml: { xs: 0, sm: 1 },
                        maxWidth: { xs: '100%', sm: '120px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {formatMoney(bill.currentValue)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2, borderColor: 'var(--color-primary)' }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: 2,
                  p: { xs: 2, sm: 2.5 }, 
                  background: 'linear-gradient(135deg, rgba(1, 90, 103, 0.14) 0%, rgba(245, 150, 0, 0.18) 100%)',
                  borderRadius: '12px',
                  border: '2px solid var(--color-primary)',
                  boxShadow: '0 4px 12px rgba(1, 90, 103, 0.2)',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  '& *': {
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}>
                  <Typography level="title-lg" fontWeight="bold" sx={{ 
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    flexShrink: 0,
                    maxWidth: { xs: '100%', sm: '50%' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: { xs: 'normal', sm: 'nowrap' }
                  }}>
                    Total a Pagar:
                  </Typography>
                  <Typography level="title-lg" fontWeight="bold" sx={{ 
                    color: 'var(--color-secondary)',
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {formatMoney(totalValue())}
                  </Typography>
                </Box>
              </Box>

              {/* Abas para escolher mÃ©todo */}
              <Tabs 
                value={tabValue} 
                onChange={(e, value) => {
                  if (!isProcessing) {
                    setTabValue(value as number);
                  }
                }}
                sx={{
                  bgcolor: 'transparent',
                  '--Tabs-gap': '8px',
                  pointerEvents: isProcessing ? 'none' : 'auto',
                  opacity: isProcessing ? 0.6 : 1,
                  width: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box'
                }}
              >
                <TabList sx={{ 
                  borderRadius: '12px',
                  bgcolor: 'rgba(0, 200, 236, 0.12)',
                  p: 0.5,
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Tab sx={{ 
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontWeight: 600,
                    borderRadius: '10px',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    flex: 1,
                    '&.Mui-selected': {
                      bgcolor: 'var(--color-primary)',
                      color: 'white'
                    }
                  }}>
                    CartÃ£o Salvo
                  </Tab>
                  <Tab sx={{ 
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontWeight: 600,
                    borderRadius: '10px',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    flex: 1,
                    '&.Mui-selected': {
                      bgcolor: 'var(--color-primary)',
                      color: 'white'
                    }
                  }}>
                    Novo CartÃ£o
                  </Tab>
                </TabList>

                {/* Aba 1: CartÃ£o Salvo */}
                <TabPanel value={0} sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  width: '100%',
                  maxWidth: '100%',
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  minHeight: 0,
                  boxSizing: 'border-box'
                }}>
                  <Stack spacing={1.5} sx={{ 
                    width: '100%', 
                    maxWidth: '100%', 
                    boxSizing: 'border-box'
                  }}>
                    {/* Debug info - remover em produÃ§Ã£o */}
                    

                    <FormControl sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <FormLabel sx={{ 
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Selecione um cartÃ£o salvo
                      </FormLabel>
                      {isLoadingSavedCardsTse ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <CircularProgress size="sm" />
                          <Typography level="body-sm" sx={{ mt: 1 }}>
                            Carregando cartÃµes...
                          </Typography>
                        </Box>
                      ) : (
                        <Select
                          value={selectedSavedCardId}
                          onChange={(e, newValue) => {
                            const cardId = newValue as number | null;
                            setSelectedSavedCardId(cardId);
                            
                            // Buscar o objeto completo do cartÃ£o
                            if (cardId !== null) {
                              const card = savedCardsTse.find(c => c.id === cardId);
                              setSelectedSavedCardTse(card || null);
                            } else {
                              setSelectedSavedCardTse(null);
                            }
                          }}
                          placeholder="Selecione um cartÃ£o"
                          sx={{ 
                            width: '100%', 
                            maxWidth: '100%', 
                            boxSizing: 'border-box',
                            '& .MuiSelect-select': {
                              width: '100%',
                              maxWidth: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
                          slotProps={{
                            listbox: { sx: { zIndex: 1500, maxHeight: 260 } }
                          }}
                        >
                          {errorSavedCardsTse && (
                            <Option value={null} disabled>
                              Erro ao carregar cartÃµes
                            </Option>
                          )}
                          {!errorSavedCardsTse && savedCardsTse.length === 0 && (
                            <Option value={null} disabled>
                              Nenhum cartÃ£o salvo
                            </Option>
                          )}
                          {savedCardsTse.map((card) => {
                            const cardLabel = `${card.bandeira} ${card.ultimosDigitos} - ${card.nomeNoCartao} (${card.mesValidade}/${card.anoValidade})`;
                            return (
                              <Option value={card.id} key={card.id}>
                                {cardLabel}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormControl>

                    {(savedCardsTse.length === 0 && !isLoadingSavedCardsTse && !errorSavedCardsTse) && (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(245, 150, 0, 0.15)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(245, 150, 0, 0.3)'
                      }}>
                        <Typography level="body-sm" sx={{ 
                          color: 'var(--color-text-tertiary)',
                          fontFamily: 'var(--font-puffin), sans-serif'
                        }}>
                          VocÃª ainda nÃ£o possui cartÃµes salvos. Use a aba &quot;Novo CartÃ£o&quot; e marque a opÃ§Ã£o &quot;Salvar este cartÃ£o&quot;.
                        </Typography>
                      </Box>
                    )}

                    {errorSavedCardsTse && (
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,0,0,0.06)', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.2)' }}>
                        <Typography level="body-sm" sx={{ color: 'danger.plainColor', fontFamily: 'var(--font-puffin), sans-serif' }}>
                          NÃ£o foi possÃ­vel carregar seus cartÃµes salvos.
                        </Typography>
                        <Button variant="outlined" size="sm" sx={{ mt: 1 }} onClick={() => refetchSavedCards()}>
                          Tentar novamente
                        </Button>
                      </Box>
                    )}

                    {selectedSavedCardTse && (
                      <Button
                        onClick={onSubmitSavedCardTse}
                        disabled={handlePayByCreditCard.isPending || isProcessing}
                        fullWidth
                        loading={handlePayByCreditCard.isPending || isProcessing}
                        sx={{
                          bgcolor: 'var(--color-primary)',
                          color: 'white',
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 1.5,
                          borderRadius: '12px',
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          '&:hover': {
                            bgcolor: 'var(--color-secondary)',
                          }
                        }}
                      >
                        {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
                      </Button>
                    )}
                    
                    {!selectedSavedCardTse && savedCardsTse.length > 0 && (
                      <Button
                        disabled
                        fullWidth
                        sx={{
                          bgcolor: 'var(--color-primary)',
                          color: 'white',
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 1.5,
                          borderRadius: '12px',
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        Selecione um cartÃ£o
                      </Button>
                    )}

                    <Button
                      onClick={handleClose}
                      disabled={isProcessing}
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: 'var(--color-text-tertiary)',
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 1.5,
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          bgcolor: 'rgba(0, 200, 236, 0.12)',
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </TabPanel>

                {/* Aba 2: Novo CartÃ£o */}
                <TabPanel value={1} sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Stack spacing={2.5} sx={{ 
                    width: '100%', 
                    maxWidth: '100%', 
                    boxSizing: 'border-box'
                  }}>
                    <FormControl required sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <FormLabel sx={{ 
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        NÃºmero do CartÃ£o
                      </FormLabel>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={newCardData.cardNumber}
                        onChange={handleCardNumberChange}
                        slotProps={{
                          input: {
                            maxLength: 19,
                            style: { width: '100%', maxWidth: '100%', boxSizing: 'border-box' }
                          }
                        }}
                        sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      />
                    </FormControl>

                    <FormControl required sx={{ width: '100%', boxSizing: 'border-box' }}>
                      <FormLabel sx={{ 
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Nome no CartÃ£o
                      </FormLabel>
                      <Input
                        placeholder="Como estÃ¡ no cartÃ£o"
                        value={newCardData.cardHolder}
                        onChange={(e) => setNewCardData({ ...newCardData, cardHolder: e.target.value.toUpperCase() })}
                        slotProps={{
                          input: {
                            style: { width: '100%', maxWidth: '100%', boxSizing: 'border-box' }
                          }
                        }}
                        sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      />
                    </FormControl>

                    <FormControl required sx={{ width: '100%', boxSizing: 'border-box' }}>
                      <FormLabel sx={{ 
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Bandeira do CartÃ£o
                      </FormLabel>
                      <Select
                        placeholder="Selecione a bandeira"
                        value={newCardData.idBandeira}
                        onChange={(_, value) => setNewCardData({ ...newCardData, idBandeira: value as number })}
                        sx={{
                          fontFamily: 'var(--font-puffin), sans-serif',
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          '& .MuiSelect-select': {
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                        slotProps={{
                          listbox: { sx: { zIndex: 1500, maxHeight: 260 } }
                        }}
                      >
                        {bandeirasAceitas.map((bandeira) => (
                          <Option value={bandeira.id} key={bandeira.id}>
                            {bandeira.bandeira}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>

                    <Grid container spacing={1.5} sx={{ width: '100%', maxWidth: '100%', margin: 0, boxSizing: 'border-box' }}>
                      <Grid item xs={12} sm={6} sx={{ 
                        paddingLeft: { xs: 0, sm: 1.5 }, 
                        paddingRight: { xs: 0, sm: 0.75 },
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box'
                      }}>
                        <FormControl required sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                          <FormLabel sx={{ 
                            color: 'var(--color-secondary)',
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            Validade (MM/AA)
                          </FormLabel>
                          <Input
                            placeholder="MM/AA"
                            value={newCardData.expiryDate}
                            onChange={handleExpiryDateChange}
                            slotProps={{
                              input: {
                                maxLength: 5,
                                style: { width: '100%', boxSizing: 'border-box' }
                              }
                            }}
                            sx={{ 
                              width: '100%', 
                              maxWidth: '100%', 
                              boxSizing: 'border-box',
                              borderRadius: '10px',
                              boxShadow: 'none',
                              '&:focus-within': { boxShadow: 'none' }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ 
                        paddingLeft: { xs: 0, sm: 0.75 }, 
                        paddingRight: { xs: 0, sm: 1.5 },
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box'
                      }}>
                        <FormControl required sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                          <FormLabel sx={{ 
                            color: 'var(--color-secondary)',
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            CVV
                          </FormLabel>
                          <Input
                            type="password"
                            inputMode="numeric"
                            placeholder="123"
                            value={newCardData.cvv}
                            onChange={handleCvvChange}
                            slotProps={{
                              input: {
                                maxLength: 4,
                                style: { width: '100%', boxSizing: 'border-box' }
                              }
                            }}
                            sx={{ 
                              width: '100%', 
                              maxWidth: '100%', 
                              boxSizing: 'border-box',
                              borderRadius: '10px',
                              boxShadow: 'none',
                              '&:focus-within': { boxShadow: 'none' }
                            }}
                          />
                        </FormControl>
                      </Grid>
              </Grid>

                    <Checkbox
                      label="Salvar este cartÃ£o para pagamentos futuros"
                      checked={newCardData.saveCard}
                      onChange={(e) => setNewCardData({ ...newCardData, saveCard: e.target.checked })}
                      sx={{
                        fontFamily: 'var(--font-puffin), sans-serif',
                        '& .MuiCheckbox-checkbox.Mui-checked': {
                          color: 'var(--color-secondary)'
                        }
                      }}
                    />

                    <Button
                      onClick={onSubmitNewCard}
                      disabled={handlePayByCreditCard.isPending || isProcessing}
                      fullWidth
                      loading={handlePayByCreditCard.isPending || isProcessing}
                      sx={{
                        bgcolor: 'var(--color-primary)',
                        color: 'white',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.5,
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        '&:hover': {
                          bgcolor: 'var(--color-secondary)',
                        }
                      }}
                    >
                      {isProcessing ? 'Processando...' : 'Pagar Agora'}
                    </Button>

                    <Button
                      onClick={handleClose}
                      disabled={isProcessing}
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: 'var(--color-text-tertiary)',
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 1.5,
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          bgcolor: 'rgba(0, 200, 236, 0.12)',
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </TabPanel>
              </Tabs>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
