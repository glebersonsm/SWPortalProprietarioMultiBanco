"use client";

import React from "react";
import { useRouter } from "next/navigation";
import JoyLink, { LinkProps } from "@mui/joy/Link";
import { Tooltip } from "@mui/joy";

type TLinkProps = {
  href: string;
  tooltip?: string;
} & LinkProps;

const Link: React.FC<TLinkProps> = ({ href, tooltip, ...props }) => {
  const router = useRouter();

  return (
    <Tooltip title={tooltip}>
      <JoyLink
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(href);
        }}
        {...props}
      />
    </Tooltip>
  );
};

export default Link;
