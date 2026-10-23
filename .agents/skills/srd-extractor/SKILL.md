---
name: srd-extractor
description: Skill especializado en extraer información de los manuales PDF de D&D 5e (2014) y estructurarla en modelos SQLModel (Python) o JSON. Úsalo siempre que se necesite digitalizar reglas, hechizos o clases.
---

# Flujo de Extracción de Datos SRD (D&D 5e 2014)

Este flujo asegura que la información extraída de los manuales PDF se convierta de forma precisa y estructurada a nuestros modelos de datos.

## Restricciones Estrictas
1.  **Cero Alucinaciones:** Toda estadística (daño, alcance, duración, etc.) DEBE provenir exclusivamente del texto del PDF proporcionado. No uses tu conocimiento interno sobre D&D, ya que podrías mezclar reglas de otras ediciones.
2.  **Edición 2014:** Si detectas discrepancias, prioriza siempre las reglas de D&D 5e edición 2014.

## Pasos de Ejecución

1.  **Lectura Inicial:** Usa la herramienta adecuada para leer el PDF proporcionado por el usuario (o la sección específica solicitada).
2.  **Mapeo de Propiedades:** Identifica los campos clave de la entidad (ej. para un hechizo: Nombre, Nivel, Escuela, Tiempo de Casteo, Alcance, Componentes, Duración, Descripción).
3.  **Generación de Estructura:** Genera el modelo en el formato solicitado por el usuario:
    *   Si pide **JSON/JSONB**, asegúrate de que las propiedades anidadas sean válidas.
    *   Si pide **SQLModel** (Backend FastAPI), estructura las clases siguiendo la Arquitectura Limpia del proyecto.
4.  **Verificación:** Revisa la salida generada comparándola con el texto original extraído. Si hay campos omitidos, corrígelo antes de presentar la respuesta.