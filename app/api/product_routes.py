from flask import Blueprint, request
from app.models import Product, db
from datetime import date, datetime
from app.forms.product_create_form import ProductCreateForm
from app.forms.product_edit_form import ProductEditForm
import boto3
import botocore
import os
import uuid

BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

product_routes = Blueprint("products", __name__)

def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def upload_file_to_s3(file, bucket_name, acl="public-read"):
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("S3_KEY"),
            aws_secret_access_key=os.environ.get("S3_SECRET")
        )
        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        print("Something Happened: ", e)
        return e
    return f"{S3_LOCATION}{file.filename}"

def remove_file_from_s3(file_url, bucket_name):
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("S3_KEY"),
            aws_secret_access_key=os.environ.get("S3_SECRET")
        )
        # Extract filename from URL
        filename = file_url.replace(S3_LOCATION, "")
        s3.delete_object(Bucket=bucket_name, Key=filename)
    except Exception as e:
        print("Something Happened: ", e)
        return e
    return True

@product_routes.route("/")
def products():
    products = Product.query.all()
    return {product.to_dict()['id']: product.to_dict() for product in products}


@product_routes.route("/create",methods=['POST'])
def create_product():
    form=ProductCreateForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        
        # Handle image upload
        image_url = None
        if data['image']:
            image = data['image']
            if not allowed_file(image.filename):
                return {'errors': {'image': ['Invalid file type. Please upload an image file.']}}, 400
            
            # Try S3 upload, but fallback gracefully if it fails
            try:
                if BUCKET_NAME:  # Only try S3 if bucket is configured
                    image.filename = get_unique_filename(image.filename)
                    upload_result = upload_file_to_s3(image, BUCKET_NAME)
                    
                    if isinstance(upload_result, str):  # Success case
                        image_url = upload_result
                    else:
                        print(f"S3 upload failed: {upload_result}")
                        # Continue without image for now
                        image_url = None
                else:
                    print("S3 not configured, skipping image upload")
                    image_url = None
            except Exception as e:
                print(f"Image upload error: {e}")
                # Continue without image instead of failing the entire request
                image_url = None
        
        new_product = Product(
            user_id=data['user_id'], 
            name=data['name'], 
            description=data['description'], 
            price=data['price'], 
            quantity=data['quantity'], 
            image=image_url,
            product_type=data['product_type'],
            created_at = datetime.now(), 
            updated_at= datetime.now()
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product.to_dict()
    else:
        return {'errors':form.errors},400


@product_routes.route('/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product_page(id):
    product = Product.query.filter(Product.id == id).first()

    if request.method == 'GET':
        return product.to_dict()

    elif request.method == 'PUT':
        form = ProductEditForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            new_data = form.data
            
            # Handle image upload
            image_url = product.image  # Keep current image by default
            if new_data['image']:
                image = new_data['image']
                if not allowed_file(image.filename):
                    return {'errors': {'image': ['Invalid file type. Please upload an image file.']}}, 400
                
                # Remove old image from S3 if it exists
                if product.image and product.image.startswith(S3_LOCATION):
                    try:
                        remove_file_from_s3(product.image, BUCKET_NAME)
                    except Exception as e:
                        print(f"Failed to remove old image: {e}")
                
                # Upload new image
                try:
                    if BUCKET_NAME:  # Only try S3 if bucket is configured
                        image.filename = get_unique_filename(image.filename)
                        upload_result = upload_file_to_s3(image, BUCKET_NAME)
                        
                        if isinstance(upload_result, str):  # Success case
                            image_url = upload_result
                        else:
                            print(f"S3 upload failed: {upload_result}")
                            return {'errors': {'image': ['Failed to upload image. Please try again.']}}, 500
                    else:
                        print("S3 not configured, skipping image upload")
                        return {'errors': {'image': ['Image upload not configured.']}}, 500
                except Exception as e:
                    print(f"Image upload error: {e}")
                    return {'errors': {'image': ['Failed to upload image. Please try again.']}}, 500
            
            product.name = new_data['name']
            product.description = new_data['description']
            product.price = new_data['price']
            product.quantity = new_data['quantity']
            product.image = image_url
            product.product_type = new_data['product_type']
            product.updated_at = datetime.now()

            db.session.add(product)
            db.session.commit()
            return product.to_dict()
        else:
            return {'errors':form.errors},400

    elif request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return {"deletion":"successful"}
