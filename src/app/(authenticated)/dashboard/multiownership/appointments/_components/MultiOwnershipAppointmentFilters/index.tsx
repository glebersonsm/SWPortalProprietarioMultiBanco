import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/joy";
import * as React from "react";
import { initialFilters } from "../../constants";
import FilterByDateInput from "@/components/FilterByDateInput";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";
import { FiltersProps } from "@/utils/types/multiownership/appointments";

type MultiOwnershipAppointmentFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  handleSearch: () => void;
};

const FILTERS_STORAGE_KEY = "multiownership_filters";
const ALL_FILTERS_VISIBLE = "multiownership_filters_all_visible";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function MultiOwnershipAppointmentFilters({
  filters,
  setFilters,
  handleSearch,
}: MultiOwnershipAppointmentFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";
    const savedAllFiltersVisible = thereIsLocalStorage ? localStorage.getItem(ALL_FILTERS_VISIBLE) : "";

    if (savedAllFiltersVisible === "true") {
      setShowFilters(true);
    }

    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        if (
          parsedFilters &&
          JSON.stringify(parsedFilters) !== JSON.stringify(initialFilters)
        ) {
          setFilters(parsedFilters);
        }
      } catch (error) {
        setFilters(initialFilters);
      }
    } else {
      setFilters(initialFilters);
    }
  }, [setFilters]);

  React.useEffect(() => {
    if (filters !== initialFilters) {
      handleSearchWithSave();
    }
  });

  const handleSearchWithSave = () => {
    if (thereIsLocalStorage) {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      localStorage.setItem(ALL_FILTERS_VISIBLE, showFilters.toString());
    }
    handleSearch();
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: { xs: 12, md: 16 },
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
          overflow: 'visible',
          transition: 'all 0.3s ease-in-out',
          mx: { xs: 1, sm: 0 },
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <FilterListIcon sx={{ mr: { xs: 0, sm: 1.5 }, mb: { xs: 1, sm: 0 }, color: 'primary.500', fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
            <Typography
              level="h4"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Filtros de Pesquisa
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel
                    sx={{
                      color: "primary.700",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
              ID do Período
            </FormLabel>
            <Input
              type="number"
              placeholder="Digite o ID..."
              value={filters.periodCoteAvailabilityId}
              sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  borderRadius: 16,
                  border: '1px solid',
                  borderColor: 'neutral.200',
                  backgroundColor: 'background.surface',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '48px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  "&::placeholder": {
                    color: "text.tertiary",
                    opacity: 0.6,
                  },
                  "&:hover": {
                    borderColor: "primary.300",
                    backgroundColor: 'rgba(44, 162, 204, 0.02)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(44, 162, 204, 0.12)',
                  },
                  "&.Mui-focused": {
                    borderColor: "primary.400",
                    backgroundColor: 'background.surface',
                    boxShadow: "0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)",
                    transform: 'translateY(-2px)',
                  },
                  "&.Mui-error": {
                    borderColor: "danger.300",
                    boxShadow: "0 0 0 4px rgba(220, 53, 69, 0.08)",
                  },
                }}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  periodCoteAvailabilityId: e.target.value,
                })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={4} sm={4}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.700",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Número da Reserva
            </FormLabel>
            <Input
              placeholder="Digite o número da reserva..."
              value={filters.reserveNumber}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                fontSize: '0.9rem',
                borderRadius: 16,
                border: '1px solid',
                borderColor: 'neutral.200',
                backgroundColor: 'background.surface',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '48px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                "&::placeholder": {
                  color: "text.tertiary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "primary.300",
                  backgroundColor: 'rgba(44, 162, 204, 0.02)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(44, 162, 204, 0.12)',
                },
                "&.Mui-focused": {
                  borderColor: "primary.400",
                  backgroundColor: 'background.surface',
                  boxShadow: "0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)",
                  transform: 'translateY(-2px)',
                },
                "&.Mui-error": {
                  borderColor: "danger.300",
                  boxShadow: "0 0 0 4px rgba(220, 53, 69, 0.08)",
                },
              }}
              onChange={(e) =>
                setFilters({ ...filters, reserveNumber: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={4} sm={4}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.700",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Nome do Cliente
            </FormLabel>
            <Input
              placeholder="Digite o nome do cliente..."
              value={filters.clientName}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                fontSize: '0.9rem',
                borderRadius: 16,
                border: '1px solid',
                borderColor: 'neutral.200',
                backgroundColor: 'background.surface',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '48px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                "&::placeholder": {
                  color: "text.tertiary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "primary.300",
                  backgroundColor: 'rgba(44, 162, 204, 0.02)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(44, 162, 204, 0.12)',
                },
                "&.Mui-focused": {
                  borderColor: "primary.400",
                  backgroundColor: 'background.surface',
                  boxShadow: "0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)",
                  transform: 'translateY(-2px)',
                },
                "&.Mui-error": {
                  borderColor: "danger.300",
                  boxShadow: "0 0 0 4px rgba(220, 53, 69, 0.08)",
                },
              }}
              onChange={(e) =>
                setFilters({ ...filters, clientName: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        {showFilters && (
          <Box sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: '2px solid', 
            borderColor: 'primary.200',
            borderRadius: '0 0 16px 16px',
            background: 'linear-gradient(135deg, rgba(44, 162, 204, 0.02) 0%, rgba(44, 162, 204, 0.05) 100%)',
            position: 'relative',
            animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideDown': {
              from: { 
                opacity: 0, 
                transform: 'translateY(-20px) scale(0.98)',
                maxHeight: 0
              },
              to: { 
                opacity: 1, 
                transform: 'translateY(0) scale(1)',
                maxHeight: '500px'
              }
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              backgroundColor: 'primary.300',
              borderRadius: '2px'
            }
          }}>
            <Typography 
              level="title-md" 
              sx={{ 
                mb: 3, 
                color: 'primary.600',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                textAlign: 'center',
                fontSize: '1rem'
              }}
            >
              Filtros Avançados
            </Typography>
            <Grid container spacing={{ xs: 3, sm: 3, md: 4 }} sx={{ px: 2 }}>
              <Grid xs={12} sm={6} md={4}>
                <FormControl>
                <FormLabel
                  sx={{
                    color: "text.primary",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    mb: 1,
                  }}
                >
                  Nome da Cota
                </FormLabel>
                <Input
                  placeholder="Digite o nome da cota..."
                  value={filters.ownershipCoteName}
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    "&::placeholder": {
                      color: "text.tertiary",
                      opacity: 0.7,
                    },
                    "&:hover": {
                      borderColor: "primary.400",
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(44, 162, 204, 0.15)',
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.500",
                      backgroundColor: 'background.surface',
                      boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1), 0 4px 12px rgba(44, 162, 204, 0.15)",
                      transform: 'translateY(-1px)',
                    },
                    "&.Mui-error": {
                      borderColor: "danger.400",
                      boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
                    },
                  }}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      ownershipCoteName: e.target.value,
                    })
                  }
                />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={4}>
                <FilterByDateInput
                  label="Data inicial"
                  value={filters.intialDate}
                  colorLabel="primary.solidHoverBg"
                  onChange={(e) =>
                    setFilters({ ...filters, intialDate: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <FilterByDateInput
                  label="Data final"
                  value={filters.finalDate}
                  colorLabel="primary.solidHoverBg"
                  onChange={(e) =>
                    setFilters({ ...filters, finalDate: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <FormControl>
                <FormLabel
                  sx={{
                    color: "text.primary",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    mb: 1,
                  }}
                >
                  Número do Imóvel
                </FormLabel>
                <Input
                  placeholder="Digite o número do imóvel..."
                  value={filters.roomNumber}
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    "&::placeholder": {
                      color: "text.tertiary",
                      opacity: 0.7,
                    },
                    "&:hover": {
                      borderColor: "primary.400",
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(44, 162, 204, 0.15)',
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.500",
                      backgroundColor: 'background.surface',
                      boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1), 0 4px 12px rgba(44, 162, 204, 0.15)",
                      transform: 'translateY(-1px)',
                    },
                    "&.Mui-error": {
                      borderColor: "danger.400",
                      boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
                    },
                  }}
                  onChange={(e) =>
                    setFilters({ ...filters, roomNumber: e.target.value })
                  }
                />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={2}>
                <FormControl>
                <FormLabel
                  sx={{
                    color: "text.primary",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    mb: 1,
                  }}
                >
                  Ano
                </FormLabel>
                <Input
                  type="number"
                  placeholder="Digite o ano..."
                  value={filters.year}
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    "&::placeholder": {
                      color: "text.tertiary",
                      opacity: 0.7,
                    },
                    "&:hover": {
                      borderColor: "primary.400",
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(44, 162, 204, 0.15)',
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.500",
                      backgroundColor: 'background.surface',
                      boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1), 0 4px 12px rgba(44, 162, 204, 0.15)",
                      transform: 'translateY(-1px)',
                    },
                    "&.Mui-error": {
                      borderColor: "danger.400",
                      boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
                    },
                  }}
                  onChange={(e) =>
                    setFilters({ ...filters, year: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={2}>
              <FormControl>
                <FormLabel
                  sx={{
                    color: "text.primary",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    mb: 1,
                  }}
                >
                  Status da Reserva
                </FormLabel>
                <Select
                  placeholder="Selecione o status..."
                  value={filters.onlyWithReservation}
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    "&::placeholder": {
                      color: "text.tertiary",
                      opacity: 0.7,
                    },
                    "&:hover": {
                      borderColor: "primary.400",
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(44, 162, 204, 0.15)',
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.500",
                      backgroundColor: 'background.surface',
                      boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1), 0 4px 12px rgba(44, 162, 204, 0.15)",
                      transform: 'translateY(-1px)',
                    },
                    "&.Mui-error": {
                      borderColor: "danger.400",
                      boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
                    },
                  }}
                  onChange={(event, newValue) =>
                    setFilters({ ...filters, onlyWithReservation: newValue })
                  }
                >
                  <Option value={"S"}>Sim</Option>
                  <Option value={"N"}>Não</Option>
                  <Option value={null}>Não importa</Option>
                </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <SearchAndClearFilters
          handleSearch={handleSearchWithSave}
          handleClear={() => {
            setFilters(initialFilters);
            if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: 3, md: 4 }, 
          px: { xs: 1, sm: 0 },
          position: 'relative'
        }}>
          <Button
            variant="soft"
            color="primary"
            onClick={() => setShowFilters(!showFilters)}
            startDecorator={showFilters ? <SearchIcon sx={{ fontSize: '1.1rem' }} /> : <FilterListIcon sx={{ fontSize: '1.1rem' }} />}
            sx={{
              borderRadius: 24,
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1rem' },
              textTransform: 'none',
              background: showFilters 
                ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                : 'linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)',
              color: 'white',
              border: 'none',
              boxShadow: showFilters 
                ? '0 6px 16px rgba(244, 67, 54, 0.3)'
                : '0 6px 16px rgba(44, 162, 204, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: { xs: '220px', sm: 'auto' },
              position: 'relative',
              overflow: 'hidden',
              "&::before": {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.6s',
              },
              "&:hover": {
                background: showFilters 
                  ? 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: showFilters 
                  ? '0 12px 28px rgba(244, 67, 54, 0.4)'
                  : '0 12px 28px rgba(44, 162, 204, 0.4)',
                "&::before": {
                  left: '100%',
                },
              },
              "&:active": {
                transform: 'translateY(-1px) scale(1.01)',
                boxShadow: showFilters 
                  ? '0 6px 16px rgba(244, 67, 54, 0.3)'
                  : '0 6px 16px rgba(44, 162, 204, 0.3)',
              },
            }}
          >
            {showFilters ? "Ocultar Filtros Avançados" : "Mostrar Filtros Avançados"}
          </Button>
          </Box>
        </Grid>
        </CardContent>
      </Card>
    </>
  );
}
