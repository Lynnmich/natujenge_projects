"""Removed historical data table

Revision ID: 15c4e88bec4a
Revises: 973c0ee63846
Create Date: 2024-07-24 12:07:26.358995

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '15c4e88bec4a'
down_revision = '973c0ee63846'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('historical_weather')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('historical_weather',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('location', sa.VARCHAR(length=50), nullable=False),
    sa.Column('temperature', sa.FLOAT(), nullable=False),
    sa.Column('description', sa.VARCHAR(length=50), nullable=False),
    sa.Column('weather_icon', sa.VARCHAR(length=50), nullable=False),
    sa.Column('low_temperature', sa.FLOAT(), nullable=False),
    sa.Column('high_temperature', sa.FLOAT(), nullable=False),
    sa.Column('recorded_at', sa.DATETIME(), nullable=True),
    sa.Column('local_time', sa.VARCHAR(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###