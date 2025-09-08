import { SvgIconProps } from "@mui/material";
import { ComponentType } from "react";

export type SubmenuProps = {
  name: string;
  icon: ComponentType<SvgIconProps>;
  path: string;
  segment: string;
};

export type RouteProps = {
  name: string;
  icon: ComponentType<SvgIconProps>;
  path: string;
  segment: string | null;
  submenu?: SubmenuProps[];
  isShow?: boolean
};
