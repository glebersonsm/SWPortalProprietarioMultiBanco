import { GetInfoContractsData } from "@/utils/types/multiownership/owners";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { ChangeEvent } from "react";

interface Props {
  data: GetInfoContractsData[] | undefined;
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
}

export const Step03 = ({ data, acceptedTerms, setAcceptedTerms }: Props) => {
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(event.target.checked);
  };

  const dataMap = Object.fromEntries(
    (data ?? []).map((item) => [item.key.replace(/^\[|\]$/g, ""), item.value])
  );

  return (
    <Box>
      <Typography variant="h6" textAlign="center" fontWeight="bold" gutterBottom>
        SCP PRESTIGE
      </Typography>
      <Typography variant="h6" textAlign="center" fontWeight="bold" gutterBottom>
        CNPJ n.º 40.654.977/0001-47
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        ANEXO I
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom fontWeight="bold">
        TÉRMINO DE MEMBRESÍA A LA SOCIEDAD EN LA CUENTA DE PARTICIPACIÓN
      </Typography>

      {/* Dados do Sócio */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: "bold" }}>
                DATOS SOCIO(S) PARTICIPANTE(S)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                Nombre Completo: {dataMap["NOME_SOCIO"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                Documento de identificación: {dataMap["RG_SOCIO"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                Dirección: {dataMap["ENDERECO_SOCIO"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Barrio: {dataMap["BAIRRO_SOCIO"]}</TableCell>
              <TableCell>Municipalidad: {dataMap["CIDADE_SOCIO"]}</TableCell>
              <TableCell>Departamento o Provincia: {dataMap["UF_SOCIO"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Teléfono fijo: {dataMap["TELEFONE_FIXO_SOCIO"]}</TableCell>
              <TableCell>Móvil: {dataMap["CELULAR_SOCIO"]}</TableCell>
              <TableCell>Correo electrónico: {dataMap["EMAIL_SOCIO"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                Nombre del Representante Legal y Documento de identificación (en
                caso de persona jurídica): {dataMap["NOME_REPRESENTANTE_LEGAL"]}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Unidade Autônoma */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: "bold" }}>
                DATOS DE LA UNIDAD AUTÓNOMA
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Unidad: {dataMap["UNIDADE_AUTONOMA"]}</TableCell>
              <TableCell colSpan={2}>Contrato: {dataMap["MATRICULA_UNIDADE"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                Capacidad ocupacional: {dataMap["CAPACIDADE_OCUPACIONAL"]}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="Aceptar los términos de este contrato"
        sx={{ mt: 4 }}
      />
    </Box>
  );
};
