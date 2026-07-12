import { useState } from 'react';
import { FileText, Download, AlertCircle, BarChart3, Trash2, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE, getAuthHeaders } from '../lib/api';

// Fecha de hoy y de hace 30 días en formato YYYY-MM-DD, para el rango inicial de R1 y R3
function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}
function hace30DiasISO() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

// Pide el reporte como HTML al backend y lo abre en una pestaña nueva,
// exactamente igual que el Reporte Histórico de Ventas: el usuario puede
// usar Ctrl+P o el botón "Imprimir / Guardar como PDF" dentro de esa página.
async function abrirReporteHtml(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { ...getAuthHeaders(true), Accept: 'text/html' },
  });

  if (!response.ok) {
    let mensaje = 'No se pudo generar el reporte.';
    try {
      const data = await response.json();
      mensaje = data.message ?? mensaje;
    } catch {
      // la respuesta no era JSON, se mantiene el mensaje genérico
    }
    throw new Error(mensaje);
  }

  const html = await response.text();
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  } else {
    throw new Error('No se pudo abrir la ventana. Habilita las ventanas emergentes.');
  }
}

export default function Reportes() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Módulo de Reportes</h1>
      </div>

      <ReporteHistoricoVentas />
      <ReporteEstadisticas />
      <ReporteEliminados />
      <ReporteKpis />
    </div>
  );
}

/** Tarjeta base reutilizable para no repetir estilos en cada reporte */
function TarjetaReporte({
  icono,
  colorIcono,
  titulo,
  descripcion,
  children,
}: {
  icono: React.ReactNode;
  colorIcono: string;
  titulo: string;
  descripcion: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className={`p-4 rounded-xl shrink-0 ${colorIcono}`}>{icono}</div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 leading-relaxed">{descripcion}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Reporte histórico de ventas (funcionalidad base existente, sin cambios) */
function ReporteHistoricoVentas() {
  const [descargando, setDescargando] = useState(false);

  const handleDescargarPDF = async () => {
    setDescargando(true);
    toast.info('Generando reporte...');
    try {
      await abrirReporteHtml(`${API_BASE}/reportes/ventas/exportar`);
      toast.success('Reporte generado. Usa Ctrl+P para guardar como PDF.');
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error al generar el documento.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<FileText size={32} />}
      colorIcono="bg-red-50 text-red-600"
      titulo="Reporte Histórico de Ventas"
      descripcion="Exporte un documento con el registro consolidado de todas las transacciones procesadas, extraído en tiempo real desde la base de datos."
    >
      <div className="flex items-center gap-4">
        <button
          onClick={handleDescargarPDF}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />
          {descargando ? 'Compilando Documento...' : 'Descargar Reporte (PDF)'}
        </button>
        {descargando && (
          <span className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
            <AlertCircle size={18} /> Operación en proceso...
          </span>
        )}
      </div>
    </TarjetaReporte>
  );
}

/**
 * Reporte 1 — Máximo, mínimo y promedio de ventas.
 * El filtro de fechas ya NO vive aquí: se abre la página con un rango por
 * defecto (últimos 30 días) y, dentro de esa misma página, el usuario puede
 * cambiar las fechas y volver a generarlo sin salir de la pestaña.
 */
function ReporteEstadisticas() {
  const [descargando, setDescargando] = useState(false);

  const handleAbrir = async () => {
    setDescargando(true);
    toast.info('Generando reporte estadístico...');
    try {
      const desde = hace30DiasISO();
      const hasta = hoyISO();
      await abrirReporteHtml(`${API_BASE}/reportes/estadisticas?desde=${desde}&hasta=${hasta}`);
      toast.success('Reporte generado. Puedes cambiar las fechas dentro de la misma página.');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el reporte.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<BarChart3 size={32} />}
      colorIcono="bg-blue-50 text-blue-600"
      titulo="Reporte  Estadístico de Ventas (Máx / Mín / Promedio)"
      descripcion="Calcula el valor máximo, mínimo y promedio del total. "
    >
      <button
        onClick={handleAbrir}
        disabled={descargando}
        className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
      >
        <Download size={20} />
        {descargando ? 'Generando...' : 'Descargar Reporte (PDF)'}
      </button>
    </TarjetaReporte>
  );
}

/** Reporte 2 — Registros eliminados lógicamente */
function ReporteEliminados() {
  const [descargando, setDescargando] = useState(false);

  const handleAbrir = async () => {
    setDescargando(true);
    toast.info('Generando reporte de eliminados...');
    try {
      await abrirReporteHtml(`${API_BASE}/reportes/eliminados`);
      toast.success('Reporte generado. Usa Ctrl+P para guardar como PDF.');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el reporte.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<Trash2 size={32} />}
      colorIcono="bg-amber-50 text-amber-600"
      titulo="Reporte  Registros Eliminados"
      descripcion="Historial de productos, usuarios y proveedores Desactivados."
    >
      <button
        onClick={handleAbrir}
        disabled={descargando}
        className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
      >
        <Download size={20} />
        {descargando ? 'Generando...' : 'Descargar Reporte (PDF)'}
      </button>
    </TarjetaReporte>
  );
}

/** Reporte 3 — Tablero de indicadores de gestión (KPIs) */
function ReporteKpis() {
  const [desde, setDesde] = useState(hace30DiasISO());
  const [hasta, setHasta] = useState(hoyISO());
  const [descargando, setDescargando] = useState(false);

  const handleAbrir = async () => {
    if (!desde || !hasta) {
      toast.error('Selecciona ambas fechas (Desde y Hasta).');
      return;
    }
    if (desde > hasta) {
      toast.error('La fecha "Desde" no puede ser posterior a "Hasta".');
      return;
    }

    setDescargando(true);
    toast.info('Generando tablero de indicadores...');
    try {
      await abrirReporteHtml(`${API_BASE}/reportes/kpis?desde=${desde}&hasta=${hasta}`);
      toast.success('Reporte generado. Usa Ctrl+P para guardar como PDF.');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el reporte.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<Gauge size={32} />}
      colorIcono="bg-emerald-50 text-emerald-600"
      titulo="Reporte  Tablero de Indicadores "
      descripcion="Calcula los indicadores Índice de Renovación y Tasa de Pedidos Anulados por Error de Stock."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleAbrir}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />
          {descargando ? 'Generando...' : 'Descargar Reporte (PDF)'}
        </button>
      </div>
    </TarjetaReporte>
  );
}
