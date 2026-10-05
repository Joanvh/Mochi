// --- TIPOS GENÉRICOS ---
export interface ApiError {
  detail: string | Record<string, any>;
}

// --- TIPOS DE DOMINIO ---
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  token?: string; // Para futura implementación de JWT
}

export interface Tienda {
  id: string;
  nombre: string;
  direccion?: string;
  // Se ampliará con layout, nodos, etc. cuando se defina el JSON de la tienda
}

export interface Producto {
  id_producto: string;
  nombre: string;
  precio: number;
  pasillo: string;
}

// --- TIPOS DE INCIDENCIAS ---
export type TipoIncidencia =
  | "congestión"
  | "producto_agotado"
  | "reposición"
  | "pasillo_bloqueado"
  | "derrame"
  | "cola_caja";

export type EstadoIncidencia = "activa" | "resuelta";

export interface IncidenciaCreate {
  tipo: TipoIncidencia;
  nodo_id: string;
  descripcion?: string;
}

export interface IncidenciaResponse extends IncidenciaCreate {
  id: string;
  estado: EstadoIncidencia;
  fecha_reporte: string;
}

// --- TIPOS DE RECOMENDACIONES Y CLASIFICACIÓN ---
export interface ClasificacionRequest {
  texto_busqueda: string;
}

export interface ClasificacionResponse {
  categorias_sugeridas: string[];
}

export interface RecommendationRequest {
  lista_compra: string[];
}

export interface RecommendationResponse {
  recomendaciones: string[];
}

// --- TIPOS DE RUTAS ---
export interface RouteRequest {
  nodo_origen: string;
  nodos_destino: string[];
  nodos_evitar?: string[];
}

export interface PasoRuta {
  nodo_id: string;
  accion: string;
  coste_tiempo_segundos: number;
}

export interface RouteResponse {
  id_ruta: string;
  recorrido: PasoRuta[];
  tiempo_total_segundos: number;
  caja_recomendada: string;
}
