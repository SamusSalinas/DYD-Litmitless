"""Import 5e rules data from 5etools into the local compendium database."""
from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from collections.abc import Iterable
from fractions import Fraction
from urllib.error import URLError
from urllib.request import Request, urlopen

from sqlmodel import Session, select

from app.db.models import CharacterClass, Equipment, Monster, Race, Spell

# Apuntamos al repositorio de 2014 de 5etools (Mirror 3)
SOURCE_ROOT = (
    "https://raw.githubusercontent.com/5etools-mirror-3/"
    "5etools-2014-src/main/data"
)

# Actualizamos la atribución para reflejar que se usa todo el contenido
ATTRIBUTION = (
    "Data imported from the 5etools 2014 data mirror; "
    "changes: converted to this application's compendium format."
)

CLASS_FILES = (
    "class/class-barbarian.json",
    "class/class-bard.json",
    "class/class-cleric.json",
    "class/class-druid.json",
    "class/class-fighter.json",
    "class/class-monk.json",
    "class/class-paladin.json",
    "class/class-ranger.json",
    "class/class-rogue.json",
    "class/class-sorcerer.json",
    "class/class-warlock.json",
    "class/class-wizard.json",
    "class/class-artificer.json", # Agregado Artífice
)

# Expandimos los archivos para importar muchas más expansiones
DATA_FILES = (
    "spells/spells-phb.json",
    "spells/spells-xge.json", # Xanathar's Guide to Everything
    "spells/spells-tce.json", # Tasha's Cauldron of Everything
    "spells/spells-scag.json", # Sword Coast Adventurer's Guide
    "spells/spells-ftd.json", # Fizban's Treasury of Dragons
    "bestiary/bestiary-mm.json",
    "bestiary/bestiary-vgm.json", # Volo's Guide to Monsters
    "bestiary/bestiary-mtf.json", # Mordenkainen's Tome of Foes
    "bestiary/bestiary-mpmm.json", # Monsters of the Multiverse
    "bestiary/bestiary-ftd.json", # Fizban's Treasury of Dragons
    "races.json",
    "items.json",
    "items-base.json",
)


def fetch_json(relative_path: str) -> dict:
    """Descarga el JSON desde GitHub."""
    request = Request(
        f"{SOURCE_ROOT}/{relative_path}",
        headers={"User-Agent": "dnd-beyond-clone-importer"},
    )
    try:
        with urlopen(request, timeout=45) as response:
            return json.load(response)
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not download or decode {relative_path}: {exc}") from exc


def plain_text(value: object) -> str:
    """Limpia etiquetas específicas de 5etools (ej: {@spell fireball}) a texto plano."""
    if isinstance(value, str):
        value = re.sub(r"\{@[a-zA-Z]+\s+([^}|]+)(?:\|[^}]*)?\}", r"\1", value)
        return value.strip()
    if isinstance(value, list):
        return "\n".join(text for item in value if (text := plain_text(item)))
    if isinstance(value, dict):
        if "name" in value and ("entries" in value or "entry" in value):
            title = plain_text(value.get("name", ""))
            body = plain_text(value.get("entries", value.get("entry", "")))
            return f"{title}: {body}" if title and body else title or body
        unit = value.get("unit", value.get("type"))
        if "amount" in value and unit:
            return f"{value['amount']} {unit}"
        fields = (
            plain_text(item)
            for key, item in value.items()
            if key not in {"type", "source", "page", "name"}
            and item is not None
            and not isinstance(item, bool)
        )
        text = " ".join(text for text in fields if text)
        if text:
            return text
        return {
            "instant": "Instantaneous",
            "special": "Special",
            "point": "Point",
            "self": "Self",
            "touch": "Touch",
        }.get(str(value.get("type", "")), "")
    if isinstance(value, (int, float)):
        return str(value)
    return ""


def srd_records(data: dict, key: str) -> list[dict]:
    """
    Extrae los registros de la lista especificada (key).
    MODIFICACIÓN (A): Se quitó el filtro de `srd == True`. Ahora retorna TODO el contenido del JSON.
    """
    return [
        record
        for record in data.get(key, [])
        if isinstance(record, dict) # <-- EL FILTRO SRD FUE ELIMINADO
    ]


def source_note(record: dict) -> str:
    """Genera la nota de atribución y fuente (ej: PHB, p. 100)."""
    source = record.get("source", "Unknown")
    page = record.get("page")
    location = f"{source}, p. {page}" if page else source
    return f"{ATTRIBUTION} Source: {location}."


def spell_record(record: dict) -> dict:
    """Mapea un hechizo de 5etools al esquema local."""
    components = record.get("components", {})
    component_names = [
        name.upper()
        for name in ("v", "s", "m")
        if components.get(name)
    ]
    material = record.get("material", components.get("m"))
    material_text = plain_text(material) if isinstance(material, (str, dict)) else None
    if isinstance(material, bool):
        material_text = None

    duration = plain_text(record.get("duration", []))
    is_concentration = any(
        entry.get("concentration") is True
        for entry in record.get("duration", [])
        if isinstance(entry, dict)
    )
    time = plain_text(record.get("time", []))
    school = record.get("school", "")
    school_names = {
        "A": "Abjuration", "C": "Conjuration", "D": "Divination",
        "E": "Enchantment", "V": "Evocation", "I": "Illusion",
        "N": "Necromancy", "T": "Transmutation",
    }
    higher = record.get("entriesHigherLevel")
    classes = record.get("classes", {}).get("fromClassList", [])
    description = plain_text(record.get("entries", []))
    
    # MODIFICACIÓN (C): Extraer el libro de origen para que React pueda construir la URL de la imagen
    source_book = record.get("source", "PHB")

    return {
        "name": record["name"],
        "level": record.get("level", 0),
        "school": school_names.get(school, school),
        "casting_time": time,
        "range": plain_text(record.get("range", {})),
        "components": ", ".join(component_names),
        "material": material_text,
        "duration": duration,
        "description": f"{description}\n\n{source_note(record)}".strip(),
        "higher_levels": {
            "text": plain_text(higher),
            "attribution": source_note(record),
        } if higher else None,
        "classes": [item["name"] for item in classes if item.get("name")],
        "ritual": bool(record.get("meta", {}).get("ritual")),
        "concentration": is_concentration or "concentration" in duration.lower(),
        "source_book": source_book,
    }


def challenge_rating(value: object) -> tuple[float, int]:
    """Convierte el formato de CR de 5etools a float y calcula XP."""
    cr = value.get("cr", "0") if isinstance(value, dict) else value
    xp = value.get("xp") if isinstance(value, dict) else None
    try:
        rating = float(Fraction(str(cr)))
    except (TypeError, ValueError, ZeroDivisionError):
        rating = 0.0

    xp_by_cr = {
        0.0: 0, 0.125: 25, 0.25: 50, 0.5: 100, 1.0: 200, 2.0: 450,
        3.0: 700, 4.0: 1100, 5.0: 1800, 6.0: 2300, 7.0: 2900,
        8.0: 3900, 9.0: 5000, 10.0: 5900, 11.0: 7200, 12.0: 8400,
        13.0: 10000, 14.0: 11500, 15.0: 13000, 16.0: 15000,
        17.0: 18000, 18.0: 20000, 19.0: 22000, 20.0: 25000,
        21.0: 33000, 22.0: 41000, 23.0: 50000, 24.0: 62000,
        25.0: 75000, 26.0: 90000, 27.0: 105000, 28.0: 120000,
        29.0: 135000, 30.0: 155000,
    }
    return rating, int(xp if xp is not None else xp_by_cr.get(rating, 0))


def monster_record(record: dict) -> dict:
    """Mapea un monstruo de 5etools al esquema local."""
    armor = record.get("ac", [0])[0]
    if isinstance(armor, dict):
        armor_class = armor.get("ac", 0)
        armor_type = plain_text(armor.get("from", [])) or None
    else:
        armor_class = armor
        armor_type = None

    cr, xp = challenge_rating(record.get("cr", "0"))
    monster_type = record.get("type", "")
    if isinstance(monster_type, dict):
        monster_type = monster_type.get("type", "")

    senses = {"passive perception": record.get("passive", 10)}
    for sense in record.get("senses", []):
        if isinstance(sense, str):
            name, _, detail = sense.partition(" ")
            senses[name] = detail or True

    traits = named_entries(record.get("trait", []))
    actions = named_entries(record.get("action", []))
    saves = record.get("save")
    skills = record.get("skill")
    speed_data = record.get("speed", {})
    speeds = {}
    speed_notes = []

    for movement, value in speed_data.items():
        if movement == "canHover":
            if value:
                speed_notes.append("The creature can hover.")
            continue
        if isinstance(value, dict):
            speeds[movement] = value.get("number", plain_text(value))
            if value.get("condition"):
                speed_notes.append(
                    f"{movement.title()} speed: {plain_text(value['condition'])}"
                )
        elif not isinstance(value, bool):
            speeds[movement] = value

    size_names = {"T": "Tiny", "S": "Small", "M": "Medium", "L": "Large",
                  "H": "Huge", "G": "Gargantuan"}
    alignment_names = {
        "L": "Lawful", "N": "Neutral", "C": "Chaotic",
        "G": "Good", "E": "Evil", "U": "Unaligned",
        "A": "Any alignment",
    }
    alignment = record.get("alignment", [])
    alignment_text = " ".join(
        alignment_names.get(value, str(value))
        for value in alignment
        if isinstance(value, str)
    ) if isinstance(alignment, list) else plain_text(alignment)
    
    size = record.get("size", ["M"])
    size_text = ", ".join(size_names.get(value, value) for value in size)

    # MODIFICACIÓN (C): Extraer datos para tokens de React
    source_book = record.get("source", "MM") # Ej: MM, VGM, MTF
    has_token = record.get("hasToken", False) # 5etools indica si existe el token en su repo de imágenes

    return {
        "name": record["name"],
        "size": size_text,
        "type": plain_text(monster_type),
        "alignment": alignment_text,
        "armor_class": int(armor_class),
        "armor_type": armor_type,
        "hit_points": int(record.get("hp", {}).get("average", 1)),
        "hit_dice": record.get("hp", {}).get("formula", ""),
        "speeds": speeds,
        "ability_scores": {
            key.upper(): record.get(key, 10)
            for key in ("str", "dex", "con", "int", "wis", "cha")
        },
        "saving_throws": {
            key: str(value).removeprefix("+") for key, value in saves.items()
        } if saves else None,
        "skills": {
            key: str(value).removeprefix("+") for key, value in skills.items()
        } if skills else None,
        "damage_resistances": list_text(record.get("resist")),
        "damage_immunities": list_text(record.get("immune")),
        "condition_immunities": list_text(record.get("conditionImmune")),
        "senses": senses,
        "languages": plain_text(record.get("languages", [])),
        "challenge_rating": cr,
        "xp": xp,
        "special_abilities": traits,
        "actions": actions,
        "legendary_actions": named_entries(record.get("legendary", [])),
        "description": "\n".join([source_note(record), *speed_notes]),
        "source_book": source_book,
        "has_token": has_token,
    }


def list_text(value: object) -> list[str] | None:
    if not value:
        return None
    items = value if isinstance(value, list) else [value]
    return [text for item in items if (text := plain_text(item))]


def named_entries(items: object) -> list[dict[str, str]]:
    if not isinstance(items, list):
        return []
    return [
        {
            "name": str(item.get("name", "Details")),
            "desc": plain_text(item.get("entries", item.get("entry", ""))),
        }
        for item in items
        if isinstance(item, dict)
    ]


def race_record(record: dict, subraces: list[dict] | None = None) -> dict:
    """Mapea razas y subrazas al esquema local."""
    ability_bonuses: dict[str, object] = {}
    for option in record.get("ability", []):
        if isinstance(option, dict):
            for key, value in option.items():
                if key == "choose" and isinstance(value, dict):
                    ability_bonuses["ANY"] = value.get("amount", 1)
                elif isinstance(value, (int, float, str)):
                    ability_bonuses[key.upper()] = value
                else:
                    ability_bonuses[key.upper()] = plain_text(value)

    speed = record.get("speed", {})
    walk_speed = speed.get("walk", 30) if isinstance(speed, dict) else speed
    if isinstance(walk_speed, dict):
        walk_speed = walk_speed.get("number", 30)

    size_names = {"T": "Tiny", "S": "Small", "M": "Medium", "L": "Large",
                  "H": "Huge", "G": "Gargantuan"}
    size = ", ".join(
        size_names.get(value, value) for value in record.get("size", ["M"])
    )

    language_options = record.get("languageProficiencies", [])
    languages = sorted(
        {
            name.replace("_", " ").title()
            for option in language_options
            if isinstance(option, dict)
            for name, allowed in option.items()
            if allowed is True
        }
    )

    entries = record.get("entries", [])
    traits = [
        {
            "name": str(entry.get("name", "Trait")),
            "description": plain_text(entry.get("entries", entry.get("entry", ""))),
        }
        for entry in entries
        if isinstance(entry, dict)
    ]
    description = plain_text(entries)

    race_subraces = [
        {
            "name": subrace["name"],
            "description": plain_text(subrace.get("entries", [])),
        }
        for subrace in subraces or []
        if subrace.get("name")
    ]
    
    # MODIFICACIÓN (C)
    source_book = record.get("source", "PHB")

    return {
        "name": record["name"],
        "ability_bonuses": ability_bonuses,
        "speed": int(walk_speed),
        "size": size,
        "traits": traits,
        "languages": languages,
        "subraces": race_subraces or None,
        "description": f"{description}\n\n{source_note(record)}".strip(),
        # "source_book": source_book,
    }


def class_records(data: dict) -> list[dict]:
    """Mapea las clases de personajes y sus características."""
    classes = srd_records(data, "class")
    features_by_class: dict[tuple[str, str], dict[str, list[dict]]] = defaultdict(
        lambda: defaultdict(list)
    )

    # Iteramos sobre TODAS las características de clase, ya que quitamos el filtro SRD
    for feature in data.get("classFeature", []):
        key = (feature.get("className", ""), feature.get("classSource", ""))
        if key[0]:
            features_by_class[key][str(feature.get("level", 0))].append(
                {
                    "name": feature.get("name", "Feature"),
                    "description": plain_text(feature.get("entries", [])),
                }
            )

    output = []
    for record in classes:
        name = record["name"]
        source = record.get("source", "")
        proficiencies = record.get("startingProficiencies", {})
        skills = proficiencies.get("skills", []) or []

        primary_ability = record.get("primaryAbility")
        if not primary_ability:
            primary_ability = list(
                record.get("multiclassing", {}).get("requirements", {}).keys()
            )

        if isinstance(primary_ability, str):
            primary_ability = [primary_ability]
        elif isinstance(primary_ability, dict):
            primary_ability = list(primary_ability)
        primary_ability = {
            ability.upper(): True for ability in primary_ability
        }

        skill_choice = next(
            (
                choice["choose"]
                for choice in skills
                if isinstance(choice, dict) and isinstance(choice.get("choose"), dict)
            ),
            {},
        )

        features = dict(features_by_class[(name, source)])
        proficiencies = {
            **proficiencies,
            "armor": list_text(proficiencies.get("armor")) or [],
            "weapons": list_text(proficiencies.get("weapons")) or [],
        }
        
        # MODIFICACIÓN (C)
        source_book = source

        output.append(
            {
                "name": name,
                "hit_die": f"d{record.get('hd', {}).get('faces', 8)}",
                "primary_ability": primary_ability,
                "saving_throws": [
                    ability.upper() for ability in record.get("proficiency", [])
                ],
                "armor_proficiencies": proficiencies["armor"],
                "weapon_proficiencies": proficiencies["weapons"],
                "skill_choices": {
                    "choose": skill_choice.get("count", 0),
                    "from": [str(skill).title() for skill in skill_choice.get("from", [])],
                },
                "features_by_level": features,
                "spellcasting": {
                    key: record[key]
                    for key in ("spellcastingAbility", "casterProgression",
                                "cantripProgression", "spellsKnownProgression")
                    if key in record
                } or None,
                "description": (
                    f"{name} class data. "
                    f"See Features for the level progression. {source_note(record)}"
                ),
                # "source_book": source_book,
            }
        )
    return output


def equipment_record(record: dict) -> dict:
    """Mapea el equipamiento y objetos mágicos."""
    value = record.get("value", 0)
    if isinstance(value, (int, float)):
        cost = f"{value / 100:g} gp" if value >= 100 else (
            f"{value / 10:g} sp" if value >= 10 else f"{value:g} cp"
        )
    else:
        cost = str(value or "0 cp")

    item_type = record.get("type", "")
    category = (
        "Weapon" if record.get("weapon") else
        "Armor" if record.get("armor") else
        "Tools" if item_type in {"AT", "INS"} else
        "Adventuring Gear"
    )

    details = {
        key: record[key]
        for key in (
            "dmg1", "dmg2", "dmgType", "property", "range", "ac",
            "rarity", "reqAttune", "weaponCategory", "weight", "value",
        )
        if key in record
    }

    description = plain_text(
        record.get("entries", record.get("additionalEntries", []))
    )
    
    # MODIFICACIÓN (C)
    source_book = record.get("source", "PHB")

    return {
        "name": record["name"],
        "category": str(category),
        "subcategory": record.get("weaponCategory"),
        "cost": cost,
        "weight": (
            float(record["weight"])
            if isinstance(record.get("weight"), (int, float))
            else None
        ),
        "properties": details,
        "description": f"{description}\n\n{source_note(record)}".strip(),
        "source_book": source_book,
    }


def upsert(session: Session, model: type, data: dict) -> None:
    """Inserta o actualiza un registro basándose en su nombre."""
    existing = session.exec(select(model).where(model.name == data["name"])).first()

    if existing is None:
        session.add(model(**data))
        return
    for key, value in data.items():
        setattr(existing, key, value)


def load_srd_payload() -> dict[str, list[dict]]:
    """Descarga e itera sobre los archivos JSON configurados."""
    payload = {key: [] for key in ("spells", "monsters", "races", "classes", "equipment")}

    for file_name in DATA_FILES:
        try:
            data = fetch_json(file_name)
            if file_name.startswith("spells/"):
                payload["spells"].extend(map(spell_record, srd_records(data, "spell")))
            elif file_name.startswith("bestiary/"):
                payload["monsters"].extend(map(monster_record, srd_records(data, "monster")))
            elif file_name == "races.json":
                subraces_by_parent: dict[tuple[str, str], list[dict]] = defaultdict(list)
                for subrace in srd_records(data, "subrace"):
                    parent = (subrace.get("raceName", ""), subrace.get("raceSource", ""))
                    if parent[0] and subrace.get("name"):
                        subraces_by_parent[parent].append(subrace)

                payload["races"].extend(
                    race_record(
                        race,
                        subraces_by_parent.get(
                            (race.get("name", ""), race.get("source", "")), []
                        ),
                    )
                    for race in srd_records(data, "race")
                )
            else:
                key = "item" if file_name == "items.json" else "baseitem"
                payload["equipment"].extend(
                    map(equipment_record, srd_records(data, key))
                )
        except Exception as e:
            print(f"Error procesando {file_name}: {e}")

    for file_path in CLASS_FILES:
        try:
            payload["classes"].extend(class_records(fetch_json(file_path)))
        except Exception as e:
            print(f"Error procesando {file_path}: {e}")

    return payload


def import_payload(session: Session, payload: dict[str, Iterable[dict]]) -> dict[str, int]:
    """Persiste todos los datos descargados en la base de datos local."""
    models = {
        "spells": Spell,
        "monsters": Monster,
        "races": Race,
        "classes": CharacterClass,
        "equipment": Equipment,
    }
    counts = {}

    for section, model in models.items():
        records = list(payload.get(section, []))
        for record in records:
            upsert(session, model, record)
        counts[section] = len(records)

    session.commit()
    return counts


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import D&D 5e entries from 5etools into the local database."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Download and count entries without writing to PostgreSQL.",
    )
    args = parser.parse_args()

    print("Descargando archivos desde 5etools... (Esto puede tomar unos minutos)")
    payload = load_srd_payload()
    counts = {section: len(records) for section, records in payload.items()}

    if args.dry_run:
        print("Dry run completado. Resultados que se insertarían:")
        print(json.dumps(counts, indent=2))
        return

    print("Insertando datos en PostgreSQL...")
    from app.db.database import engine
    with Session(engine) as session:
        result = import_payload(session, payload)
        print("Importación completada con éxito:")
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()