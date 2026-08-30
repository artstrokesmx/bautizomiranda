export interface InvitadoBase {
  nombreInvitado?: string;
  nombreFamilia?: string;
}

export interface BienvenidaProps extends InvitadoBase {
  nombreBebe?: string;
}

export interface ConfirmacionProps extends InvitadoBase {
  idInvitado?: string;
  pasesAsignados?: number;
  pasesNinos?: number; // 👈 Agregado aquí
}

// Extiende de ConfirmacionProps
export interface Invitado extends ConfirmacionProps {
  id: string;
  slug: string;
  nombreInvitado: string;
  nombreFamilia: string;
  pasesAsignados: number;
  pasesNinos?: number;
  menuNinos: boolean;
  categoria: string;
  estatus: 'confirmado' | 'pendiente' | 'rechazado';
  mesaAsignada?: number | null;
}

export interface TiempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}