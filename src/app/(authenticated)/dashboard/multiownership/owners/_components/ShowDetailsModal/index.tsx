import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Owner } from "@/utils/types/multiownership/owners";
import { FormControl, FormLabel, Grid, Textarea, Typography, Box, Divider, Chip } from "@mui/joy";
import { 
  Business as BusinessIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  CalendarToday as CalendarIcon,
  Tag as TagIcon,
  AccountTree as AccountTreeIcon
} from "@mui/icons-material";
import React from "react";

type ShowDetailsModalProps = {
  owner: Owner;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 600,
  color: "primary.plainColor",
  fontSize: "0.875rem",
  mb: 0.5,
};

const textareaSx = {
  minHeight: "40px",
  "& .MuiTextarea-textarea": {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "text.primary",
  },
  "& .MuiTextarea-root": {
    backgroundColor: "grey.50",
    border: "1px solid",
    borderColor: "grey.200",
    borderRadius: "8px",
    "&:hover": {
      borderColor: "grey.300",
    },
  },
};

const sectionTitleSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "primary.solidBg",
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 2,
  mt: 1,
};

export default function MultiownershipShowDetailsModal({
  owner,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails
      title="Detalhes do Imóvel/Cota"
      shouldOpen={shouldOpen}
    >
      <Box sx={{ p: 1 }}>
        {/* Seção Cliente */}
        <Typography sx={sectionTitleSx}>
          <PersonIcon fontSize="small" />
          Informações do Cliente
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Nome do Cliente</FormLabel>
              <Textarea defaultValue={owner.clientName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>ID do Cliente</FormLabel>
              <Textarea defaultValue={owner.clientId} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Código do Cliente</FormLabel>
              <Textarea defaultValue={owner.clientCode} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Seção Empreendimento */}
        <Typography sx={sectionTitleSx}>
          <BusinessIcon fontSize="small" />
          Informações do Empreendimento
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Nome do Empreendimento</FormLabel>
              <Textarea defaultValue={owner.enterpriseName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>ID do Empreendimento</FormLabel>
              <Textarea defaultValue={owner.enterpriseId} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Número do Contrato</FormLabel>
              <Textarea defaultValue={owner.contractNumber} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Seção Propriedade */}
        <Typography sx={sectionTitleSx}>
          <HomeIcon fontSize="small" />
          Informações da Propriedade
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Número do Imóvel</FormLabel>
              <Textarea defaultValue={owner.propertyNumber} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Tipo do Imóvel</FormLabel>
              <Textarea defaultValue={owner.propertyTypeName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Código do Tipo</FormLabel>
              <Textarea defaultValue={owner.propertyTypeCode} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Seção Bloco/Andar */}
        <Typography sx={sectionTitleSx}>
          <ApartmentIcon fontSize="small" />
          Localização no Edifício
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Nome do Bloco</FormLabel>
              <Textarea defaultValue={owner.blockName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Código do Bloco</FormLabel>
              <Textarea defaultValue={owner.blockCode} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Andar do Imóvel</FormLabel>
              <Textarea defaultValue={owner.propertyFloorName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Código do Andar</FormLabel>
              <Textarea defaultValue={owner.propertyFloorCode} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Seção Cota/Fração */}
        <Typography sx={sectionTitleSx}>
          <AccountTreeIcon fontSize="small" />
          Informações da Cota
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>ID da Cota</FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Textarea defaultValue={owner.quotaId} readOnly sx={textareaSx} />
                <Chip 
                  size="sm" 
                  variant="soft" 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Principal
                </Chip>
              </Box>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Grupo da Cota</FormLabel>
              <Textarea defaultValue={owner.quotaGroupNome} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>ID do Grupo</FormLabel>
              <Textarea defaultValue={owner.quotaGroupId} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Nome da Fração</FormLabel>
              <Textarea defaultValue={owner.fractionName} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Código da Fração</FormLabel>
              <Textarea defaultValue={owner.fractionCode} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Seção Data */}
        <Typography sx={sectionTitleSx}>
          <CalendarIcon fontSize="small" />
          Informações Temporais
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Data de Aquisição</FormLabel>
              <Textarea defaultValue={owner.purchaseDate} readOnly sx={textareaSx} />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </ModalToShowDetails>
  );
}