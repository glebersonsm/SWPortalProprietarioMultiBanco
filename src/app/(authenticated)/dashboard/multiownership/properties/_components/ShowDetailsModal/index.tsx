import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Property } from "@/utils/types/multiownership/properties";
import { FormControl, FormLabel, Textarea, Grid } from "@mui/joy";
import { Divider } from "@mui/material";

type ShowDetailsModalProps = {
  property: Property;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
};

export default function ShowDetailsModal({ property, shouldOpen }: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails title="Detalhes do imóvel" shouldOpen={shouldOpen}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Id do imóvel</FormLabel>
            <Textarea defaultValue={property.id} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Id do Empreendimento</FormLabel>
            <Textarea defaultValue={property.enterpriseId} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do Empreendimento</FormLabel>
            <Textarea defaultValue={property.enterpriseName} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Imóvel</FormLabel>
            <Textarea defaultValue={property.propertyNumber} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do bloco</FormLabel>
            <Textarea defaultValue={property.blockCode} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do bloco</FormLabel>
            <Textarea defaultValue={property.blockName} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do andar do imóvel</FormLabel>
            <Textarea defaultValue={property.propertyFloorCode} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do andar do imóvel</FormLabel>
            <Textarea defaultValue={property.propertyFloorName} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Código do tipo do imóvel</FormLabel>
            <Textarea defaultValue={property.propertyTypeCode} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do tipo de imóvel</FormLabel>
            <Textarea defaultValue={property.propertyTypeName} readOnly minRows={2} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={2}>
          <FormControl>
            <FormLabel sx={labelSx}>Vendidas</FormLabel>
            <Textarea defaultValue={property.sold} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <FormControl>
            <FormLabel sx={labelSx}>Disponíveis</FormLabel>
            <Textarea defaultValue={property.available} readOnly minRows={2} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={2}>
          <FormControl>
            <FormLabel sx={labelSx}>Bloqueadas</FormLabel>
            <Textarea defaultValue={property.blocked} readOnly minRows={2} />
          </FormControl>
        </Grid>
      </Grid>
    </ModalToShowDetails>
  );
}
