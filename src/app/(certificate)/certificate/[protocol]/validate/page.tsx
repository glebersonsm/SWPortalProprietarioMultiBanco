import { Stack } from "@mui/joy";
import { cookies } from "next/headers";
import BackButton from "./_components/BackButton";
import CertificateInformation from "./_components/CertificateInformation";
import { validateCertificate } from "@/services/querys/finance-users";

type ValidatePageProps = {
  params: { protocol: string };
};

export default async function ValidatePage({ params }: ValidatePageProps) {
  const data = await validateCertificate(params.protocol);

  const cookie = cookies();
  const hasAuthCookie = cookie.has("authToken");

  return (
    <Stack
      gap={3}
      alignItems="center"
      minHeight="100vh"
      justifyContent="center"
    >
      <CertificateInformation data={data} />
      <BackButton isAuthorized={hasAuthCookie} />
    </Stack>
  );
}
