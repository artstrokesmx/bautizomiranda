'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from "next";

import { 
  obtenerInvitados, 
  agregarInvitadoService, 
  eliminarInvitadoService, 
  actualizarInvitadoService, 
  Invitado 
} from '@/app/actions/invitados';

const generarSlug = (nombre: string) => {
  return nombre
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

function compartirWhatsApp(invitado: Invitado) {
  const urlInvitacion = `${window.location.origin}/invitado/${invitado.slug}`;
  const mensaje = `¡Hola ${invitado.nombreInvitado}! 👋✨\nNos encantaría que nos acompañaras en el bautizo. Diseñamos una invitación especial para ti:\n\n👉 ${urlInvitacion}`;
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  
  window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');
}

export const metadata: Metadata = {
  title: "Panel de Administración | Bautizo Sofía",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Panel() {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración de Mesas
  const [numMesas, setNumMesas] = useState<number>(6);
  const [sillasPorMesa, setSillasPorMesa] = useState<number>(10);
  const [asignacionesMesas, setAsignacionesMesas] = useState<Record<string, number>>({});

  // Estado para el formulario de nuevo invitado
  const [nombreInvitado, setNombreInvitado] = useState('');
  const [nombreFamilia, setNombreFamilia] = useState('');
  const [pasesAsignados, setPasesAsignados] = useState(2);
  const [pasesNinos, setPasesNinos] = useState(0);
  const [categoria, setCategoria] = useState('Familia Jessy');
  const [menuNinos, setMenuNinos] = useState(false);

  // Estado para edición en Modal
  const [invitadoAEditar, setInvitadoAEditar] = useState<Invitado | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datos = await obtenerInvitados();
        setInvitados(datos);
      } catch (error) {
        console.error('Error cargando invitados de Turso:', error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const handleAgregarInvitado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInvitado.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const datosNuevoInvitado = {
      slug: generarSlug(nombreInvitado),
      nombreInvitado,
      nombreFamilia: nombreFamilia || `Familia ${nombreInvitado.split(' ')[0]}`,
      pasesAsignados: Number(pasesAsignados),
      pasesNinos: Number(pasesNinos),
      categoria,
      menuNinos,
      estatus: 'pendiente' as const,
    };

    try {
      const res = await agregarInvitadoService(datosNuevoInvitado);

      if (res.success && res.id) {
        const invitadoCreado: Invitado = {
          ...datosNuevoInvitado,
          id: res.id,
        };

        setInvitados((prev) => [invitadoCreado, ...prev]);

        setNombreInvitado('');
        setNombreFamilia('');
        setPasesAsignados(2);
        setPasesNinos(0);
        setMenuNinos(false);
      } else {
        alert('Hubo un error al guardar el invitado en Turso.');
      }
    } catch (error) {
      console.error('Error al agregar el invitado:', error);
      alert('Hubo un error inesperado al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Función para eliminar invitado
  const handleEliminarInvitado = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a "${nombre}"?`)) return;

    try {
      const res = await eliminarInvitadoService(id);
      if (res.success) {
        setInvitados((prev) => prev.filter((i) => i.id !== id));
        // Remover de la asignación de mesas si estaba asignado
        handleAsignarMesa(id, null);
      } else {
        alert(res.error || 'No se pudo eliminar el invitado.');
      }
    } catch (error) {
      console.error('Error al eliminar invitado:', error);
      alert('Ocurrió un error inesperado.');
    }
  };

  // ✏️ Función para guardar la edición de invitado
// ✅ CÓDIGO CORREGIDO:
const handleGuardarEdicion = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!invitadoAEditar) return;

  setIsSubmitting(true);

  try {
    const res = await actualizarInvitadoService(invitadoAEditar);
    if (res.success) {
      const nuevoSlug = res.slug || invitadoAEditar.slug;
      const invitadoActualizado = { ...invitadoAEditar, slug: nuevoSlug };

      setInvitados((prev) =>
        prev.map((i) => (i.id === invitadoAEditar.id ? invitadoActualizado : i))
      );
      setInvitadoAEditar(null);
    } else {
      alert(res.error || 'Error al actualizar el invitado.');
    }
  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('Ocurrió un error al guardar la edición.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleAsignarMesa = (invitadoId: string, mesaNumero: number | null) => {
    setAsignacionesMesas((prev) => {
      const copy = { ...prev };
      if (mesaNumero === null) {
        delete copy[invitadoId];
      } else {
        copy[invitadoId] = mesaNumero;
      }
      return copy;
    });
  };

  const totalPases = invitados.reduce((acc, curr) => acc + curr.pasesAsignados, 0);
  const confirmados = invitados.filter(i => i.estatus === 'confirmado').reduce((acc, curr) => acc + curr.pasesAsignados, 0);
  const pendientes = invitados.filter(i => i.estatus === 'pendiente').reduce((acc, curr) => acc + curr.pasesAsignados, 0);
  const rechazados = invitados.filter(i => i.estatus === 'cancelado').reduce((acc, curr) => acc + curr.pasesAsignados, 0);

  const invitadosSinMesa = invitados.filter(inv => !asignacionesMesas[inv.id]);
  const categoriasDisponibles = ['Familia Jessy', 'Familia Arturo', 'Amigo Jessy', 'Amigo Arturo', 'Trabajo'];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8 font-serif text-stone-800">
      
      {/* Encabezado */}
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-amber-900">Panel de Control</h2>
        <p className="text-sm text-stone-500">Administra tus invitados y pases para el bautizo.</p>
      </header>

      {/* Grid Principal: Formulario + Estadísticas/Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Alta */}
        <section className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4 h-fit">
          <h2 className="text-xl font-bold text-amber-900 border-b pb-2">Agregar Invitado</h2>
          
          <form className="space-y-4" onSubmit={handleAgregarInvitado}>
            <div>
              <label className="block text-xs font-bold mb-1">Nombre del invitado:</label>
              <input 
                type="text" 
                required
                value={nombreInvitado}
                onChange={(e) => setNombreInvitado(e.target.value)}
                placeholder="Ej: Mariana López" 
                className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Nombre de la Familia:</label>
              <input 
                type="text" 
                value={nombreFamilia}
                onChange={(e) => setNombreFamilia(e.target.value)}
                placeholder="Ej: Familia López" 
                className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Total Pases:</label>
                <input 
                  type="number" 
                  min="1"
                  value={pasesAsignados}
                  onChange={(e) => setPasesAsignados(Number(e.target.value))}
                  className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Niños:</label>
                <input 
                  type="number" 
                  min="0"
                  max={pasesAsignados}
                  value={pasesNinos}
                  onChange={(e) => setPasesNinos(Number(e.target.value))}
                  className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Tipo de invitado:</label>
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="menuNinos" 
                checked={menuNinos}
                onChange={(e) => setMenuNinos(e.target.checked)}
                className="w-4 h-4 text-pink-500 rounded accent-pink-400 cursor-pointer" 
              />
              <label htmlFor="menuNinos" className="text-xs font-medium cursor-pointer select-none">
                ¿Requiere menú infantil?
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? 'Guardando en Turso...' : 'Guardar Invitado'}
            </button>
          </form>
        </section>

        {/* Métricas y Lista */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Métricas rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-200 text-center">
              <span className="block text-xs text-amber-800 font-bold uppercase">Total Pases</span>
              <span className="text-2xl font-bold text-amber-900">{totalPases}</span>
            </div>
            <div className="bg-emerald-100/60 p-4 rounded-2xl border border-emerald-200 text-center">
              <span className="block text-xs text-emerald-800 font-bold uppercase">Confirmados</span>
              <span className="text-2xl font-bold text-emerald-900">{confirmados}</span>
            </div>
            <div className="bg-yellow-100/60 p-4 rounded-2xl border border-yellow-200 text-center">
              <span className="block text-xs text-yellow-800 font-bold uppercase">Pendientes</span>
              <span className="text-2xl font-bold text-yellow-900">{pendientes}</span>
            </div>
            <div className="bg-rose-100/60 p-4 rounded-2xl border border-rose-200 text-center">
              <span className="block text-xs text-rose-800 font-bold uppercase">Rechazados</span>
              <span className="text-2xl font-bold text-rose-900">{rechazados}</span>
            </div>
          </div>

          {/* Distribución por Grupos */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600">
              Distribución por Grupos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {categoriasDisponibles.map((cat) => {
                const count = invitados.filter(i => i.categoria === cat).reduce((acc, curr) => acc + curr.pasesAsignados, 0);
                return (
                  <div key={cat} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <p className="font-bold text-stone-700">{cat}</p>
                    <p className="text-stone-500">{count} pases asignados</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de Invitados */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-800">Lista de Invitados</h3>

            {loading ? (
              <p className="text-sm text-stone-400 text-center py-6">Cargando invitados desde Turso...</p>
            ) : invitados.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-6">No hay invitados registrados.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {invitados.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between text-sm flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {inv.estatus === 'confirmado' && <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm flex-shrink-0" title="Confirmado"></span>}
                      {inv.estatus === 'pendiente' && <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm animate-pulse flex-shrink-0" title="Pendiente"></span>}
                      {inv.estatus === 'cancelado' && <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm flex-shrink-0" title="Cancelado"></span>}
                      
                      <div>
                        <p className="font-bold text-stone-800">{inv.nombreInvitado} <span className="text-stone-500 font-normal">({inv.nombreFamilia})</span></p>
                        <p className="text-xs text-stone-400">{inv.categoria} • {inv.pasesAsignados} pases ({inv.pasesNinos} niños)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button 
                        onClick={() => setInvitadoAEditar(inv)}
                        className="text-xs px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold transition-colors"
                        title="Editar invitado"
                      >
                        ✏️ Editar
                      </button>

                      <button 
                        onClick={() => handleEliminarInvitado(inv.id, inv.nombreInvitado)}
                        className="text-xs px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-bold transition-colors"
                        title="Eliminar invitado"
                      >
                        🗑️
                      </button>

                      <button 
                        onClick={() => {
                          const url = `${window.location.origin}/invitado/${inv.slug}`;
                          navigator.clipboard.writeText(url);
                          alert('¡Enlace copiado al portapapeles!');
                        }}
                        className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors"
                      >
                        Enlace
                      </button>

                      <button 
                        onClick={() => compartirWhatsApp(inv)}
                        className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL DE EDICIÓN DE INVITADO */}
      {invitadoAEditar && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-amber-900 border-b pb-2">Editar Invitado</h3>
            
            <form onSubmit={handleGuardarEdicion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Nombre del invitado:</label>
                <input 
                  type="text" 
                  required
                  value={invitadoAEditar.nombreInvitado}
                  onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, nombreInvitado: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Nombre de la Familia:</label>
                <input 
                  type="text" 
                  value={invitadoAEditar.nombreFamilia}
                  onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, nombreFamilia: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Total Pases:</label>
                  <input 
                    type="number" 
                    min="1"
                    value={invitadoAEditar.pasesAsignados}
                    onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, pasesAsignados: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Niños:</label>
                  <input 
                    type="number" 
                    min="0"
                    max={invitadoAEditar.pasesAsignados}
                    value={invitadoAEditar.pasesNinos}
                    onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, pasesNinos: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tipo de invitado:</label>
                <select 
                  value={invitadoAEditar.categoria}
                  onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, categoria: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-xl bg-stone-100 border border-stone-200"
                >
                  {categoriasDisponibles.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="menuNinosEditar" 
                  checked={invitadoAEditar.menuNinos}
                  onChange={(e) => setInvitadoAEditar({ ...invitadoAEditar, menuNinos: e.target.checked })}
                  className="w-4 h-4 text-pink-500 rounded accent-pink-400 cursor-pointer" 
                />
                <label htmlFor="menuNinosEditar" className="text-xs font-medium cursor-pointer select-none">
                  ¿Requiere menú infantil?
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInvitadoAEditar(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-full text-xs font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white rounded-full text-xs font-bold shadow-sm"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CROQUIS Y GESTOR INTERACTIVO DE MESAS */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-900">Acomodo Interactivo de Mesas</h3>
            <p className="text-xs text-stone-500">Asigna las familias y sus pases completos en cada mesa.</p>
          </div>

          <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold">Total Mesas:</label>
              <input 
                type="number" 
                min="1" 
                max="20"
                value={numMesas} 
                onChange={(e) => setNumMesas(Number(e.target.value))} 
                className="w-14 p-1 rounded-lg border text-center font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">Sillas por Mesa:</label>
              <input 
                type="number" 
                min="4" 
                max="20"
                value={sillasPorMesa} 
                onChange={(e) => setSillasPorMesa(Number(e.target.value))} 
                className="w-14 p-1 rounded-lg border text-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* Panel para asignar familias sin mesa */}
        {invitadosSinMesa.length > 0 && (
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Familias pendientes por acomodar ({invitadosSinMesa.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {invitadosSinMesa.map((inv) => (
                <div 
                  key={inv.id} 
                  className="bg-white border border-amber-200 shadow-xs px-3 py-1.5 rounded-xl text-xs flex items-center gap-2"
                >
                  <div>
                    <span className="font-bold text-stone-800">{inv.nombreFamilia}</span>
                    <span className="text-stone-400 text-[10px] block">{inv.pasesAsignados} pases</span>
                  </div>
                  <select
                    onChange={(e) => e.target.value && handleAsignarMesa(inv.id, Number(e.target.value))}
                    defaultValue=""
                    className="text-[11px] bg-amber-100 text-amber-900 rounded px-1 py-0.5 font-bold cursor-pointer"
                  >
                    <option value="" disabled>Mesa...</option>
                    {Array.from({ length: numMesas }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        Mesa {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de Mesas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: numMesas }, (_, index) => {
            const numeroMesa = index + 1;
            const familiasEnMesa = invitados.filter(inv => asignacionesMesas[inv.id] === numeroMesa);
            const sillasOcupadas = familiasEnMesa.reduce((acc, curr) => acc + curr.pasesAsignados, 0);
            const asientosLibres = sillasPorMesa - sillasOcupadas;
            const estaLlana = sillasOcupadas > sillasPorMesa;

            return (
              <div 
                key={numeroMesa} 
                className={`p-5 rounded-3xl border transition-all ${
                  estaLlana 
                    ? 'bg-rose-50/40 border-rose-300' 
                    : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                  <div>
                    <h4 className="font-bold text-stone-800 text-base">Mesa {numeroMesa}</h4>
                    <p className={`text-xs font-semibold ${estaLlana ? 'text-rose-600' : 'text-stone-400'}`}>
                      {sillasOcupadas} de {sillasPorMesa} pases ocupados
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    estaLlana 
                      ? 'bg-rose-100 text-rose-700' 
                      : asientosLibres === 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {asientosLibres < 0 ? `+${Math.abs(asientosLibres)} Excedidos` : `${asientosLibres} libres`}
                  </span>
                </div>

                <div className="space-y-2 min-h-[100px]">
                  {familiasEnMesa.length === 0 ? (
                    <div className="h-24 border border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-xs text-stone-400">
                      Mesa vacía
                    </div>
                  ) : (
                    familiasEnMesa.map((inv) => (
                      <div 
                        key={inv.id} 
                        className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-stone-800">{inv.nombreFamilia}</p>
                          <p className="text-[11px] text-stone-500">{inv.pasesAsignados} pases ({inv.pasesNinos} niños)</p>
                        </div>
                        <button 
                          onClick={() => handleAsignarMesa(inv.id, null)}
                          className="text-stone-400 hover:text-rose-600 font-bold px-1 text-sm"
                          title="Quitar de esta mesa"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}