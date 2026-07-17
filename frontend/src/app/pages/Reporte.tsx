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

// Descarga un archivo PDF real generado por el backend.
async function descargarReportePdf(
  url: string,
  nombreArchivo: string
): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(true),
      Accept: 'application/pdf',
    },
  });

  if (!response.ok) {
    let mensaje = 'No se pudo generar el reporte PDF.';

    try {
      const data = await response.json();
      mensaje = data.message ?? mensaje;
    } catch {
      // La respuesta no era JSON.
    }

    throw new Error(mensaje);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/pdf')) {
    throw new Error(
      'El servidor no devolvió un archivo PDF válido.'
    );
  }

  const archivoPdf = await response.blob();
  const urlTemporal = window.URL.createObjectURL(archivoPdf);

  const enlace = document.createElement('a');

  enlace.href = urlTemporal;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  window.URL.revokeObjectURL(urlTemporal);
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
      <ReporteIngresos />
      <ReporteMetas />
      <ReporteEntregables />

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

/** Reporte histórico de ventas */
function ReporteHistoricoVentas() {
  const [descargando, setDescargando] = useState(false);

  const handleDescargarPDF = async () => {
    setDescargando(true);
    toast.info('Generando reporte PDF...');
    try {
      await descargarReportePdf(`${API_BASE}/reportes/ventas/exportar`, 'reporte_ventas.pdf');
      toast.success('Reporte PDF descargado correctamente.');
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
 * Descarga PDF directamente con rango de fechas (últimos 30 días por defecto).
 */
function ReporteEstadisticas() {
  const [descargando, setDescargando] = useState(false);
  const [desde, setDesde] = useState(hace30DiasISO());
  const [hasta, setHasta] = useState(hoyISO());

  const handleDescargar = async () => {
    setDescargando(true);
    toast.info('Generando reporte PDF...');
    try {
      await descargarReportePdf(
        `${API_BASE}/reportes/estadisticas?desde=${desde}&hasta=${hasta}`,
        `reporte_estadistico_${desde}_${hasta}.pdf`
      );
      toast.success('Reporte PDF descargado correctamente.');
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
      titulo="Reporte Estadístico de Ventas (Máx / Mín / Promedio)"
      descripcion="Calcula el valor máximo, mínimo y promedio del total. "
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="stats-desde" className="text-xs font-medium text-gray-600">Desde</label>
          <input
            id="stats-desde"
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="stats-hasta" className="text-xs font-medium text-gray-600">Hasta</label>
          <input
            id="stats-hasta"
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />
          {descargando ? 'Generando PDF...' : 'Descargar Reporte (PDF)'}
        </button>
      </div>
    </TarjetaReporte>
  );
}

/** Reporte 2 — Registros eliminados lógicamente */
function ReporteEliminados() {
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    setDescargando(true);
    toast.info('Generando reporte PDF...');
    try {
      await descargarReportePdf(`${API_BASE}/reportes/eliminados`, 'reporte_eliminados.pdf');
      toast.success('Reporte PDF descargado correctamente.');
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
      titulo="Reporte de Registros Eliminados"
      descripcion="Historial de productos, usuarios y proveedores desactivados."
    >
      <button
        onClick={handleDescargar}
        disabled={descargando}
        className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
      >
        <Download size={20} />
        {descargando ? 'Generando PDF...' : 'Descargar Reporte (PDF)'}
      </button>
    </TarjetaReporte>
  );
}

/** Reporte 3 — Tablero de indicadores de gestión (KPIs) */
function ReporteKpis() {
  const [desde, setDesde] = useState(hace30DiasISO());
  const [hasta, setHasta] = useState(hoyISO());
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!desde || !hasta) {
      toast.error('Selecciona ambas fechas (Desde y Hasta).');
      return;
    }
    if (desde > hasta) {
      toast.error('La fecha "Desde" no puede ser posterior a "Hasta".');
      return;
    }

    setDescargando(true);
    toast.info('Generando reporte PDF...');
    try {
      await descargarReportePdf(
        `${API_BASE}/reportes/kpis?desde=${desde}&hasta=${hasta}`,
        `reporte_kpis_${desde}_${hasta}.pdf`
      );
      toast.success('Reporte PDF descargado correctamente.');
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
      titulo="Reporte de Indicadores (KPIs)"
      descripcion="Calcula los indicadores: ERI, TPVS, Renovación de Mercancía y TVCES."
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
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />
          {descargando ? 'Generando PDF...' : 'Descargar Reporte (PDF)'}
        </button>
      </div>
    </TarjetaReporte>
  );
}

/**
* Persona 2 — Reporte 4
* Ingresos y ventas acumuladas.
*/
function ReporteIngresos() {
  const [desde, setDesde] = useState(hace30DiasISO());
  const [hasta, setHasta] = useState(hoyISO());
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!desde || !hasta) {
      toast.error('Selecciona ambas fechas: Desde y Hasta.');
      return;
    }

    if (desde > hasta) {
      toast.error(
        'La fecha "Desde" no puede ser posterior a la fecha "Hasta".'
      );
      return;
    }

    setDescargando(true);
    toast.info('Generando reporte de ingresos...');

    try {
      const parametros = new URLSearchParams({
        desde,
        hasta,
      });

      await descargarReportePdf(
        `${API_BASE}/reportes/ingresos?${parametros.toString()}`,
        `reporte_ingresos_${desde}_${hasta}.pdf`
      );

      toast.success(
        'Reporte de ingresos descargado correctamente.'
      );
    } catch (error) {
      console.error(
        'Error al generar reporte de ingresos:',
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al generar el reporte.'
      );
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<FileText size={32} />}
      colorIcono="bg-purple-50 text-purple-600"
      titulo="Reporte 4 — Ingresos y Ventas Acumuladas"
      descripcion="Muestra los ingresos del periodo seleccionado. Solo considera ventas completadas y excluye ventas anuladas o en proceso."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="ingresos-desde"
            className="text-xs font-medium text-gray-600"
          >
            Desde
          </label>

          <input
            id="ingresos-desde"
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="ingresos-hasta"
            className="text-xs font-medium text-gray-600"
          >
            Hasta
          </label>

          <input
            id="ingresos-hasta"
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />

          {descargando
            ? 'Generando PDF...'
            : 'Descargar Reporte (PDF)'}
        </button>

        {descargando && (
          <span className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
            <AlertCircle size={18} />
            Operación en proceso...
          </span>
        )}
      </div>
    </TarjetaReporte>
  );
}

/**
 * Persona 2 — Reporte 5
 * Cumplimiento de metas trimestrales.
 */
function ReporteMetas() {
  const [trimestre, setTrimestre] = useState('1');
  const [anio, setAnio] = useState('2026');
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!trimestre || !anio) {
      toast.error('Selecciona el trimestre y el año.');
      return;
    }

    const numeroAnio = Number(anio);

    if (
      Number.isNaN(numeroAnio) ||
      numeroAnio < 2000 ||
      numeroAnio > 2100
    ) {
      toast.error('Ingresa un año válido entre 2000 y 2100.');
      return;
    }

    setDescargando(true);
    toast.info('Generando reporte de metas trimestrales...');

    try {
      const parametros = new URLSearchParams({
        trimestre,
        anio,
      });

      await descargarReportePdf(
        `${API_BASE}/reportes/metas?${parametros.toString()}`,
        `reporte_metas_T${trimestre}_${anio}.pdf`
      );

      toast.success(
        'Reporte de metas descargado correctamente.'
      );
    } catch (error) {
      console.error(
        'Error al generar reporte de metas:',
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al generar el reporte.'
      );
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<BarChart3 size={32} />}
      colorIcono="bg-indigo-50 text-indigo-600"
      titulo="Reporte 5 — Cumplimiento de Metas Trimestrales"
      descripcion="Compara la meta planificada con el total vendido durante el trimestre y calcula el porcentaje de cumplimiento."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="metas-trimestre"
            className="text-xs font-medium text-gray-600"
          >
            Trimestre
          </label>

          <select
            id="metas-trimestre"
            value={trimestre}
            onChange={(e) => setTrimestre(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="1">Primer trimestre</option>
            <option value="2">Segundo trimestre</option>
            <option value="3">Tercer trimestre</option>
            <option value="4">Cuarto trimestre</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="metas-anio"
            className="text-xs font-medium text-gray-600"
          >
            Año
          </label>

          <input
            id="metas-anio"
            type="number"
            min="2000"
            max="2100"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
          />
        </div>

        <button
          type="button"
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />

          {descargando
            ? 'Generando PDF...'
            : 'Descargar Reporte (PDF)'}
        </button>

        {descargando && (
          <span className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
            <AlertCircle size={18} />
            Operación en proceso...
          </span>
        )}
      </div>
    </TarjetaReporte>
  );

  /**
 * Persona 2 — Reporte 6
 * Volumen de entregables aceptados.
 */
function ReporteEntregables() {
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    setDescargando(true);
    toast.info('Generando reporte de entregables aceptados...');

    try {
      await descargarReportePdf(
        `${API_BASE}/reportes/entregables`,
        'reporte_entregables.pdf'
      );

      toast.success(
        'Reporte de entregables descargado correctamente.'
      );
    } catch (error) {
      console.error(
        'Error al generar reporte de entregables:',
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al generar el reporte.'
      );
    } finally {
      setDescargando(false);
    }
  };

  return (
    <TarjetaReporte
      icono={<FileText size={32} />}
      colorIcono="bg-cyan-50 text-cyan-700"
      titulo="Reporte 6 — Entregables Aceptados"
      descripcion="Muestra los entregables activos que fueron aceptados y calcula el porcentaje de avance físico del proyecto."
    >
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
        >
          <Download size={20} />

          {descargando
            ? 'Generando PDF...'
            : 'Descargar Reporte (PDF)'}
        </button>

        {descargando && (
          <span className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
            <AlertCircle size={18} />
            Operación en proceso...
          </span>
        )}
      </div>
    </TarjetaReporte>
  );
}

  




