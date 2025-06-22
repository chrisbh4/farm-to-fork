import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import './Homepage.css'
import ProductList from './ProductList';
import { Modal } from '../../context/Modal';
import SignUpForm from '../auth/SignUpForm';

function HomePage() {
    const user = useSelector(state => state.session.user)
    const products = useSelector(state => state.products)
    const history = useHistory()
    const [showSignUpModal, setShowSignUpModal] = useState(false)
    const [showAllProducts, setShowAllProducts] = useState(false)
    const [activeFilter, setActiveFilter] = useState('All Products')

    // Get unique product types from the products data
    const productTypes = ['All Products', ...new Set(Object.values(products).map(product => product.product_type))]

    // Filter products based on active filter
    const filteredProducts = activeFilter === 'All Products'
        ? Object.values(products)
        : Object.values(products).filter(product => product.product_type === activeFilter)

    // Sort products by name
    function sortProductsByName(productA, productB) {
        return productA.name.localeCompare(productB.name)
    }

    // Get displayed products (either all or limited)
    const displayedProducts = showAllProducts
        ? filteredProducts.sort(sortProductsByName)
        : filteredProducts.sort(sortProductsByName).slice(0, 8)

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType)
        setShowAllProducts(false) // Reset to show limited products when filter changes
    }

    const scrollToProducts = () => {
        setShowAllProducts(true);
        // Small delay to allow state update before scrolling
        setTimeout(() => {
            const productsSection = document.getElementById('products-section');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Farm Fresh to Your Door
                            </h1>
                            <p className="hero-subtitle">
                                Connect directly with local farmers and discover the freshest,
                                most delicious produce in your community. Support sustainable
                                agriculture while enjoying premium quality fruits and vegetables.
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary btn-lg"
                                        onClick={() => history.push('/products')}
                                >
                                    <i className="fas fa-leaf"></i>
                                    Shop Fresh Produce
                                </button>
                                {!user && (
                                    <button
                                        className="btn btn-secondary btn-lg"
                                        onClick={() => setShowSignUpModal(true)}
                                    >
                                        <i className="fas fa-user-plus"></i>
                                        Join Our Community
                                    </button>
                                )}
                            </div>
                            <div className="hero-stats">
                                <div className="stat">
                                    <span className="stat-number">{Object.values(products).length}+</span>
                                    <span className="stat-label">Fresh Products</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-label">Local Farmers</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">1000+</span>
                                    <span className="stat-label">Happy Customers</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Fresh vegetables and fruits"
                                className="hero-img"
                            />
                            <div className="hero-badge">
                                <i className="fas fa-certificate"></i>
                                <span>100% Organic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Farm to Fork?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-seedling"></i>
                            </div>
                            <h3 className="feature-title">100% Fresh & Local</h3>
                            <p className="feature-description">
                                All produce is harvested fresh and sourced directly from local farms
                                in your area, ensuring maximum freshness and flavor.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3 className="feature-title">Direct from Farmers</h3>
                            <p className="feature-description">
                                Skip the middleman and buy directly from farmers, ensuring fair
                                prices and supporting your local agricultural community.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-truck"></i>
                            </div>
                            <h3 className="feature-title">Fast Delivery</h3>
                            <p className="feature-description">
                                Get your fresh produce delivered right to your door within 24 hours
                                of harvest for ultimate freshness.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <h3 className="feature-title">Sustainable Farming</h3>
                            <p className="feature-description">
                                Support environmentally friendly farming practices that protect
                                our planet for future generations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section" id="products-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Fresh Picks Today</h2>
                        <p className="section-subtitle">
                            Discover the finest selection of seasonal produce from our trusted local farmers
                        </p>
                    </div>

                    {/* Product Categories Filter (Future Feature) */}
                    <div className="product-filters">
                        {productTypes.map((type) => (
                            <button
                                key={type}
                                className={`filter-btn ${activeFilter === type ? 'filter-btn-active' : ''}`}
                                onClick={() => handleFilterChange(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {displayedProducts.map((product) => (
                            <ProductList key={product.id} user={user} product={product} />
                        ))}
                    </div>

                    {/* View All Products Button */}
                    {filteredProducts.length > 8 && (
                        <div className="products-footer">
                            <button className="btn btn-outline btn-lg" onClick={scrollToProducts}>
                                {showAllProducts ? (
                                    <>
                                        Showing All {filteredProducts.length} Products
                                        <i className="fas fa-check"></i>
                                    </>
                                ) : (
                                    <>
                                        View All {filteredProducts.length} Products
                                        <i className="fas fa-arrow-right"></i>
                                    </>
                                )}
                            </button>
                            {showAllProducts && (
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => setShowAllProducts(false)}
                                    style={{ marginLeft: 'var(--space-4)' }}
                                >
                                    Show Less
                                    <i className="fas fa-arrow-up"></i>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Start Selling?</h2>
                        <p className="cta-subtitle">
                            Join our community of local farmers and start selling your fresh produce today.
                            It's free to get started!
                        </p>
                        <div className="cta-actions">
                            {user ? (
                                <a href="/products/create" className="btn btn-primary btn-xl">
                                    <i className="fas fa-plus"></i>
                                    Create Your First Listing
                                </a>
                            ) : (
                                <button className="btn btn-primary btn-xl" onClick={() => setShowSignUpModal(true)}>
                                    <i className="fas fa-store"></i>

                                    Start Selling Today
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sign Up Modal */}
            {showSignUpModal && (
                <Modal onClose={() => setShowSignUpModal(false)}>
                    <SignUpForm onClose={() => setShowSignUpModal(false)} />
                </Modal>
            )}
        </div>
    )
}

export default HomePage
