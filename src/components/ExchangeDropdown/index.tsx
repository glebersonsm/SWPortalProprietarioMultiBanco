import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  SwapHoriz as SwapIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

interface ExchangeDropdownProps {
  appointmentId: string;
  bookingId: string;
  initialDate: string;
  finalDate: string;
  capacity: number;
  idIntercambiadora: string;
  ownershipName: string;
  pessoaTitular1Tipo: string;
  documentOwnership: string;
  coteId: number;
  roomCondominiumId: number;
  hasSCPContract: boolean;
  onWeekExchange: (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => void;
  onUsageTypeExchange: (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => void;
  tooltip?: string;
}

export default function ExchangeDropdown({
  appointmentId,
  bookingId,
  initialDate,
  finalDate,
  capacity,
  idIntercambiadora,
  ownershipName,
  pessoaTitular1Tipo,
  documentOwnership,
  coteId,
  roomCondominiumId,
  hasSCPContract,
  onWeekExchange,
  onUsageTypeExchange,
  tooltip = "Opções de troca",
}: ExchangeDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWeekExchange = () => {
    onWeekExchange(
      appointmentId,
      bookingId,
      initialDate,
      finalDate,
      capacity,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract
    );
    handleClose();
  };

  const handleUsageTypeExchange = () => {
    onUsageTypeExchange(
      appointmentId,
      bookingId,
      initialDate,
      finalDate,
      capacity,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract
    );
    handleClose();
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: 'var(--color-button-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-button-primary-hover)',
              color: 'white',
            },
          }}
        >
          <CalendarIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleWeekExchange}>
          <ListItemIcon>
            <CalendarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Trocar semana</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUsageTypeExchange}>
          <ListItemIcon>
            <SwapIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Trocar tipo de uso</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}