import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import ProductList from '../Home/ProductList';

function ProductsPage() {
    const [filters, setFilters] = useState({});
    const [size, setSize] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All Products');

    // Check if filters.size exists and set size value
    useEffect(() => {
        if (filters.size) {
            setSize(filters.size);
        }
    }, [filters]);
    
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

    // Filter products based on active filter
    const getFilteredProducts = () => {
        switch (activeFilter) {
            case 'Vegetables':
                return products.filter(product => 
                    product.name.toLowerCase().includes('tomato') ||
                    product.name.toLowerCase().includes('carrot') ||
                    product.name.toLowerCase().includes('lettuce') ||
                    product.name.toLowerCase().includes('cucumber') ||
                    product.name.toLowerCase().includes('pepper') ||
                    product.name.toLowerCase().includes('onion') ||
                    product.name.toLowerCase().includes('potato') ||
                    product.name.toLowerCase().includes('broccoli') ||
                    product.name.toLowerCase().includes('cauliflower') ||
                    product.name.toLowerCase().includes('spinach') ||
                    product.name.toLowerCase().includes('squash') ||
                    product.name.toLowerCase().includes('mushroom') ||
                    product.name.toLowerCase().includes('cabbage') ||
                    product.name.toLowerCase().includes('celery') ||
                    product.name.toLowerCase().includes('eggplant') ||
                    product.name.toLowerCase().includes('kale') ||
                    product.name.toLowerCase().includes('radish') ||
                    product.name.toLowerCase().includes('beet') ||
                    product.name.toLowerCase().includes('zucchini') ||
                    product.name.toLowerCase().includes('asparagus') ||
                    product.name.toLowerCase().includes('artichoke') ||
                    product.name.toLowerCase().includes('brussel') ||
                    product.name.toLowerCase().includes('bokchoy') ||
                    product.name.toLowerCase().includes('corn') ||
                    product.name.toLowerCase().includes('bean') ||
                    product.name.toLowerCase().includes('ginger')
                );
            case 'Fruits':
                return products.filter(product => 
                    product.name.toLowerCase().includes('apple') ||
                    product.name.toLowerCase().includes('cherry') ||
                    product.name.toLowerCase().includes('lemon') ||
                    product.name.toLowerCase().includes('grape') ||
                    product.name.toLowerCase().includes('avocado') ||
                    product.name.toLowerCase().includes('plantain')
                );
            case 'Herbs':
                return products.filter(product => 
                    product.name.toLowerCase().includes('garlic') ||
                    product.name.toLowerCase().includes('ginger')
                );
            case 'Organic':
                // For now, assume all products are organic since we don't have an organic field
                return products;
            default:
                return products;
        }
    };

    const filteredProducts = getFilteredProducts();

    const handleFilterClick = (filterName) => {
        setActiveFilter(filterName);
    };

    return (
        <div className="products-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <div className="page-header-content">
                        <h1 className="page-title">All Products</h1>
                        <p className="page-subtitle">
                            Discover our complete collection of fresh, locally-sourced produce from trusted farmers
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <div className="container">
                    {/* Product Categories Filter */}
                    <div className="product-filters">
                        <button 
                            className={`filter-btn ${activeFilter === 'All Products' ? 'filter-btn-active' : ''}`}
                            onClick={() => handleFilterClick('All Products')}
                        >
                            All Products
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'Vegetables' ? 'filter-btn-active' : ''}`}
                            onClick={() => handleFilterClick('Vegetables')}
                        >
                            Vegetables
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'Fruits' ? 'filter-btn-active' : ''}`}
                            onClick={() => handleFilterClick('Fruits')}
                        >
                            Fruits
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'Herbs' ? 'filter-btn-active' : ''}`}
                            onClick={() => handleFilterClick('Herbs')}
                        >
                            Herbs
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'Organic' ? 'filter-btn-active' : ''}`}
                            onClick={() => handleFilterClick('Organic')}
                        >
                            Organic
                        </button>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductList key={product.id} user={user} product={product} />
                        ))}
                    </div>

                    {/* No Products Message */}
                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <div className="no-products-content">
                                <i className="fas fa-search no-products-icon"></i>
                                <h3 className="no-products-title">No products found</h3>
                                <p className="no-products-subtitle">
                                    Try adjusting your filters or check back later for new products.
                                </p>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => handleFilterClick('All Products')}
                                >
                                    <i className="fas fa-refresh"></i>
                                    Show All Products
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default ProductsPage 