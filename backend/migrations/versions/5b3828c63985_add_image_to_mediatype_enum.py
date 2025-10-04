"""Add 'image' to mediatype enum

Revision ID: 5b3828c63985
Revises: 977065800541
Create Date: 2025-10-04 17:33:29.797122

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b3828c63985'
down_revision: Union[str, Sequence[str], None] = '977065800541'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
