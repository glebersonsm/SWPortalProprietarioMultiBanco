"use client";

import React from "react";
import { Button } from "@mui/joy";
import { SxProps } from "@mui/material";

type ButtonOpenModalProps = {
  type: string;
  text?: string;
  params?: Record<string, string | number | any>;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps;
};

export default function ButtonOpenModal({
  type,
  text,
  startIcon,
  params,
  disabled = false,
  sx = {},
}: ButtonOpenModalProps) {
  return (
    <Button
      sx={{...sx, transition: "0.6s",}}
      onClick={(e) => {
        const newSearchParams = new URLSearchParams();
        newSearchParams.set("action", type);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            newSearchParams.set(key, value.toString());
          });
        }

        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
        e.stopPropagation();
      }}
      startDecorator={startIcon}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
