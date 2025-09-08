"use client";

import { FormControl, Grid } from "@mui/joy";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/user-reservesMultiOwnership";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Tab, Tabs } from "@mui/material";
import { useFilters } from "../../Filters.context.hook";

const FILTERS_STORAGE_KEY = "users_multiownership_appointment_filters";

export function AppointmentYearFilters() {
  const { filters, setFilters, years } = useFilters();

  return (
    <Tabs
      value={filters.year}
      onChange={(_, newYear) => setFilters({ ...filters, year: newYear })}
      centered
      TabIndicatorProps={{
        children: <span className="indicator-spacer" />,
      }}
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
        },
        "& .indicator-spacer": {
          width: {
            xs: "80%",
            sm: "90%",
            md: "100%",
          },
          height: 3,
          backgroundColor: "var(--color-button-primary)",
          clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          borderRadius: "1.5px",
        },
        "& .MuiTab-root": {
          mx: { xs: 1, sm: 2, md: 3 },
          color: "#000000",
          "&.Mui-selected": {
            color: "var(--color-button-primary)",
          },
        },
      }}
    >
      {years.map((year) => {
        const isSelected = filters.year === String(year);
        return (
          <Tab
            key={year}
            value={String(year)}
            label={year}
            sx={{
              fontWeight: isSelected ? "bold" : "normal",
              fontSize: isSelected ? 24 : 14,
              minWidth: { xs: 80, sm: 120, md: 140 },
            }}
          />
        );
      })}
    </Tabs>
  );
}