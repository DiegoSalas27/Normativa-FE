export interface IEstadoTratamiento {
  estadosTratamientoId: string;
  nombre: 'Cancelado' | 'Sin asignar' | 'En proceso' | 'Solucionado' | 'Asignado';
}