"""add product_type to products

Revision ID: b85c7069a1fd
Revises: ba4a6b66d13e
Create Date: 2025-06-20 18:59:10.336133

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b85c7069a1fd'
down_revision = 'ba4a6b66d13e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('products', sa.Column('product_type', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('products', 'product_type')
    # ### end Alembic commands ###
