"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Grid, Box, Typography, Stack } from "@mui/joy";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ImageIcon from "@mui/icons-material/Image";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentIcon from "@mui/icons-material/Payment";

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigateToGeral = () => {
    router.push("/dashboard/settings/geral");
  };

  const handleNavigateToImagens = () => {
    router.push("/dashboard/settings/imagens-home");
  };

  const handleNavigateToRegrasTarifarias = () => {
    router.push("/dashboard/settings/regras-tarifarias");
  };

  const handleNavigateToFinanceiras = () => {
    router.push("/dashboard/settings/financeiras");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "lg",
              boxShadow: "sm",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "md",
                transform: "translateY(-2px)",
                borderColor: "primary.300",
              },
            }}
            onClick={handleNavigateToGeral}
          >
            <CardContent>
              <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.softBg",
                    color: "primary.softColor",
                    mb: 1,
                  }}
                >
                  <SettingsRoundedIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  level="title-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Configurações gerais
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Gerenciar configurações do sistema
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "lg",
              boxShadow: "sm",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "md",
                transform: "translateY(-2px)",
                borderColor: "primary.300",
              },
            }}
            onClick={handleNavigateToImagens}
          >
            <CardContent>
              <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.softBg",
                    color: "primary.softColor",
                    mb: 1,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  level="title-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Imagens da Home
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Gerenciar grupos de imagens da home
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "lg",
              boxShadow: "sm",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "md",
                transform: "translateY(-2px)",
                borderColor: "primary.300",
              },
            }}
            onClick={handleNavigateToRegrasTarifarias}
          >
            <CardContent>
              <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.softBg",
                    color: "primary.softColor",
                    mb: 1,
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  level="title-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Regras tarifárias
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Gerenciar regras de pax free
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "lg",
              boxShadow: "sm",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "md",
                transform: "translateY(-2px)",
                borderColor: "primary.300",
              },
            }}
            onClick={handleNavigateToFinanceiras}
          >
            <CardContent>
              <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.softBg",
                    color: "primary.softColor",
                    mb: 1,
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  level="title-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Financeiras
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Configurações financeiras e gateways
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
