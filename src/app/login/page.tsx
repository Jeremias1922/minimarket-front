"use client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import useAuth from "./useAuth";
import {
  abrirTurno,
  obtenerTurnoActual,
} from "../../../helpers/httpHelper";

interface UsuarioLogin {
  id: number;
  nombre: string;
  username: string;
  rol: "CAJERO" | "ENCARGADO" | "DUENIO";
}

export default function Login() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mensajeError, setMensajeError] =
    useState("");

  const [procesandoLogin, setProcesandoLogin] =
    useState(false);

  /*
   * Apertura de caja
   */
  const [modalApertura, setModalApertura] =
    useState(false);

  const [usuarioPendiente, setUsuarioPendiente] =
    useState<UsuarioLogin | null>(null);

  const [montoInicial, setMontoInicial] =
    useState("");

  const [
    mensajeErrorApertura,
    setMensajeErrorApertura,
  ] = useState("");

  const [
    procesandoApertura,
    setProcesandoApertura,
  ] = useState(false);

  const guardarUsuarioYRedirigir = (
    usuario: UsuarioLogin,
    destino: string
  ) => {
    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    router.replace(destino);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setMensajeError(
        "Ingresá el usuario y la contraseña."
      );

      return;
    }

    try {
      setProcesandoLogin(true);
      setMensajeError("");

      const usuario: UsuarioLogin =
        await iniciarSesion(
          username.trim(),
          password
        );

      /*
       * El dueño no abre turno.
       */
      if (usuario.rol === "DUENIO") {
        guardarUsuarioYRedirigir(
          usuario,
          "/dashboard"
        );

        return;
      }

      if (
        usuario.rol !== "CAJERO" &&
        usuario.rol !== "ENCARGADO"
      ) {
        setMensajeError(
          "El usuario no tiene un rol válido."
        );

        return;
      }

      /*
       * Antes de solicitar el monto inicial,
       * comprobamos si el mismo usuario ya tiene
       * un turno abierto.
       */
      try {
        await obtenerTurnoActual(usuario.id);

        /*
         * Ya tenía turno abierto.
         * Recupera la sesión y entra directamente.
         */
        guardarUsuarioYRedirigir(
          usuario,
          "/caja"
        );

        return;
      } catch (errorTurno) {
        if (
          axios.isAxiosError(errorTurno) &&
          errorTurno.response?.status === 404
        ) {
          /*
           * No tiene turno abierto.
           * Solicitamos el monto inicial.
           */
          setUsuarioPendiente(usuario);
          setMontoInicial("");
          setMensajeErrorApertura("");
          setModalApertura(true);

          return;
        }

        throw errorTurno;
      }
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setMensajeError(
            "Usuario o contraseña incorrectos."
          );

          return;
        }

        if (!error.response) {
          setMensajeError(
            "No se pudo conectar con el servidor."
          );

          return;
        }
      }

      setMensajeError(
        "No se pudo iniciar sesión. Intentá nuevamente."
      );
    } finally {
      setProcesandoLogin(false);
    }
  };

  const confirmarAperturaTurno = async () => {
    if (!usuarioPendiente) {
      return;
    }

    const monto = Number(montoInicial);

    if (
      montoInicial.trim() === "" ||
      !Number.isFinite(monto) ||
      monto < 0
    ) {
      setMensajeErrorApertura(
        "Ingresá un monto inicial válido."
      );

      return;
    }

    try {
      setProcesandoApertura(true);
      setMensajeErrorApertura("");

      await abrirTurno(
        usuarioPendiente.id,
        monto
      );

      guardarUsuarioYRedirigir(
        usuarioPendiente,
        "/caja"
      );
    } catch (error) {
      console.error(
        "Error al abrir el turno:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          const respuesta =
            error.response.data;

          const mensajeBackend =
            typeof respuesta === "string"
              ? respuesta
              : respuesta?.mensaje;

          setMensajeErrorApertura(
            mensajeBackend ||
              "Otro usuario dejó una sesión activa."
          );

          return;
        }

        if (error.response?.status === 400) {
          const respuesta =
            error.response.data;

          const mensajeBackend =
            typeof respuesta === "string"
              ? respuesta
              : respuesta?.message ||
                respuesta?.mensaje;

          setMensajeErrorApertura(
            mensajeBackend ||
              "El monto inicial ingresado no es válido."
          );

          return;
        }

        if (!error.response) {
          setMensajeErrorApertura(
            "No se pudo conectar con el servidor."
          );

          return;
        }
      }

      setMensajeErrorApertura(
        "No se pudo abrir el turno."
      );
    } finally {
      setProcesandoApertura(false);
    }
  };

  const cancelarApertura = () => {
    if (procesandoApertura) {
      return;
    }

    setModalApertura(false);
    setUsuarioPendiente(null);
    setMontoInicial("");
    setMensajeErrorApertura("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (procesandoLogin) {
      return;
    }

    await handleLogin();
  };

  const handleSubmitApertura = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (procesandoApertura) {
      return;
    }

    await confirmarAperturaTurno();
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 350,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
            }}
          >
            Iniciar sesión
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            {mensajeError && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {mensajeError}
              </Alert>
            )}

            <TextField
              label="Usuario"
              fullWidth
              sx={{ mb: 2 }}
              value={username}
              disabled={procesandoLogin}
              autoComplete="username"
              onChange={(event) => {
                setUsername(
                  event.target.value
                );

                if (mensajeError) {
                  setMensajeError("");
                }
              }}
            />

            <TextField
              label="Contraseña"
              type={
                mostrarPassword
                  ? "text"
                  : "password"
              }
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              disabled={procesandoLogin}
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                if (mensajeError) {
                  setMensajeError("");
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        disabled={
                          procesandoLogin
                        }
                        onClick={() =>
                          setMostrarPassword(
                            (valorActual) =>
                              !valorActual
                          )
                        }
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        edge="end"
                        aria-label={
                          mostrarPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {mostrarPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={procesandoLogin}
            >
              {procesandoLogin
                ? "Ingresando..."
                : "Ingresar"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={modalApertura}
        onClose={cancelarApertura}
        fullWidth
        maxWidth="xs"
      >
        <Box
          component="form"
          onSubmit={handleSubmitApertura}
        >
          <DialogTitle>
            Apertura de caja
          </DialogTitle>

          <DialogContent>
            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Indicá cuánto efectivo hay en la
              caja al comenzar el turno.
            </Typography>

            {mensajeErrorApertura && (
              <Alert
                severity="warning"
                sx={{ mb: 2 }}
              >
                {mensajeErrorApertura}
              </Alert>
            )}

            <TextField
              autoFocus
              fullWidth
              label="Monto inicial"
              type="number"
              value={montoInicial}
              disabled={procesandoApertura}
              onChange={(event) => {
                setMontoInicial(
                  event.target.value
                );

                if (mensajeErrorApertura) {
                  setMensajeErrorApertura("");
                }
              }}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                },
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
            }}
          >
            <Button
              type="button"
              onClick={cancelarApertura}
              disabled={procesandoApertura}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={procesandoApertura}
            >
              {procesandoApertura
                ? "Abriendo..."
                : "Abrir turno"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}