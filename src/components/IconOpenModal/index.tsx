import React from "react";
import { IconButton, Tooltip, Button } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { match } from "ts-pattern";
import { SxProps } from "@mui/system";
import { EditCalendar } from "@mui/icons-material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

type IconOpenModalProps = {
  type:
    | "add"
    | "edit"
    | "cancel"
    | "delete"
    | "history"
    | "show"
    | "reset"
    | "calendar"
    | string;
  params: Record<string, string | number>;
  icon?: React.ReactNode;
  tooltip?: string;
  asButton?: boolean;
  showIcon?: boolean;
  buttonText?: string;
  showToolTipWhenAsButton?: boolean;
  sxoverride?: SxProps;
};

export default function IconOpenModal({
  type,
  params,
  icon,
  tooltip,
  asButton = false,
  buttonText,
  showIcon = false,
  showToolTipWhenAsButton = false,
  sxoverride = {},
}: IconOpenModalProps) {
  const handleClick = (e: React.MouseEvent) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("action", type);

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value.toString());
    });

    if (typeof window !== "undefined" && window.history) {
      window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    e.stopPropagation();
  };

  const getIcon = () =>
    match({ type })
      .with({ type: "add" }, () => <AddCircleOutlineIcon />)
      .with({ type: "edit" }, () => <EditIcon />)
      .with({ type: "delete" }, () => <DeleteIcon />)
      .with({ type: "history" }, () => <HistoryIcon />)
      .with({ type: "show" }, () => <VisibilityIcon />)
      .with({ type: "reset" }, () => <RestartAltIcon />)
      .with({ type: "cancel" }, () => <CancelIcon />)
      .with({ type: "calendar" }, () => <EditCalendar />)
      .with({ type: "baixar" }, () => <DownloadForOfflineIcon />)
      .otherwise(() => icon);

  if (asButton) {
    return (
      <Tooltip title={showToolTipWhenAsButton ? tooltip : null}>
        <Button
          onClick={handleClick}
          startDecorator={showIcon ? getIcon() : null}
          sx={{
            ...sxoverride,
            transition: "0.6s",
          }}
        >
          {buttonText || "Abrir"}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        sx={{
          ...sxoverride,
          transition: "0.6s",
        }}
        size="sm"
        onClick={handleClick}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
