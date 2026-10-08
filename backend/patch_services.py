import os

base_path = r"c:\Users\Samuel\Desktop\dnd-beyond-clone\backend\app\services"

def patch_service(file_name, crud_module):
    path = os.path.join(base_path, file_name)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    old_get_all = f"def get_all(session: Session):\n    return {crud_module}.get_all(session)"
    new_get_all = f"def get_all(session: Session, **kwargs):\n    return {crud_module}.get_all(session, **kwargs)"
    
    if old_get_all in content:
        content = content.replace(old_get_all, new_get_all)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {file_name}")
    else:
        print(f"Could not find get_all in {file_name}")

patch_service("spell_service.py", "crud_spell")
patch_service("character_service.py", "crud_character")
patch_service("monster_service.py", "crud_monster")
patch_service("equipment_service.py", "crud_equipment")
patch_service("homebrew_service.py", "crud_homebrew")
patch_service("race_service.py", "crud_race")
patch_service("character_class_service.py", "crud_character_class")
