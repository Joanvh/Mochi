export interface RecommendationRequest {
  lista_compra: string[];
}

export interface RecommendationResponse {
  recomendaciones: Array<{
    id: string | number;
    nombre: string;
    motivo?: string;
  }>;
}
