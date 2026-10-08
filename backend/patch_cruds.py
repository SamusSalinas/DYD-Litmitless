import os

base_path = r"c:\Users\Samuel\Desktop\dnd-beyond-clone\backend\app\crud"

def patch_crud(file_name, model_name, filters_code):
    path = os.path.join(base_path, file_name)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    old_get_all = f"def get_all(session: Session):\n    return session.exec(select({model_name})).all()"
    
    if old_get_all in content:
        content = content.replace(old_get_all, filters_code)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {file_name}")
    else:
        print(f"Could not find get_all in {file_name}")

spell_filters = """def get_all(session: Session, level=None, school=None, class_name=None, name=None, ritual=None, concentration=None):
    stmt = select(Spell)
    if level is not None:
        stmt = stmt.where(Spell.level == level)
    if school:
        stmt = stmt.where(Spell.school == school)
    if name:
        stmt = stmt.where(Spell.name.ilike(f"%{name}%"))
    if ritual is not None:
        stmt = stmt.where(Spell.ritual == ritual)
    if concentration is not None:
        stmt = stmt.where(Spell.concentration == concentration)
    return session.exec(stmt).all()"""
patch_crud("crud_spell.py", "Spell", spell_filters)

char_filters = """def get_all(session: Session, name=None, race=None, character_class=None):
    stmt = select(Character)
    if name:
        stmt = stmt.where(Character.name.ilike(f"%{name}%"))
    if race:
        stmt = stmt.where(Character.race == race)
    if character_class:
        stmt = stmt.where(Character.character_class == character_class)
    return session.exec(stmt).all()"""
patch_crud("crud_character.py", "Character", char_filters)

monster_filters = """def get_all(session: Session, name=None, type=None, size=None, challenge_rating=None):
    stmt = select(Monster)
    if name:
        stmt = stmt.where(Monster.name.ilike(f"%{name}%"))
    if type:
        stmt = stmt.where(Monster.type == type)
    if size:
        stmt = stmt.where(Monster.size == size)
    if challenge_rating is not None:
        stmt = stmt.where(Monster.challenge_rating == challenge_rating)
    return session.exec(stmt).all()"""
patch_crud("crud_monster.py", "Monster", monster_filters)

equip_filters = """def get_all(session: Session, name=None, category=None, subcategory=None):
    stmt = select(Equipment)
    if name:
        stmt = stmt.where(Equipment.name.ilike(f"%{name}%"))
    if category:
        stmt = stmt.where(Equipment.category == category)
    if subcategory:
        stmt = stmt.where(Equipment.subcategory == subcategory)
    return session.exec(stmt).all()"""
patch_crud("crud_equipment.py", "Equipment", equip_filters)

homebrew_filters = """def get_all(session: Session, name=None, content_type=None):
    stmt = select(Homebrew)
    if name:
        stmt = stmt.where(Homebrew.name.ilike(f"%{name}%"))
    if content_type:
        stmt = stmt.where(Homebrew.content_type == content_type)
    return session.exec(stmt).all()"""
patch_crud("crud_homebrew.py", "Homebrew", homebrew_filters)

race_filters = """def get_all(session: Session, name=None):
    stmt = select(Race)
    if name:
        stmt = stmt.where(Race.name.ilike(f"%{name}%"))
    return session.exec(stmt).all()"""
patch_crud("crud_race.py", "Race", race_filters)

class_filters = """def get_all(session: Session, name=None):
    stmt = select(CharacterClass)
    if name:
        stmt = stmt.where(CharacterClass.name.ilike(f"%{name}%"))
    return session.exec(stmt).all()"""
patch_crud("crud_character_class.py", "CharacterClass", class_filters)

