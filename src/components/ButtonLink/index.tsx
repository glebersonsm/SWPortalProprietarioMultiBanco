import React from "react";
import Link from "../Link";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { match } from "ts-pattern";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, IconButton, Tooltip } from "@mui/joy";
import { SxProps } from "@mui/system";
import { EditCalendar } from "@mui/icons-material";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

type ButtonLinkProps = {
  href: string;
  type: string;
  tooltip?: string;
  asButton?: boolean;
  asIconButton?: boolean;
  buttonText?: string;
  showToolTipWhenAsButton?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  isSolid?: boolean;
  handleOnClick?: VoidFunction;
  sxoverride?: SxProps;
  colorIcon?: string;
};

export default function ButtonLink({
  href,
  type,
  tooltip,
  icon,
  handleOnClick,
  asButton = false,
  asIconButton = false,
  buttonText = "Button text",
  showToolTipWhenAsButton = false,
  showIcon = true,
  isSolid = true,
  sxoverride = {},
  colorIcon,
}: ButtonLinkProps) {
  const getIcon = () =>
    match({ type })
      .with({ type: "add" }, () => <AddCircleOutlineIcon />)
      .with({ type: "edit" }, () => <EditIcon />)
      .with({ type: "delete" }, () => <DeleteIcon />)
      .with({ type: "history" }, () => <HistoryIcon />)
      .with({ type: "show" }, () => <VisibilityIcon />)
      .with({ type: "reset" }, () => <RestartAltIcon />)
      .with({ type: "calendar" }, () => <EditCalendar />)
      .with({ type: "cancel" }, () => <CancelIcon />)
      .with({ type: "baixar" }, () => <DownloadForOfflineIcon />)
      .otherwise(() => icon);

  if (asButton) {
    return (
      <Tooltip title={showToolTipWhenAsButton ? tooltip : null}>
        <Button
          variant={isSolid ? "solid" : "outlined"}
          onClick={() => {
            if (handleOnClick !== undefined) handleOnClick();
          }}
          startDecorator={showIcon ? getIcon() : null}
          sx={sxoverride}
        >
          {buttonText || "Abrir"}
        </Button>
      </Tooltip>
    );
  }

  if (asIconButton) {
    return (
      <Tooltip title={tooltip}>
        <IconButton
          onClick={() => {
            if (handleOnClick !== undefined) handleOnClick();
          }}
          size="sm"
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Link href={href} sx={sxoverride} color="neutral" tooltip={tooltip}>
      <IconButton size="sm" sx={{ color: colorIcon }}>
        {getIcon()}
      </IconButton>
    </Link>
  );
}
