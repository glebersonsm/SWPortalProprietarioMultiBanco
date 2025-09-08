import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

export const Step0 = () => (
   <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          INSTRUMENTO PRIVADO PARA LA CONSTITUCIÓN DE SOCIEDAD EN CUENTA DE
          PARTICIPACIÓN
        </Typography>
        <Typography variant="h6" color="textSecondary">
          CNPJ n.º 40.654.977/0001-47
        </Typography>
      </Box>

      <Typography fontWeight={500} paragraph>
        PARTES CONTRATANTES:
      </Typography>

      <Box ml={4}>
        <List>
          <ListItem>
            <ListItemText
              secondary={
                <>
                  <strong>EMPRESA HOTELEIRA MABU LTDA.</strong>,sociedad de
                  responsabilidad limitada, con sede en la ciudad de Foz do
                  Iguaçu, Estado de Paraná, en la Rua Carlos Hugo Urnau, Nº 492,
                  Loteamento Dona Amanda, CEP: 85853-734, debidamente inscrita
                  en el CNPJ bajo el número 75.047.498/0002 -28, en este acto
                  debidamente representado en la forma de su Contrato Social
                  vigente por su administrador el Señor. WELLINGTON ESTRUQUEL,
                  brasilero, divorciado, nacido en 24/12/1975, natural de São
                  Paulo/SP, administrador de empresas, residente y domiciliado
                  en la Ciudad de Curitiba, Estado de Paraná, en Ruta Margarida
                  Dallarmi, nº 551, casa 3, barrio Santa Felicidade, CEP:
                  82015-690, portador de la Cédula de Identidad RG Nº
                  24.654.629-3/SSP/SP, emitido en 02/06/2000, registrado en el
                  CPF/ME bajo el número 151.946.668-45, en adelante denominado
                  SOCIO OSTENSIVO; y
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              secondary={
                <>
                  <strong>SÓCIOS PARTICIPANTES</strong> devidamente
                  individualizados e identificados, conforme Anexo I do Contrato
                  original, denominados, conjuntamente, apenas Sócios
                  Participantes;
                </>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Typography variant="h6" paragraph>
        Considerando que:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Que la SOCIA OSTENSIVA tiene por objeto social: (a) la explotación del negocio de administración de condominios; y (b) la explotación del servicio de administración hotelera;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Que los SOCIOS PARTICIPANTES suscribieron el Contrato de Concesión de Derecho Real de Uso ('Contrato de Concesión'), mediante el cual se convirtieron en concesionarios del uso de determinada(s) unidad(es) del Condominio 'Prestige' ('Unidad Autónoma'), debidamente inscrito en el Registro 42.508, 2º Oficio de Registro de la Propiedad de Foz do Iguaçu, durante su respectivo Período de Uso, de acuerdo con los términos y condiciones establecidos en el Contrato de Concesión;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Que los SOCIOS PARTICIPANTES, en los términos del Contrato de Concesión, tienen derecho a poner a disposición del Centro de Alquiler de la SOCIA OSTENSIVA los Periodos de Uso de la Unidad Autónoma a la que tienen derecho y que no utilizan;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Que la SOCIA OSTENSIVA, a través de esta SCP y su Centro de Alquiler, desarrollará la actividad de alquiler por los Períodos de Uso de las Unidades Autónomas de los SOCIOS PARTICIPANTES, con servicios propios y/o de terceros;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Que la SOCIA OSTENSIVA y PRESTIGE INCORPORAÇÃO E ADMINISTRAÇÃO DE BENS LTDA., sociedad de responsabilidad limitada, con domicilio social en R. Carlos Hugo Urnau, s/n, Loteamento Dona Amanda, Foz do Iguaçu, Estado de Paraná, debidamente inscrita en el CNPJ bajo el nº 22.408.887/0001-94 ('Incorporadora') y el CONDOMINIO PRESTIGE, registrado en CNPJ/MF con el número 36.322.152/0001-58, celebró un Contrato de Administración para servicios de administración de condominios ('Contrato de administración');" />
        </ListItem>
      </List>

      <Typography paragraph>
        LAS PARTES, de mutuo acuerdo y de común acuerdo, RESUELVEN constituir
        esta Sociedad en Cuenta de Participación (&quot;SCP&quot;), a través de
        este Instrumento Privado de Constitución de Sociedad en Cuenta de
        Participación (&quot;Contrato&quot;), que se regirá por los términos y
        condiciones acordados a continuación y por la ley aplicable, en
        particular los artículos 991 al 996 de la Ley N° 10.406/02 (&quot;Código
        Civil&quot;), mediante las siguientes cláusulas y condiciones:
      </Typography>
    </Box>
)