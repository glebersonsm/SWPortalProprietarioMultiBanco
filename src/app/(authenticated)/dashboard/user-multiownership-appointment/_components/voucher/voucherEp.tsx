import React from "react";
import { Box, Grid, Paper, Divider } from "@mui/material";
import Image from "next/image";
import { Typography } from "@mui/joy";
import { ReservaVoucherDados } from "@/utils/types/multiownership/owners";

interface Props {
  data?: ReservaVoucherDados;
}

export const VoucherEp = ({ data }: Props) => {
  const isTropical = data?.tipoCliente === "Tropical";
  const primaryColor = isTropical ? "#055F34" : "#17476E";
  const saudacao = !isTropical
    ? "¡Bienvenidos al Barretos Country!"
    : "¡Bienvenidos al Barretos Country!";

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
          CONFIRMACIÓN DE RESERVA
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
            sx={{
              color: "white",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <strong>{saudacao}</strong>
            <br />
            ¡Es una inmensa alegría tenerlos en nuestro emprendimiento!
            <br />
            ¡Deseamos que su estadía esté llena de confort y momentos
            inolvidables!
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
        <Grid item xs={3}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
            }}
          >
            Llegada
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
              {data?.dataChegada ?? "--/--/----"} <br />
              {data?.horaChegada ?? "--:--"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
            }}
          >
            Salida
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
              {data?.dataPartida ?? "--/--/----"} <br />
              {data?.horaPartida ?? "--:--"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
            }}
          >
            Acomodación
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
              {data?.acomodacao ?? "---"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
            }}
          >
            Cantidad
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
              {data?.quantidadePax ?? "---"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography
        sx={{
          color: "white",
          fontFamily: "Montserrat, sans-serif",
        }}
        gutterBottom
      >
        NORMAS Y POLÍTICA DE USO:
      </Typography>

      <ol>
        <li>
          Para garantizar la salud y el confort de todos los huéspedes,
          informamos que está prohibido fumar en las áreas internas del
          emprendimiento.
        </li>
        <li>
          Para mantener un ambiente tranquilo y seguro, sólo los huéspedes
          registrados pueden acceder a nuestras instalaciones.
        </li>
        <li>
          No está incluido el desayuno, almuerzo, cena, refrigerios, transporte
          y otros servicios en el resort, pudiendo contratarse directamente con
          la recepción del hotel.
        </li>
        <li>
          Nuestro check-in comienza a las 15:00 horas los días sábado,
          permitiendo que empiece su estadía con calma. El check-out es hasta
          las 10:00 de la mañana del último día de su estadía para que pueda
          disfrutar hasta el último momento.
        </li>
        <li>
          Es responsable por cualquier daño o pérdida en la unidad durante el
          período de la estadía. En caso de que ocurra algún incidente, póngase
          en contacto con la recepción del hotel.
        </li>
        <li>
          Los menores de 18 años no acompañados por los padres deberán presentar
          una autorización registrada de notaría para la entrada y permanencia
          en el hotel.
        </li>
        <li>
          Para garantizar la calidad de las experiencias en el BLUE PARK y en
          las áreas sociales, solicitamos que el consumo de alimentos y bebidas
          sea restringido a las unidades habitacionales (UH). El BLUE PARK se
          reserva el derecho de realizar revisiones de seguridad en bolsas,
          mochilas para así mantener la seguridad de todos.
        </li>
        <li>
          Recuerde que la tensión en nuestro condominio es de 220V. Si es
          necesario, traiga su propio convertidor para garantizar una estadía
          completa.
        </li>
        <li>
          Si necesita cualquier asistencia durante la estadía, le recomendamos
          que contacte a la recepción del hotel.
        </li>
      </ol>

      <Box mt={4} textAlign="center">
        <Typography
          sx={{
            color: "white",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Recepción Barretos Country
          <br />
          Contacto: (45) 3521 2000 | recepcaomtr@hoteismabu.com.br
        </Typography>
      </Box>
    </>
  );
};
