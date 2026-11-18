# 💾 03 - Base de Datos y Modelos

#database #postgresql #sqlmodel #alembic #jsonb

La capa de datos utiliza **PostgreSQL 15** orquestado mediante Docker, con persistencia mapeada a través de **SQLModel**.

---

## 1. Estrategia Híbrida: Relacional + JSONB

Para emular la flexibilidad del motor de D&D Beyond sin sacrificar la integridad referencial, el esquema combina:

1. **Campos Relacionales Tipados:**
   - Índices primarios UUID v4.
   - Puntuaciones principales numéricas (`level`, `armor_class`, `hit_points`, etc.).
   - Metadatos temporales de auditoría (`created_at`, `updated_at`).
2. **Columnas JSONB:**
   - Estructuras dinámicas o anidadas como puntuaciones de características (`ability_scores: {"STR": 15, "DEX": 14, ...}`).
   - Listas de competencias (`proficiencies: {"skills": [...], "languages": [...]}`).
   - Rasgos y características (`features: [{"name": "Second Wind", "description": "..."}]`).
   - Inventario y conjuros conocidos/preparados.

---

## 2. Modelos Principales

### 🧙‍♂️ Personajes (`Character`)
- **Tabla:** `characters`
- **Atributos Clave:**
  - `id`: UUID (Primary Key).
  - `name`: Nombre del personaje (1 a 120 caracteres).
  - `level`: Nivel del personaje (restringido de 1 a 20).
  - `race`, `character_class`: Raza y clase del héroe.
  - `ability_scores`: Diccionario JSONB con Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma.
  - `hit_points`, `max_hit_points`: Puntos de vida actuales y máximos.
  - `armor_class`, `speed`, `proficiency_bonus`: Estadísticas de combate y movimiento.
  - `proficiencies`, `equipment`, `features`: JSONB estructurados.
  - `spell_ids`: Lista de identificadores de conjuros asociados.

### 📜 Compendio SRD
- **`Spell` (Conjuros):** Nivel (0-9), escuela de magia, tiempo de lanzamiento, alcance, componentes (V, S, M), duración, descripción y escala a niveles superiores.
- **`CharacterClass` (Clases):** Dado de golpe (d6, d8, d10, d12), competencias de salvación, competencias de armas y armaduras, progresión por nivel.
- **`Race` (Razas):** Bonificadores de atributos, velocidad, tamaño, rasgos raciales e idiomas.
- **`Monster` (Monstruos):** Estadísticas de criaturas, valor de desafío (CR), acciones, reacciones y ataques.
- **`Equipment` (Equipo y Objetos):** Tipo de objeto, costo, peso, propiedades de armas/armaduras.

### 🧪 Contenido Personalizado (`Homebrew`)
Permite a los usuarios registrar elementos propios (hechizos, razas, monstruos o subclases) preservando la bandera `is_homebrew: true` para diferenciarlos del SRD oficial.

---

## 3. Control de Versiones con Alembic

Las migraciones viven en `backend/migrations/`:
- `alembic.ini`: Configuración que referencia la base de datos de `.env`.
- Migración actual: `20261007_01_compendium_source_metadata.py` (agrega metadatos de fuentes y trazabilidad SRD).

Comando para aplicar migraciones:
```powershell
Set-Location backend
.\.venv\Scripts\alembic.exe upgrade head
```

---

## 4. Enlaces Relacionados

- [[02 - Backend - FastAPI y SQLModel]]
- [[04 - API REST y Endpoints]]
- [[07 - Infraestructura y Docker]]
- Volver al [[00 - Índice General]]

