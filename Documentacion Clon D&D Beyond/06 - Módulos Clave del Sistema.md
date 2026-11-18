# 🎲 06 - Módulos Clave del Sistema

#modulos #personajes #dados #compendio #manuales #srd

Esta sección detalla las cuatro funcionalidades nucleares del proyecto:

---

## 1. Hoja de Personaje Interactiva y Level Up

Ubicación: `frontend/src/features/characters/CharacterDetailPage.tsx`

La hoja de personaje emula la experiencia interactiva de **D&D Beyond**:
- **Estadísticas Principales:** Muestra en tiempo real Armor Class, Hit Points (actuales/máximos), Speed y Proficiency Bonus.
- **Modificadores Automáticos:** Cálculo matemático de modificadores de habilidad según las reglas oficiales: $\lfloor(\text{score} - 10) / 2\rfloor$, mostrándolos con formato positivo/negativo (`+3`, `-1`).
- **Subida de Nivel Dinámica (`handleLevelUp`):**
  - Botón integrado en la cabecera que incrementa el nivel del héroe con tope en nivel 20.
  - Envía la mutación al endpoint `PUT /api/characters/{id}` con el nuevo nivel.
  - Sincroniza y refresca automáticamente la información en la base de datos PostgreSQL y la vista del usuario.

---

## 2. Lanzador de Dados con Animación 3D

Ubicación: `frontend/src/features/dice/DiceRollerPage.tsx` y `frontend/src/index.css`

El motor de dados permite realizar tiradas directamente en la web con retroalimentación visual:
- **Dados Soportados:** d4, d6, d8, d10, d12, d20 y d100.
- **Configuración de Tirada:** Selección de cantidad de dados simultáneos y modificador numérico (+/-).
- **Animación 3D (`diceSpin`):**
  ```css
  @keyframes diceSpin {
    from { transform: rotateX(0deg) rotateY(0deg); }
    to   { transform: rotateX(360deg) rotateY(360deg); }
  }
  .dice-rotate {
    animation: diceSpin 0.6s linear;
  }
  ```
  Durante el lanzamiento (600ms), la tarjeta de resultado rota en el espacio tridimensional con efecto de pulso antes de revelar el valor final y el desglose de cada dado.
- **Historial de Tiradas:** Panel lateral que almacena los últimos 10 lanzamientos con su notación (`1d20+5`), resultado individual y marca temporal exacta.

---

## 3. Compendio Digital: Hechizos, Equipamiento y Objetos Mágicos

Ubicación: `frontend/src/features/compendium/`

Adopta la distribución y diseño estructurado de `Proyecto`:
- **Hechizos (`SpellsPage.tsx`):**
  - Agrupados por nivel con badges circulares (`Trucos / nivel 0`, `Nivel 1`, `Nivel 2`...).
  - Grilla responsiva con tarjetas colapsables (`details`/`summary`), metadatos (`hechizo-metadatos`: nivel, escuela, tiempo, alcance, componentes, duración) y descripción legible.
- **Equipamiento (`EquipmentPage.tsx`):**
  - Grilla de objetos con resumen interactivo (`+`/`−`) y ficha técnica detallada (`objeto-ficha-metadatos`: categoría, coste, peso, daño, clase de armadura, propiedades y descripción).
- **Objetos Mágicos (`MagicItemsPage.tsx`):**
  - Filtros por rareza en píldoras interactivas (`Common`, `Uncommon`, `Rare`, `Very Rare`, `Legendary`, `Artifact`).
  - Tabla estilizada (`tabla-objetos-magicos`: Objeto, Tipo, Rareza, Sintonización, Fuente).
  - Modal emergente con la ficha completa y atribución de licencia abierta SRD 5.1 (CC-BY-4.0).

---

## 4. Visor Web de Manuales PDF Locales

Ubicación: `backend/app/api/routes/manuals.py` y `frontend/src/features/books/BooksPage.tsx`

- Permite consultar los libros oficiales situados en la raíz del proyecto (*Player's Handbook*, *Dungeon Master's Guide*, *Monster Manual*).
- El backend los sirve como un flujo de bytes con soporte para `HTTP Range`, permitiendo saltar entre páginas de manuales pesados de manera instantánea dentro del navegador, sin subir los archivos a servicios de terceros.

---

## 5. Enlaces Relacionados

- [[01 - Arquitectura y Stack]]
- [[04 - API REST y Endpoints]]
- [[05 - Frontend - React y UI]]
- Volver al [[00 - Índice General]]

