"use client";

import { useState } from "react";
import { login } from "./authApi";
import { IUsuario } from "./usuario.interface";

export default function useAuth() {
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async (username: string, password: string) => {
    try {
      setLoading(true);

      const usuario = await login(username, password);

      localStorage.setItem("usuario", JSON.stringify(usuario));

      return usuario;
    } catch (error) {
      alert("Usuario o contraseña incorrectos");
      throw error;
    } finally {
      setLoading(false);
    }
  };

 const obtenerUsuario = (): IUsuario | null => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
  };

  return {
    iniciarSesion,
    obtenerUsuario,
    cerrarSesion,
    loading,
  };
}