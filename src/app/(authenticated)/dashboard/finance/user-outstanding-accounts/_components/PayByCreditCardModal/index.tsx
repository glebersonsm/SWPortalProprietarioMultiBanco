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
  
  // Estados para novo cartão
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
      // Se não houver empresaId, não é possível buscar cartões (obrigatório no backend)
      if (!empresaId) {
        return [];
      }

      // Montar parâmetros de filtro
      const filterParams: { idEmpresa: number; idTorre?: number | null; idContrato?: number | null; } = { 
        idEmpresa: empresaId 
      };
      
      if (torreId) {
        filterParams.idTorre = torreId;
      }
      
      if (contratoId) {
        filterParams.idContrato = contratoId;
      }

      try {
        const cards = await getSavedCards(filterParams);
        return cards || [];
      } catch (error: any) {
        console.error("Erro ao buscar cartões salvos:", error);
        return [];
      }
    },
    enabled: shouldOpen && !!empresaId, // Só executa se o modal estiver aberto e houver empresaId
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

  // Função para aplicar máscara no número do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.substring(0, 16); // Limita a 16 dígitos
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaço a cada 4 dígitos
    setNewCardData({ ...newCardData, cardNumber: formatted });
  };

  // Função para aplicar máscara e validação na validade (MM/AA)
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

  // Função para aplicar máscara no CVV (3 ou 4 dígitos)
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
      toast.error("Selecione um cartão");
      return;
    }
    
    // TODO: Implementar pagamento com cartão tokenizado
    toast.info("💳 Integração de pagamento com cartão tokenizado em desenvolvimento");
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
    //         "Não foi possível fazer o pagamento nesse momento, por favor tente novamente mais tarde!"
    //       );
    //       handleClose();
    //     },
    //   }
    // );
  };

  const onSubmitSavedCardTse = async () => {
    if (!selectedSavedCardTse) {
      toast.error("Selecione um cartão salvo");
      return;
    }
    
    if (selectedBills.length === 0) {
      toast.error("Nenhuma conta selecionada");
      return;
    }

    const empresaId = selectedBills[0].companyId;  // Corrigido: companyId ao invÃ©s de idEmpresa
    const torreId = selectedBills[0].idTorre;      // Torre vem direto do selectedBills
    const contratoId = selectedBills[0].idContrato || torreId; // Fallback para torre se não tiver contrato

    

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
        contrato: contratoId,
        numeroParcelas: 1
      };
      
      
      
      const resultado = await payWithSavedCard(payload);
      
      // Verificar se o pagamento foi autorizado
      if (resultado?.autorizado) {
        queryClient.invalidateQueries({
          queryKey: ["getUserOutstandingBills"],
        });
        
        toast.success("✅ Pagamento aprovado com sucesso");
        clearSelectedAccounts();
        handleClose();
      } else {
        // Exibir mensagem de retorno da operadora
        const mensagemOperadora = resultado?.mensagemAutorizacao || "Pagamento não aprovado";
        toast.error(`âŒ ${mensagemOperadora}`);
      }
    } catch (error: any) {
      // Erro de sistema
      const mensagemErro = error?.response?.data?.mensagemAutorizacao 
        || error?.response?.data?.message
        || "Não foi possível processar seu pagamento";
      
      toast.error(`âŒ ${mensagemErro}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const onSubmitNewCard = async () => {
    // ValidaÃ§Ãµes
    if (!newCardData.cardNumber || !newCardData.cardHolder || !newCardData.expiryDate || !newCardData.cvv || !newCardData.idBandeira) {
      toast.error("Preencha todos os campos do cartão");
      return;
    }

    if (selectedBills.length === 0) {
      toast.error("Nenhuma conta selecionada");
      return;
    }

    const empresaId = selectedBills[0].companyId;
    const torreId = selectedBills[0].idTorre;
    const contratoId = selectedBills[0].idContrato || torreId;

    // Separar mês e ano da data de validade
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
        Contrato: contratoId,
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
        
        toast.success("✅ Pagamento aprovado com sucesso");
        clearSelectedAccounts();
        handleClose();
      } else {
        // Exibir mensagem de retorno da operadora
        const mensagemOperadora = resultado?.mensagemAutorizacao || "Pagamento não aprovado";
        toast.error(`âŒ ${mensagemOperadora}`);
      }
    } catch (error: any) {
      // Erro de sistema
      const mensagemErro = error?.response?.data?.mensagemAutorizacao 
        || error?.response?.data?.message
        || "Não foi possível processar seu pagamento";
      
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
          width: { xs: 'calc(100vw - 20px)', sm: 'calc(100vw - 40px)', md: '750px' },
          maxWidth: { xs: 'calc(100vw - 20px)', sm: 'calc(100vw - 40px)', md: '750px' },
          overflowX: 'hidden',
          maxHeight: '90vh',
          mt: { xs: 4, sm: 6 },
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
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
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            fontSize: { xs: '1.3rem', sm: '1.6rem' },
            fontFamily: 'var(--font-puffin), sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            pt: { xs: 2.5, sm: 3.5 },
            flexShrink: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            wordBreak: 'break-word',
            overflow: 'hidden',
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%) 1',
            mb: 1
          }}>
            Pagamento por Cartão de Crédito
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
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2.5,
                borderRadius: '16px',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <CircularProgress 
                  size="lg" 
                  sx={{ 
                    '--CircularProgress-size': '64px',
                    color: 'primary.plainColor',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round'
                    }
                  }} 
                />
                <Typography level="title-lg" sx={{ 
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-puffin), sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  Processando pagamento...
                </Typography>
                <Typography level="body-sm" sx={{ 
                  color: 'text.tertiary',
                  fontFamily: 'var(--font-puffin), sans-serif',
                  textAlign: 'center',
                  maxWidth: '280px',
                  lineHeight: 1.6
                }}>
                  Aguarde, não feche esta janela enquanto processamos seu pagamento
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
                  mb: 2,
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                  fontFamily: 'var(--font-puffin), sans-serif',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  letterSpacing: '-0.02em'
                }}>
                  Contas Selecionadas
                </Typography>
                <Divider sx={{ 
                  mb: 3, 
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                  opacity: 0.3,
                  background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)'
                }} />
                {selectedBills.length > 0 && (
                  <Stack spacing={1.5} sx={{ 
                    p: { xs: 2, sm: 2.5 }, 
                    background: 'linear-gradient(135deg, rgba(0, 200, 236, 0.15) 0%, rgba(0, 200, 236, 0.08) 100%)',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(0, 200, 236, 0.3)',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    boxShadow: '0 4px 16px rgba(0, 200, 236, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      borderRadius: '16px 16px 0 0'
                    },
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
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      wordBreak: 'break-word',
                      fontWeight: 500,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}>
                      <Box component="span" sx={{ 
                        minWidth: 'fit-content',
                        fontWeight: 700,
                        color: 'text.secondary'
                      }}>
                        Empresa:
                      </Box>
                      <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {selectedBills[0].companyName}
                      </Box>
                    </Typography>
                    <Typography level="body-sm" sx={{ 
                      fontFamily: 'var(--font-puffin), sans-serif',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      wordBreak: 'break-word',
                      fontWeight: 500,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}>
                      <Box component="span" sx={{ 
                        minWidth: 'fit-content',
                        fontWeight: 700,
                        color: 'text.secondary'
                      }}>
                        Contrato:
                      </Box>
                      <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {selectedBills[0].contrato}
                      </Box>
                    </Typography>
                  </Stack>
                )}
                <Box sx={{ 
                  mt: 3, 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  maxHeight: { xs: 220, sm: 260 },
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 0.5,
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '10px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-primary) 100%)'
                    }
                  }
                }}>
                  {selectedBills.map((bill, index) => (
                    <Box 
                      key={bill.id} 
                      sx={{ 
                        p: { xs: 2, sm: 2.5 }, 
                        mb: 2, 
                        background: 'linear-gradient(135deg, rgba(245, 150, 0, 0.12) 0%, rgba(245, 150, 0, 0.06) 100%)',
                        borderRadius: '16px',
                        border: '1.5px solid rgba(245, 150, 0, 0.25)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2.5,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(245, 150, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                          borderRadius: '16px 0 0 16px',
                          opacity: 0.6
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(245, 150, 0, 0.18) 0%, rgba(245, 150, 0, 0.1) 100%)',
                          borderColor: 'rgba(245, 150, 0, 0.4)',
                          boxShadow: '0 4px 16px rgba(245, 150, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Stack spacing={1} sx={{ 
                        flex: 1, 
                        minWidth: 0, 
                        maxWidth: { xs: '100%', sm: 'calc(100% - 140px)' },
                        pl: 1.5,
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        '&.MuiStack-root': {
                          width: '100% !important',
                          maxWidth: { xs: '100% !important', sm: 'calc(100% - 140px) !important' },
                          boxSizing: 'border-box !important',
                          overflow: 'hidden !important'
                        },
                        '&.joy-nmo3nj-JoyStack-root': {
                          width: '100% !important',
                          maxWidth: { xs: '100% !important', sm: 'calc(100% - 140px) !important' },
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
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: 'text.tertiary',
                          fontWeight: 500
                        }}>
                          <Box component="span" sx={{ 
                            fontWeight: 700,
                            color: 'text.secondary',
                            mr: 0.5
                          }}>
                            ID:
                          </Box>
                          {bill.id}
                        </Typography>
                        <Typography level="body-sm" sx={{ 
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                          wordBreak: 'break-word',
                          fontWeight: 600,
                          color: 'text.primary',
                          lineHeight: 1.4
                        }}>
                          {bill.accountTypeName}
                        </Typography>
                        <Typography level="body-sm" sx={{ 
                          fontFamily: 'var(--font-puffin), sans-serif', 
                          color: 'text.tertiary',
                          fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                          fontWeight: 500
                        }}>
                          <Box component="span" sx={{ color: 'text.tertiary', opacity: 0.8 }}>Vencimento:</Box> {bill.dueDate}
                        </Typography>
                      </Stack>
                      <Typography level="body-md" fontWeight="bold" sx={{ 
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        ml: { xs: 0, sm: 1 },
                        maxWidth: { xs: '100%', sm: '140px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 700,
                        letterSpacing: '-0.01em'
                      }}>
                        {formatMoney(bill.currentValue)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ 
                  my: 3, 
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                  opacity: 0.3,
                  background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)'
                }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: 2.5,
                  p: { xs: 2.5, sm: 3 }, 
                  background: 'linear-gradient(135deg, rgba(1, 90, 103, 0.12) 0%, rgba(245, 150, 0, 0.15) 100%)',
                  borderRadius: '18px',
                  border: '2px solid',
                  borderImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%) 1',
                  boxShadow: '0 8px 24px rgba(1, 90, 103, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    borderRadius: '18px 18px 0 0'
                  },
                  '& *': {
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}>
                  <Typography level="title-lg" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    flexShrink: 0,
                    maxWidth: { xs: '100%', sm: '50%' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    letterSpacing: '-0.02em'
                  }}>
                    Total a Pagar:
                  </Typography>
                  <Typography level="title-lg" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontSize: { xs: '1.3rem', sm: '1.6rem' },
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 800,
                    letterSpacing: '-0.03em'
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
                  borderRadius: '14px',
                  bgcolor: 'rgba(0, 200, 236, 0.08)',
                  p: 0.75,
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid rgba(0, 200, 236, 0.15)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)'
                }}>
                  <Tab sx={{ 
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontWeight: 600,
                    borderRadius: '12px',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    flex: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    py: 1.25,
                    '&:hover': {
                      bgcolor: 'rgba(0, 200, 236, 0.15)',
                      transform: 'translateY(-1px)'
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(1, 90, 103, 0.3)',
                      transform: 'translateY(-2px)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(1, 90, 103, 0.4)'
                      }
                    }
                  }}>
                    Cartão Salvo
                  </Tab>
                  <Tab sx={{ 
                    fontFamily: 'var(--font-puffin), sans-serif',
                    fontWeight: 600,
                    borderRadius: '12px',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    flex: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    py: 1.25,
                    '&:hover': {
                      bgcolor: 'rgba(0, 200, 236, 0.15)',
                      transform: 'translateY(-1px)'
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(1, 90, 103, 0.3)',
                      transform: 'translateY(-2px)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(1, 90, 103, 0.4)'
                      }
                    }
                  }}>
                    Novo Cartão
                  </Tab>
                </TabList>

                {/* Aba 1: Cartão Salvo */}
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
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        mb: 1.5
                      }}>
                        Selecione um cartão salvo
                      </FormLabel>
                      {isLoadingSavedCardsTse ? (
                        <Box sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, rgba(0, 200, 236, 0.08) 0%, rgba(0, 200, 236, 0.04) 100%)',
                          borderRadius: '16px',
                          border: '1.5px solid rgba(0, 200, 236, 0.2)'
                        }}>
                          <CircularProgress 
                            size="md" 
                            sx={{ 
                              color: 'primary.plainColor',
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round'
                              }
                            }} 
                          />
                          <Typography level="body-sm" sx={{ 
                            mt: 2,
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 600,
                            color: 'text.secondary'
                          }}>
                            Carregando cartões...
                          </Typography>
                        </Box>
                      ) : (
                        <Select
                          value={selectedSavedCardId}
                          onChange={(e, newValue) => {
                            const cardId = newValue as number | null;
                            setSelectedSavedCardId(cardId);
                            
                            // Buscar o objeto completo do cartão
                            if (cardId !== null) {
                              const card = savedCardsTse.find(c => c.id === cardId);
                              setSelectedSavedCardTse(card || null);
                            } else {
                              setSelectedSavedCardTse(null);
                            }
                          }}
                          placeholder="Selecione um cartão"
                          sx={{ 
                            width: '100%', 
                            maxWidth: '100%', 
                            boxSizing: 'border-box',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:focus-within': {
                              boxShadow: '0 0 0 3px rgba(0, 200, 236, 0.15)',
                              borderColor: 'var(--color-primary)'
                            },
                            '& .MuiSelect-select': {
                              width: '100%',
                              maxWidth: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              py: 1.25,
                              fontSize: { xs: '0.95rem', sm: '1rem' }
                            }
                          }}
                          slotProps={{
                            listbox: { 
                              sx: { 
                                zIndex: 1500, 
                                maxHeight: 260,
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(0, 200, 236, 0.2)'
                              } 
                            }
                          }}
                        >
                          {errorSavedCardsTse && (
                            <Option value={null} disabled>
                              Erro ao carregar cartões
                            </Option>
                          )}
                          {!errorSavedCardsTse && savedCardsTse.length === 0 && (
                            <Option value={null} disabled>
                              Nenhum cartão salvo
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
                        p: 2.5, 
                        background: 'linear-gradient(135deg, rgba(245, 150, 0, 0.12) 0%, rgba(245, 150, 0, 0.06) 100%)',
                        borderRadius: '16px',
                        border: '1.5px solid rgba(245, 150, 0, 0.25)',
                        boxShadow: '0 2px 8px rgba(245, 150, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                          borderRadius: '16px 0 0 16px',
                          opacity: 0.6
                        }
                      }}>
                        <Typography level="body-sm" sx={{ 
                          color: 'text.primary',
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          pl: 1
                        }}>
                          Você ainda não possui cartões salvos. Use a aba &quot;Novo Cartão&quot; e marque a opção &quot;Salvar este cartão&quot;.
                        </Typography>
                      </Box>
                    )}

                    {errorSavedCardsTse && (
                      <Box sx={{ 
                        p: 2.5, 
                        background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.08) 0%, rgba(255, 0, 0, 0.04) 100%)',
                        borderRadius: '16px', 
                        border: '1.5px solid rgba(255, 0, 0, 0.25)',
                        boxShadow: '0 2px 8px rgba(255, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)',
                          borderRadius: '16px 0 0 16px',
                          opacity: 0.6
                        }
                      }}>
                        <Typography level="body-sm" sx={{ 
                          color: 'danger.plainColor', 
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 600,
                          mb: 1.5,
                          pl: 1
                        }}>
                          Não foi possível carregar seus cartões salvos.
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="sm" 
                          sx={{ 
                            mt: 1,
                            ml: 1,
                            borderRadius: '10px',
                            borderColor: 'danger.plainColor',
                            color: 'danger.plainColor',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: 'rgba(255, 0, 0, 0.1)',
                              borderColor: 'danger.plainColor',
                              transform: 'translateY(-1px)'
                            }
                          }} 
                          onClick={() => refetchSavedCards()}
                        >
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
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                          color: 'white',
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 1.75,
                          borderRadius: '14px',
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          boxShadow: '0 4px 12px rgba(1, 90, 103, 0.3)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                            boxShadow: '0 6px 20px rgba(1, 90, 103, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          '&:active': {
                            transform: 'translateY(0)',
                            boxShadow: '0 2px 8px rgba(1, 90, 103, 0.3)'
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed'
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
                        Selecione um cartão
                      </Button>
                    )}

                    <Button
                      onClick={handleClose}
                      disabled={isProcessing}
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: 'text.tertiary',
                        color: 'text.tertiary',
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
                          color: 'primary.plainColor',
                          bgcolor: 'rgba(0, 200, 236, 0.12)',
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </TabPanel>

                {/* Aba 2: Novo Cartão */}
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
                        color: 'text.secondary',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Número do Cartão
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
                        sx={{ 
                          width: '100%', 
                          maxWidth: '100%', 
                          boxSizing: 'border-box',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          '&:focus-within': {
                            boxShadow: '0 0 0 3px rgba(0, 200, 236, 0.15)',
                            borderColor: 'var(--color-primary)'
                          },
                          '& .MuiInput-input': {
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            py: 1.25
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl required sx={{ width: '100%', boxSizing: 'border-box' }}>
                      <FormLabel sx={{ 
                        color: 'text.secondary',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Nome no Cartão
                      </FormLabel>
                      <Input
                        placeholder="Como está no cartão"
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
                        color: 'text.secondary',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 600
                      }}>
                        Bandeira do Cartão
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
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          '&:focus-within': {
                            boxShadow: '0 0 0 3px rgba(0, 200, 236, 0.15)',
                            borderColor: 'var(--color-primary)'
                          },
                          '& .MuiSelect-select': {
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            py: 1.25,
                            fontSize: { xs: '0.95rem', sm: '1rem' }
                          }
                        }}
                        slotProps={{
                          listbox: { 
                            sx: { 
                              zIndex: 1500, 
                              maxHeight: 260,
                              borderRadius: '12px',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                              border: '1px solid rgba(0, 200, 236, 0.2)'
                            } 
                          }
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
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            mb: 1.5
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
                              borderRadius: '12px',
                              transition: 'all 0.3s ease',
                              '&:focus-within': {
                                boxShadow: '0 0 0 3px rgba(0, 200, 236, 0.15)',
                                borderColor: 'var(--color-primary)'
                              },
                              '& .MuiInput-input': {
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                py: 1.25
                              }
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
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            mb: 1.5
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
                              borderRadius: '12px',
                              transition: 'all 0.3s ease',
                              '&:focus-within': {
                                boxShadow: '0 0 0 3px rgba(0, 200, 236, 0.15)',
                                borderColor: 'var(--color-primary)'
                              },
                              '& .MuiInput-input': {
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                py: 1.25
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
              </Grid>

                    <Checkbox
                      label="Salvar este cartão para pagamentos futuros"
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
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        color: 'white',
                        fontFamily: 'var(--font-puffin), sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.75,
                        borderRadius: '14px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        boxShadow: '0 4px 12px rgba(1, 90, 103, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                          boxShadow: '0 6px 20px rgba(1, 90, 103, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 8px rgba(1, 90, 103, 0.3)'
                        },
                        '&:disabled': {
                          opacity: 0.6,
                          cursor: 'not-allowed'
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
                        borderColor: 'text.tertiary',
                        color: 'text.tertiary',
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
                          color: 'primary.plainColor',
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
