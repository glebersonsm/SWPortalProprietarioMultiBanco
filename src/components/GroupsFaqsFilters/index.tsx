import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "@/app/(authenticated)/dashboard/faqs/constants";
import { FiltersProps } from "@/utils/types/faqs";

type GroupsFaqsFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function GroupsFaqsFilters({
  filters,
  setFilters,
}: GroupsFaqsFiltersProps) {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12} sm={5}>
        <FormControl>
          <FormLabel
            sx={{
              color: "var(--faq-filter-label-color)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
            }}
          >
            Pergunta
          </FormLabel>

          <Input
            placeholder="Filtrar por texto da pergunta"
            startDecorator={<SearchIcon />}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              color: "text.primary",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.6,
              },
              "&:hover": {
                borderColor: "primary.500",
              },
              "&.Mui-focused": {
                borderColor: "primary.500",
                boxShadow: "0 0 0 2px var(--card-shadow-color, rgba(44, 162, 204, 0.2))",
              },
              "&.Mui-error": {
                borderColor: "danger.500",
              },
            }}
            value={filters.textQuestion}
            onChange={(e) =>
              setFilters({ ...filters, textQuestion: e.target.value })
            }
          />
        </FormControl>
      </Grid>

      <Grid xs={12} sm={5}>
        <FormControl>
          <FormLabel
            sx={{
              color: "var(--faq-filter-label-color)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
            }}
          >
            Resposta
          </FormLabel>

          <Input
            placeholder="Filtrar por texto da resposta"
            startDecorator={<SearchIcon />}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              color: "text.primary",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.6,
              },
              "&:hover": {
                borderColor: "primary.500",
              },
              "&.Mui-focused": {
                borderColor: "primary.500",
                boxShadow: "0 0 0 2px var(--card-shadow-color, rgba(44, 162, 204, 0.2))",
              },
              "&.Mui-error": {
                borderColor: "danger.500",
              },
            }}
            value={filters.textResponse}
            onChange={(e) =>
              setFilters({ ...filters, textResponse: e.target.value })
            }
          />
        </FormControl>
      </Grid>

      <Grid xs={12} sm={2} sx={{ marginTop: "auto" }}>
        <Button
          sx={{
            width: "100%",
            backgroundColor: "var(--color-button-primary)",
            color: "var(--color-button-text)",
            fontFamily: "Montserrat, sans-serif",
            border: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--color-button-primary-hover)",
            },
          }}
          variant="outlined"
          endDecorator={<DeleteIcon />}
          onClick={() => setFilters(initialFilters)}
        >
          Limpar Filtros
        </Button>
      </Grid>
    </Grid>
  );
}
