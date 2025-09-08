import LoadingData from "@/components/LoadingData";
import { GetInfoContractsData } from "@/utils/types/multiownership/owners";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface Props {
  data: GetInfoContractsData[] | undefined;
}

export const Step02 = ({ data }: Props) => {
  if (!data) {
    return <LoadingData />;
  }

  const dataMap = Object.fromEntries(
    data.map((item) => [item.key, item.value])
  );

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          ANEXO I
        </Typography>
        <Typography variant="h5" gutterBottom>
          TERMO DE ADESÃO À SOCIEDADE EM CONTA DE PARTICIPAÇÃO
        </Typography>
      </Box>
      <Typography my={5} variant="h6" textAlign={"center"}>
        DADOS SÓCIO(S) PARTICIPANTE(S)
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Campo</strong>
              </TableCell>
              <TableCell>
                <strong>Valor</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["Nome Completo", "[NOME_SOCIO]"],
              ["RG", "[RG_SOCIO]"],
              ["CPF/CNPJ", "[CPF_CNPJ_SOCIO]"],
              ["Endereço", "[ENDERECO_SOCIO]"],
              ["Bairro", "[BAIRRO_SOCIO]"],
              ["Município", "[CIDADE_SOCIO]"],
              ["UF", "[UF_SOCIO]"],
              ["CEP", "[CEP_SOCIO]"],
              ["Telefone Fixo", "[TELEFONE_FIXO_SOCIO]"],
              ["Celular", "[CELULAR_SOCIO]"],
              ["E-mail", "[EMAIL_SOCIO]"],
              [
                "Nome do Representante Legal /RG/CPF",
                "[NOME_REPRESENTANTE_LEGAL]",
              ],
            ].map(([label, key]) => (
              <TableRow key={key}>
                <TableCell>{label}</TableCell>
                <TableCell>{dataMap[key] || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography my={5} variant="h6" textAlign={"center"}>
        DADOS DA UNIDADE AUTONÔMA
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Campo</strong>
              </TableCell>
              <TableCell>
                <strong>Valor</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["Unidade", "[UNIDADE_AUTONOMA]"],
              ["Matrícula", "[MATRICULA_UNIDADE]"],
              ["Capacidade ocupacional", "[CAPACIDADE_OCUPACIONAL]"],
            ].map(([label, key]) => (
              <TableRow key={key}>
                <TableCell>{label}</TableCell>
                <TableCell>{dataMap[key] || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Campo</strong>
              </TableCell>
              <TableCell>
                <strong>Valor</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Unidade</TableCell>
              <TableCell>[UNIDADE_AUTONOMA]</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Matrícula</TableCell>
              <TableCell>[MATRICULA_UNIDADE]</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capacidade ocupacional</TableCell>
              <TableCell>[CAPACIDADE_OCUPACIONAL]</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer> */}

      <Typography my={5} variant="h6" textAlign={"center"}>
        DECLARAÇÃO
      </Typography>
      <Typography paragraph>
        Pelo presente Termo de Adesão, o <strong>SÓCIO PARTICIPANTE</strong>{" "}
        acima nomeado e qualificado,
        <strong>DECLARA</strong>, para todos os fins e efeitos de direito, estar
        aderindo como sócio à SCP, tendo ciência das condições constantes no
        Contrato de Constituição de Sociedade em Conta de Participação da
        mencionada sociedade, e que:
      </Typography>

      <Box sx={{ pl: 3 }}>
        <List sx={{ listStyleType: "lower-alpha", pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="Recebeu com antecedência uma cópia do instrumento de Contrato de Constituição de Sociedade em Conta de Participação (a ‘SCP’) referentes à operação do Pool de Locações a ser desenvolvida nas instalações do Condomínio Prestige, estando plenamente de acordo com todas as suas cláusulas e condições, nada tendo a opor, agora ou no futuro, quanto às mesmas, obrigando-se a cumpri-las integralmente." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="Adere neste ato, em caráter definitivo, irrevogável e irretratável, à SCP, na qualidade de SÓCIO PARTICIPANTE, obrigando-se a cumprir todas as regras, cláusulas e condições estabelecidas no âmbito de dita sociedade." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="A referida sociedade será administrada com exclusividade pela SÓCIA OSTENSIVA - Administradora do Pool de Locações." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="A referida SCP terá como atividade a administração do Período de Utilização da Unidade Autônoma descrita e identificada no quadro acima, quando cedido o direito de uso do Período de Utilização do SÓCIO PARTICIPANTE, na forma de locação a terceiros (Pool de Locação), pelo sistema de hotelaria." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="As rendas locatícias serão proporcionais à Unidade Autônoma da qual o SÓCIO PARTICIPANTE é concessionário." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="As rendas são variáveis." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="Caberá aos sócios a distribuição das rendas líquidas, após deduzidas todas as despesas, taxas de administração, impostos e demais custos." />
          </ListItem>
          {/* <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="Para fins de recebimento dos resultados da SCP, o SÓCIO PARTICIPANTE indica a conta bancária abaixo:" />
          </ListItem>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Campo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Valor</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ["Titular da conta", "[TITULAR_CONTA]"],
                  ["CPF ou CNPJ", "[CPF_CNPJ_TITULAR]"],
                  ["Banco", "[BANCO]"],
                  ["Cidade", "[CIDADE_BANCO]"],
                  ["Agência", "[AGENCIA]"],
                  ["Conta Corrente", "[CONTA_CORRENTE]"],
                ].map(([label, key]) => (
                  <TableRow key={key}>
                    <TableCell>{label}</TableCell>
                    <TableCell>{dataMap[key] || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="A sociedade tem prazo de duração igual ao prazo do Contrato de Concessão Real de Direito de Uso." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="É livre a retirada dos sócios, desde que previamente comunicado, com antecedência mínima de pelo menos 120 (cento e vinte) dias, mediante pedido por escrito, respeitadas as reservas já efetuadas pela SÓCIA OSTENSIVA." />
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <ListItemText primary="Com assinatura do presente Termo, fica a SÓCIA OSTENSIVA automaticamente investida na posse da Unidade Autônoma do SÓCIO PARTICIPANTE, que passa a integrar o Pool de Locação." />
          </ListItem>
        </List>
      </Box>

      <Typography paragraph>
        E, por estar assim justos e de acordo, firma o presente em 02 (duas)
        vias de igual teor e para a mesma finalidade.
      </Typography>
    </Box>
  );
};
