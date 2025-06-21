from app.models import db, Product
from datetime import datetime
from app.seeds.product_list import products
import random

# Product type mapping
PRODUCT_TYPE_MAPPING = {
    # Vegetables
    "acorn_squash": "Vegetables",
    "artichoke": "Vegetables",
    "asparagus": "Vegetables",
    "bokchoy": "Vegetables",
    "broccoli": "Vegetables",
    "brussel_sprout": "Vegetables",
    "cabbage": "Vegetables",
    "carrots": "Vegetables",
    "cauliflower": "Vegetables",
    "celery": "Vegetables",
    "corn": "Vegetables",
    "cucumber": "Vegetables",
    "eggplant": "Vegetables",
    "garlic": "Herbs",
    "ginger": "Herbs",
    "grape_tomato": "Vegetables",
    "green_bean": "Vegetables",
    "green_bell_pepper": "Vegetables",
    "green_onion": "Herbs",
    "habenero": "Herbs",
    "jalapeno": "Herbs",
    "kale": "Vegetables",
    "leet": "Vegetables",
    "lettuce": "Vegetables",
    "orange_bell_pepper": "Vegetables",
    "plantain": "Vegetables",
    "potato": "Vegetables",
    "radish": "Vegetables",
    "red_beet": "Vegetables",
    "red_bell_pepper": "Vegetables",
    "red_onion": "Vegetables",
    "red_potato": "Vegetables",
    "spaghetti_squash": "Vegetables",
    "spinach": "Vegetables",
    "squash": "Vegetables",
    "sweet_potato": "Vegetables",
    "tomato": "Vegetables",
    "yellow_bell_pepper": "Vegetables",
    "yellow_onion": "Vegetables",
    "yellow_zucchini": "Vegetables",
    "zucchini": "Vegetables",
    
    # Fruits
    "apple": "Fruits",
    "cherry": "Fruits",
    "fuji_apple": "Fruits",
    "lemon": "Fruits",
    "red_grapes": "Fruits",
    
    # Mushrooms (can be considered vegetables or organic)
    "bella_mushroom": "Vegetables",
    "oyster_mushroom": "Vegetables",
    "portabello_mushroom": "Vegetables",
    "shiitake_mushroom": "Vegetables",
    "white_mushroom": "Vegetables",
    
    # Avocado (technically a fruit but often categorized as vegetable)
    "avocado": "Vegetables"
}

def seed_products():
    i = 0

    while i < len(products):
        name = products[i]
        split_name = name.split("_")
        j_name = (" ").join(split_name)
        
        # Get product type from mapping, default to Vegetables
        product_type = PRODUCT_TYPE_MAPPING.get(name, "Vegetables")
        
        p = Product(
            user_id = random.randint(1, 3),
            name=f'{ j_name.title() }',
            description=f'This is a locally grown { j_name }. It\'s fresh and ready to be eaten.',
            price=float(random.randint(1, 20)) + 0.99,
            image=(f'https://raw.githubusercontent.com/michellekontoff/spudhub/main/product_images/{ name }.jpg'),
            product_type=product_type,
            created_at=datetime.now(),
            updated_at= datetime.now()
        )
        db.session.add(p)
        i += 1

    db.session.commit()

def undo_products():
    db.session.execute('TRUNCATE products RESTART IDENTITY CASCADE;')
    db.session.commit()
