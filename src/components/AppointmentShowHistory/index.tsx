import React, { useState } from "react";
import { IconButton, Tooltip, Button } from "@mui/joy";
import HistoryIcon from "@mui/icons-material/History";
import { match } from "ts-pattern";
import { SxProps } from "@mui/system";
import { useAppointmentHistory } from "@/hooks/useAppointmentHistory";

type AppointmentShowHistoryModalProps = {
  type:
    | "history"
    | string;
  params: Record<string, string | number>;
  icon?: React.ReactNode;
  tooltip?: string;
  sxoverride?: SxProps;
};

export default function AppointmentShowHistoryModal({
  type,
  params,
  icon,
  tooltip,
  sxoverride = {},
}: AppointmentShowHistoryModalProps) {
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  const { history, loading, error } = useAppointmentHistory(appointmentId || 0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (type === "history" && params.appointmentId) {
      setAppointmentId(Number(params.appointmentId)); 
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("action", type);
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value.toString());
    });
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const getIcon = () =>
    match({ type })
      .with({ type: "history" }, () => <HistoryIcon />)
      .otherwise(() => icon);

  return (
    <Tooltip title={tooltip}>
      <IconButton
        sx={sxoverride}
        size="sm"
        onClick={handleClick}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
