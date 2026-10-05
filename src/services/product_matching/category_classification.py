import nltk
from nltk.corpus import stopwords
from sentence_transformers import SentenceTransformer, util

# Descargar las stopwords en español la primera vez
# nltk.download("punkt")
# nltk.download("stopwords")
#nltk.download("punkt", quiet=True)
#nltk.download("punkt_tab", quiet=True)  

# 1. Cargar un modelo multilingüe o específico para español
# (puedes usar 'all-MiniLM-L6-v2' o un modelo especializado como 'hiiamsid/sentence_similarity_spanish_es')
modelo = SentenceTransformer('BAAI/bge-m3')

# 2. Definir el conjunto de stopwords en español
stop_words_es = set(stopwords.words("spanish"))

# 3. Definir la palabra o frase de entrada y la lista de comparación
lista_palabras = [
    # Aceite, especias y salsas
    {"id": 12, "name": "Aceite, especias y salsas"},
    {"id": 112, "name": "Aceite, vinagre y sal"},
    {"id": 115, "name": "Especias"},
    {"id": 116, "name": "Mayonesa, ketchup y mostaza"},
    {"id": 117, "name": "Otras salsas"},
    # Agua y refrescos
    {"id": 18, "name": "Agua y refrescos"},
    {"id": 156, "name": "Agua"},
    {"id": 163, "name": "Isotónico y energético"},
    {"id": 158, "name": "Refresco de cola"},
    {"id": 159, "name": "Refresco de naranja y de limón"},
    {"id": 161, "name": "Tónica y bitter"},
    {"id": 162, "name": "Refresco de té y sin gas"},
    # Aperitivos
    {"id": 15, "name": "Aperitivos"},
    {"id": 135, "name": "Aceitunas y encurtidos"},
    {"id": 133, "name": "Frutos secos y fruta desecada"},
    {"id": 132, "name": "Patatas fritas y snacks"},
    # Arroz, legumbres y pasta
    {"id": 13, "name": "Arroz, legumbres y pasta"},
    {"id": 118, "name": "Arroz"},
    {"id": 121, "name": "Legumbres"},
    {"id": 120, "name": "Pasta y fideos"},
    # Azúcar, caramelos y chocolate
    {"id": 9, "name": "Azúcar, caramelos y chocolate"},
    {"id": 89, "name": "Azúcar y edulcorante"},
    {"id": 95, "name": "Chicles y caramelos"},
    {"id": 92, "name": "Chocolate"},
    {"id": 97, "name": "Golosinas"},
    {"id": 90, "name": "Mermelada y miel"},
    {"id": 833, "name": "Turrones"},
    # Bebé
    {"id": 24, "name": "Bebé"},
    {"id": 216, "name": "Alimentación infantil"},
    {"id": 219, "name": "Biberón y chupete"},
    {"id": 218, "name": "Higiene y cuidado"},
    {"id": 217, "name": "Toallitas y pañales"},
    # Bodega
    {"id": 19, "name": "Bodega"},
    {"id": 164, "name": "Cerveza"},
    {"id": 166, "name": "Cerveza sin alcohol"},
    {"id": 181, "name": "Licores"},
    {"id": 174, "name": "Sidra y cava"},
    {"id": 168, "name": "Tinto de verano y sangría"},
    {"id": 170, "name": "Vino blanco"},
    {"id": 173, "name": "Vino lambrusco y espumoso"},
    {"id": 171, "name": "Vino rosado"},
    {"id": 169, "name": "Vino tinto"},
    # Cacao, café e infusiones
    {"id": 8, "name": "Cacao, café e infusiones"},
    {"id": 86, "name": "Cacao soluble y chocolate a la taza"},
    {"id": 81, "name": "Café cápsula y monodosis"},
    {"id": 83, "name": "Café molido y en grano"},
    {"id": 84, "name": "Café soluble y otras bebidas"},
    {"id": 88, "name": "Té e infusiones"},
    # Carne
    {"id": 3, "name": "Carne"},
    {"id": 46, "name": "Arreglos"},
    {"id": 38, "name": "Aves y pollo"},
    {"id": 47, "name": "Carne congelada"},
    {"id": 37, "name": "Cerdo"},
    {"id": 42, "name": "Conejo y cordero"},
    {"id": 43, "name": "Embutido"},
    {"id": 44, "name": "Hamburguesas y picadas"},
    {"id": 40, "name": "Vacuno"},
    {"id": 45, "name": "Empanados y elaborados"},
    # Cereales y galletas
    {"id": 7, "name": "Cereales y galletas"},
    {"id": 78, "name": "Cereales"},
    {"id": 80, "name": "Galletas"},
    {"id": 79, "name": "Tortitas"},
    # Charcutería y quesos
    {"id": 4, "name": "Charcutería y quesos"},
    {"id": 48, "name": "Aves y jamón cocido"},
    {"id": 52, "name": "Bacón y salchichas"},
    {"id": 49, "name": "Chopped y mortadela"},
    {"id": 51, "name": "Embutido curado"},
    {"id": 50, "name": "Jamón serrano"},
    {"id": 58, "name": "Paté y sobrasada"},
    {"id": 54, "name": "Queso curado, semicurado y tierno"},
    {"id": 56, "name": "Queso lonchas, rallado y en porciones"},
    {"id": 53, "name": "Queso untable, fresco y especialidades"},
    # Congelados
    {"id": 17, "name": "Congelados"},
    {"id": 147, "name": "Arroz y pasta"},
    {"id": 148, "name": "Carne"},
    {"id": 145, "name": "Fruta y verdura"},
    {"id": 154, "name": "Helados"},
    {"id": 155, "name": "Hielo"},
    {"id": 150, "name": "Marisco"},
    {"id": 149, "name": "Pescado"},
    {"id": 151, "name": "Pizzas"},
    {"id": 884, "name": "Rebozados"},
    {"id": 152, "name": "Tartas y churros"},
    # Conservas, caldos y cremas
    {"id": 14, "name": "Conservas, caldos y cremas"},
    {"id": 122, "name": "Atún y otras conservas de pescado"},
    {"id": 123, "name": "Berberechos y mejillones"},
    {"id": 127, "name": "Conservas de verdura y frutas"},
    {"id": 130, "name": "Gazpacho y cremas"},
    {"id": 129, "name": "Sopa y caldo"},
    {"id": 126, "name": "Tomate"},
    # Cuidado del cabello
    {"id": 21, "name": "Cuidado del cabello"},
    {"id": 201, "name": "Acondicionador y mascarilla"},
    {"id": 199, "name": "Champú"},
    {"id": 203, "name": "Coloración cabello"},
    {"id": 202, "name": "Fijación cabello"},
    # Cuidado facial y corporal
    {"id": 20, "name": "Cuidado facial y corporal"},
    {"id": 192, "name": "Afeitado y cuidado para hombre"},
    {"id": 189, "name": "Cuidado corporal"},
    {"id": 185, "name": "Cuidado e higiene facial"},
    {"id": 191, "name": "Depilación"},
    {"id": 188, "name": "Desodorante"},
    {"id": 187, "name": "Gel y jabón de manos"},
    {"id": 186, "name": "Higiene bucal"},
    {"id": 190, "name": "Higiene íntima"},
    {"id": 194, "name": "Manicura y pedicura"},
    {"id": 196, "name": "Perfume y colonia"},
    {"id": 198, "name": "Protector solar y aftersun"},
    # Fitoterapia y parafarmacia
    {"id": 23, "name": "Fitoterapia y parafarmacia"},
    {"id": 213, "name": "Fitoterapia"},
    {"id": 214, "name": "Parafarmacia"},
    # Fruta y verdura
    {"id": 1, "name": "Fruta y verdura"},
    {"id": 27, "name": "Fruta"},
    {"id": 28, "name": "Lechuga y ensalada preparada"},
    {"id": 29, "name": "Verdura"},
    # Huevos, leche y mantequilla
    {"id": 6, "name": "Huevos, leche y mantequilla"},
    {"id": 77, "name": "Huevos"},
    {"id": 72, "name": "Leche y bebidas vegetales"},
    {"id": 75, "name": "Mantequilla y margarina"},
    # Limpieza y hogar
    {"id": 26, "name": "Limpieza y hogar"},
    {"id": 226, "name": "Detergente y suavizante ropa"},
    {"id": 237, "name": "Estropajo, bayeta y guantes"},
    {"id": 241, "name": "Insecticida y ambientador"},
    {"id": 234, "name": "Lejía y líquidos fuertes"},
    {"id": 235, "name": "Limpiacristales"},
    {"id": 233, "name": "Limpiahogar y friegasuelos"},
    {"id": 231, "name": "Limpieza baño y WC"},
    {"id": 230, "name": "Limpieza cocina"},
    {"id": 232, "name": "Limpieza muebles y multiusos"},
    {"id": 229, "name": "Limpieza vajilla"},
    {"id": 243, "name": "Menaje y conservación de alimentos"},
    {"id": 238, "name": "Papel higiénico y celulosa"},
    {"id": 239, "name": "Pilas y bolsas de basura"},
    {"id": 244, "name": "Utensilios de limpieza y calzado"},
    # Maquillaje
    {"id": 22, "name": "Maquillaje"},
    {"id": 206, "name": "Bases de maquillaje y corrector"},
    {"id": 207, "name": "Colorete y polvos"},
    {"id": 208, "name": "Labios"},
    {"id": 210, "name": "Ojos"},
    {"id": 212, "name": "Pinceles y brochas"},
    # Marisco y pescado
    {"id": 2, "name": "Marisco y pescado"},
    {"id": 32, "name": "Marisco"},
    {"id": 34, "name": "Pescado congelado"},
    {"id": 31, "name": "Pescado fresco"},
    {"id": 36, "name": "Salazones y ahumados"},
    # Mascotas
    {"id": 25, "name": "Mascotas"},
    {"id": 222, "name": "Gato"},
    {"id": 221, "name": "Perro"},
    {"id": 225, "name": "Otros"},
    # Panadería y pastelería
    {"id": 5, "name": "Panadería y pastelería"},
    {"id": 65, "name": "Bollería de horno"},
    {"id": 66, "name": "Bollería envasada"},
    {"id": 69, "name": "Harina y preparado repostería"},
    {"id": 59, "name": "Pan de horno"},
    {"id": 60, "name": "Pan de molde y otras especialidades"},
    {"id": 62, "name": "Pan tostado y rallado"},
    {"id": 64, "name": "Picos, rosquilletas y picatostes"},
    {"id": 68, "name": "Tartas y pasteles"},
    {"id": 71, "name": "Velas y decoración"},
    # Pizzas y platos preparados
    {"id": 16, "name": "Pizzas y platos preparados"},
    {"id": 897, "name": "Listo para Comer"},
    {"id": 138, "name": "Pizzas"},
    {"id": 140, "name": "Platos preparados calientes"},
    {"id": 142, "name": "Platos preparados fríos"},
    # Postres y yogures
    {"id": 11, "name": "Postres y yogures"},
    {"id": 105, "name": "Bífidus"},
    {"id": 110, "name": "Flan y natillas"},
    {"id": 111, "name": "Gelatina y otros postres"},
    {"id": 106, "name": "Postres de soja"},
    {"id": 103, "name": "Yogures desnatados"},
    {"id": 109, "name": "Yogures griegos"},
    {"id": 108, "name": "Yogures líquidos"},
    {"id": 104, "name": "Yogures naturales y sabores"},
    {"id": 107, "name": "Yogures y postres infantiles"},
    # Zumos
    {"id": 10, "name": "Zumos"},
    {"id": 99, "name": "Fruta variada"},
    {"id": 100, "name": "Melocotón y piña"},
    {"id": 143, "name": "Naranja"},
    {"id": 98, "name": "Tomate y otros sabores"},
]


def limpiar_frase(query):
  # A. Tokenizar la consulta (dividir en palabras) y pasar a minúsculas
  words = nltk.word_tokenize(query)

  # B. Filtrar eliminando las stopwords y signos de puntuación básicos
  palabras_filtradas = [
      p for p in words if p.lower() not in stop_words_es
  ]

  # C. Volver a unir la consulta limpia en un solo string (o dejarla como lista según prefieras)
  query_limpia = " ".join(palabras_filtradas)
  print(f"Consulta sin stopwords: '{query_limpia}'\n")
  return palabras_filtradas

def obtener_tres_mas_similares(query, lista_categorias):
  nombres_categorias = [item["name"] for item in lista_categorias]
  # Tokenizar y generar embeddings para la consulta y la lista
  emb_consulta = modelo.encode(query, convert_to_tensor=True)
  emb_lista = modelo.encode(nombres_categorias, convert_to_tensor=True)

  # Calcular la similitud de coseno entre los embeddings
  similitudes = util.cos_sim(emb_consulta, emb_lista)[0]

  # Obtener los 3 índices con mayor puntuación
  top_indices = similitudes.argsort(descending=True)[:3]

  resultados = []
  for i in top_indices:
    idx = i.item()
    categoria_encontrada = lista_categorias[idx]
    score = similitudes[idx].item()

    resultados.append({
        "id": categoria_encontrada["id"],
        "name": categoria_encontrada["name"],
        "similarity": score,
    })
  return resultados

def incluir(it, total):
   for i in it:
        incluido = False
        for j in total:
            if i['id']==j['id']:
                j['similarity'] += i['similarity']
                incluido = True
        if not incluido:
            total.append(i)


"""Método definitivo: la entrada es la fila de la lista de la compra, 
la salida son las tres categorías más probables en formato [{id, nombre, similarity}...]"""

def main(entrada):
    words = limpiar_frase(entrada)
    res = []
    for w in words:
        print("--------", w)
        top_tres = obtener_tres_mas_similares(w, lista_palabras)
        if(not res):
           res.extend(top_tres)
        else:
            incluir(top_tres, res)
    res = sorted(res, key=lambda x: x["similarity"], reverse=True)
    return(res[0:3])
