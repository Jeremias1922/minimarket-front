"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button } from "@mui/material";

const opciones = [
  {
    nombre: "Resumen",
    href: "/dashboard/resumen",
  },
  {
    nombre: "Caja actual",
    href: "/dashboard/caja",
  },
  {
    nombre: "Finanzas",
    href: "/dashboard/finanzas",
  },
  {
    nombre: "Proveedores",
    href: "/dashboard/proveedores",
  },
  {
    nombre: "Empleados",
    href: "/dashboard/empleados",
  },
  {
    nombre: "Stock",
    href: "/dashboard/stock",
  },
];

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        minHeight: 62,
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 3,
        py: 1,
        overflowX: "auto",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 72,
        zIndex: 90,
      }}
    >
      {opciones.map((opcion) => {
        const activo =
          pathname === opcion.href ||
          pathname.startsWith(`${opcion.href}/`);

        return (
          <Button
            key={opcion.href}
            component={Link}
            href={opcion.href}
            variant={activo ? "contained" : "text"}
            sx={{
              flexShrink: 0,
              px: 2,
              borderRadius: 2,
              fontWeight: 700,
              color: activo ? "#ffffff" : "#374151",
              backgroundColor: activo
                ? "#f97316"
                : "transparent",

              "&:hover": {
                backgroundColor: activo
                  ? "#ea580c"
                  : "#fff7ed",
                color: activo
                  ? "#ffffff"
                  : "#ea580c",
              },
            }}
          >
            {opcion.nombre}
          </Button>
        );
      })}
    </Box>
  );
}