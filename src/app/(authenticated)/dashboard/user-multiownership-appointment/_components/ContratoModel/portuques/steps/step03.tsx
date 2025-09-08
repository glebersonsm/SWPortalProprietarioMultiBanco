import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

interface Props {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
}

export const Step03 = ({ acceptedTerms, setAcceptedTerms }: Props) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(event.target.checked);
  };


return (
  <Box>
    <div className="texte_center">
      <h2>ANEXO II</h2>
      <h3>TERMO DE CONDIÇÕES DE AGENDAMENTO PARA A CENTRAL DE LOCAÇÃO</h3>
    </div>

    <Typography paragraph>
      Ao solicitar o agendamento do<strong><u>Período de Utilização para a Central de Locação</u></strong> 
      o CONCESSIONÁRIO e SÓCIO PARTICIPANTE concorda com as condições abaixo
      enumeradas, sem prejuízo da observância e cumprimento das demais
      disposições constantes do Contrato de Concessão Real de Direito de Uso,
      das Normas e Políticas de Uso, da Convenção do Condomínio Prestige e do
      Regimento Interno do Condomínio Prestige.
    </Typography>

    <Typography variant="h5" gutterBottom>
      1. Da disponibilização do Período de Utilização para a Central de Locação
    </Typography>

    <Box pl={3}>
      <Typography paragraph>
        <strong>1.1.</strong> O agendamento do Período de Utilização com
        disponibilização para a Central de Locação deverá observar rigorosamente
        a ordem de prioridades dentre os CONCESSIONÁRIOS da Unidade Autônoma.
      </Typography>
      <Typography paragraph>
        <strong>1.2.</strong> Uma vez disponibilizada o Período de Utilização
        para a Central de Locação, esta somente poderá ser retirada do Pool com
        até 180 dias de antecedência da data prevista para o check-in. Passado
        esse prazo, o CONCESSIONÁRIO não poderá mais retirar o Período de
        Utilização da Central de Locação.
      </Typography>
      <Typography paragraph>
        <strong>1.3.</strong> A retirada do Período de Utilização da Central de
        Locação poderá ser feita sem quaisquer ônus.
      </Typography>
      <Typography paragraph>
        <strong>1.4.</strong> O CONCESSIONÁRIO e SÓCIO PARTICIPANTE deverá
        manter seus dados cadastrais sempre atualizados, possibilitando contato
        pela Administradora e SÓCIA OSTENSIVA, não se responsabilizando esta por
        quaisquer fatos ou problemas advindos de eventual impossibilidade de
        comunicação com o CONCESSIONÁRIO e SÓCIO PARTICIPANTE.
      </Typography>
      <Typography paragraph>
        <strong>1.5.</strong> Para disponibilização dos Períodos de Utilização a
        partir do segundo ano, o CONCESSIONÁRIO deverá exercer sua prioridade de
        acordo com os respectivos períodos de solicitação, iniciando-se na
        primeira semana de junho e se encerrando na quarta semana de agosto,
        conforme Regras Gerais de Reserva. Não o fazendo dentro dos períodos
        previamente estabelecidos, o CONCESSIONÁRIO perderá o direito à sua
        ordem de prioridade para o ano subsequente, e somente poderá registrar
        seus Períodos de Utilização no mês de setembro, conforme
        disponibilidade.
      </Typography>
      <Typography paragraph>
        <strong>1.6.</strong> Também perderá direito à prioridade o
        CONCESSIONÁRIO que registrar apenas parte dos seus Períodos de
        Utilização, relativamente àquelas semanas não registradas.
      </Typography>
      <Typography paragraph>
        <strong>1.7.</strong> Se o CONCESSIONÁRIO que não registrou seu(s)
        Período(s) de Utilização, total ou parcialmente, não o fizer no decorrer
        do mês de setembro, terá as semanas não registradas convertidas em
        Semanas de Uso Livre (flutuantes), ficando à disposição também dos
        demais CONCESSIONÁRIOS.
      </Typography>
      <Typography paragraph>
        <strong>1.8.</strong> As semanas de uso livre poderão ser
        disponibilizadas para a Central de Locação a qualquer tempo, após o
        encerramento do Período de Solicitação, observada a disponibilidade.
      </Typography>
    </Box>

    <Typography variant="h5" gutterBottom>
      2. Da apuração e distribuição dos resultados da SCP
    </Typography>
    <Box pl={3}>
      <Typography paragraph>
        <strong>2.1.</strong> Os resultados da Central de Locação serão apurados
        mensalmente, e distribuídos e pagos anualmente, podendo, no entanto, ser
        objeto de adiantamento mensais, a todos os CONCESSIONÁRIOS que tenham
        disponibilizado seus respectivos Período de Utilização dentro do mesmo
        mês, observados os seguintes critérios:
      </Typography>

      <Box pl={3}>
        <Typography paragraph>
          <strong>2.1.1.</strong>Tipo de estação, se premium, de alta estação ou
          média estação;
        </Typography>
        <Typography paragraph>
          <strong>2.1.2.</strong>Tipo de unidade.
        </Typography>
      </Box>

      <Typography paragraph>
        <strong>2.2.</strong> Se a semana se iniciar dentro de um mês e se
        encerrar em outro, os valores serão apurados proporcionalmente, conforme
        os resultados e o número de dias da semana em cada um dos meses.
      </Typography>
      <Typography paragraph>
        <strong>2.3.</strong> Os valores serão disponibilizados aos SÓCIOS
        PARTICIPANTES por meio de depósito em conta corrente, a ser feito até o
        5º (quinto) dia útil do mês seguinte ao mês de apuração, entendendo-se
        como mês de apuração o mês subsequente ao mês em que a unidade foi
        disponibilizada para locação.
      </Typography>
      <Typography paragraph>
        <strong>2.4.</strong> Sobre os valores apurados será descontada a taxa
        de administração de 20% (vinte por cento), tributos, despesas e outros
        custos decorrentes da locação.
      </Typography>
      <Typography paragraph>
        <strong>2.5.</strong> A disponibilização do Período de Utilização para a
        Central de Locação não garantirá a efetiva locação das diárias do
        Período Fracionado de Utilização do CESSIONÁRIO, não se
        responsabilizando a Administradora pelo resultado financeiro da
        operação.
      </Typography>
    </Box>

    <Typography variant="h5" gutterBottom>
      3. Do inadimplemento das obrigações pecuniárias
    </Typography>
    <Box pl={3}>
      <Typography paragraph>
        <strong>3.1.</strong> Em caso de inadimplemento de quaisquer obrigações
        pecuniárias, a unidade do CONCESSIONÁRIO inadimplente ficará inacessível
        a este até que os valores arrecadados com a locação sejam suficientes
        para o pagamento de todos os débitos pendentes, ou até que o
        CONCESSIONÁRIO efetue o seu integral pagamento.
      </Typography>
      <Typography paragraph>
        <strong>3.2.</strong> Os valores relativos ao rateio pela inclusão da
        unidade no pool de locação serão revertidos para a quitação dos débitos
        existentes. Observando-se eventual saldo, os valores excedentes serão
        revertidos em favor do CONCESSIONÁRIO.
      </Typography>
    </Box>

    <Typography variant="h5" gutterBottom>
      4. Disposições gerais
    </Typography>

    <Box pl={3}>
      <Typography paragraph>
        <strong>4.1.</strong> O CONCESSIONÁRIO declara ter pleno conhecimento
        das disposições constantes do “Contrato de Concessão Real de Direito de
        Uso” e das “Normas e Políticas de Uso”.
      </Typography>
      <Typography paragraph>
        <strong>4.2.</strong> O CONCESSIONÁRIO declara ter pleno conhecimento
        das disposições constantes, da “Convenção do Condomínio Prestige” e do
        “Regimento Interno do Condomínio Prestige”.
      </Typography>
    </Box>
    <FormControlLabel
      control={
        <Checkbox
          checked={acceptedTerms}
          onChange={handleCheckboxChange}
          color="primary"
        />
      }
      label="Aceita os termos desse contrato?"
    />
  </Box>
);
};