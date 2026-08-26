// src/lib/mockData.ts
import { Invitado } from "@/types/interfaces/invitacion";

export interface EventoInfo {
  nombreBebe: string;
  papas: string;
  padrinos: string;
  citaBiblica: string;
  referenciaCita: string;
}

export const DATOS_EVENTO: EventoInfo = {
  nombreBebe: "Miranda Sofía",
  papas: "Jessica Navarrete y Arturo Miranda",
  padrinos: "Nallely Navarrete y Marcos García",
  citaBiblica: "«Te mando que te esfuerces y seas valiente; no temas ni desmayes, porque tu Dios estará contigo dondequiera que vayas.»",
  referenciaCita: "- Josué 1:9 -",
};

export const MOCK_INVITADOS: Invitado[] = [
  {
    id: "1",
    slug: "carlos-gomez",
    nombreInvitado: "Carlos Gómez",
    nombreFamilia: "Familia Gómez",
    pasesAsignados: 2,
    pasesNinos: 1,
    menuNinos: true,
    categoria: "Familia Jessy",
    estatus: "confirmado",
  },
  {
    id: "2",
    slug: "mariana-lopez",
    nombreInvitado: "Mariana López",
    nombreFamilia: "Familia López",
    pasesAsignados: 3,
    pasesNinos: 0,
    menuNinos: false,
    categoria: "Amigo Arturo",
    estatus: "pendiente",
  },
  {
    id: "3",
    slug: "pedro-martinez",
    nombreInvitado: "Pedro Martínez",
    nombreFamilia: "Familia Martínez",
    pasesAsignados: 1,
    pasesNinos: 0,
    menuNinos: false,
    categoria: "Trabajo",
    estatus: "rechazado",
  },
  {
    id: "4",
    slug: "Juan-Navarrete",
    nombreInvitado: "Juan Navarrete",
    nombreFamilia: "Familia Navarrete",
    pasesAsignados: 4,
    pasesNinos: 0,
    menuNinos: false,
    categoria: "Trabajo",
    estatus: "rechazado",
  },
  {
    id: "5",
    slug: "camila-miranda",
    nombreInvitado: "Camila Miranda",
    nombreFamilia: "Familia Miranda",
    pasesAsignados: 3,
    pasesNinos: 0,
    menuNinos: false,
    categoria: "Trabajo",
    estatus: "rechazado",
  },
  {
    id: "6",
    slug: "ariana-velez",
    nombreFamilia: "Familia Velez",
    nombreInvitado: "Ariana Velez",
    pasesAsignados: 8,
    pasesNinos: 0,
    menuNinos: false,
    categoria: "Trabajo",
    estatus: "rechazado",
  },
];