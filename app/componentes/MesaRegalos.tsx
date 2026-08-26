import Link from "next/link";

export default function MesaRegalos() {
  return (
    <div className="my-6 p-6 bg-amber-50/40 rounded-3xl border border-amber-200/50 text-center max-w-sm mx-auto">
      {/* Título con la fuente cursiva Niconne */}
      <h2 className="text-4xl text-pink-400 font-script mb-3">
        Mesa de Regalos
      </h2>

      {/* Párrafos estilizados con la fuente Serif */}
      <p className="font-serif text-sm text-invitation-text-brown leading-relaxed mb-3">
        Lo que más valoramos es tu presencia y oración por Miranda y nuestra familia. La mayor de las bendiciones es la amistad, la salud y la familia.
      </p>

      <p className=" text-invitation-text-brown leading-relaxed mb-6">
        Si además deseas consentir a Miranda con un detalle, puedes ver nuestras sugerencias en la mesa de regalos:
      </p>

      {/* Botón de enlace a Liverpool */}
      <Link
        href="https://www.liverpool.com.mx" // Reemplazar con la URL exacta de tu evento
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full py-3 px-6 bg-pink-500 hover:bg-rose-200 text-white font-serif text-sm font-medium rounded-full shadow-md transition-colors"
      >
        Ver Mesa en Liverpool
      </Link>
    </div>
  );
}