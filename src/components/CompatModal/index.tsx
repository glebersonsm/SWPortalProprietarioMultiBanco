"use client";
import * as React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/joy/Box";

// Compat wrappers to replace @mui/joy Modal APIs and avoid React 19 ref warnings.

export type ModalProps = DialogProps;

export function Modal(props: ModalProps) {
  const { children, ...dialogProps } = props;
  return <Dialog {...dialogProps}>{children}</Dialog>;
}

type ContainerProps = React.PropsWithChildren<{
  sx?: any;
  [key: string]: any;
}>;

export function ModalDialog({ children, sx, ...rest }: ContainerProps) {
  // Acts as a simple container inside Material Dialog; move layout styles here.
  return (
    <Box sx={sx} {...rest}>
      {children}
    </Box>
  );
}

export function ModalOverflow({ children, sx, ...rest }: ContainerProps) {
  // Provides scrollable area similar to Joy's ModalOverflow.
  return (
    <Box sx={{ 
      maxHeight: "95vh", 
      overflow: "auto", 
      display: "flex",
      flexDirection: "column",
      width: "100%",
      ...sx 
    }} {...rest}>
      {children}
    </Box>
  );
}

export { DialogTitle, DialogContent, DialogActions };

