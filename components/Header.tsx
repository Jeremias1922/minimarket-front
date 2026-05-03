"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

interface Usuario {
  nombre: string;
  rol: "ADMIN" | "CAJERO";
}

export default function Header({ title }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) {
      setUsuario(JSON.parse(data));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  return (
    <Box
      component="header"
      sx={{
        height: 72,
        backgroundColor: "#ffffff",
        borderBottom: "3px solid #f97316",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* IZQUIERDA */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            width: 44,
            height: 44,
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#ea580c",
            "&:hover": {
              backgroundColor: "#ffedd5",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        {open && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: 56,
              left: 0,
              width: 220,
              borderRadius: 3,
              overflow: "hidden",
              zIndex: 200,
            }}
          >
            <MenuLink href="/caja">Caja</MenuLink>
            <MenuLink href="/productos">Productos</MenuLink>
            <MenuLink href="/ventas">Ventas</MenuLink>
            <MenuLink href="/turnos">Turnos</MenuLink>
          </Paper>
        )}
      </Box>

      {/* DERECHA */}
      {usuario && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontWeight: 500 }}>
            {usuario.nombre} 
          </Typography>

          <Button variant="outlined" color="error" onClick={cerrarSesion}>
            Salir
          </Button>
        </Box>
      )}
    </Box>
  );
}

function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#fff7ed",
            color: "#ea580c",
          },
        }}
      >
        {children}
      </Box>
    </Link>
  );
}