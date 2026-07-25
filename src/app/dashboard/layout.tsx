"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

import Header from "../../../components/Header";
import DashboardHeader from "../../../components/DashboardHeader";

interface UsuarioGuardado {
  id: number;
  nombre: string;
  username: string;
  rol: "CAJERO" | "ENCARGADO" | "DUENIO";
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const [autorizado, setAutorizado] = useState(false);
  const [validando, setValidando] = useState(true);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");

    if (!usuarioStorage) {
      router.replace("/login");
      setValidando(false);
      return;
    }

    try {
      const usuario: UsuarioGuardado =
        JSON.parse(usuarioStorage);

      if (usuario.rol !== "DUENIO") {
        router.replace("/caja");
        setValidando(false);
        return;
      }

      setAutorizado(true);
    } catch (error) {
      console.error(
        "Usuario inválido en localStorage:",
        error
      );

      localStorage.removeItem("usuario");
      router.replace("/login");
    } finally {
      setValidando(false);
    }
  }, [router]);

  if (validando || !autorizado) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header title="Administración" />

      <DashboardHeader />

      <Box component="main">
        {children}
      </Box>
    </>
  );
}