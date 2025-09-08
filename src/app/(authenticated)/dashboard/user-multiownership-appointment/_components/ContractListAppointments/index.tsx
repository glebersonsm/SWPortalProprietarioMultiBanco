"use client";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { Owner } from "@/utils/types/multiownership/owners";
import { useRouter } from "next/navigation";
import { useReservar } from "../../context.hook";

export function OwnerCards({ owners }: { owners: Owner[] }) {
  const router = useRouter();
  const { setOwner } = useReservar();
  return (
    <Grid container spacing={2}>
      {owners.map((owner) => (
        <Grid item xs={12} key={owner.quotaId}>
          <Card
            variant="outlined"
            sx={{ display: "flex", alignItems: "center", p: 1 }}
          >
            <CardContent sx={{ flex: 1, py: "8px !important" }}>
              <Typography variant="body1">
                {owner.enterpriseName} – {owner.fractionName} –{" "}
                {owner.propertyNumber} – {owner.blockName} –{" "}
                {owner.propertyTypeCode} {owner.contractNumber}
              </Typography>
            </CardContent>
            <Box sx={{ pr: 2 }}>
              <Button
                onClick={() => {
                  setOwner(owner);
                  router.push(
                    `/dashboard/user-multiownership-appointment/ListAppointments`
                  );
                }}
                sx={{
                  backgroundColor: "var(--color-button-primary)",
                  color: "var(--color-button-text)",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                  "&:hover": {
                    backgroundColor: "var(--color-button-primary-hover)",
                  },
                }}
              >
                DETALHES
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
