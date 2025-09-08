import { getUser } from "@/services/api/user";
import { getFrameworkParams } from "@/services/querys/framework";
import { getAuthUser } from "@/utils/auth";
import { removeCookie } from "@/utils/cookies";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useUser({
  isSubmitted = true,
}: {
  isSubmitted?: boolean;
} = {}) {
  const queryClient = useQueryClient();

  const fetchUser = async () => {
    const usuarioIdRoles = await getAuthUser();

    if (usuarioIdRoles?.userId) {
      return { userData: await getUser(usuarioIdRoles.userId), usuarioIdRoles };
    }
    throw new Error();
  };

  const { data } = useQuery({
    queryKey: ["getAuthUser"],
    queryFn: async () => {
      try {
        const authUser = await fetchUser();

        const settingsParams = await getFrameworkParams();

        return {
          userData: authUser.userData,
          roles: authUser.usuarioIdRoles,
          settingsParams,
        };
      } catch (error) {
        removeCookie("authToken");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: isSubmitted,
  });

  const refetchAuthUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAuthUser"] });
  };

  return {
    settingsParams: data?.settingsParams,
    userData: data?.userData,
    gestorFinanceiro: data?.userData?.gestorFinanceiro,
    gestorReservasAgendamentos: data?.userData?.gestorReservasAgendamentos,
    refetchAuthUser,
    isAdm: data?.userData?.isAdm,
    integratedWithTimeSharing: data?.settingsParams?.integratedWithTimeSharing,
    authUserCompany: data?.userData?.companies?.[0],
  };
}
