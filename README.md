# 🥕 Farm to Fork

**A modern e-commerce platform connecting consumers directly with local farmers**

Farm to Fork is a full-stack web application that bridges the gap between local farmers and consumers, providing a seamless marketplace for fresh, locally-sourced produce. Built with React and Flask, it offers a complete e-commerce experience with real-time cart management, order tracking, and user-friendly interfaces.

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://your-app-url.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/your-username/farm-to-fork)

## 🌟 Features

### 🛒 **E-Commerce Core**
- **Product Catalog**: Browse and search through a comprehensive collection of fresh produce
- **Advanced Filtering**: Filter products by category, search by name, and dynamic product discovery
- **Shopping Cart**: Real-time cart management with quantity updates and price calculations
- **Secure Checkout**: Complete purchase flow with order creation and confirmation
- **Order Management**: Full order history with expandable details and order tracking

### 👤 **User Management**
- **Authentication System**: Secure user registration, login, and logout
- **User Profiles**: Personalized user accounts with profile management
- **Protected Routes**: Secure access to user-specific features
- **Demo User**: Quick access demo account for testing

### 🚜 **Farmer Dashboard**
- **Product Management**: Create, edit, and delete product listings
- **Inventory Control**: Manage product availability and pricing
- **Sales Analytics**: Track product performance and sales

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Interactive Modals**: Smooth modal interactions for product details and forms
- **Loading States**: Professional loading indicators and error handling
- **Purchase Confirmation**: Animated success modals with order summaries
- **Empty State Handling**: Thoughtful empty cart and no-products messaging

### 🔍 **Search & Discovery**
- **Smart Search**: Real-time product search with URL parameter support
- **Category Filtering**: Dynamic product type filtering
- **Search History**: Persistent search state with URL integration
- **Product Recommendations**: Featured products and discovery features

## 🛠️ Tech Stack

### **Frontend**
- **React 17** - Modern UI library with hooks
- **Redux** - State management with Redux Toolkit patterns
- **React Router** - Client-side routing and navigation
- **CSS3** - Custom styling with modern CSS features
- **Font Awesome** - Professional icon library

### **Backend**
- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-Login** - User session management
- **Flask-WTF** - Form handling and validation
- **Alembic** - Database migrations

### **Database**
- **PostgreSQL** - Production database
- **SQLite** - Development database support

### **Deployment & DevOps**
- **Docker** - Containerized deployment
- **Heroku** - Cloud platform deployment
- **Gunicorn** - WSGI HTTP Server
- **AWS S3** - File storage (configured)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/farm-to-fork.git
   cd farm-to-fork
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
   
   # Activate virtual environment
   pipenv shell
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb farm_to_fork_dev
   
   # Run migrations
   flask db upgrade
   
   # Seed database with sample data
   flask seed all
   ```

4. **Frontend Setup**
   ```bash
   cd react-app
   npm install
   ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   flask run
   
   # Terminal 2 - Frontend
   cd react-app
   npm start
   ```

6. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🗂️ Project Structure

```
farm-to-fork/
├── app/                          # Flask backend
│   ├── api/                      # API routes
│   │   ├── auth_routes.py        # Authentication endpoints
│   │   ├── product_routes.py     # Product CRUD operations
│   │   ├── order_routes.py       # Order management
│   │   └── user_routes.py        # User management
│   ├── models/                   # Database models
│   │   ├── user.py              # User model
│   │   ├── product.py           # Product model
│   │   ├── order.py             # Order model
│   │   └── order_detail.py      # Order details model
│   ├── forms/                    # WTForms
│   └── seeds/                    # Database seeders
├── react-app/                    # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── Cart/            # Shopping cart components
│   │   │   ├── Home/            # Homepage components
│   │   │   ├── Orders/          # Order management
│   │   │   ├── Products/        # Product components
│   │   │   └── NavBar.js        # Navigation
│   │   ├── store/               # Redux store
│   │   │   ├── session.js       # User session
│   │   │   ├── products.js      # Product state
│   │   │   ├── shoppingCart.js  # Cart state
│   │   │   └── index.js         # Store configuration
│   │   └── context/             # React context
├── migrations/                   # Database migrations
└── documentation/               # Project documentation
```

## 🔑 Key Features Deep Dive

### Order Management System
- **Complete Order Flow**: From cart to confirmation with database persistence
- **Order History**: Users can view all past orders with detailed breakdowns
- **Order Details**: Expandable order cards showing products, quantities, and prices
- **Real-time Updates**: Immediate cart updates and order status changes

### Shopping Cart
- **Persistent State**: Cart items maintained across sessions
- **Dynamic Calculations**: Real-time price updates and totals
- **Quantity Management**: Easy quantity adjustments with validation
- **Checkout Process**: Streamlined purchase flow with error handling

### Product Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Image Support**: Product image uploads and display
- **Category System**: Organized product types and filtering
- **Search Integration**: Fast product discovery and filtering

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Loading States**: Professional loading indicators throughout
- **Error Handling**: Comprehensive error messages and recovery options
- **Accessibility**: ARIA labels and keyboard navigation support

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/signup` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile

## 🚀 Deployment

### Heroku Deployment

1. **Prepare for deployment**
   ```bash
   pipenv lock -r > requirements.txt
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Deploy with Docker**
   ```bash
   heroku container:login
   heroku container:push web -a your-app-name
   heroku container:release web -a your-app-name
   ```

4. **Setup database**
   ```bash
   heroku run flask db upgrade -a your-app-name
   heroku run flask seed all -a your-app-name
   ```

### Environment Variables
```env
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
REACT_APP_BASE_URL=your-backend-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **App Academy** - For the foundational project structure
- **Local Farmers** - For inspiring the concept of direct farm-to-consumer commerce
- **Open Source Community** - For the amazing tools and libraries used

## 📞 Contact

**Your Name** - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/your-username/farm-to-fork](https://github.com/your-username/farm-to-fork)

---

**Made with ❤️ for farmers and fresh food lovers**
