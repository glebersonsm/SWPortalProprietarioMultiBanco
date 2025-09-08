"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import {
  Button,
  Grid,
  Stack,
  Typography,
  Box,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  IconButton,
  Divider,
} from "@mui/joy";
import { Add, Remove } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { AvailabilityItem } from "@/services/querys/user-time-sharing-availability";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { saveTimeShareReserve, SaveReserveRequest } from "@/services/querys/user-time-sharing-reserves";
import { toast } from "react-toastify";
import CepInput from "@/components/CepInput";
import CitySearchField from "@/components/CitySearchField";
import { getDocumentTypes } from "@/services/querys/documentTypes";
import { DocumentTypes } from "@/utils/types/users";
import { useReserveSearch } from "@/contexts/ReserveSearchContext";
import { formatDate } from "@/utils/dates";

type BookingFormProps = {
  availability: AvailabilityItem;
  editMode?: boolean;
  reserveData?: any;
};

interface GuestData {
  id?: number;
  name: string;
  birthDate: string;
  gender: string;
}

type BookingFormData = {
  // Dados da reserva
  checkin: string;
  checkout: string;
  status: string;
  useType: 'proprietario' | 'convidado';
  
  // Dados do hóspede principal
  principalGuest: {
    name: string;
    birthDate: string;
    tipoDocumentoId: number | null;
    tipoDocumento: string;
    documento: string;
    email: string;
    ddi: string;
    ddd: string;
    telefone: string;
    gender: string;
    estrangeiro: boolean;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      complement: string;
      city: number | null; // ID da cidade selecionada
      cep: string;
    };
  };
  
  // Dados dos convidados
  guests: GuestData[];
};

const BookingForm: React.FC<BookingFormProps> = ({ availability, editMode = false, reserveData }) => {
  const router = useRouter();
  const { saveStateToStorage } = useReserveSearch();
  const [loading, setLoading] = React.useState(false);
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypes[]>([]);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);

  // Função para calcular idade baseada na data de nascimento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    try {
      // Converte data do formato dd/MM/yyyy para Date
      const [day, month, year] = birthDate.split('/');
      const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Erro ao calcular idade:', error);
      return 0;
    }
  };

  // Função para contar hóspedes por categoria de idade
  const countGuestsByAge = (allGuests: Array<{birthDate: string}>) => {
    let adultos = 0;
    let criancas1 = 0; // 0-6 anos
    let criancas2 = 0; // 7-12 anos
    
    allGuests.forEach(guest => {
      const age = calculateAge(guest.birthDate);
      if (age > 13) {
        adultos++;
      } else if (age >= 7 && age <= 12) {
        criancas2++;
      } else if (age >= 0 && age <= 6) {
        criancas1++;
      }
    });
    
    return { adultos, criancas1, criancas2 };
  };

  // Valores iniciais para os campos de data
  // const initialCheckin = formatDate(editMode ? reserveData?.dataChegadaPrevista : availability.checkin,"dd/MM/yyyy");
  // const initialCheckout = formatDate(editMode ? reserveData?.dataPartidaPrevista : availability.checkout,"dd/MM/yyyy");
  // console.log(initialCheckin,initialCheckout,reserveData?.dataChegadaPrevista,reserveData?.dataPartidaPrevista,availability.checkin,availability.checkout)
  
  const methods = useForm<BookingFormData>({
    defaultValues: {
      checkin: formatDate(availability.checkin,"yyyy-MM-dd"),
      checkout: formatDate(availability.checkout,"yyyy-MM-dd"),
      status: 'AC - A Confirmar',
      useType: 'proprietario',
      principalGuest: {
        name: '',
        birthDate: '',
        tipoDocumentoId: null,
        tipoDocumento: '',
        documento: '',
        email: '',
        ddi: '+55',
        ddd: '',
        telefone: '',
        gender: 'F',
        estrangeiro: false,
        address: {
          street: '',
          number: '',
          neighborhood: '',
          complement: '',
          city: null,
          cep: '',
        }
      },
      guests: [],
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;



  // Estado para armazenar dados da reserva em edição
  const [editReserveNumber, setEditReserveNumber] = useState<number | null>(null);
  const [editGuestIds, setEditGuestIds] = useState<{[key: number]: number}>({});

  // useEffect para carregar tipos de documento
  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        setLoadingDocumentTypes(true);
        const types = await getDocumentTypes({ personType: 0 }); // 0 para pessoa física
        setDocumentTypes(types);
        console.log('Tipos de documento carregados:', types);
      } catch (error) {
        console.error('Erro ao carregar tipos de documento:', error);
        toast.error('Erro ao carregar tipos de documento');
      } finally {
        setLoadingDocumentTypes(false);
      }
    };

    loadDocumentTypes();
  }, [setLoadingDocumentTypes]);

  // useEffect para preencher dados em modo de edição
  useEffect(() => {
    // Só executa se estiver em modo de edição E tiver dados de reserva
    if (!editMode || !reserveData) {
      return;
    }
    
    try {
      // Verificar se os dados estão no formato correto
      let reserve;
      if (reserveData.data && reserveData.data.length > 0) {
        // Formato antigo com wrapper data
        reserve = reserveData.data[0];
      } else if (reserveData.hospedes) {
        // Formato direto da reserva
        reserve = reserveData;
      } else {
        console.error('BookingForm - Formato de dados não reconhecido:', reserveData);
        toast.error('Formato de dados da reserva não reconhecido');
        return;
      }
      
      const hospedes = reserve.hospedes || [];
      
      if (hospedes.length === 0) {
        console.error('BookingForm - Nenhum hóspede encontrado na reserva');
        toast.error('Dados de hóspedes não encontrados na reserva');
        return;
      }
      
      // Armazenar número da reserva para uso posterior
      setEditReserveNumber(reserve.numReserva);
      
      // Encontrar hóspede principal
      const principalGuest = hospedes.find((h: any) => h.principal === 'S') || hospedes[0];
      const otherGuests = hospedes.filter((guest: any) => guest.principal !== 'S');
      
      // Mapear IDs dos hóspedes
      const guestIdMap: {[key: number]: number} = {};
      hospedes.forEach((guest: any, index: number) => {
        if (guest && guest.id) {
          guestIdMap[index] = guest.id;
        }
      });
      setEditGuestIds(guestIdMap);
      
       // Função para converter data ISO para formato YYYY-MM-DD
       const convertISOToDateInput = (isoDate?: string) => {
         if (!isoDate) return '';
         try {
           const date = new Date(isoDate);
           if (!isNaN(date.getTime())) {
             const year = date.getFullYear();
             const month = String(date.getMonth() + 1).padStart(2, '0');
             const day = String(date.getDate()).padStart(2, '0');
             return `${year}-${month}-${day}`;
           }
         } catch (error) {
           console.error('Erro ao converter data ISO:', error);
         }
         return '';
       };


      
      // Preencher dados do formulário
      const formData: BookingFormData = {
        checkin: convertISOToDateInput(availability.checkin),
        checkout: convertISOToDateInput(availability.checkout),
        status: reserve.statusReserva || 'AC - A Confirmar',
        useType: 'proprietario',
        principalGuest: {
          name: principalGuest?.nome || '',
          birthDate: formatDate(principalGuest?.dataNascimento) || '',
          tipoDocumentoId: principalGuest?.tipoDocumentoId || null,
          tipoDocumento: principalGuest?.tipoDocumento || '',
          documento: principalGuest?.documento || '',
          email: principalGuest?.email || '',
          ddi: principalGuest?.DDI || '+55',
          ddd: principalGuest?.DDD || '',
          telefone: principalGuest?.telefone || '',
          gender: principalGuest?.sexo || 'F',
          estrangeiro: principalGuest?.Estrangeiro === 1,
          address: {
            street: principalGuest?.logradouro || '',
            number: principalGuest?.numero || '',
            neighborhood: principalGuest?.bairro || '',
            complement: '',
            city: principalGuest?.cidadeId || (principalGuest?.codigoIbge ? parseInt(principalGuest.codigoIbge) : null),
            cep: principalGuest?.cep || '',
          }
        },
        guests: otherGuests.map((guest: any) => ({
          id: guest.id,
          name: guest.nome || '',
          birthDate: convertISOToDateInput(guest.dataNascimento) || '',
          gender: guest.sexo || 'F',
        }))
      };
      
      // Resetar formulário com novos dados
      reset(formData);
      
      // Forçar atualização dos campos críticos após o reset
      setTimeout(() => {
        // Sempre forçar atualização do campo gender para garantir que seja preenchido
        if (principalGuest?.sexo) {
          setValue('principalGuest.gender', principalGuest.sexo, { shouldValidate: true, shouldDirty: true });
        }
        
        // Forçar atualização da data de nascimento também
        if (principalGuest?.dataNascimento) {
          const convertedDate = convertISOToDateInput(principalGuest.dataNascimento);
          setValue('principalGuest.birthDate', convertedDate, { shouldValidate: true, shouldDirty: true });
        }
        
        // Forçar atualização dos campos dos hóspedes convidados
        otherGuests.forEach((guest: any, index: number) => {
          if (guest.sexo) {
            setValue(`guests.${index}.gender`, guest.sexo, { shouldValidate: true, shouldDirty: true });
          }
          if (guest.dataNascimento) {
            const convertedDate = convertISOToDateInput(guest.dataNascimento);
            setValue(`guests.${index}.birthDate`, convertedDate, { shouldValidate: true, shouldDirty: true });
          }
        });
      }, 200);
      
      // Atualizar estado dos convidados
      setGuests(formData.guests);
    } catch (error) {
      console.error('BookingForm - Erro ao preencher dados de edição:', error);
      toast.error('Erro ao carregar dados da reserva para edição');
    }
  }, [editMode, reserveData, reset, setValue, availability.checkin, availability.checkout]);

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      // Converter datas para ISO string
      const convertDateToISO = (dateStr: string): string => {
        if (!dateStr) return new Date().toISOString();
        
        // Se a data está no formato YYYY-MM-DD (tipo date)
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
        }
        
        // Se a data está no formato dd/MM/yyyy
        if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [day, month, year] = dateStr.split('/');
          return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
        }
        
        // Fallback: tentar converter diretamente
        try {
          return new Date(dateStr).toISOString();
        } catch (error) {
          console.error('Erro ao converter data:', dateStr, error);
          return new Date().toISOString();
        }
      };

      // Calcular quantidades por idade
      const allGuests = [data.principalGuest, ...data.guests];
      const ageCounts = countGuestsByAge(allGuests);

      // Preparar dados dos hóspedes
      const hospedes = allGuests.map((guest, index) => {
        const isPrincipal = index === 0;
        const principalData = data.principalGuest;
        
        // Em modo de edição, usar ID existente se disponível, senão 0 para novos hóspedes
        let guestId = 0;
        if (editMode) {
          if (isPrincipal && editGuestIds[0]) {
            guestId = editGuestIds[0];
          } else if (!isPrincipal) {
            const guestData = guest as GuestData;
            guestId = guestData.id || 0;
          }
        }
        
        return {
          id: guestId,
          idHospede: 0,
          estrangeiro: isPrincipal ? (principalData.estrangeiro ? 1 : 0) : 0,
          tipoHospede: "string",
          clienteId: 0,
          cidadeId: isPrincipal ? (principalData.address.city || 0) : 0,
          principal: isPrincipal ? "S" : "N",
          nome: guest.name,
          dataNascimento: convertDateToISO(guest.birthDate),
          documento: isPrincipal ? principalData.documento : '',
          tipoDocumentoId: isPrincipal ? (principalData.tipoDocumentoId || 0) : 0,
          tipoDocumento: isPrincipal ? principalData.tipoDocumento : '',
          DDI: isPrincipal ? principalData.ddi : '',
          DDD: isPrincipal ? principalData.ddd : '',
          telefone: isPrincipal ? principalData.telefone : '',
          email: isPrincipal ? principalData.email : '',
          sexo: isPrincipal ? principalData.gender : '',
          codigoIbge: "0000000",
          logradouro: isPrincipal ? principalData.address.street : '',
          numero: isPrincipal ? principalData.address.number : '',
          bairro: isPrincipal ? principalData.address.neighborhood : '',
          cep: isPrincipal ? principalData.address.cep : '',
          dataCheckin: convertDateToISO(data.checkin),
          dataCheckout: convertDateToISO(data.checkout),
        };
      });

      // Preparar dados da requisição
      const reserveData: SaveReserveRequest = {
        reserva: editMode && editReserveNumber ? editReserveNumber : 0,
        numeroContrato: availability.numeroContrato,
        idVenda: availability.idVenda || 0,
        checkin: convertDateToISO(data.checkin),
        checkout: convertDateToISO(data.checkout),
        quantideAdultos: ageCounts.adultos,
        quantidadeCrianca1: ageCounts.criancas1,
        quantidadeCrianca2: ageCounts.criancas2,
        hospedes
      };

      // Enviar dados para o endpoint
      const response = await saveTimeShareReserve(reserveData);
      
      if (response.success) {
        const successMessage = editMode ? "Reserva editada com sucesso" : "Reserva criada com sucesso";
        toast.success(successMessage);
        router.push("/dashboard/user-time-sharing-reserves");
      } else {
        const errorMessage = response.errors?.[0] || (editMode ? "Erro ao editar reserva" : "Erro ao criar reserva");
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Erro ao salvar reserva:", error);
      const errorMessage = error?.response?.data?.message || (editMode ? "Erro ao editar reserva" : "Erro ao criar reserva");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    // Restaurar estado da busca antes de sair
    saveStateToStorage();
    router.back();
  };

  const addGuest = () => {
    setGuests([...guests, { name: '', birthDate: '', gender: 'F' }]);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Dados da Reserva - Layout horizontal */}
            <Grid container spacing={3} alignItems="center">
              <Grid xs={12} md={4}>
                <InputField
                  field="checkin"
                  label="Checkin"
                  type="date"
                  disabled={true}
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InputField
                  field="checkout"
                  label="Checkout"
                  type="date"
                  disabled={true}
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InputField
                  field="status"
                  label="Status"
                  defaultValue="CF - Confirmada"
                  disabled={true}
                  required={false}
                />
              </Grid>
            </Grid>

            {/* Linha divisória antes dos Dados do Hóspede Principal */}
            <Divider sx={{ borderColor: 'primary.500', borderWidth: 1 }} />
            
            {/* Dados do Hóspede Principal */}
            <Typography level="title-lg" sx={{ mb: 3, color: 'primary.500' }}>
              Dados do hóspede principal
            </Typography>
            <Grid container spacing={2}>
              {/* Primeira linha */}
              <Grid xs={12} md={3}>
                <InputField
                  field="principalGuest.name"
                  label="Nome"
                  required
                />
              </Grid>
              <Grid xs={12} md={2}>
                <InputField
                  field="principalGuest.birthDate"
                  label="Data de Nascimento"
                  type="date"
                  required
                />
              </Grid>
              <Grid xs={12} md={2}>
                <SelectField
                  field="principalGuest.tipoDocumentoId"
                  label="Tipo Documento"
                  options={documentTypes.map(doc => ({ id: doc.id, name: doc.name }))}
                  required
                />
              </Grid>
              <Grid xs={12} md={2}>
                <InputField
                  field="principalGuest.documento"
                  label="Documento"
                  required
                />
              </Grid>
              <Grid xs={12} md={3}>
                <InputField
                  field="principalGuest.email"
                  label="E-mail"
                  type="email"
                  placeholder="email@exemplo.com"
                  required={false}
                />
              </Grid>
              
              {/* Segunda linha */}
              <Grid xs={12} md={1}>
                <InputField
                  field="principalGuest.ddi"
                  label="DDI"
                  placeholder="+55"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={1}>
                <InputField
                  field="principalGuest.ddd"
                  label="DDD"
                  placeholder="11"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <InputField
                  field="principalGuest.telefone"
                  label="Telefone"
                  placeholder="99999-9999"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <SelectField
                  field="principalGuest.gender"
                  label="Sexo"
                  options={[
                    { id: 'M', name: 'Masculino' },
                    { id: 'F', name: 'Feminino' }
                  ]}
                  required
                />
              </Grid>
              <Grid xs={12} md={2}>
                <FormControl>
                  <FormLabel>Estrangeiro</FormLabel>
                  <Controller
                    name="principalGuest.estrangeiro"
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        orientation="horizontal"
                        value={value}
                        onChange={(event) => onChange(event.target.value === 'true')}
                      >
                        <Radio value="false" label="Não" />
                        <Radio value="true" label="Sim" />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} md={4}>
                <InputField
                  field="principalGuest.address.street"
                  label="Logradouro"
                  required={false}
                />
              </Grid>
              
              {/* Terceira linha */}
              <Grid xs={12} md={1}>
                <InputField
                  field="principalGuest.address.number"
                  label="Número"
                  placeholder="123"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <InputField
                  field="principalGuest.address.neighborhood"
                  label="Bairro"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <InputField
                  field="principalGuest.address.complement"
                  label="Complemento"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <CitySearchField
                  name="principalGuest.address.city"
                  label="Cidade/UF"
                  placeholder="Digite para buscar cidade"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <CepInput
                  field="principalGuest.address.cep"
                  label="CEP"
                  required={false}
                />
              </Grid>
              <Grid xs={12} md={2}>
                {/* Espaço para alinhamento */}
              </Grid>
            </Grid>

            {/* Linha divisória antes dos Dados dos Convidados */}
            <Divider sx={{ borderColor: 'primary.500', borderWidth: 1 }} />
            
            {/* Dados dos Convidados */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography level="title-lg" sx={{ color: 'primary.500' }}>
                    Dados do(s) convidado(s)
                  </Typography>
                  <IconButton 
                    variant="outlined" 
                    color="primary" 
                    onClick={addGuest}
                    sx={{ borderRadius: '50%' }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Stack spacing={2}>
                  {guests.map((guest, index) => (
                    <Grid container spacing={2} key={index} alignItems="end">
                      <Grid xs={12} md={5}>
                        <InputField
                          field={`guests.${index}.name`}
                          label="Nome"
                          placeholder="Digite o nome completo"
                          required={false}
                        />
                      </Grid>
                      <Grid xs={12} md={3}>
                        <InputField
                          field={`guests.${index}.birthDate`}
                          label="Data de Nascimento"
                          type="date"
                          required={false}
                        />
                      </Grid>
                      <Grid xs={12} md={3}>
                        <SelectField
                          label="Sexo"
                          field={`guests.${index}.gender`}
                          defaultValue="F"
                          options={[
                            { id: "M", name: "Masculino" },
                            { id: "F", name: "Feminino" }
                          ]}
                        />
                      </Grid>
                      <Grid xs={12} md={1}>
                        <IconButton
                          variant="outlined"
                          color="danger"
                          onClick={() => removeGuest(index)}
                          sx={{ borderRadius: '50%' }}
                        >
                          <Remove />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>

            {/* Botões de Ação */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={handleExit}
                disabled={loading}
              >
                Sair
              </Button>
              <Button
                type="submit"
                variant="solid"
                color="primary"
                loading={loading}
              >
                Salvar
              </Button>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default BookingForm;