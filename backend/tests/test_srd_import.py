from scripts.import_srd import (
    challenge_rating,
    class_records,
    monster_record,
    plain_text,
    spell_record,
    srd_records,
)


def test_only_explicit_srd_records_are_selected():
    records = srd_records(
        {
            "spell": [
                {"name": "Allowed", "srd": True},
                {"name": "Not marked", "source": "PHB"},
                {"name": "String marker", "srd": "true"},
            ]
        },
        "spell",
    )

    assert [record["name"] for record in records] == ["Allowed"]


def test_plain_text_converts_nested_time_and_range_shapes():
    assert plain_text([{"number": 1, "unit": "action"}]) == "1 action"
    assert plain_text(
        {"type": "point", "distance": {"type": "feet", "amount": 60}}
    ) == "60 feet"
    assert plain_text([{"type": "instant"}]) == "Instantaneous"


def test_spell_mapping_preserves_fields_and_license_attribution():
    spell = spell_record(
        {
            "name": "Sample Spell",
            "source": "PHB",
            "page": 211,
            "level": 0,
            "school": "V",
            "time": [{"number": 1, "unit": "action"}],
            "range": {
                "type": "point",
                "distance": {"type": "feet", "amount": 60},
            },
            "components": {"v": True, "s": True, "m": True},
            "duration": [{"type": "instant"}],
            "entries": ["A sample rules entry."],
            "classes": {"fromClassList": [{"name": "Wizard"}]},
            "meta": {"ritual": True},
        }
    )

    assert spell["casting_time"] == "1 action"
    assert spell["range"] == "60 feet"
    assert spell["duration"] == "Instantaneous"
    assert spell["components"] == "V, S, M"
    assert spell["classes"] == ["Wizard"]
    assert spell["ritual"] is True
    assert "CC BY 4.0" in spell["description"]


def test_monster_mapping_handles_fractional_cr_and_reduces_alignment():
    monster = monster_record(
        {
            "name": "Sample Creature",
            "source": "MM",
            "page": 12,
            "size": ["M"],
            "type": {"type": "beast"},
            "alignment": ["N", "G"],
            "ac": [12],
            "hp": {"average": 5, "formula": "1d8 + 1"},
            "speed": {
                "walk": 30,
                "fly": {"number": 40, "condition": "while near its nest"},
                "canHover": True,
            },
            "str": 10,
            "dex": 12,
            "con": 12,
            "int": 2,
            "wis": 10,
            "cha": 5,
            "passive": 10,
            "languages": [],
            "cr": "1/8",
        }
    )

    assert monster["size"] == "Medium"
    assert monster["type"] == "beast"
    assert monster["alignment"] == "Neutral Good"
    assert monster["challenge_rating"] == 0.125
    assert monster["xp"] == 25
    assert monster["speeds"] == {"walk": 30, "fly": 40}
    assert "can hover" in monster["description"].lower()
    assert "while near its nest" in monster["description"]
    assert challenge_rating({"cr": "1/4", "xp": 60}) == (0.25, 60)


def test_class_mapping_matches_compendium_page_contract_and_filters_features():
    classes = class_records(
        {
            "class": [
                {
                    "name": "Wizard",
                    "source": "PHB",
                    "srd": True,
                    "hd": {"faces": 6},
                    "proficiency": ["int", "wis"],
                    "multiclassing": {"requirements": {"int": 13}},
                    "startingProficiencies": {
                        "armor": [],
                        "weapons": ["{@item dagger|PHB}"],
                        "skills": [
                            {"choose": {"from": ["arcana", "history"], "count": 2}}
                        ],
                    },
                }
            ],
            "classFeature": [
                {
                    "className": "Wizard",
                    "classSource": "PHB",
                    "level": 1,
                    "name": "Arcane Recovery",
                    "srd": True,
                    "entries": ["Recover spell slots."],
                },
                {
                    "className": "Wizard",
                    "classSource": "PHB",
                    "level": 2,
                    "name": "Non-SRD Feature",
                    "srd": False,
                    "entries": ["Do not import."],
                },
            ],
        }
    )

    assert len(classes) == 1
    assert classes[0]["primary_ability"] == {"INT": True}
    assert classes[0]["skill_choices"] == {
        "choose": 2,
        "from": ["Arcana", "History"],
    }
    assert classes[0]["weapon_proficiencies"] == ["dagger"]
    assert classes[0]["features_by_level"] == {
        "1": [{"name": "Arcane Recovery", "description": "Recover spell slots."}]
    }
