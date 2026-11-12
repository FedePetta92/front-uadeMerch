// Formatea la fecha que manda el backend ("2026-11-12T14:07:29") como "12/11/2026, 14:07"
export function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}
