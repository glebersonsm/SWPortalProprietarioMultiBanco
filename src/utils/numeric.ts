export const formatNumeric = (value: number) =>
  Intl.NumberFormat("pt-BR", { style: "decimal" }).format(
    value
  );
