from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Order, Order_Detail, Product, db
from datetime import datetime
from decimal import Decimal

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=['POST'])
@login_required
def create_order():
    """
    Create a new order with order details
    """
    try:
        data = request.get_json()
        cart_items = data.get('cart_items', [])
        
        if not cart_items:
            return {'errors': ['Cart cannot be empty']}, 400
        
        # Calculate total price and validate products
        total_price = Decimal('0.00')
        order_details = []
        
        for item in cart_items:
            product_id = item.get('productId')
            quantity = item.get('quantity', 1)
            
            # Validate product exists
            product = Product.query.get(product_id)
            if not product:
                return {'errors': [f'Product with id {product_id} not found']}, 400
            
            # Calculate item total
            item_total = Decimal(str(product.price)) * quantity
            total_price += item_total
            
            order_details.append({
                'product_id': product_id,
                'quantity': quantity,
                'product': product
            })
        
        # Create the order
        new_order = Order(
            user_id=current_user.id,
            total_price=total_price,
            created_at=datetime.now().date(),
            updated_at=datetime.now().date()
        )
        
        db.session.add(new_order)
        db.session.commit()
        
        # Create order details
        for detail in order_details:
            order_detail = Order_Detail(
                user_id=current_user.id,
                order_id=new_order.id,
                product_id=detail['product_id'],
                quantity=detail['quantity'],
                created_at=datetime.now().date(),
                updated_at=datetime.now().date()
            )
            db.session.add(order_detail)
        
        db.session.commit()
        
        # Return the created order with details
        order_dict = new_order.to_dict()
        order_dict['order_details'] = [
            {
                'product_id': detail['product_id'],
                'quantity': detail['quantity'],
                'product_name': detail['product'].name,
                'product_price': float(detail['product'].price),
                'total_price': float(Decimal(str(detail['product'].price)) * detail['quantity'])
            }
            for detail in order_details
        ]
        
        return {'order': order_dict}, 201
        
    except Exception as e:
        db.session.rollback()
        return {'errors': [str(e)]}, 500

@order_routes.route('', methods=['GET'])
@login_required
def get_user_orders():
    """
    Get all orders for the current user
    """
    try:
        orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
        
        orders_with_details = []
        for order in orders:
            order_dict = order.to_dict()
            
            # Get order details
            order_details = Order_Detail.query.filter_by(order_id=order.id).all()
            order_dict['order_details'] = []
            
            for detail in order_details:
                product = Product.query.get(detail.product_id)
                if product:
                    order_dict['order_details'].append({
                        'id': detail.id,
                        'product_id': detail.product_id,
                        'quantity': detail.quantity,
                        'product_name': product.name,
                        'product_price': float(product.price),
                        'product_image': product.image,
                        'total_price': float(Decimal(str(product.price)) * detail.quantity)
                    })
            
            orders_with_details.append(order_dict)
        
        return {'orders': orders_with_details}, 200
        
    except Exception as e:
        return {'errors': [str(e)]}, 500

@order_routes.route('/<int:order_id>', methods=['GET'])
@login_required
def get_order_details(order_id):
    """
    Get details for a specific order
    """
    try:
        order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
        
        if not order:
            return {'errors': ['Order not found']}, 404
        
        order_dict = order.to_dict()
        
        # Get order details
        order_details = Order_Detail.query.filter_by(order_id=order.id).all()
        order_dict['order_details'] = []
        
        for detail in order_details:
            product = Product.query.get(detail.product_id)
            if product:
                order_dict['order_details'].append({
                    'id': detail.id,
                    'product_id': detail.product_id,
                    'quantity': detail.quantity,
                    'product_name': product.name,
                    'product_price': float(product.price),
                    'product_image': product.image,
                    'total_price': float(Decimal(str(product.price)) * detail.quantity)
                })
        
        return {'order': order_dict}, 200
        
    except Exception as e:
        return {'errors': [str(e)]}, 500 