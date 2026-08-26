import {BienvenidaProps} from "@/types/interfaces/invitacion"

export default function Bienvenida({
  nombreBebe = "Miranda Sofía",
  nombreInvitado = "Juanito",
  nombreFamilia = "Familia Pérez",
}:BienvenidaProps) {
  return (
    <section className="text-center max-w-2xl mt-8 m-5">
      <div className="flex flex-col items-center mb-4 text-invitation-gold-accent">
        <span className="text-3xl font-light">†</span>
        <div className="flex gap-1 items-center">
          <span className="text-xl">❤︎</span>
          <span className="w-16 h-px bg-invitation-gold-accent block"></span>
          <span className="text-xl">❤︎</span>
        </div>
      </div>
      <div className="py-1.5 px-4 bg-amber-50/60 rounded-full border border-amber-200/50 inline-block">
        <p className="font-serif text-sm md:text-base text-invitation-text-brown">
          ¡Hola, <span className="font-bold">{nombreInvitado}</span>!
        </p>
      </div>
      <p>Te invito a ti y a toda tu familia {nombreFamilia}<br/> a:</p>
      <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-invitation-gold-accent font-semibold mb-2 block">
        Mi Bautizo
      </span>
      <h1 className="text-4xl md:text-6xl font-script text-pink-400 mb-4 tracking-tight">
        {nombreBebe}
      </h1>
      <p className="text-stone-600 italic text-base md:text-lg max-w-md mx-auto">
        Acompáñanos a celebrar el inicio de este camino de fe y amor.
      </p>
      <h2 className="text-lg text-pink-400" >
        Mis papás orgullosos
      </h2>
      <p className="text-orange-900 text-3xl font-script">
        Jessica Navarrete<br/>y<br/>Arturo Miranda</p>
      <h2 className="text-lg text-pink-400">
        Mis padrinos amorosos
      </h2>
      <p className="text-orange-900 text-3xl font-script">Nallely Navarrete<br/>y<br/>Marcos García</p>
      <p className="text-invitation-gold-accent font-serif text-lg md:text-xl italic leading-relaxed mt-8">
    «Te mando que te esfuerces y seas valiente; no temas ni desmayes, porque tu Dios estará contigo dondequiera que vayas.»</p>
      <p className="text-orange-900">-Josué 1:9-</p>
    </section>
  );
}