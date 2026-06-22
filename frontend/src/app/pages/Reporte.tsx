import { useState } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE, getAuthHeaders } from '../lib/api';

export default function Reportes() {
  // Estado para controlar el botón mientras Laravel genera el PDF
  const [descargando, setDescargando] = useState(false);

  // Función 100% EN CALIENTE para consumir el endpoint
  const handleDescargarPDF = async () => {
    setDescargando(true);
    toast.info('Generando reporte...');

    try {
      // 1. Petición HTTP GET al controlador ReporteController de Laravel
      const response = await fetch(`${API_BASE}/reportes/ventas/exportar`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(true),
          Accept: 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error('Fallo en la comunicación con la Base de Datos');
      }

      // 2. Obtener HTML y abrir en nueva ventana
      const html = await response.text();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        toast.success('Reporte generado. Usa Ctrl+P para guardar como PDF.');
      } else {
        toast.error('No se pudo abrir la ventana. Habilita las ventanas emergentes.');
      }

    } catch (error) {
      console.error("Error al descargar:", error);
      toast.error('Ocurrió un error al generar el documento. Revise la consola del servidor.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Módulo de Reportes</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-start gap-6">
          
          {/* Icono decorativo */}
          <div className="p-4 bg-red-50 text-red-600 rounded-xl shrink-0">
            <FileText size={32} />
          </div>
          
          {/* Contenido e Información */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Reporte Histórico de Ventas</h2>
            <p className="text-sm text-gray-600 mt-2 mb-6 leading-relaxed">
              Exporte un documento oficial en formato <span className="font-semibold">PDF</span> con el registro consolidado de todas las transacciones procesadas. 
              Este reporte extrae los datos en tiempo real desde el motor MySQL, garantizando que la información financiera y de inventario sea precisa al segundo exacto de la descarga.
            </p>

            {/* Controles de Acción */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleDescargarPDF}
                disabled={descargando}
                className="flex items-center gap-2 bg-[#1e6b3e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#155430] disabled:bg-gray-400 transition-all shadow-sm"
              >
                <Download size={20} />
                {descargando ? 'Compilando Documento...' : 'Descargar Reporte (PDF)'}
              </button>
              
              {/* Indicador visual de procesamiento */}
              {descargando && (
                <span className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
                  <AlertCircle size={18} /> Operación en proceso...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}