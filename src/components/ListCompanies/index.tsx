import { getCompanies } from "@/services/querys/companies";
import { CompanyUser } from "@/utils/types/companies";
import { Checkbox, FormLabel, Stack, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type ListCompanies = {
  userCompanies: CompanyUser[];
};

export default function ListCompanies({ userCompanies }: ListCompanies) {
  const { data: companies = [] } = useQuery({
    queryKey: ["getCompanies"],
    queryFn: () => getCompanies(),
  });

  const { setValue } = useFormContext();
  const [selectedCompanies, setSelectedCompanies] =
    useState<CompanyUser[]>(userCompanies);

  const handleCheckCompany = (companyId: number) => {
    const selectedItem = companies!.find(
      (company) => company.companyId === companyId
    );

    if (selectedItem === undefined) return;

    const selectedIndex = selectedCompanies.findIndex(
      (company) => company.companyId === companyId
    );

    if (selectedIndex === -1) {
      setSelectedCompanies([...selectedCompanies, selectedItem]);
    } else {
      const updatedSelection = [...selectedCompanies];
      updatedSelection.splice(selectedIndex, 1);
      setSelectedCompanies(updatedSelection);
    }
  };

  useEffect(() => {
    setValue("companies", selectedCompanies);
  }, [selectedCompanies, setValue]);

  return (
    <Stack>
      <FormLabel
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: "primary.solidHoverBg",
        }}
      >
        Gerenciamento de empresas
      </FormLabel>

      {companies.length <= 0 && (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            fontSize: 14,
            color: "primary.plainColor",
          }}
        >
          *Esse usuário não tem empresas cadastradas
        </Typography>
      )}
      {companies.length > 0 && (
        <Stack marginTop={2} gap={2}>
          {companies?.map((company) => {
            return (
              <Stack key={company.companyId}>
                <Checkbox
                  sx={{
                    color: "primary.plainColor",
                  }}
                  label={company.name}
                  checked={selectedCompanies?.some(
                    (selectedCompany) =>
                      selectedCompany.companyId === company.companyId
                  )}
                  onChange={() => handleCheckCompany(company.companyId)}
                />
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
