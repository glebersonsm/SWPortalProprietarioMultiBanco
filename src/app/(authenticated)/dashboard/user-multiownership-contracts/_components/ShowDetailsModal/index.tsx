import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Owner } from "@/utils/types/multiownership/owners";
import { FormControl, FormLabel, Textarea, Grid } from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  owner: Owner;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
};

export default function MultiownershipShowDetailsModal({
  owner,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails title="Detalhes do imóvel/cota" shouldOpen={shouldOpen}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Id do Empreendimento</FormLabel>
            <Textarea defaultValue={owner.enterpriseId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Número contrato</FormLabel>
            <Textarea defaultValue={owner.contractNumber} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do Empreendimento</FormLabel>
            <Textarea defaultValue={owner.enterpriseName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>UH</FormLabel>
            <Textarea defaultValue={owner.propertyNumber} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do cliente</FormLabel>
            <Textarea defaultValue={owner.clientName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Id do cliente</FormLabel>
            <Textarea defaultValue={owner.clientId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do cliente</FormLabel>
            <Textarea defaultValue={owner.clientCode} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do bloco</FormLabel>
            <Textarea defaultValue={owner.blockCode} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do bloco</FormLabel>
            <Textarea defaultValue={owner.blockName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do andar do imóvel</FormLabel>
            <Textarea defaultValue={owner.propertyFloorCode} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do andar do imóvel</FormLabel>
            <Textarea defaultValue={owner.propertyFloorName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do tipo do imóvel</FormLabel>
            <Textarea defaultValue={owner.propertyTypeCode} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do tipo de imóvel</FormLabel>
            <Textarea defaultValue={owner.propertyTypeName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Id da cota</FormLabel>
            <Textarea defaultValue={owner.quotaId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do grupo da cota</FormLabel>
            <Textarea defaultValue={owner.quotaGroupId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do grupo da cota</FormLabel>
            <Textarea defaultValue={owner.quotaGroupNome} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Código da fração</FormLabel>
            <Textarea defaultValue={owner.fractionCode} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome da fração</FormLabel>
            <Textarea defaultValue={owner.fractionName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Data de aquisição</FormLabel>
            <Textarea defaultValue={owner.purchaseDate} readOnly />
          </FormControl>
        </Grid>
      </Grid>
    </ModalToShowDetails>
  );
}
