"use client";

import LoadingData from "@/components/LoadingData";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import useUser from "@/hooks/useUser";
import { generateQRCode, consultarStatusPix, confirmarPagamentoPix, simularPagamentoPix } from "@/services/querys/finance-users";
import { formatMoney } from "@/utils/money";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { Box, Button, Stack, Typography, LinearProgress, CircularProgress } from "@mui/joy";
import { DialogContent, DialogTitle, Modal, ModalDialog, ModalOverflow } from "@/components/CompatModal";
import { useQueryClient } from "@tanstack/react-query";
import { ContentCopy } from "@mui/icons-material";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

type PayPerPixModalProps = {
  shouldOpen: boolean;
  selectedBills: UserOutstandingBill[];
  clearSelectedAccounts: () => void;
};

export default function PayPerPixModal({
  shouldOpen,
  selectedBills = [],
  clearSelectedAccounts,
}: PayPerPixModalProps) {
  const TEMPO_EXPIRACAO_SEGUNDOS = 300; // 5 minutos
  
  const [qrCode, setQrCode] = useState("");
  const [txid, setTxid] = useState("");
  const [expiracao, setExpiracao] = useState<Date | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(TEMPO_EXPIRACAO_SEGUNDOS);
  const [expirado, setExpirado] = useState(false);
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [mostrarConfirmacaoCancelamento, setMostrarConfirmacaoCancelamento] = useState(false);
  const [simulandoPagamento, setSimulandoPagamento] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasGeneratedQrRef = useRef(false);
  const [statusGeracao, setStatusGeracao] = useState<"idle" | "carregando" | "sucesso" | "erro">("idle");
  
  // Detectar se está em modo desenvolvimento (localhost)
  const isDesenvolvimento = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const { userData } = useUser();
  const closeModal = useCloseModal();

  const queryClient = useQueryClient();

  const totalSelecionado = useMemo(
    () => selectedBills.reduce((acc, bill) => acc + bill.currentValue, 0),
    [selectedBills]
  );

  const limparIntervalos = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const resetarEstado = useCallback((options?: { manterStatus?: boolean }) => {
    setQrCode("");
    setTxid("");
    setExpiracao(null);
    setTempoRestante(TEMPO_EXPIRACAO_SEGUNDOS);
    setExpirado(false);
    setProcessandoPagamento(false);
    if (!options?.manterStatus) {
      setStatusGeracao("idle");
    }
  }, []);

  const processarRetornoQrCode = useCallback((data: any) => {
    console.debug("[PIX] Sucesso na geração do QR Code", data);
    console.log('[DEBUG PIX] Resposta do backend:', data);
    console.log('[DEBUG PIX] Data expiração recebida:', data.expiracao);
    
    const dataExpiracao = new Date(data.expiracao);
    const agora = new Date();
    
    console.log('[DEBUG PIX] Data expiração parseada:', dataExpiracao);
    console.log('[DEBUG PIX] Data atual:', agora);
    
    const diferencaMs = dataExpiracao.getTime() - agora.getTime();
    const segundosRestantes = Math.floor(diferencaMs / 1000);
    
    console.log('[DEBUG PIX] Diferença em ms:', diferencaMs);
    console.log('[DEBUG PIX] Segundos restantes:', segundosRestantes);
    
    setQrCode(data.qrCode);
    setTxid(data.txid);
    setExpiracao(dataExpiracao);
    setTempoRestante(segundosRestantes > 0 ? segundosRestantes : TEMPO_EXPIRACAO_SEGUNDOS);
    setExpirado(false);
    clearSelectedAccounts();
    toast.info("QR Code gerado! Aguardando pagamento...");
    setStatusGeracao("sucesso");
  }, [clearSelectedAccounts]);

  const handleCloseModal = useCallback(() => {
    if (processandoPagamento) {
      toast.warning("⏳ Processamento em andamento. Aguarde a conclusão do pagamento.");
      return;
    }

    if (qrCode && !expirado) {
      setMostrarConfirmacaoCancelamento(true);
      return;
    }

    limparIntervalos();
    resetarEstado();
    closeModal();
  }, [processandoPagamento, qrCode, expirado, closeModal, limparIntervalos, resetarEstado]);

  const handleGenerateQrCode = useCallback(async (force = false) => {
    if (!force && hasGeneratedQrRef.current) {
      return;
    }

    hasGeneratedQrRef.current = true;
    setStatusGeracao("carregando");
    console.debug("[PIX] Iniciando geração de QR Code (force:", force, ")");

    resetarEstado({ manterStatus: true });

    try {
      const data = await generateQRCode({
        personId: userData!.personId,
        ids: selectedBills.map((bill) => bill.id),
        totalValue: totalSelecionado,
        idEmpresa: selectedBills[0]?.companyId,
        idTorre: selectedBills[0]?.idTorre,
        idContrato: selectedBills[0]?.idContrato,
        contasFinanceiras: selectedBills.map((bill) => ({
          idContaFinanceira: bill.id,
          valor: bill.currentValue,
          dataVencimento: bill.vencimentoDate || bill.dueDate,
          valorJuros: bill.juros ?? 0,
          valorMulta: bill.multa ?? 0,
        })),
      });

      processarRetornoQrCode(data);
    } catch (error) {
      console.error("[PIX] Erro ao gerar QR Code", error);
      hasGeneratedQrRef.current = true; // evita novas tentativas automáticas
      toast.error("Não foi possível gerar o QR-Code, por favor tente novamente mais tarde!");
      setStatusGeracao("erro");
    } finally {
      console.debug("[PIX] Finalizou processamento da geração de QR Code");
    }
  }, [selectedBills, totalSelecionado, userData, resetarEstado, processarRetornoQrCode]);
  // Gerar QR Code automaticamente quando abrir o modal
  useEffect(() => {
    if (!shouldOpen) {
      limparIntervalos();
      resetarEstado();
      hasGeneratedQrRef.current = false;
      setStatusGeracao("idle");
      return;
    }

    if (!processandoPagamento && !hasGeneratedQrRef.current) {
      handleGenerateQrCode();
    }
  }, [shouldOpen, processandoPagamento, handleGenerateQrCode, limparIntervalos, resetarEstado]);

  // Bloquear atualização da página durante processamento
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (processandoPagamento || qrCode) {
        e.preventDefault();
        e.returnValue = 'Há uma operação PIX em andamento. Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [processandoPagamento, qrCode]);
  // Recalcular tempo restante quando o componente montar ou voltar do background
  useEffect(() => {
    const recalcularTempo = () => {
      if (qrCode && expiracao && !expirado) {
        const agora = new Date();
        const diferencaMs = expiracao.getTime() - agora.getTime();
        const segundosRestantes = Math.floor(diferencaMs / 1000);
        
        if (segundosRestantes <= 0) {
          setExpirado(true);
          setTempoRestante(0);
          limparIntervalos();
          toast.warning("QR Code expirado! Gere um novo QR Code.");
        } else {
          setTempoRestante(segundosRestantes);
        }
      }
    };

    // Recalcular inicialmente
    recalcularTempo();

    // Adicionar listener para quando o usuário voltar para a aba
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        recalcularTempo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [qrCode, expiracao, expirado, limparIntervalos]);

  // Countdown de expiração baseado no timestamp real
  useEffect(() => {
    if (qrCode && expiracao && !expirado) {
      countdownIntervalRef.current = setInterval(() => {
        const agora = new Date();
        const diferencaMs = expiracao.getTime() - agora.getTime();
        const segundosRestantes = Math.floor(diferencaMs / 1000);
        
        if (segundosRestantes <= 0) {
          setExpirado(true);
          setTempoRestante(0);
          limparIntervalos();
          toast.warning("QR Code expirado! Gere um novo QR Code.");
        } else {
          setTempoRestante(segundosRestantes);
        }
      }, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [qrCode, expiracao, expirado, limparIntervalos]);

  const copiarCodigoPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      toast.success("Código PIX copiado!");
    } catch (err) {
      toast.error("Erro ao copiar código PIX");
    }
  };

  const confirmarCancelamento = () => {
    setMostrarConfirmacaoCancelamento(false);
    limparIntervalos();
    resetarEstado();
    closeModal();
  };

  const cancelarConfirmacao = () => {
    setMostrarConfirmacaoCancelamento(false);
  };

  // Polling para verificar pagamento
  useEffect(() => {
    if (txid && qrCode && !expirado && !processandoPagamento) {
      const executarConsulta = async () => {
        try {
          console.debug("[PIX] Consulta status PIX iniciada", txid);
          const statusResponse = await consultarStatusPix(txid);
          console.debug("[PIX] Resposta consulta status", statusResponse);

          if (statusResponse.pago) {
            limparIntervalos();
            setProcessandoPagamento(true);
            console.debug("[PIX] Status pago, confirmando no backend");

            await confirmarPagamentoPix(txid);
            toast.success("Pagamento PIX realizado com sucesso!");

            queryClient.invalidateQueries({ queryKey: ["getUserOutstandingBills"] });

            setTimeout(() => {
              handleCloseModal();
            }, 1500);
          }
        } catch (error: any) {
          console.error("Erro no polling PIX:", error);
        }
      };

      executarConsulta();
      pollingIntervalRef.current = setInterval(executarConsulta, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [txid, qrCode, expirado, processandoPagamento, handleCloseModal, queryClient, limparIntervalos]);

  const handleSimularPagamento = async () => {
    if (!txid) {
      toast.error("Txid não encontrado");
      return;
    }

    try {
      setSimulandoPagamento(true);
      limparIntervalos(); // Parar polling
      
      toast.info("🔧 Simulando pagamento PIX...");
      
      const resultado = await simularPagamentoPix(txid);
      
      if (resultado.autorizado) {
        toast.success("✅ Pagamento PIX simulado com sucesso!");
        
        // Recarregar lista de contas
        queryClient.invalidateQueries({ queryKey: ["getUserOutstandingBills"] });
        
        // Fechar modal após delay para usuário ver a mensagem
        setTimeout(() => {
          limparIntervalos();
          resetarEstado();
          closeModal();
        }, 1500);
      } else {
        toast.error("❌ Falha na simulação do pagamento");
        setSimulandoPagamento(false);
      }
    } catch (error: any) {
      console.error("Erro ao simular pagamento:", error);
      toast.error(error.message || "Erro ao simular pagamento PIX");
      setSimulandoPagamento(false);
    }
  };

  const formatarTempoRestante = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const getCorTimer = (segundos: number): "primary" | "warning" | "danger" => {
    if (segundos > 180) return "primary"; // > 3 min = azul
    if (segundos > 60) return "warning";  // > 1 min = amarelo
    return "danger"; // < 1 min = vermelho
  };

  return (
    <>
      {/* Modal de Confirmação de Cancelamento */}
      <AlertDialogModal
        openModal={mostrarConfirmacaoCancelamento}
        closeModal={cancelarConfirmacao}
        title="Cancelar Pagamento PIX"
        message="Você possui um QR Code PIX ativo. Deseja realmente cancelar?"
        actionText="Sim, cancelar"
        cancelActionText="Não, continuar"
        onHandleAction={confirmarCancelamento}
      />

      {/* Modal Principal PIX */}
      <Modal 
        open={shouldOpen} 
        onClose={(event, reason) => {
          // Prevenir fechamento clicando fora do modal ou ESC
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleCloseModal();
        }}
      >
      <ModalOverflow>
        <ModalDialog sx={{ 
          minWidth: { xs: '95%', sm: 500, md: 600 }, 
          maxWidth: { xs: '95%', sm: 600, md: 700 },
          maxHeight: '95vh',
          overflow: 'auto'
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
            pb: 2
          }}>
            Pagamento por QR-Code PIX
            {processandoPagamento && (
              <Typography level="body-sm" sx={{ 
                color: 'var(--color-secondary)',
                fontWeight: 600,
                animation: 'pulse 1.5s ease-in-out infinite',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                ⏳ Processando...
              </Typography>
            )}
          </DialogTitle>
          <DialogContent sx={{ 
            marginTop: "10px", 
            position: 'relative',
            px: { xs: 1, sm: 2 },
            pb: 2
          }}>
            {/* Overlay de processamento */}
            {processandoPagamento && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
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
                  Processando pagamento...
                </Typography>
                <Typography level="body-sm" sx={{ 
                  color: 'var(--color-secondary)',
                  fontFamily: 'var(--font-puffin), sans-serif',
                  textAlign: 'center'
                }}>
                  Aguarde, não feche esta janela
                </Typography>
              </Box>
            )}
            <Stack sx={{ width: '100%', alignItems: 'center' }}>
              {statusGeracao === "carregando" && !qrCode ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: { xs: "300px", sm: "400px", md: "500px" },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "500px" },
                    gap: 2,
                    py: 3
                  }}
                >
                  <LoadingData />
                  <Typography level="body-sm" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                    Gerando QR Code PIX...
                  </Typography>
                </Box>
              ) : qrCode ? (
                <Stack
                  textAlign="center"
                  gap={2}
                  sx={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: { xs: "100%", sm: "500px", md: "500px" },
                    width: "100%",
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  {expirado ? (
                    <>
                      <Typography level="h4" color="danger" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                        QR Code Expirado
                      </Typography>
                      <Typography level="body-sm" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                        Este QR Code expirou. Gere um novo para continuar.
                      </Typography>
                      <Button 
                        color="primary" 
                        onClick={() => handleGenerateQrCode(true)}
                        fullWidth
                        sx={{
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 600
                        }}
                      >
                        Gerar Novo QR Code
                      </Button>
                      <Button
                        onClick={handleCloseModal}
                        fullWidth
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 600
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box sx={{ 
                        width: "100%", 
                        display: 'flex', 
                        justifyContent: 'center',
                        p: { xs: 1, sm: 1.5 },
                        bgcolor: 'background.surface',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <QRCode
                          size={200}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                            aspectRatio: '1',
                          }}
                          value={qrCode}
                          viewBox={`0 0 256 256`}
                        />
                      </Box>
                      
                      <Typography level="title-md" textAlign="center">
                        Valor: {formatMoney(totalSelecionado)}
                      </Typography>
                      
                      {/* Timer de expiração */}
                      {tempoRestante > 0 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography level="body-sm" color={getCorTimer(tempoRestante)}>
                              ⏱️ Tempo restante: {formatarTempoRestante(tempoRestante)}
                            </Typography>
                            <Typography level="body-xs" color="neutral">
                              (válido por 5 minutos)
                            </Typography>
                          </Box>
                          <LinearProgress
                            determinate
                            value={(tempoRestante / TEMPO_EXPIRACAO_SEGUNDOS) * 100}
                            color={getCorTimer(tempoRestante)}
                            sx={{ height: 8 }}
                          />
                        </Box>
                      )}
                      
                      {/* Botão Copiar Código PIX */}
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={copiarCodigoPix}
                        fullWidth
                        sx={{ mt: 1 }}
                        startDecorator={<ContentCopy />}
                      >
                        Copiar Código PIX (Copia e Cola)
                      </Button>

                      {/* Botão Simular Pagamento - APENAS EM DESENVOLVIMENTO */}
                      {isDesenvolvimento && (
                        <Button
                          variant="solid"
                          onClick={handleSimularPagamento}
                          disabled={simulandoPagamento || processandoPagamento}
                          loading={simulandoPagamento}
                          fullWidth
                          sx={{
                            mt: 1,
                            fontFamily: 'var(--font-puffin), sans-serif',
                            fontWeight: 600,
                            background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            color: 'var(--color-text-light, #ffffff)',
                            boxShadow: '0 6px 18px rgba(1, 90, 103, 0.25)',
                            '&:hover': {
                              background: 'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-primary) 100%)'
                            },
                            '&:disabled': {
                              background: 'linear-gradient(180deg, rgba(1, 90, 103, 0.5) 0%, rgba(0, 200, 236, 0.5) 100%)',
                              boxShadow: 'none'
                            }
                          }}
                        >
                          {simulandoPagamento ? '🔧 Simulando...' : '🔧 Simular Pagamento (DEV)'}
                        </Button>
                      )}
                      
                      <Typography level="body-xs" color="primary" textAlign="center">
                        Escaneie o QR Code com o app do seu banco
                      </Typography>
                      
                      <Typography level="body-xs" color="neutral" textAlign="center" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                        🔄 Aguardando confirmação do pagamento...
                      </Typography>
                      
                      {/* Botão Cancelar */}
                      <Button
                        onClick={handleCloseModal}
                        disabled={processandoPagamento}
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          fontFamily: 'var(--font-puffin), sans-serif',
                          fontWeight: 600,
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          '&:hover': {
                            backgroundColor: 'rgba(1, 90, 103, 0.08)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)'
                          },
                          '&:disabled': {
                            borderColor: 'rgba(1, 90, 103, 0.3)',
                            color: 'rgba(1, 90, 103, 0.3)'
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </Stack>
              ) : statusGeracao === "erro" ? (
                <Stack gap={3} textAlign="center">
                  <Typography level="h4" color="danger" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                    Erro ao gerar QR Code
                  </Typography>
                  <Typography level="body-sm" sx={{ fontFamily: 'var(--font-puffin), sans-serif' }}>
                    Não foi possível gerar o QR Code PIX. Tente novamente.
                  </Typography>
                  <Button onClick={() => handleGenerateQrCode(true)} fullWidth>
                    Tentar Novamente
                  </Button>
                  <Button onClick={handleCloseModal} fullWidth variant="outlined" color="neutral">
                    Fechar
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
      </Modal>
    </>
  );
}
