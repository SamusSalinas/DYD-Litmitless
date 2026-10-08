---
name: test-gen
description: Skill especializado en la generación y ejecución de pruebas (unitarias, de integración) para el backend (Python/pytest) y el frontend (React/Jest o similar). Úsalo para crear cobertura de código sin saturar el contexto general.
---

# Generador de Pruebas (D&D Beyond Clone)

Este skill proporciona un marco estructurado para generar pruebas precisas sin mantener el conocimiento de testing permanentemente en la memoria del agente.

## Instrucciones de Ejecución
1.  **Entiende el Código:** Lee el archivo de código fuente para el que se necesitan pruebas (usa lectura parcial si el archivo es muy grande).
2.  **Identifica el Entorno:**
    *   Si estás en `/backend`: Usa `pytest`. Para lógica pura de D&D (cálculos de daño, tiradas), crea tests unitarios. Para endpoints de FastAPI, asegúrate de mockear la base de datos (SQLModel/PostgreSQL) adecuadamente usando sesiones asíncronas de prueba.
    *   Si estás en `/frontend`: Usa el framework configurado (ej. Vitest, React Testing Library). Verifica que el componente de interfaz gráfica renderice correctamente las reglas de D&D.
3.  **Genera las Pruebas:** Escribe pruebas que cubran los casos de éxito, límites (edge cases típicos de D&D) y casos de error.
4.  **Ejecuta y Verifica:** Usa la herramienta `run_command` para ejecutar las pruebas recién creadas. Si fallan, corrige las pruebas o el código de producción de inmediato.