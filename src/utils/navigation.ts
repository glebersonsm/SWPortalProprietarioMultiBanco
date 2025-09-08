import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { match } from "ts-pattern";

export const DASHBOARD_ROUTES = [
  {
    name: "Home",
    icon: HomeRoundedIcon,
    path: "/dashboard",
    segment: null,
  },
  {
    name: "Documentos",
    icon: InventoryIcon,
    path: "/dashboard/documents",
    segment: "documents",
  },
  {
    name: "Usuários",
    icon: GroupIcon,
    path: "/dashboard/users",
    segment: "users",
  },
  {
    name: "Perguntas e Respostas",
    icon: ImportContactsIcon,
    path: "/dashboard/faqs",
    segment: "faqs",
  },
] as const;

const translateNameSegment = (name: string | null): string => {
  return match(name)
    .with("add", () => "Adicionar")
    .with("edit", () => "Editar")
    .with("change-password", () => "Alterar senha")
    .otherwise(() => name ?? "");
};

export const getCurrentRoute = (segment: string | null) =>
  DASHBOARD_ROUTES.find((route) => route.segment === segment) ?? {
    name: translateNameSegment(segment),
    path: "#",
  };
