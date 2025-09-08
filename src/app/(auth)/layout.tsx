"use client";

import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { Link } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalStyles
        styles={{
          fontSize: "12px",
          ":root": {
            "--Collapsed-breakpoint": "769px",
            "--Cover-width": "50vw",
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.2s",
          },
          td: {
            whiteSpace: "wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          },
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "row" }}></Box>
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 )",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Box
              component="section"
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 200,
                aspectRatio: "1500 / 1094",
                overflow: "hidden",
                mx: "auto",
                my: 2,
              }}
            >
              <Image
                src="/logo/My-Mabu.png"
                alt="Logo My Mabu"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Box>
          {children}
         <Box component="footer" sx={{ py: 3 }}>
          <Typography level="body-xs" textAlign="center">
            <Link href="https://swsolucoes.inf.br" target="_blank" rel="noopener noreferrer">
              © SW Soluções {new Date().getFullYear()}
            </Link>
          </Typography>
        </Box>
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          [theme.getColorSchemeSelector("dark")]: {
            filter: "brightness(0.4)",
          },
        })}
      >
        <Image
          alt="Background image"
          src={"/img/ImagemAntesLogin.jpg"}
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
    </>
  );
}
