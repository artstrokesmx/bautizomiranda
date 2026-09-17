import Image from "next/image";

import Bienvenida from '@/app/componentes/Bienvenida';
import Contador from "@/app/componentes/Contador";
import Ubicacion from "@/app/componentes/Ubicacion";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-0 md:p-6 lg:p-10">
      {/* Marco Celular Fijo */}
      <div className="
        relative
        w-full
        max-w-[425px]
        h-[100vh] md:h-[840px]
        bg-invitation-bg-cream
        shadow-2xl
        rounded-none md:rounded-3xl
        overflow-hidden
        border-0 md:border md:border-stone-200
      ">
        {/* ======================================================== */}
        {/* CAPA DE MARCO FIJO (No se mueven al hacer scroll)        */}
        {/* ======================================================== */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Capa 1: Esquina Superior Derecha */}
          <Image
            src="/suprederecha.png"
            alt="Decoración Superior Derecha"
            fill
            className="object-cover object-top"
            priority
          />

          {/* Capa 2: Marco Izquierdo (Girasoles) */}
          <Image
            src="/marcoizqb.png"
            alt="Marco Izquierdo"
            fill
            className="object-cover object-left"
            priority
          />

          {/* Capa 3: Ilustración de la Virgencita */}
          <Image
            src="/virgencita2.png"
            alt="Ilustración Virgencita"
            fill
            className="object-cover object-bottom-right"
            priority
          />
        </div>

        {/* ======================================================== */}
        {/* CAPA DE CONTENIDO SCROLLEABLE                            */}
        {/* ======================================================== */}
        {/* 
          El padding interno (px-12, pt-16, pb-20) es CLAVE:
          Evita que el texto invada el área dibujada por el marco 
          de girasoles e ilustraciones.
        */}
        <div className="
          relative 
          z-10 
          h-full 
          w-full
          overflow-y-auto 
          overflow-x-hidden
          px-10 md:px-14 
          pt-2 pb-24 
          ml-6
          flex flex-col 
          items-center 
          text-center
          space-y-8
        ">
          <Bienvenida />
          <Contador />
          <Ubicacion />
        </div>

      </div>
    </main>
  );
}
