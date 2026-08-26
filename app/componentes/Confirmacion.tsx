'use client';

import { useState } from 'react';
import { ConfirmacionProps } from "@/types/interfaces/invitacion";
import { confirmarAsistenciaService } from "@/services/invitadosService";

export default function Confirmacion({
  idInvitado = "",
  pasesAsignados = 1,
  nombreFamilia,
  nombreInvitado,
  pasesNinos = 0,
}: ConfirmacionProps) {
  const [estatus, setEstatus] = useState<'pendiente' | 'confirmado' | 'rechazado'>('pendiente');
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // Inicialización de estados basada en las props recibidas
  const [adultos, setAdultos] = useState<number | ''>(pasesAsignados);
  const [ninos, setNinos] = useState<number | ''>(pasesNinos);

  const numAdultos = typeof adultos === 'number' ? adultos : 0;
  const numNinos = typeof ninos === 'number' ? ninos : 0;

  // 🟢 Helper para incrementar respetando el máximo asignado
  const incrementar = (
    setter: React.Dispatch<React.SetStateAction<number | ''>>,
    valorActual: number,
    maximoPermitido: number
  ) => {
    if (valorActual < maximoPermitido) {
      setter(valorActual + 1);
    }
  };

  // Helper para decrementar con un mínimo de 0
  const decrementar = (setter: React.Dispatch<React.SetStateAction<number | ''>>, valorMinimo = 0) => {
    setter((prev) => {
      const numActual = typeof prev === 'number' ? prev : 0;
      return numActual > valorMinimo ? numActual - 1 : valorMinimo;
    });
  };

  // 🟢 Control manual en input validando que no exceda el tope de la BD
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | ''>>,
    maximoPermitido: number
  ) => {
    const val = e.target.value;
    if (val === '') {
      setter('');
    } else {
      let parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        setter('');
      } else {
        // Si intenta ingresar manualmente un número mayor al máximo, se fuerza al tope permitido
        if (parsed > maximoPermitido) parsed = maximoPermitido;
        if (parsed < 0) parsed = 0;
        setter(parsed);
      }
    }
  };

  // Función principal para enviar la asistencia
  const responderAsistencia = async (confirmado: boolean) => {
    if (!idInvitado) {
      setMensajeError("No se encontró el identificador del invitado.");
      return;
    }

    setCargando(true);
    setMensajeError(null);

    const cantidadAdultos = typeof adultos === 'number' ? adultos : 0;
    const cantidadNinos = typeof ninos === 'number' ? ninos : 0;

    // Validación de seguridad previa al envío
    if (confirmado && (cantidadAdultos + cantidadNinos > pasesAsignados)) {
      setMensajeError(`El total de pases no puede exceder los ${pasesAsignados} pases reservados.`);
      setCargando(false);
      return;
    }

    try {
      await confirmarAsistenciaService({
        idInvitado,
        confirmado,
        pasesConfirmados: confirmado ? cantidadAdultos : 0,
        ninosConfirmados: confirmado ? cantidadNinos : 0,
      });

      setEstatus(confirmado ? 'confirmado' : 'rechazado');
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      setMensajeError("Ocurrió un error al guardar tu respuesta. Por favor intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Cálculos de máximos permitidos para cada control
  const maxAdultosPosibles = pasesAsignados - numNinos;
  const maxNinosPosibles = pasesAsignados - numAdultos;

  return (
    <div className="my-6 p-6 bg-amber-50/40 rounded-3xl border border-amber-200/50 text-center max-w-sm mx-auto shadow-sm">
      <h2 className="text-4xl text-pink-400 font-script mb-2">
        Confirma tu asistencia
      </h2>

      <p className="font-serif text-sm text-invitation-text-brown">
        {nombreInvitado ? `Hola ${nombreInvitado}, confirma tu asistencia y la de la` : 'Confirma la asistencia de la'}
      </p>

      <p className="font-serif text-sm text-invitation-text-brown font-semibold mb-1">
        {nombreFamilia}
      </p>

      <p className="font-serif text-xs text-invitation-text-brown/80 mb-4">
        Te hemos reservado <span className="font-bold">{pasesAsignados} pase(s)</span>.
      </p>

      {/* Controles de desglose de pases */}
      {estatus === 'pendiente' && (
        <div className="my-5 p-4 bg-white/70 rounded-2xl border border-amber-200/60 flex flex-col gap-3">
          
          {/* Selector de Adultos */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-xs text-invitation-text-brown font-medium">
              Adultos:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decrementar(setAdultos, 0)}
                disabled={numAdultos <= 0}
                className="w-8 h-8 rounded-full bg-amber-200/60 disabled:opacity-30 text-amber-900 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center text-sm"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                max={maxAdultosPosibles}
                value={adultos}
                onChange={(e) => handleInputChange(e, setAdultos, maxAdultosPosibles)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="w-12 text-center py-1 border border-amber-300 rounded-lg text-sm font-semibold text-invitation-text-brown bg-white outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button
                type="button"
                onClick={() => incrementar(setAdultos, numAdultos, maxAdultosPosibles)}
                disabled={numAdultos >= maxAdultosPosibles}
                className="w-8 h-8 rounded-full bg-amber-200/60 disabled:opacity-30 text-amber-900 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Selector de Niños */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-xs text-invitation-text-brown font-medium">
              Niños:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decrementar(setNinos, 0)}
                disabled={numNinos <= 0}
                className="w-8 h-8 rounded-full bg-amber-200/60 disabled:opacity-30 text-amber-900 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center text-sm"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                max={maxNinosPosibles}
                value={ninos}
                onChange={(e) => handleInputChange(e, setNinos, maxNinosPosibles)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="w-12 text-center py-1 border border-amber-300 rounded-lg text-sm font-semibold text-invitation-text-brown bg-white outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button
                type="button"
                onClick={() => incrementar(setNinos, numNinos, maxNinosPosibles)}
                disabled={numNinos >= maxNinosPosibles}
                className="w-8 h-8 rounded-full bg-amber-200/60 disabled:opacity-30 text-amber-900 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

        </div>
      )}

      <p className="font-serif text-xs text-invitation-text-brown/90 leading-relaxed mb-6">
        Por favor confirma si nos acompañarás antes del <strong>10 de octubre de 2026</strong>.
      </p>

      {/* Mensaje de error */}
      {mensajeError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-xs font-serif">
          {mensajeError}
        </div>
      )}

      {/* Estatus Confirmado */}
      {estatus === 'confirmado' && (
        <div className="p-4 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-2xl font-serif text-sm">
          ¡Muchas gracias! Hemos guardado tu confirmación ({adultos || 0} adulto(s) y {ninos || 0} niño(s)). Nos dará mucho gusto ver a la {nombreFamilia}.
        </div>
      )}

      {/* Estatus Rechazado */}
      {estatus === 'rechazado' && (
        <div className="p-4 bg-stone-200/80 border border-stone-300 text-stone-700 rounded-2xl font-serif text-sm">
          Lamentamos que no nos puedan acompañar, muchas gracias por avisarnos.
        </div>
      )}

      {/* Botones de acción */}
      {estatus === 'pendiente' && (
        <div className="flex flex-row gap-3 justify-center w-full">
          <button
            onClick={() => responderAsistencia(true)}
            disabled={cargando}
            className="flex-1 py-3 px-4 bg-pink-400 hover:bg-amber-800 disabled:opacity-50 text-white font-serif text-sm font-medium rounded-full shadow-md transition-all active:scale-95"
          >
            {cargando ? 'Guardando...' : '¡Sí asistiré!'}
          </button>

          <button
            onClick={() => responderAsistencia(false)}
            disabled={cargando}
            className="flex-1 py-3 px-4 bg-pink-950 hover:bg-stone-500 disabled:opacity-50 text-white font-serif text-sm font-medium rounded-full shadow-md transition-all active:scale-95"
          >
            No podré acudir
          </button>
        </div>
      )}
    </div>
  );
}