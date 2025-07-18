from app.models import review
from .db import db
from .order_detail import Order_Detail

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer,primary_key=True, nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(precision=10, scale=2, asdecimal=False), nullable=False )
    quantity = db.Column(db.Integer , nullable=True, default=1)
    image = db.Column(db.Text, nullable=True)
    product_type = db.Column(db.String(50), nullable=False, default='Vegetables')
    created_at = db.Column(db.Date , nullable=False)
    updated_at = db.Column(db.Date , nullable=False)

    reviews = db.relationship("Review", backref=db.backref("products"), lazy=True )
    user = db.relationship("User", backref=db.backref("products"), lazy=True )


# Getters & Setters
    # @property
    # def _name(self):
    #     return self.name

    # @_name.setter
    # def _name(self, name):
    #     self.name = name

    # @property
    # def _description(self):
    #     return self.description

    # @_description.setter
    # def _description(self, description):
    #     self.description = description

    # @property
    # def _price(self):
    #     return self.price

    # @_price.setter
    # def _price(self, price):
    #     self.price = price

    # @property
    # def _quantity(self):
    #     return self.quantity

    # @_quantity.setter
    # def _quantity(self, quantity):
    #     self.quantity = quantity

    # @property
    # def _image(self):
    #     return self.image

    # @_image.setter
    # def _image(self, image):
    #     self.image = image

    # @property
    # def _updated_at(self):
    #     return self.updated_at

    # @_updated_at.setter
    # def _updated_at(self, updated_at):
    #     self.updated_at = updated_at


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'image': self.image,
            'product_type': self.product_type,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at)
        }

    def get_reviews(self):
        return [review.to_dict() for review in self.reviews]
