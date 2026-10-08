---
name: refactor-mcp
description: Utiliza herramientas de consola, scripts o AST para refactorizar código sin depender exclusivamente del LLM reescribiendo archivos enteros, optimizando el uso de tokens y previniendo pérdida de código.
---

# Flujo de Refactorización de Código

Esta habilidad previene que el agente intente volcar archivos enteros de miles de líneas en la respuesta de chat, lo cual consume el presupuesto de tokens e introduce riesgos de truncamiento.

## Directrices
1.  **Evaluación de Tamaño:** Si el archivo a refactorizar tiene más de 150 líneas, NO intentes reescribirlo por completo usando herramientas de reemplazo de contenido.
2.  **Uso de Scripts/MCP:** Delega las refactorizaciones (como cambiar nombres de propiedades en todo el monorepo o reorganizar importaciones) a scripts de shell (ej. `sed`, `awk`) o a herramientas de refactorización integradas en el entorno que puedas invocar vía terminal.
3.  **Cambios Quirúrgicos:** Si debes editar el archivo directamente, utiliza reemplazo por bloques (regex o diffs precisos) en lugar de sobrescribir el archivo entero.
4.  **Verificación Post-Refactor:** Ejecuta siempre el linter (`npm run lint` en frontend o `ruff check` en backend) para confirmar que la sintaxis quedó intacta.