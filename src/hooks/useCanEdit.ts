import { useMemo } from "react";
import useUser from "./useUser";
import useNavigation from "./useNavigation";
import { usePathname } from "next/navigation";

/**
 * Hook para verificar se o usuário tem permissão para editar/criar/deletar em uma rota específica
 * @param segment - Segmento da rota (ex: "images", "users", "documents"). Se não fornecido, usa a rota atual
 * @returns true se o usuário tem permissão, false caso contrário
 */
export default function useCanEdit(segment?: string | null) {
  const { isAdm, userData } = useUser();
  const { DASHBOARD_ROUTES } = useNavigation();
  const pathname = usePathname();

  return useMemo(() => {
    // Administradores sempre podem editar
    if (isAdm) return true;

    // Se não há segmento fornecido, tenta extrair da rota atual
    let routeSegment = segment;
    if (!routeSegment && pathname) {
      // Extrai o segmento da rota atual (ex: /dashboard/images -> "images")
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length > 1 && pathParts[0] === "dashboard") {
        routeSegment = pathParts[1];
        // Para rotas aninhadas, pega apenas o primeiro segmento (ex: "finance" de "finance/transactions")
        if (routeSegment && routeSegment.includes('/')) {
          routeSegment = routeSegment.split('/')[0];
        }
      }
    }

    // Se ainda não tem segmento, retorna false
    if (!routeSegment) return false;

    // Type guard: garante que routeSegment é string
    const segmentToCheck: string = routeSegment;

    // Verifica se a rota está disponível nas rotas do usuário
    // Isso significa que a rota não está restrita para OperadorSistema
    const route = DASHBOARD_ROUTES.find((r) => {
      if (!r.segment) return false;
      
      // Verifica correspondência exata
      if (r.segment === segmentToCheck) return true;
      
      // Verifica se o segmento fornecido é pai da rota (ex: "finance" para "finance/transactions")
      if (r.segment.startsWith(segmentToCheck + '/')) return true;
      
      // Verifica se a rota é pai do segmento fornecido (ex: "finance" para "finance/transactions")
      if (segmentToCheck.startsWith(r.segment + '/')) return true;
      
      // Verifica se o segmento está em submenus (ex: "settings" dentro de "configuracoes")
      if (r.submenu && r.submenu.length > 0) {
        const foundInSubmenu = r.submenu.some((subItem) => {
          if (!subItem.segment) return false;
          
          // Verifica correspondência exata no submenu
          if (subItem.segment === segmentToCheck) return true;
          
          // Verifica se o segmento fornecido é pai da rota do submenu
          if (subItem.segment.startsWith(segmentToCheck + '/')) return true;
          
          // Verifica se a rota do submenu é pai do segmento fornecido
          if (segmentToCheck.startsWith(subItem.segment + '/')) return true;
          
          return false;
        });
        
        if (foundInSubmenu) return true;
      }
      
      return false;
    });

    return !!route;
  }, [isAdm, DASHBOARD_ROUTES, segment, pathname]);
}

