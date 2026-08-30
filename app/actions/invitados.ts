'use server';

import { db } from '@/lib/turso'; // Ajusta la ruta a tu archivo turso.ts si es necesario
import { revalidatePath } from 'next/cache';

export interface Invitado {
  id: string;
  slug: string;
  nombreInvitado: string;
  nombreFamilia: string;
  pasesAsignados: number;
  pasesNinos: number;
  categoria: string;
  menuNinos: boolean;
  estatus: 'pendiente' | 'confirmado' | 'cancelado';
  confirmadosAdultos?: number;
  confirmadosNinos?: number;
}

// 1. Obtener todos los invitados desde Turso
export async function obtenerInvitados(): Promise<Invitado[]> {
  try {
    const result = await db.execute('SELECT * FROM invitados ORDER BY created_at DESC');

    return result.rows.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      nombreInvitado: row.nombre_invitado as string,
      nombreFamilia: row.nombre_familia as string,
      pasesAsignados: Number(row.pases_asignados),
      pasesNinos: Number(row.pases_ninos),
      categoria: row.categoria as string,
      menuNinos: Boolean(row.menu_ninos),
      estatus: row.estatus as 'pendiente' | 'confirmado' | 'cancelado',
      confirmadosAdultos: Number(row.confirmados_adultos || 0),
      confirmadosNinos: Number(row.confirmados_ninos || 0),
    }));
  } catch (error) {
    console.error('Error al obtener invitados:', error);
    throw new Error('No se pudieron obtener los invitados');
  }
}

// 2. Obtener un invitado por su Slug (para la vista de invitación /invitado/[slug])
export async function obtenerInvitadoPorSlug(slug: string): Promise<Invitado | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM invitados WHERE slug = ? LIMIT 1',
      args: [slug],
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id as string,
      slug: row.slug as string,
      nombreInvitado: row.nombre_invitado as string,
      nombreFamilia: row.nombre_familia as string,
      pasesAsignados: Number(row.pases_asignados),
      pasesNinos: Number(row.pases_ninos),
      categoria: row.categoria as string,
      menuNinos: Boolean(row.menu_ninos),
      estatus: row.estatus as 'pendiente' | 'confirmado' | 'cancelado',
      confirmadosAdultos: Number(row.confirmados_adultos || 0),
      confirmadosNinos: Number(row.confirmados_ninos || 0),
    };
  } catch (error) {
    console.error('Error al obtener invitado por slug:', error);
    return null;
  }
}

// 3. Agregar un nuevo invitado a Turso
export async function agregarInvitadoService(invitado: Omit<Invitado, 'id'>) {
  try {
    const id = crypto.randomUUID(); // Generamos UUID único en el servidor

    await db.execute({
      sql: `INSERT INTO invitados (
        id, slug, nombre_invitado, nombre_familia, pases_asignados, pases_ninos, categoria, menu_ninos, estatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        invitado.slug,
        invitado.nombreInvitado,
        invitado.nombreFamilia,
        invitado.pasesAsignados,
        invitado.pasesNinos,
        invitado.categoria,
        invitado.menuNinos ? 1 : 0, // Convertimos boolean a 1 o 0 para SQLite
        invitado.estatus,
      ],
    });

    // Revalidar las rutas para refrescar datos
    revalidatePath('/admin');
    revalidatePath('/panel');

    return { success: true, id };
  } catch (error) {
    console.error('Error al agregar invitado:', error);
    return { success: false, error: 'Error al guardar en la base de datos' };
  }
}

// 4. Confirmar o rechazar asistencia desde la invitación del cliente
export async function confirmarAsistenciaService(datos: {
  id: string;
  estatus: 'confirmado' | 'cancelado';
  confirmadosAdultos: number;
  confirmadosNinos: number;
}) {
  try {
    await db.execute({
      sql: `UPDATE invitados 
            SET estatus = ?, confirmados_adultos = ?, confirmados_ninos = ? 
            WHERE id = ?`,
      args: [
        datos.estatus,
        datos.confirmadosAdultos,
        datos.confirmadosNinos,
        datos.id,
      ],
    });

    revalidatePath('/admin');
    revalidatePath('/panel');

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la asistencia:', error);
    return { success: false, error: 'No se pudo guardar la respuesta.' };
  }
}

// 5. Eliminar invitado desde el panel
export async function eliminarInvitadoService(id: string) {
  try {
    await db.execute({
      sql: 'DELETE FROM invitados WHERE id = ?',
      args: [id],
    });

    revalidatePath('/admin');
    revalidatePath('/panel');

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar invitado:', error);
    return { success: false, error: 'No se pudo eliminar el invitado' };
  }
}