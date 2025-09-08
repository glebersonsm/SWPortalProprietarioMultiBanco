import { addDays, format, parse } from "date-fns";

export const formatDate = (date?: string, specificFormat = "dd/MM/yyyy", addDaysParam = 0) => {
  if (!date) {
    return "";
  }

  // Se a data está no formato YYYY-MM-DD, criar Date sem timezone
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = addDays(new Date(year, month -1, day), addDaysParam); // month é 0-indexed
    return format(parsedDate, specificFormat);
  }

  // Se a data está no formato ISO com timezone Z (YYYY-MM-DDTHH:mm:ssZ), extrair apenas a parte da data
  if (/^\d{4}-\d{2}-\d{2}T.*Z$/.test(date)) {
    const dateOnly = date.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    const parsedDate = addDays(new Date(Date.UTC(year, month - 1, day)),1); // month é 0-indexed
    return format(parsedDate, specificFormat);
  }

  // Para outros formatos, usar o comportamento original
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  return format(parsedDate, specificFormat);
};

export function formatWithSaturdayFormCheck(dateStr?: string, formatStr: string = "dd/MM/yyyy") {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return "";
  const date = new Date(dateStr);
  const adjustedDate = date.getDay() === 5 ? addDays(date, 1) : date;
  return format(adjustedDate, formatStr); // usando `format` do date-fns
}

export function isDateBeforeToday(dateStr?: string, formatStr: string = "dd/MM/yyyy"): boolean {
  if (!dateStr) return false;

  try {
    const compareDate = parse(dateStr, formatStr, new Date());
    const today = new Date();
    // Zera hora para comparar apenas a data
    compareDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return compareDate <= today;
  } catch (error) {
    console.log(error);
    return false;
  }
}