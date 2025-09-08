"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Grid,
  Stack,
  CircularProgress,
  Box,
  Typography,
  Alert
} from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { getUserContracts } from "@/services/querys/user-time-sharing-contracts";
import { getAvailability, AvailabilityItem } from "@/services/querys/user-time-sharing-availability";
import { getLinkedHotels, LinkedHotel } from "@/services/querys/timeSharing/linkedHotels";
import { useQuery } from "@tanstack/react-query";
import { UserContract } from "@/utils/types/user-time-sharing-contracts";
import AvailabilityCard from "../AvailabilityCard";
import { useRouter } from "next/navigation";
import { useReserveSearch } from "@/contexts/ReserveSearchContext";

type CreateReservaProps = {
  onCancel?: () => void; // A prop opcional para o botão de voltar
};

export default function CreateReserva({ onCancel = () => {} }: CreateReservaProps) {
  const router = useRouter();
  const {
    state,
    updateFilters,
    updateAvailabilityResults,
    setHasSearched,
    setIsSearching,
    setError,
    loadStateFromStorage
  } = useReserveSearch();
  
  const { filters, availabilityResults: results, isSearching, error } = state;
  
  // Estados locais para controle da UI
  const [localStartDate, setLocalStartDate] = useState("");
  const [localEndDate, setLocalEndDate] = useState("");
  const [localSelectedContract, setLocalSelectedContract] = useState("");
  const [localSelectedHotel, setLocalSelectedHotel] = useState("-1");
  const [selectedContractDetails, setSelectedContractDetails] = useState<UserContract | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["getUserContracts"],
    queryFn: async () => getUserContracts({ contractNumber: "" }, 1),
  });

  const { isLoading: isLoadingHotels, data: hotelsData } = useQuery({
    queryKey: ["linkedHotels"],
    queryFn: getLinkedHotels,
  });

  // Carregar dados do Context quando o componente for montado
  useEffect(() => {
    loadStateFromStorage();
  }, [loadStateFromStorage]);

  // Sincronizar dados do Context com estados locais quando os filtros mudarem
  useEffect(() => {
    if (filters.startDate) setLocalStartDate(filters.startDate);
    if (filters.endDate) setLocalEndDate(filters.endDate);
    if (filters.selectedContract) setLocalSelectedContract(filters.selectedContract);
    if (filters.selectedHotel) setLocalSelectedHotel(filters.selectedHotel);
  }, [filters.startDate, filters.endDate, filters.selectedContract, filters.selectedHotel]);

  const { contracts = [] } = data ?? {};
  const activeContracts = contracts.filter(contract => contract.status === "ATIVO");

  // Preencher automaticamente as datas ao montar o componente
  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endDateCalc = new Date(nextMonth);
    endDateCalc.setDate(nextMonth.getDate() + 7);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    setLocalStartDate(formatDate(nextMonth));
    setLocalEndDate(formatDate(endDateCalc));
  }, []);

   useEffect(() => {
    // Se a lista de contratos não estiver carregando e houver exatamente um contrato
    if (!isLoading && activeContracts.length === 1) {
      const contract = activeContracts[0];
      setLocalSelectedContract(String(contract.tsSaleId));
      setSelectedContractDetails(contract);
    }
  }, [isLoading, activeContracts]);

  // Atualizar filtros no contexto quando os valores locais mudarem
  useEffect(() => {
    if (localStartDate && localEndDate && localSelectedContract) {
      updateFilters({
        startDate: localStartDate,
        endDate: localEndDate,
        selectedContract: localSelectedContract,
        selectedHotel: localSelectedHotel,
      });
    }
  }, [localStartDate, localEndDate, localSelectedContract, localSelectedHotel, updateFilters]);

   useEffect(() => {
    if (localSelectedContract && activeContracts.length > 0) {
      const contract = activeContracts.find(c => String(c.tsSaleId) === localSelectedContract);
      if (contract) {
        setSelectedContractDetails(contract);
      }
    } else {
      setSelectedContractDetails(null);
    }
  }, [localSelectedContract, activeContracts]);

  const handleSelectPeriod = (availability: AvailabilityItem) => {
    // Salvar o estado atual no Context antes de navegar
    updateFilters({
      startDate: localStartDate,
      endDate: localEndDate,
      selectedContract: localSelectedContract,
      selectedHotel: localSelectedHotel,
    });
    updateAvailabilityResults(results);

    // Adicionar o IdVenda ao objeto availability antes de passar para o BookingForm
    const availabilityWithIdVenda = {
      ...availability,
      idVenda: selectedContractDetails?.tsSaleId || 0
    };
    
    // Navegar para a nova página SPA com os dados da disponibilidade
    const availabilityData = encodeURIComponent(JSON.stringify(availabilityWithIdVenda));
    router.push(`/dashboard/user-time-sharing-reserves/select-period?availability=${availabilityData}`);
  };

  const handleExpandedSearch = async () => {
    if (!localStartDate || !localEndDate || !localSelectedContract || !selectedContractDetails) {
      setError("Preencha todos os campos para pesquisar");
      return;
    }

    setError(null);
    setIsSearching(true);
    updateAvailabilityResults([]);

    try {
      const startDateObj = new Date(localStartDate);
      const endDateObj = new Date(localEndDate);

      const response = await getAvailability({
        NumeroContrato: selectedContractDetails.contractNumber,
        IdVenda: String(selectedContractDetails.tsSaleId),
        HotelId: localSelectedHotel || "-1",
        DataInicial: startDateObj,
        DataFinal: endDateObj,
        TipoDeBusca: "A"
      });

      if (response.success) {
        updateAvailabilityResults(response.data);
      } else {
        setError(response.errors[0] || "Ocorreu um erro ao buscar disponibilidade. Tente novamente.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao buscar disponibilidade. Tente novamente.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!localStartDate || !localEndDate || !localSelectedContract || !selectedContractDetails) {
      setError("Preencha todos os campos para pesquisar");
      return;
    }

    setError(null);
    setIsSearching(true);
    updateAvailabilityResults([]);

    try {
      const startDateObj = new Date(localStartDate);
      const endDateObj = new Date(localEndDate);

      const response = await getAvailability({
        NumeroContrato: selectedContractDetails.contractNumber,
        IdVenda: String(selectedContractDetails.tsSaleId),
        HotelId: localSelectedHotel || "-1",
        DataInicial: startDateObj,
        DataFinal: endDateObj,
        TipoDeBusca: "E"
      });

      if (response.success) {
        updateAvailabilityResults(response.data);
        setHasSearched(response.data.length === 0);
      } else {
        setError(response.errors[0] || "Ocorreu um erro ao buscar disponibilidade. Tente novamente.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao buscar disponibilidade. Tente novamente.");
      console.error(err);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };


  return (
    <>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleSearch;
        }}
      >
      <Grid container spacing={2} sx={{ flexGrow: 1, alignItems: 'flex-end' }}>
        <Grid xs={12} md={2}>
          <FormControl>
            <FormLabel>Data inicial</FormLabel>
            <Input
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              required
            />
          </FormControl>
        </Grid>

        <Grid xs={12} md={2}>
          <FormControl>
            <FormLabel>Data fim</FormLabel>
            <Input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                required
              />
          </FormControl>
        </Grid>

        <Grid xs={12} md={4}>
          <FormControl>
            <FormLabel>Contratos</FormLabel>
            <Select
              placeholder="Selecione um contrato..."
              value={localSelectedContract}
              onChange={(e, newValue) => setLocalSelectedContract(newValue || "")}
              required
              endDecorator={isLoading ? <CircularProgress size="sm" sx={{ '--CircularProgress-progressColor': 'var(--CircularProgress-Color)' }} /> : null}
              disabled={isLoading}
            >
              {activeContracts.map((contract: UserContract) => (
                <Option key={contract.tsSaleId} value={String(contract.tsSaleId)}>
                  {`Contrato ${contract.contractNumber} da venda ${contract.tsSaleId}`}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} md={3}>
          <FormControl>
            <FormLabel>Hotel</FormLabel>
            <Select
              value={localSelectedHotel}
              placeholder="Selecione um hotel..."
              onChange={(e, newValue) => setLocalSelectedHotel(newValue || "")}
              endDecorator={isLoadingHotels ? <CircularProgress size="sm" sx={{ '--CircularProgress-progressColor': 'var(--CircularProgress-Color)' }} /> : null}
              disabled={isLoadingHotels}
            >
              <Option key="-1" value="-1">Selecione um hotel...</Option>
              {hotelsData?.data?.map((hotel: LinkedHotel) => (
                <Option key={hotel.hotelId} value={String(hotel.hotelId)}>
                  {hotel.hotelNome}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button
              type="submit"
              startDecorator={<SearchIcon />}
              onClick={handleSearch}
              sx={{ width: '100%' }}
            >
              Consultar disponibilidades
            </Button>
          </Stack>
        </Grid>
      </Grid>
      </form>

      {error && (
        <Alert color="danger" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!isSearching && results && results.length > 0 && (
         <Box sx={{ mt: 4 }}>
           <Typography level="title-lg" sx={{ mb: 2 }}>
             Períodos disponíveis: ({results.length})
           </Typography>
           <Grid container spacing={2}>
             {results.map((item, index) => (
               <Grid xs={12} md={6} lg={4} key={index}>
                 <AvailabilityCard 
                   availability={item} 
                   onSelect={handleSelectPeriod} 
                 />
               </Grid>
             ))}
           </Grid>
         </Box>
       )}

      {!isSearching && results && results.length === 0 && !error && state.hasSearched && (
         <Box sx={{ mt: 4, textAlign: 'center' }}>
           <Typography level="body-md" color="neutral" sx={{ mb: 2 }}>
             Nenhuma disponibilidade foi encontrada com os filtros informados.
           </Typography>
           <Button
             variant="outlined"
             startDecorator={<TuneIcon />}
             onClick={handleExpandedSearch}
             loading={isSearching}
           >
             Ampliar busca
           </Button>
         </Box>
       )}

       {!isSearching && (!results || results.length === 0) && !error && !state.hasSearched && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography level="body-md" color="neutral">
              Preencha os campos acima e clique Consultar disponibilidades para ver os períodos disponíveis.
            </Typography>
          </Box>
        )}

     {isSearching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ '--CircularProgress-progressColor': 'var(--CircularProgress-Color)' }} />
        </Box>
      )}

    </>
  );
}