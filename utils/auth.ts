export const getUsuario = () => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};