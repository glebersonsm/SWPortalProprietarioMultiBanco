"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/querys/users";
import { getPhoneTypes } from "@/services/querys/phoneTypes";
import { getAddressTypes } from "@/services/querys/addressTypes";
import { getDocumentTypes } from "@/services/querys/documentTypes";
import EditForm from "./_components/Form";
import LoadingData from "@/components/LoadingData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = React.use(params);
  const router = useRouter();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["getUserById", { id: userId }],
    queryFn: async () => {
      const users = await getUsers({
        filters: { id: userId, email: "", cpf: "", name: "" },
      });
      const user = users.users[0];
      const currentTypePerson = user?.personType;

      const [phoneTypes, addressTypes, documentTypes] = await Promise.all([
        getPhoneTypes({ personType: currentTypePerson }),
        getAddressTypes({ personType: currentTypePerson }),
        getDocumentTypes({ personType: currentTypePerson }),
      ]);

      return { user, phoneTypes, addressTypes, documentTypes };
    },
  });

  if (isError) {
    toast.error("Não foi possível acessar os dados do usuário nesse momento!");
    router.push(`/dashboard`);
  }

  const { user, phoneTypes, addressTypes, documentTypes } = data || {};

  return isLoading ? (
    <LoadingData />
  ) : (
    <EditForm
      user={user}
      phoneTypes={phoneTypes}
      addressTypes={addressTypes}
      documentTypes={documentTypes}
    />
  );
}
