"use client";

import Header from "../../../components/Header";
import MovimientosCaja from "./MovimientosCaja";

export default function Page() {
  return (
    <>
      <Header title="Movimientos de caja" />

      <MovimientosCaja />
    </>
  );
}