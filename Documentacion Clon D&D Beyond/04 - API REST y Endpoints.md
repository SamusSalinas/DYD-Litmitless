# 🌐 04 - API REST y Endpoints

#api #rest #fastapi #endpoints #contratos

La API expone sus servicios bajo el prefijo `/api/`. La documentación Swagger interactiva se encuentra en `http://localhost:8000/docs` y OpenAPI JSON en `http://localhost:8000/openapi.json`.

---

## 1. Catálogo de Endpoints

### 🏥 Estado y Diagnóstico
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica estado de la API y ejecuta `SELECT 1` contra PostgreSQL. Retorna `{"status": "ok"}` o código `503`. |

---

### 🧙‍♂️ Personajes (`/api/characters`)
| Método | Endpoint | Parámetros / Body | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/characters/` | Query: `name`, `race`, `character_class` | Lista todos los personajes creados en la instancia local. |
| `GET` | `/api/characters/{id}` | Path: `id` (UUID) | Obtiene la ficha completa del personaje. |
| `POST` | `/api/characters/` | Body: `CharacterCreate` | Crea un nuevo personaje (valida niveles 1-20 y esquemas de stats). |
| `PUT` | `/api/characters/{id}` | Body: `CharacterUpdate` | Actualización total/parcial (nombre, level, backstory, etc.). Permite la subida de nivel interactiva. |
| `DELETE`| `/api/characters/{id}` | Path: `id` (UUID) | Elimina permanentemente el personaje. |

---

### 📖 Compendio Oficial y Reglas
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/spells/` | Catálogo de conjuros (filtrable por nivel, escuela y clase). |
| `GET` | `/api/spells/{id}` | Detalle completo de un conjuro. |
| `GET` | `/api/classes/` | Lista de las clases oficiales (Guerrero, Mago, Pícaro, Clérigo, etc.). |
| `GET` | `/api/classes/{id}` | Detalle de la clase, dados de golpe, rasgos y competencias. |
| `GET` | `/api/races/` | Lista de razas (Humano, Elfo, Enano, Mediano, etc.). |
| `GET` | `/api/races/{id}` | Modificadores raciales y características. |
| `GET` | `/api/monsters/` | Bestiario con valores de desafío y acciones. |
| `GET` | `/api/monsters/{id}` | Ficha de monstruo con stat block completo. |
| `GET` | `/api/equipment/` | Lista de armas, armaduras y equipo de aventurero. |

---

### 📚 Manuales PDF Locales (`/api/manuals`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/manuals/` | Retorna los manuales disponibles localmente (`players-handbook`, `dungeon-masters-guide`, `monster-manual`). |
| `GET` | `/api/manuals/{id}` | Transmite el archivo PDF con soporte de `Range headers` para renderizado fluido en el visor web. |

---

### 🧪 Semilla y Homebrew
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/seed/` | Operación idempotente que carga el compendio básico inicial. |
| `GET` | `/api/homebrew/` | Lista de creaciones caseras registradas por el usuario. |
| `POST` | `/api/homebrew/` | Creación de contenido custom compatible con las reglas del sistema. |

---

## 2. Enlaces Relacionados

- [[02 - Backend - FastAPI y SQLModel]]
- [[03 - Base de Datos y Modelos]]
- [[06 - Módulos Clave del Sistema]]
- Volver al [[00 - Índice General]]

