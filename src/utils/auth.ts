import { redirect } from "next/navigation";
import { getCookie } from "./cookies";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  UserId: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[]; // pega os roles
}

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;
export const getAuthUser = async (): Promise<{ userId: number; roles: string[]; }|undefined> => {
  var authToken = getCookie("authToken");
  var localStorageToken;
  if (authToken === undefined && typeof window !== "undefined")
  {
    localStorageToken = thereIsLocalStorage ? localStorage.getItem("authToken") : undefined;
    if (localStorageToken !== undefined && authToken === undefined)
      authToken = localStorageToken;
  }

  localStorage.removeItem("authToken");

  try {
    if (authToken) {
      const decodedToken = jwtDecode<CustomJwtPayload>(authToken);
      if (decodedToken) {
        const userId = Number(decodedToken.UserId);
        const roles =
          decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        return {
          userId,
          roles,
        };
      }

      throw new Error("Undefined token");
    }
  } catch (err) {
    console.error("Token inválido:", err);
    redirect("/login");
  }
};
