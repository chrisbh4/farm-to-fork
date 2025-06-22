from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DecimalField, TextAreaField, IntegerField, SelectField
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
from app.models import Product


def check_name_on_edit(form, field):
    name = field.data

    product = Product.query.filter(Product.name == name).first()

    if product and product.id != form.data['product_id']:
        raise ValidationError("Name must be unique.")

PRODUCT_TYPES = [
    ('Vegetables', 'Vegetables'),
    ('Fruits', 'Fruits'),
    ('Herbs', 'Herbs')
]

class ProductEditForm(FlaskForm):
    product_id = IntegerField("product_id")
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=100, message="Name must be between %(min)d and %(max)d characters."), check_name_on_edit])
    description = TextAreaField('Description', validators=[DataRequired(), Length(min=10, max=500, message="Description must be between %(min)d and %(max)d characters.")])
    price = DecimalField('Price', validators=[DataRequired(), NumberRange(min=0.01, max=10000.00, message="Price must be between $%(min).2f and $%(max).2f.")])
    quantity = IntegerField('Quantity', validators=[DataRequired(), NumberRange(min=1, message="Quantity must be at least %(min)d.")])
    image = FileField("Image", validators=[FileAllowed(['jpg', 'jpeg', 'png', 'gif', 'webp'], 'Only image files are allowed!')])
    product_type = SelectField('Product Type', choices=PRODUCT_TYPES, validators=[DataRequired()])
