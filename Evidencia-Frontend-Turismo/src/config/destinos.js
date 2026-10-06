const DESTINO_NAMES = {
  "san-andres": "San Andrés",
  "cartagena": "Cartagena de Indias",
  "santa-marta": "Santa Marta",
  "playa-blanca": "Playa Blanca",
  "islas-rosario": "Islas del Rosario",
  "palomino": "Palomino",
  "barranquilla": "Barranquilla",
};

export function getDestinoNombre(slug) {
  return DESTINO_NAMES[slug] || slug;
}
