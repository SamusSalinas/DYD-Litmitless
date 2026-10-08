from sqlmodel import Session, select
from app.db.models import Spell, CharacterClass, Race, Monster, Equipment

def seed_spells(session: Session):
    spells_data = [
        {"name": "Fireball", "level": 3, "school": "Evocation", "casting_time": "1 action", "range": "150 feet", "components": "V, S, M", "material": "A tiny ball of bat guano and sulfur", "duration": "Instantaneous", "description": "A bright streak flashes from your pointing finger...", "classes": ["Sorcerer", "Wizard"]},
        {"name": "Magic Missile", "level": 1, "school": "Evocation", "casting_time": "1 action", "range": "120 feet", "components": "V, S", "duration": "Instantaneous", "description": "You create three glowing darts of magical force...", "classes": ["Sorcerer", "Wizard"]},
        {"name": "Cure Wounds", "level": 1, "school": "Evocation", "casting_time": "1 action", "range": "Touch", "components": "V, S", "duration": "Instantaneous", "description": "A creature you touch regains a number of hit points...", "classes": ["Bard", "Cleric", "Druid", "Paladin", "Ranger"]},
    ]
    for data in spells_data:
        if not session.exec(select(Spell).where(Spell.name == data["name"])).first():
            session.add(Spell(**data))

def seed_classes(session: Session):
    classes_data = [
        {"name": "Fighter", "hit_die": "d10", "primary_ability": {"primary": ["STR", "DEX"]}, "saving_throws": ["STR", "CON"], "armor_proficiencies": ["All armor", "Shields"], "weapon_proficiencies": ["Simple weapons", "Martial weapons"], "skill_choices": {"choose": 2, "from": ["Acrobatics", "Animal Handling", "Athletics"]}, "features_by_level": {"1": [{"name": "Fighting Style", "description": "You adopt a particular style of fighting."}]}, "description": "A master of martial combat."},
        {"name": "Wizard", "hit_die": "d6", "primary_ability": {"primary": ["INT"]}, "saving_throws": ["INT", "WIS"], "armor_proficiencies": [], "weapon_proficiencies": ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"], "skill_choices": {"choose": 2, "from": ["Arcana", "History", "Insight"]}, "features_by_level": {"1": [{"name": "Spellcasting", "description": "As a student of arcane magic, you have a spellbook containing spells."}]}, "description": "A scholarly magic-user capable of manipulating the structures of reality."},
    ]
    for data in classes_data:
        if not session.exec(select(CharacterClass).where(CharacterClass.name == data["name"])).first():
            session.add(CharacterClass(**data))

def seed_races(session: Session):
    races_data = [
        {"name": "Human", "ability_bonuses": {"STR": 1, "DEX": 1, "CON": 1, "INT": 1, "WIS": 1, "CHA": 1}, "speed": 30, "size": "Medium", "traits": [], "languages": ["Common", "One extra language"], "description": "Humans are the most adaptable and ambitious people."},
        {"name": "Elf", "ability_bonuses": {"DEX": 2}, "speed": 30, "size": "Medium", "traits": [{"name": "Darkvision", "description": "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions."}], "languages": ["Common", "Elvish"], "description": "Elves are a magical people of otherworldly grace."},
    ]
    for data in races_data:
        if not session.exec(select(Race).where(Race.name == data["name"])).first():
            session.add(Race(**data))

def seed_monsters(session: Session):
    monsters_data = [
        {"name": "Goblin", "size": "Small", "type": "Humanoid", "alignment": "Neutral Evil", "armor_class": 15, "armor_type": "Leather armor, shield", "hit_points": 7, "hit_dice": "2d6", "speeds": {"walk": 30}, "ability_scores": {"STR": 8, "DEX": 14, "CON": 10, "INT": 10, "WIS": 8, "CHA": 8}, "senses": {"darkvision": 60, "passive_perception": 9}, "languages": "Common, Goblin", "challenge_rating": 0.25, "xp": 50, "actions": [{"name": "Scimitar", "desc": "Melee Weapon Attack", "attack_bonus": 4, "damage": "1d6+2"}]},
        {"name": "Skeleton", "size": "Medium", "type": "Undead", "alignment": "Lawful Evil", "armor_class": 13, "armor_type": "Armor scraps", "hit_points": 13, "hit_dice": "2d8+4", "speeds": {"walk": 30}, "ability_scores": {"STR": 10, "DEX": 14, "CON": 15, "INT": 6, "WIS": 8, "CHA": 5}, "senses": {"darkvision": 60, "passive_perception": 9}, "languages": "Understands all languages it knew in life but can't speak", "challenge_rating": 0.25, "xp": 50, "actions": [{"name": "Shortsword", "desc": "Melee Weapon Attack", "attack_bonus": 4, "damage": "1d6+2"}]},
    ]
    for data in monsters_data:
        if not session.exec(select(Monster).where(Monster.name == data["name"])).first():
            session.add(Monster(**data))

def seed_equipment(session: Session):
    equipment_data = [
        {"name": "Longsword", "category": "Weapon", "subcategory": "Martial Melee Weapon", "cost": "15 gp", "weight": 3, "properties": {"damage": "1d8", "damage_type": "slashing", "versatile": "1d10"}},
        {"name": "Leather Armor", "category": "Armor", "subcategory": "Light Armor", "cost": "10 gp", "weight": 10, "properties": {"ac": 11, "modifier": "DEX"}},
    ]
    for data in equipment_data:
        if not session.exec(select(Equipment).where(Equipment.name == data["name"])).first():
            session.add(Equipment(**data))

def seed_all(session: Session):
    seed_spells(session)
    seed_classes(session)
    seed_races(session)
    seed_monsters(session)
    seed_equipment(session)
    session.commit()
