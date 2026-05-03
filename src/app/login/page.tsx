"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useAuth from "./useAuth";
import { useRouter } from "next/navigation";
import { abrirTurno } from "../../../helpers/httpHelper";

export default function Login() {
  const { iniciarSesion, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const usuario = await iniciarSesion(username, password);

    await abrirTurno(usuario.id);

    router.push("/caja");
  } catch (error) {
    console.error(error);
  }
};


  return (
    <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Login
        </Typography>

        <TextField
          label="Usuario"
          fullWidth
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" onClick={handleLogin} disabled={loading}>
          Ingresar
        </Button>
      </Paper>
    </Box>
  );
}