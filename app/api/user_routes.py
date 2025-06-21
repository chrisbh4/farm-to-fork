from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
from app.forms import SignUpForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    # Only allow users to update their own profile
    if current_user.id != id:
        return {'errors': ['Unauthorized']}, 403
    
    user = User.query.get(id)
    if not user:
        return {'errors': ['User not found']}, 404
    
    data = request.get_json()
    errors = {}
    
    # Validate username
    if 'username' in data:
        username = data['username'].strip()
        if not username:
            errors['username'] = 'Username is required'
        elif len(username) < 3:
            errors['username'] = 'Username must be at least 3 characters'
        elif len(username) > 40:
            errors['username'] = 'Username must be less than 40 characters'
        elif User.query.filter(User.username == username, User.id != id).first():
            errors['username'] = 'Username is already taken'
        else:
            user.username = username
    
    # Validate email
    if 'email' in data:
        email = data['email'].strip().lower()
        if not email:
            errors['email'] = 'Email is required'
        elif '@' not in email or '.' not in email:
            errors['email'] = 'Please enter a valid email address'
        elif len(email) > 255:
            errors['email'] = 'Email must be less than 255 characters'
        elif User.query.filter(User.email == email, User.id != id).first():
            errors['email'] = 'Email is already registered'
        else:
            user.email = email
    
    # Validate password (optional)
    if 'password' in data and data['password']:
        password = data['password']
        if len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'
        elif len(password) > 255:
            errors['password'] = 'Password must be less than 255 characters'
        else:
            user.password = password
    
    if errors:
        return {'errors': errors}, 400
    
    try:
        db.session.commit()
        return user.to_dict()
    except Exception as e:
        db.session.rollback()
        return {'errors': ['An error occurred while updating your profile']}, 500
