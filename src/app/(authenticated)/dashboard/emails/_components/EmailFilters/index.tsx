"use client";

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
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/emails";

const FILTERS_STORAGE_KEY = "emails_filters";
const ALL_FILTERS_VISIBLE = "emails_filters_all_visible";
const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

type EmailFilterProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function EmailFilters({
  filters,
  setFilters,
}: EmailFilterProps) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [isFiltersLoaded, setIsFiltersLoaded] = React.useState(false);

  const handleChangeSent = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    newValue: string | null
  ) => {
    setFilters({ ...filters, sent: newValue });
  };

  React.useEffect(() => {
    const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";
    const savedAllFiltersVisible = thereIsLocalStorage ? localStorage.getItem(ALL_FILTERS_VISIBLE) : "";
    if (savedAllFiltersVisible === "true") {
      setShowFilters(true);
    }

    if (savedFilters && savedFilters.length > 0) {
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

    setIsFiltersLoaded(true);
  }, [setFilters]);

  React.useEffect(() => {
    if (isFiltersLoaded && thereIsLocalStorage) {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters, isFiltersLoaded]);

  React.useEffect(() => {
    if (thereIsLocalStorage)
      localStorage.setItem(ALL_FILTERS_VISIBLE, showFilters.toString());
  }, [showFilters]);

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
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              ID
            </FormLabel>
            <Input
              placeholder="Filtrar por ID"
              value={filters.id}
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
              sx={{
                borderRadius: 16,
                minHeight: '48px',
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                border: '1.5px solid',
                borderColor: 'neutral.300',
                backgroundColor: 'background.surface',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.400',
                  backgroundColor: 'background.level1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                '&:focus-within': {
                  borderColor: 'primary.500',
                  backgroundColor: 'background.surface',
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                  transform: 'translateY(-1px)',
                },
                '&.Joy-focused': {
                  borderColor: 'primary.500',
                  backgroundColor: 'background.surface',
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                },
              }}
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
              Destinatário
            </FormLabel>
            <Input
              placeholder="Filtrar por destinatário"
              value={filters.recipient}
              onChange={(e) =>
                setFilters({ ...filters, recipient: e.target.value })
              }
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
          {/* Botão Limpar Filtros */}
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
                    Data inicial
                  </FormLabel>
                  <Input
                    type="date"
                    value={filters.initialCreationDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        initialCreationDate: e.target.value,
                      })
                    }
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'neutral.200',
                      backgroundColor: 'background.surface',
                      transition: 'all 0.3s ease',
                      minHeight: '40px',
                      "&:hover": {
                        borderColor: "primary.300",
                        backgroundColor: 'rgba(44, 162, 204, 0.02)',
                      },
                      "&.Mui-focused": {
                        borderColor: "primary.400",
                        backgroundColor: 'background.surface',
                        boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1)",
                      },
                    }}
                  />
              </FormControl>
            </Grid>
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
                    Data final
                  </FormLabel>
                  <Input
                    type="date"
                    value={filters.finalCreationDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        finalCreationDate: e.target.value,
                      })
                    }
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'neutral.200',
                      backgroundColor: 'background.surface',
                      transition: 'all 0.3s ease',
                      minHeight: '40px',
                      "&:hover": {
                        borderColor: "primary.300",
                        backgroundColor: 'rgba(44, 162, 204, 0.02)',
                      },
                      "&.Mui-focused": {
                        borderColor: "primary.400",
                        backgroundColor: 'background.surface',
                        boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1)",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel
                  sx={{
                    color: "primary.solidHoverBg",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Assunto
                </FormLabel>
                <Input
                  placeholder="Filtrar por assunto"
                  value={filters.subject}
                  onChange={(e) =>
                    setFilters({ ...filters, subject: e.target.value })
                  }
                  sx={{
                    borderRadius: 16,
                    minHeight: '48px',
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    border: '1.5px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.400',
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:focus-within': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                      transform: 'translateY(-1px)',
                    },
                    '&.Joy-focused': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={2}>
              <FormControl>
                <FormLabel
                  sx={{
                    color: "primary.solidHoverBg",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Data inicial de envio
                </FormLabel>
                <Input
                  type="date"
                  value={filters.initialShippingDate}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      initialShippingDate: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 16,
                    minHeight: '48px',
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    border: '1.5px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.400',
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:focus-within': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                      transform: 'translateY(-1px)',
                    },
                    '&.Joy-focused': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={2}>
              <FormControl>
                <FormLabel
                  sx={{
                    color: "primary.solidHoverBg",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Data final de envio
                </FormLabel>
                <Input
                  type="date"
                  value={filters.finalShippingDate}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      finalShippingDate: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 16,
                    minHeight: '48px',
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    border: '1.5px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.400',
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:focus-within': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                      transform: 'translateY(-1px)',
                    },
                    '&.Joy-focused': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel
                  sx={{
                    color: "primary.solidHoverBg",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Status
                </FormLabel>
                <Select 
                  value={filters.sent} 
                  onChange={handleChangeSent}
                  sx={{
                    borderRadius: 16,
                    minHeight: '48px',
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    border: '1.5px solid',
                    borderColor: 'neutral.300',
                    backgroundColor: 'background.surface',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.400',
                      backgroundColor: 'background.level1',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:focus-within': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                      transform: 'translateY(-1px)',
                    },
                    '&.Joy-focused': {
                      borderColor: 'primary.500',
                      backgroundColor: 'background.surface',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                    },
                  }}
                >
                  <Option value="sent">Enviado</Option>
                  <Option value="notSent">Não enviado</Option>
                  <Option value="default">Selecione</Option>
                </Select>
              </FormControl>
            </Grid>
            </Grid>
          </Box>
        )}
      </Grid>
      
      {/* Seção de Botões de Ação */}
      <Box sx={{ 
        mt: { xs: 3, md: 4 }, 
        pt: { xs: 2, md: 3 }, 
        borderTop: '1px solid', 
        borderColor: 'divider' 
      }}>
        <Box sx={{ 
           display: 'flex', 
           flexDirection: { xs: 'column', sm: 'row' },
           alignItems: 'center',
           justifyContent: 'center',
           gap: 2
         }}>
          {/* Botão Limpar Filtros */}
          <Button
            variant="outlined"
            color="danger"
            endDecorator={<DeleteIcon />}
            onClick={() => {
              if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
              setFilters(initialFilters);
            }}
            sx={{
              width: "20%",
              bgcolor: "var(--users-button-clear-bg)",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              border:"none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "var(--users-button-clear-hover)",
              },
            }}
          >
            Limpar Filtros
          </Button>

          {/* Botão Mostrar/Ocultar Filtros Avançados */}
          <Button
            variant="soft"
            color="primary"
            onClick={() => setShowFilters(!showFilters)}
            startDecorator={
              showFilters 
                ? <SearchIcon sx={{ fontSize: '1.1rem' }} /> 
                : <FilterListIcon sx={{ fontSize: '1.1rem' }} />
            }
            sx={{
              borderRadius: 24,
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1rem' },
              textTransform: 'none',
              minWidth: { xs: '220px', sm: 'auto' },
              position: 'relative',
              overflow: 'hidden',
              color: 'white',
              border: 'none',
              
              // Gradientes dinâmicos
              background: showFilters 
                ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                : 'linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)',
              
              // Sombras dinâmicas
              boxShadow: showFilters 
                ? '0 6px 16px rgba(244, 67, 54, 0.3)'
                : '0 6px 16px rgba(44, 162, 204, 0.3)',
              
              // Transições suaves
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              
              // Efeito de brilho
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
              
              // Estados de hover
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
              
              // Estados de active
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
      </Box>
      </CardContent>
      </Card>
    </>
  );
}
