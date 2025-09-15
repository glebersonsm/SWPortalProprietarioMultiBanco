import React from "react";
import { Box, Grid, Paper, Divider } from "@mui/material";
import Image from "next/image";
import { Typography } from "@mui/joy";
import { ReservaVoucherDados } from "@/utils/types/multiownership/owners";

interface Props {
  data?: ReservaVoucherDados;
}

export const VoucherPt = ({ data }: Props) => {
  const isTropical = data?.tipoCliente === "Tropical";
  const primaryColor = isTropical ? "#055F34" : "#17476E";
  const saudacao = isTropical
    ? "Seja bem-vindo ao Barretos Country!"
    : "Seja bem-vindo ao Barretos Country!";

  return (
    <>
      <Box
        sx={{
          backgroundColor: primaryColor,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 87,
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo/BarretosCountry.png"
            alt="Logo Barretos Country"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Typography
          sx={{
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            textAlign: "center",
          }}
        >
          CONFIMAÇÃO DE RESERVA
        </Typography>
      </Box>

      <Box
        my={2}
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Paper
          variant="outlined"
          sx={{ backgroundColor: primaryColor, width: "50%", borderRadius: 3 }}
        >
          <Typography
            sx={{
              color: "white",
              fontFamily: "Montserrat, sans-serif",
            }}
            gutterBottom
          >
            RESERVA Nº {data?.numeroReserva ?? "----"}
          </Typography>
        </Paper>
      </Box>

      <Paper
        variant="outlined"
        sx={{ backgroundColor: primaryColor, padding: 2 }}
      >
        <Box my={2} textAlign="center">
          <Typography
            sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
          >
            <strong>{saudacao}</strong>
            <br />
            É uma grande alegria recebê-lo em nosso empreendimento.
            <br />
            Desejamos que sua estadia seja repleta de conforto e momentos
            inesquecíveis!
          </Typography>
        </Box>

        <Box>
          {data?.tipoUso === "Uso Convidado" && (
            <Paper
              variant="outlined"
              sx={{ backgroundColor: primaryColor, padding: 2 }}
            >
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>CLIENTE:</strong> {data?.cliente ?? "---"}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>CONTRATO:</strong> {data?.contrato ?? "---"}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>HOTEL DE HOSPEDAGEM:</strong> {data?.nomeHotel ?? "---"}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>HÓSPEDES:</strong> {data?.hospedePrincipal ?? "---"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>OBSERVAÇÕES:</strong> NÃO INCLUI ACESSO AO BLUE PARK /{" "}
                  {data?.observacao ?? "---"}
                </Typography>
              </Box>
            </Paper>
          )}

          {data?.tipoUso === "Uso Intercambiadora" && (
            <Paper
              variant="outlined"
              sx={{ backgroundColor: primaryColor, padding: 2 }}
            >
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>HÓSPEDES RCI:</strong>{" "}
                  {data?.hospedePrincipal ?? "---"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>OBSERVAÇÕES:</strong> NÃO INCLUI ACESSO AO BLUE PARK /{" "}
                  {data?.observacao ?? "---"}
                </Typography>
              </Box>
            </Paper>
          )}

          {(data?.tipoUso === "Uso Próprio" ||
            data?.tipoUso === "Uso Proprio") && (
            <Paper
              variant="outlined"
              sx={{ backgroundColor: primaryColor, padding: 2 }}
            >
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>CLIENTE:</strong> {data?.cliente ?? "---"}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>CONTRATO:</strong> {data?.contrato ?? "---"}
                </Typography>
              </Box>
               <Box mb={1}>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>HOTEL DE HOSPEDAGEM:</strong> {data?.nomeHotel ?? "---"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
                >
                  <strong>OBSERVAÇÕES:</strong>{" "}
                  {data?.observacao ?? "ACESSO AO BLUE PARK"}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Paper>

      <Grid container spacing={2} my={3}>
        {["Chegada", "Partida", "Acomodação", "Quantidade"].map(
          (label, idx) => {
            const content = [
              `${data?.dataChegada ?? "--/--/----"}\n${
                data?.horaChegada ?? "--:--"
              }`,
              `${data?.dataPartida ?? "--/--/----"}\n${
                data?.horaPartida ?? "--:--"
              }`,
              `${data?.acomodacao ?? "---"}`,
              `${data?.quantidadePax ?? "---"}`,
            ][idx];

            return (
              <Grid item xs={3} key={label}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    textAlign: "center",
                  }}
                >
                  {label}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: primaryColor,
                    borderRadius: "16px",
                    padding: "8px",
                    marginTop: "4px",
                    height: 60,
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: "Montserrat, sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {content}
                  </Typography>
                </Box>
              </Grid>
            );
          }
        )}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography
        sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
        gutterBottom
      >
        NORMAS E POLÍTICA DE USO:
      </Typography>

      <ol>
        <li>
          Para garantir a saúde e o conforto de todos os hospedes, informamos
          que é proibido fumar nas áreas internas do empreendimento.
        </li>
        <li>
          Para manter um ambiente tranquilo e seguro, apenas hóspedes
          registrados podem acessar nossas instalações
        </li>
        <li>
          Não estão inclusos café, almoço, jantar, lanches, transporte e outros
          serviços no resort, mas você pode facilmente contratá-los na recepção
          do hotel.
        </li>
        <li>
          Nosso check-in começa às 15h00 aos sábados, permitindo que você comece
          sua estadia com calma. O check-out é até às 10h00 no último dia da sua
          estadia para que você possa aproveitar até o último momento.
        </li>
        <li>
          Você é responsável por quaisquer danos ou perdas na unidade durante o
          período da estadia. Caso ocorra algum incidente, pedimos para você
          entrar em contato com a recepção do hotel.{" "}
        </li>
        <li>
          Menores de 18 anos desacompanhados dos pais, deverão apresentar uma
          autorização registrada em cartório para a entrada e permanência no
          hotel.{" "}
        </li>
        <li>
          Para garantir a qualidade das experiências no BLUE PARK e nas áreas
          sociais, solicitamos que o consumo de alimentos e bebidas seja
          restrito às unidades habitacionais (UH). O BLUE PARK reserva-se o
          direito de realizar revistas de segurança em bolsas, sacolas, mochilas
          para assegurar que apenas itens permitidos sejam consumidos no parque.
        </li>
        <li>
          Lembre-se de que a voltagem em nosso condomínio é toda 220V. Se
          precisar, traga seu próprio conversor para garantir uma estadia
          completa. Não dispomos conversores para empréstimos.
        </li>
        <li>
          Caso necessite de qualquer assistência durante sua estadia,
          recomendamos que entre em contato com a recepção do hotel.
        </li>
      </ol>

      <Box mt={4} textAlign="center">
        <Typography
          sx={{ color: "white", fontFamily: "Montserrat, sans-serif" }}
        >
          Recepção Barretos Country
          <br />
          Contato: (XX) XXXX XXXX | recepcaomtr@hoteibarretoscountry.com.br
        </Typography>
      </Box>
    </>
  );
};
