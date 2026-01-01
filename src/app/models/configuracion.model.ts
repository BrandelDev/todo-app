export interface Configuracion {
  id?: string;
  tema: 'claro' | 'oscuro';
  inicioSemana: 'lunes' | 'domingo';
  notificaciones: boolean;
  sonido: boolean;
}
