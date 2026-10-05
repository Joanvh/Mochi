import type { RecommendationResponse } from "../api";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const fetchRecomendaciones = async (
  lista: string[],
): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/recommendations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Convertimos el objeto al formato que espera FastAPI (RecommendationRequest)
    body: JSON.stringify({ lista_compra: lista }),
  });

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status}`);
  }

  // Parseamos la respuesta tipada
  const data: RecommendationResponse = await response.json();
  return data.recomendaciones;
};
