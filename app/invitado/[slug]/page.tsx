import Image from "next/image";

import Bienvenida from '@/app/componentes/Bienvenida';
import Contador from "@/app/componentes/Contador";
import Ubicacion from "@/app/componentes/Ubicacion";
import Mesa from "@/app/componentes/MesaRegalos";
import Itinerario from "@/app/componentes/Itinerario"
import Confirmacion from "@/app/componentes/Confirmacion"

//prueba de bd
import { obtenerInvitadoPorSlug, obtenerDatosEvento } from "@/services/invitadosService";


export default async function InvitacionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitado = await obtenerInvitadoPorSlug(slug);
  const evento = await obtenerDatosEvento();


  if (!invitado) {
    return <p className="text-center mt-10">Invitación no encontrada</p>;
  }

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-0 md:p-6 lg:p-10">
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
          <Bienvenida 
            nombreInvitado={invitado.nombreInvitado}
            nombreFamilia={invitado.nombreFamilia}
            nombreBebe={evento.nombreBebe}
          />
          <Contador />
          <Ubicacion />
          <Mesa />
          <Itinerario/>
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-amber-200 max-w-sm w-full space-y-4">
            <p className="text-sm text-stone-600">
              Hemos reservado <strong className="text-amber-800">{invitado.pasesAsignados} pases</strong> para la {invitado.nombreFamilia}.
            </p>
            
            <Confirmacion 
              idInvitado={invitado.id}
              pasesAsignados={invitado.pasesAsignados}
              nombreFamilia={invitado.nombreFamilia}
            />
      </div>
        </div>

      </div>
    </main>
  );
}