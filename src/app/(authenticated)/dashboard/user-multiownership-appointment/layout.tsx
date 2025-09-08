import React from "react";
import PageLayout from "../_components/PageLayout";
import { ReservarProvider } from "./context.hook";
import { FiltersProvider } from "./Filters.context.hook";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FiltersProvider>
      <ReservarProvider>
        <PageLayout
          title={
            <span style={{ color: "var(--color-title)" }}>
              Meus agendamentos
            </span>
          }
        >
          {children}
        </PageLayout>
      </ReservarProvider>
    </FiltersProvider>
  );
}
