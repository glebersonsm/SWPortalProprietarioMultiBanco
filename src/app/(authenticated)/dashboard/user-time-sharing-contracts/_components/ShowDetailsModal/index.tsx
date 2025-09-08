import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Contract } from "@/utils/types/timeSharing/contracts";
import { 
  Box, 
  Chip, 
  Divider, 
  FormControl, 
  FormLabel, 
  Grid, 
  Textarea, 
  Typography 
} from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  contract: Contract;
  shouldOpen: boolean;
};

export default function ShowDetailsModal({
  contract,
  shouldOpen,
}: ShowDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'active':
        return 'success';
      case 'cancelado':
      case 'cancelled':
        return 'danger';
      case 'revertido':
      case 'reversed':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <ModalToShowDetails title="Detalhes do Contrato" shouldOpen={shouldOpen}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Informações Básicas do Contrato */}
        <Box>
          <Typography level="h4" sx={{ mb: 2, color: 'primary.500' }}>
            📋 Informações do Contrato
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>ID de Venda</FormLabel>
                <Textarea 
                  defaultValue={contract.tsSaleId} 
                  readOnly 
                  sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Número do Contrato</FormLabel>
                <Textarea 
                  defaultValue={contract.contractNumber} 
                  readOnly 
                  sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Tipo de Contrato</FormLabel>
                <Textarea defaultValue={contract.contractType} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Projeto-Contrato</FormLabel>
                <Textarea defaultValue={contract.projectXContract} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Data de Venda</FormLabel>
                <Textarea defaultValue={contract.saleDate} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Cidade - Estado</FormLabel>
                <Textarea defaultValue={contract.cityState} readOnly />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Dados do Cliente */}
        <Box>
          <Typography level="h4" sx={{ mb: 2, color: 'primary.500' }}>
            👤 Dados do Cliente
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Nome do Cliente</FormLabel>
                <Textarea 
                  defaultValue={contract.clientName} 
                  readOnly 
                  sx={{ fontWeight: 'bold' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>ID do Cliente</FormLabel>
                <Textarea 
                  defaultValue={contract.clientId} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Documento</FormLabel>
                <Textarea 
                  defaultValue={contract.clientDocument} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Email</FormLabel>
                <Textarea defaultValue={contract.clientEmail} readOnly />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Status e Controle */}
        <Box>
          <Typography level="h4" sx={{ mb: 2, color: 'primary.500' }}>
            📊 Status e Controle
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Status do Contrato
                </Typography>
                <Chip 
                  color={getStatusColor(contract.status)} 
                  size="lg"
                  sx={{ fontWeight: 'bold' }}
                >
                  {contract.status}
                </Chip>
              </Box>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Sala de Vendas</FormLabel>
                <Textarea defaultValue={contract.saleRoom} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Cancelado</FormLabel>
                <Textarea defaultValue={contract.cancellation} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Data do Cancelamento</FormLabel>
                <Textarea defaultValue={contract.cancellationDate || '-'} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Revertido</FormLabel>
                <Textarea defaultValue={contract.reversed} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Data da Reversão</FormLabel>
                <Textarea defaultValue={contract.reversalDate || '-'} readOnly />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Data de Validade</FormLabel>
                <Textarea defaultValue={contract.expirationDate} readOnly />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Informações Financeiras */}
        <Box>
          <Typography level="h4" sx={{ mb: 2, color: 'success.500' }}>
            💰 Informações Financeiras
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold', color: 'success.600' }}>Valor Total da Venda</FormLabel>
                <Textarea 
                  defaultValue={contract.totalSalesValue} 
                  readOnly 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'success.700',
                    fontFamily: 'monospace'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Valor de Entrada</FormLabel>
                <Textarea 
                  defaultValue={contract.downPayment} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Valor Financiado</FormLabel>
                <Textarea 
                  defaultValue={contract.amountFinanced} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Percentual de Integralização</FormLabel>
                <Textarea 
                  defaultValue={contract.percentagePaid} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Parcelas de Entrada</FormLabel>
                <Textarea 
                  defaultValue={contract.numberOfDownPayments} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Parcelas Financiadas</FormLabel>
                <Textarea 
                  defaultValue={contract.numberOfFinancedInstallments} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>Parcelas Pagas</FormLabel>
                <Textarea 
                  defaultValue={contract.numberOfInstallmentsPaid} 
                  readOnly 
                  sx={{ fontFamily: 'monospace' }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold', color: 'warning.600' }}>Saldo de Pontos</FormLabel>
                <Textarea 
                  defaultValue={contract.pointsBalance} 
                  readOnly 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'warning.700',
                    fontFamily: 'monospace'
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ModalToShowDetails>
  );
}
