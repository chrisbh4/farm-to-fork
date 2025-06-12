import { useSelector } from 'react-redux'
import { useState } from 'react'
import './Homepage.css'
import ProductList from './ProductList';

function HomePage() {
    const [showAllProducts, setShowAllProducts] = useState(false);
    
    function sortProductsByName(productA, productB) {
        let nameA = productA.name.toUpperCase(); 
        let nameB = productB.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    const products = Object.values(useSelector((state) => state.products)).sort(sortProductsByName);
    const user = useSelector(state => state.session.user);

    // Get featured products (first 8) or all products based on state
    const displayedProducts = showAllProducts ? products : products.slice(0, 8);

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
                                <button className="btn btn-primary btn-lg">
                                    <i className="fas fa-leaf"></i>
                                    Shop Fresh Produce
                                </button>
                                {!user && (
                                    <button className="btn btn-secondary btn-lg">
                                        <i className="fas fa-user-plus"></i>
                                        Join Our Community
                                    </button>
                                )}
                            </div>
                            <div className="hero-stats">
                                <div className="stat">
                                    <span className="stat-number">{products.length}+</span>
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
                    <h2 className="section-title">Why Choose SpudHub?</h2>
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
                        <button className="filter-btn filter-btn-active">All Products</button>
                        <button className="filter-btn">Vegetables</button>
                        <button className="filter-btn">Fruits</button>
                        <button className="filter-btn">Herbs</button>
                        <button className="filter-btn">Organic</button>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {displayedProducts.map((product) => (
                            <ProductList key={product.id} user={user} product={product} />
                        ))}
                    </div>

                    {/* View All Products Button */}
                    {products.length > 8 && (
                        <div className="products-footer">
                            <button className="btn btn-outline btn-lg" onClick={scrollToProducts}>
                                {showAllProducts ? (
                                    <>
                                        Showing All {products.length} Products
                                        <i className="fas fa-check"></i>
                                    </>
                                ) : (
                                    <>
                                        View All {products.length} Products
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
                                <button className="btn btn-primary btn-xl">
                                    <i className="fas fa-store"></i>
                                    Start Selling Today
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
