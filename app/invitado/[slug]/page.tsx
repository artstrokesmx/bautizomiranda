import Image from "next/image";

import Bienvenida from '@/app/componentes/Bienvenida';
import Contador from "@/app/componentes/Contador";
import Ubicacion from "@/app/componentes/Ubicacion";
import Mesa from "@/app/componentes/MesaRegalos";
import Itinerario from "@/app/componentes/Itinerario";
import Confirmacion from "@/app/componentes/Confirmacion";

// IMPORT ACTUALIZADO: Traemos la función desde el Server Action con Turso
import { obtenerInvitadoPorSlug } from "@/app/actions/invitados";

export default async function InvitacionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitado = await obtenerInvitadoPorSlug(slug);

  // Datos estáticos del evento (o puedes mantener tu servicio si ya existe)
  const evento = {
    nombreBebe: "Lucía", // Cambia esto por el nombre de tu bebé
  };

  if (!invitado) {
    return (
      <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-sm border border-stone-200">
          <h1 className="text-xl font-bold text-amber-900 mb-2">Invitación no encontrada</h1>
          <p className="text-sm text-stone-500">
            El enlace ingresado no es válido o ha expirado. Por favor verifica la URL con la persona que te invitó.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-100 flex items-center justify-center p-0 md:p-6 lg:p-10">
      <div className="
        relative
        w-full
        max-w-[425px]
        bg-invitation-bg-cream
        shadow-2xl
        rounded-none md:rounded-3xl
        overflow-hidden
        border-0 md:border md:border-stone-200
      ">
        {/* ======================================================== */}
        {/* CAPA DE MARCO FIJO                                       */}
        {/* ======================================================== */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Capa 1: Esquina Superior Derecha */}
          <Image
            src="/suprederecha.png"
            alt="Decoración Superior Derecha"
            fill
            className="object-contain object-right"
            priority
          />

          {/* Capa 2: Marco Izquierdo (Girasoles) */}
          <Image
            src="/marcoizqb.png"
            alt="Marco Izquierdo"
            fill
            className="object-contain object-left"
            priority
          />

          {/* Capa 3: Ilustración de la Virgencita */}
          <Image
            src="/virgencita2.png"
            alt="Ilustración Virgencita"
            className="object-contain object-right -translate-y-[50px]"
            fill
            priority
          />
        </div>

        {/* ======================================================== */}
        {/* CAPA DE CONTENIDO SCROLLEABLE                            */}
        {/* ======================================================== */}
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
          <Itinerario />

          <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-amber-200 max-w-sm w-full space-y-4">
            <p className="text-sm text-stone-600">
              Hemos reservado <strong className="text-amber-800">{invitado.pasesAsignados} pases</strong> para la {invitado.nombreFamilia}.
            </p>
            
            <Confirmacion 
              idInvitado={invitado.id}
              nombreInvitado={invitado.nombreInvitado}
              nombreFamilia={invitado.nombreFamilia}
              pasesAsignados={invitado.pasesAsignados}
              pasesNinos={invitado.pasesNinos}
              estatusInicial={invitado.estatus}
              confirmadosAdultosInicial={invitado.confirmadosAdultos}
              confirmadosNinosInicial={invitado.confirmadosNinos}
            />
          </div>
        </div>

      </div>
    </main>
  );
}