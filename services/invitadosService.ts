// src/services/invitadosService.ts
import { MOCK_INVITADOS, DATOS_EVENTO } from "@/lib/MockData";
import { Invitado } from "@/types/interfaces/invitacion";

// Interfaz para el payload de confirmación
export interface ConfirmarAsistenciaPayload {
  idInvitado: string;
  confirmado: boolean;
  pasesConfirmados?: number;
  ninosConfirmados?: number;
}

export async function agregarInvitadoService(nuevoInvitado: Invitado): Promise<Invitado> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  MOCK_INVITADOS.unshift(nuevoInvitado);
  return nuevoInvitado;
}

// Simula la consulta por slug: SELECT * FROM invitados WHERE slug = slug
export async function obtenerInvitadoPorSlug(slug: string): Promise<Invitado | null> {
  // Simulamos un pequeño retraso de red (opcional)
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const invitado = MOCK_INVITADOS.find((i) => i.slug === slug);
  return invitado || null;
}

// Obtener todos los invitados para el panel de administración
export async function obtenerTodosLosInvitados(): Promise<Invitado[]> {
  return MOCK_INVITADOS;
}

// Obtener la información del evento
export async function obtenerDatosEvento() {
  return DATOS_EVENTO;
}

// 🟢 FUNCIÓN QUE FALTABA: Confirmar asistencia
export async function confirmarAsistenciaService(payload: ConfirmarAsistenciaPayload): Promise<boolean> {
  // Simulamos retraso de red (cuando te conectes a Turso, aquí irá el `await db.execute(...)`)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const invitadoIndex = MOCK_INVITADOS.findIndex((i) => i.id === payload.idInvitado);

  if (invitadoIndex !== -1) {
    // Actualizamos el mock en memoria
    MOCK_INVITADOS[invitadoIndex] = {
      ...MOCK_INVITADOS[invitadoIndex],
      estatus: payload.confirmado ? 'confirmado' : 'rechazado',
      pasesAsignados: payload.confirmado && payload.pasesConfirmados !== undefined 
        ? payload.pasesConfirmados 
        : MOCK_INVITADOS[invitadoIndex].pasesAsignados,
      pasesNinos: payload.confirmado && payload.ninosConfirmados !== undefined 
        ? payload.ninosConfirmados 
        : MOCK_INVITADOS[invitadoIndex].pasesNinos,
    };
    return true;
  }

  throw new Error("Invitado no encontrado");
}