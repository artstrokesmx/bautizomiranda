'use client';

import { useEffect, useState } from 'react';
import { TiempoRestante } from '@/types/interfaces/invitacion';

const FECHA_BAUTIZO = '2026-10-24T10:00:00';

const TIEMPO_INICIAL: TiempoRestante = {
  dias: 0,
  horas: 0,
  minutos: 0,
  segundos: 0,
};

function calcularTiempo(): TiempoRestante {
  const diferencia =
    new Date(FECHA_BAUTIZO).getTime() - Date.now();

  if (diferencia <= 0) {
    return TIEMPO_INICIAL;
  }

  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor(
      (diferencia / (1000 * 60 * 60)) % 24
    ),
    minutos: Math.floor(
      (diferencia / (1000 * 60)) % 60
    ),
    segundos: Math.floor(
      (diferencia / 1000) % 60
    ),
  };
}

export default function Contador() {
  const [timeLeft, setTimeLeft] =
    useState<TiempoRestante>(TIEMPO_INICIAL);

  const [fechaTexto, setFechaTexto] = useState('');

  useEffect(() => {
    const actualizar = () => {
      setTimeLeft(calcularTiempo());

      setFechaTexto(
        new Date(FECHA_BAUTIZO).toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    actualizar();

    const timer = window.setInterval(actualizar, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="mt-10 p-6 bg-red-100/50 rounded-3xl border border-amber-500 shadow-sm text-center">
      <h2 className="text-3xl  tracking-widest text-pink-400 font-script mb-2">
        Aparta el día
      </h2>

      <p className="text-invitation-gold-accent font-bold text-xl capitalize min-h-6">
        {fechaTexto || '\u00A0'}
      </p>

      <div className="flex justify-center gap-3 md:gap-6 my-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="flex flex-col items-center bg-white/80 backdrop-blur-sm shadow-md border border-amber-100 rounded-2xl p-3 min-w-[70px] md:min-w-[90px]"
          >
            <span className="text-2xl md:text-4xl font-bold text-amber-800">
              {String(value).padStart(2, '0')}
            </span>

            <span className="text-xs md:text-sm capitalize text-stone-500 font-medium">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}