import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { match } from "ts-pattern";
import useUser from "./useUser";
import EmailIcon from "@mui/icons-material/Email";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Person4Icon from "@mui/icons-material/Person4";
import AccountTree from "@mui/icons-material/AccountTree";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import { RouteProps } from "@/utils/types/routes";
import BookIcon from "@mui/icons-material/Book";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Apartment, Person2 } from "@mui/icons-material";

export default function useNavigation() {
  const {
    userData,
    isAdm,
    gestorReservasAgendamentos,
    integratedWithTimeSharing,
    gestorFinanceiro,
  } = useUser();

  const FIXED_DASHBOARD_ROUTES: RouteProps[] = [
    {
      name: "Home",
      icon: HomeRoundedIcon,
      path: `/dashboard`,
      segment: null,
    },
    {
      name: "Documentos",
      icon: InventoryIcon,
      path: `/dashboard/documents`,
      segment: "documents",
    },
  ];

  // const ADM_MULTIOWNERSHIP_DASHBOARD_ROUTES: RouteProps[] = [
  //   {
  //     name: "Multipropriedade",
  //     icon: AccountTree,
  //     path: `/dashboard/multiownership`,
  //     segment: "multiownership",
  //     submenu: [
  //       {
  //         name: "Imóveis",
  //         icon: Apartment,
  //         path: `/dashboard/multiownership/properties`,
  //         segment: "multiownership/properties",
  //       },
  //       {
  //         name: "Clientes",
  //         icon: Person4Icon,
  //         path: `/dashboard/multiownership/owners`,
  //         segment: "multiownership/owners",
  //       },
  //       {
  //         name: "Agendamentos",
  //         icon: BookIcon,
  //         path: `/dashboard/multiownership/appointments`,
  //         segment: "multiownership/appointments",
  //       },
  //     ],
  //   },
  // ];

  // const ADM_TIMESHARING_DASHBOARD_ROUTES: RouteProps[] = [
  //   {
  //     name: "Time Sharing",
  //     icon: ScreenShareIcon,
  //     path: `/dashboard/time-sharing`,
  //     segment: "time-sharing",
  //     submenu: [
  //       {
  //         name: "Contratos",
  //         icon: MenuBookIcon,
  //         path: `/dashboard/time-sharing/contracts`,
  //         segment: "time-sharing/contracts",
  //       },
  //       {
  //         name: "Reservas",
  //         icon: BookmarkAddedIcon,
  //         path: `/dashboard/time-sharing/reserves-written-off`,
  //         segment: "time-sharing/reserves-written-off",
  //       },
  //       // {
  //       //   name: "Reservas",
  //       //   icon: BookIcon,
  //       //   path: `/dashboard/time-sharing/reserves`,
  //       //   segment: "time-sharing/reserves",
  //       // },
  //     ],
  //   },
  // ];

  const ADM_DASHBOARD_ROUTES: RouteProps[] = [
    {
      name: "E-mails",
      icon: EmailIcon,
      path: `/dashboard/emails`,
      segment: "emails",
    },
    {
      name: "Usuários",
      icon: GroupIcon,
      path: `/dashboard/users`,
      segment: "users",
    },
  ];

  const USER_DASHBOARD_ROUTES: RouteProps[] = [
    {
      name: "Meus dados de usuário",
      icon: PersonIcon,
      path: `/dashboard/users/${userData?.id}/edit`,
      segment: "users",
    },
  ];

  const USER_DASHBOARD_MULTIOWNERSHIP_ROUTES: RouteProps[] = [
    // {
    //   name: "Meus contratos",
    //   icon: MenuBookIcon,
    //   path: `/dashboard/user-multiownership-contracts`,
    //   segment: "user-multiownership-contracts",
    // },
    // {
    //   name: "Meus agendamentos",
    //   icon: BookIcon,
    //   path: `/dashboard/user-multiownership-appointment`,
    //   segment: "user-multiownership-appointment",
    // },
  ];

  const USER_DASHBOARD_TIMESHARING_ROUTES: RouteProps[] = [
    {
      name: "Meus contratos",
      icon: MenuBookIcon,
      path: `/dashboard/user-time-sharing-contracts`,
      segment: "user-time-sharing-contracts",
    },
    {
      name: "Minhas reservas",
      icon: BookmarkAddedIcon,
      path: `/dashboard/user-time-sharing-reserves`,
      segment: "user-time-sharing-reserves",
    },
  ];

  const DASHBOARD_ROUTES: RouteProps[] = [
    ...FIXED_DASHBOARD_ROUTES,

    ...(isAdm ||
    gestorFinanceiro === 1 ||
    (!isAdm && gestorFinanceiro !== 1 && gestorReservasAgendamentos !== 1)
      ? [
          {
            name: "Finanças",
            icon: AttachMoneyIcon,
            path: `/dashboard/finance`,
            segment: "finance",
          },
        ]
      : []),

    ... [
          {
            name: "Galeria de imagens",
            icon: PhotoLibraryOutlinedIcon,
            path: `/dashboard/images`,
            segment: "images",
          },
        ],

    ...((!isAdm && gestorReservasAgendamentos !== 1 && gestorFinanceiro !== 1) && 
        (integratedWithTimeSharing === undefined || integratedWithTimeSharing === false)
      ? USER_DASHBOARD_MULTIOWNERSHIP_ROUTES
      : []),
    ...((!isAdm && !gestorReservasAgendamentos && !gestorFinanceiro) &&
       integratedWithTimeSharing
      ? USER_DASHBOARD_TIMESHARING_ROUTES
      : []),

    // ...((isAdm || gestorReservasAgendamentos || gestorFinanceiro) &&
    //     integratedWithTimeSharing ? ADM_TIMESHARING_DASHBOARD_ROUTES : []),
    // ...((isAdm || gestorReservasAgendamentos === 1) && 
    //     (integratedWithTimeSharing === undefined || integratedWithTimeSharing === false)
    //   ? ADM_MULTIOWNERSHIP_DASHBOARD_ROUTES
    //   : []),
    ...(isAdm ? ADM_DASHBOARD_ROUTES : USER_DASHBOARD_ROUTES),

    {
      name: "Perguntas e Respostas",
      icon: ImportContactsIcon,
      path: `/dashboard/faqs`,
      segment: "faqs",
    },
  ];

  const translateNameSegment = (name: string | null): string => {
    return match(name)
      .with("add", () => "Adicionar")
      .with("edit", () => "Editar")
      .with("outstanding-accounts", () => "Contas à receber")
      .with("user-outstanding-accounts", () => "Minhas contas")
      .with("tokenized-cards", () => "Cartões tokenizados")
      .with("user-tokenized-cards", () => "Cartões tokenizados do usuário")
      .with("transactions", () => "Transações")
      .with("change-password", () => "Alterar senha")
      .with("settings", () => "Configurações")
      .with("contracts", () => "Contratos")
      .with("user-time-sharing", () => "Time Sharing do Usuário")
      .with("reserves", () => "Reservas")
      .with("properties", () => "Imóveis")
      .with("user-multiownership-contracts", () => "Meus contratos")
      .with("user-multiownership-reserves", () => "Minhas reservas")
      .with("reserves-written-off", () => "Reservas")
      .with("owners", () => "Clientes")
      .with("bookings", () => "Reservas")
      .with("appointments", () => "Agendamentos")
      .with("reserve-exchange", () => "Trocar a semana")
      .with("reservar", () => "Reservar")
      .with("select-periodo", () => "Reservar")
      .with("user-multiownership-appointment", () => "Agendamentos")
      .with("ListAppointments", () => "Agendamentos")
      .with("ListAppointmentsAdmView", () => "Visão padrão cliente")
      .with("user-time-sharing-contracts", () => "Meus contratos")

      .otherwise(() => name ?? "");
  };

  const getCurrentRoute = (segment: string | null) =>
    DASHBOARD_ROUTES.find((route) => route.segment === segment) ?? {
      name: translateNameSegment(segment),
      path: "#",
    };

  return { DASHBOARD_ROUTES, getCurrentRoute, userData };
}
