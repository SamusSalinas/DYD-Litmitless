"""Create equipment when missing and add compendium source metadata.

Revision ID: 20261007_01
Revises:
Create Date: 2026-10-07
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20261007_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    schema = "public"

    if not inspector.has_table("equipment", schema=schema):
        op.create_table(
            "equipment",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("category", sa.String(), nullable=False),
            sa.Column("subcategory", sa.String(), nullable=True),
            sa.Column("cost", sa.String(), nullable=False),
            sa.Column("weight", sa.Float(), nullable=True),
            sa.Column("properties", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
            sa.Column("description", sa.String(), nullable=True),
            sa.Column(
                "source_book",
                sa.String(),
                server_default=sa.text("'Unknown'"),
                nullable=False,
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                nullable=False,
            ),
            sa.PrimaryKeyConstraint("id"),
            schema=schema,
        )
        op.create_index(
            "ix_equipment_name",
            "equipment",
            ["name"],
            unique=True,
            schema=schema,
        )

    required_columns = {
        "monsters": {
            "source_book": sa.Column(
                "source_book",
                sa.String(),
                server_default=sa.text("'Unknown'"),
                nullable=False,
            ),
            "has_token": sa.Column(
                "has_token",
                sa.Boolean(),
                server_default=sa.false(),
                nullable=False,
            ),
        },
        "spells": {
            "source_book": sa.Column(
                "source_book",
                sa.String(),
                server_default=sa.text("'Unknown'"),
                nullable=False,
            ),
        },
        "equipment": {
            "source_book": sa.Column(
                "source_book",
                sa.String(),
                server_default=sa.text("'Unknown'"),
                nullable=False,
            ),
        },
    }

    for table_name, columns in required_columns.items():
        if not inspector.has_table(table_name, schema=schema):
            continue

        existing_columns = {
            column["name"]
            for column in inspector.get_columns(table_name, schema=schema)
        }
        for column_name, column in columns.items():
            if column_name not in existing_columns:
                op.add_column(table_name, column, schema=schema)


def downgrade() -> None:
    raise NotImplementedError(
        "This conditional migration is intentionally forward-only to avoid "
        "dropping pre-existing equipment data or metadata columns."
    )
