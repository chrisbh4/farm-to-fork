import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import ProductList from '../Home/ProductList';

function AllProductsPage() {
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

    // Get unique product types from the products data
    const productTypes = ['All Products', ...new Set(products.map(product => product.product_type))];

    // Filter products based on active filter
    const getFilteredProducts = () => {
        if (activeFilter === 'All Products') {
            return products;
        }
        return products.filter(product => product.product_type === activeFilter);
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
                        {productTypes.map((type) => (
                            <button 
                                key={type}
                                className={`filter-btn ${activeFilter === type ? 'filter-btn-active' : ''}`}
                                onClick={() => handleFilterClick(type)}
                            >
                                {type}
                            </button>
                        ))}
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

export default AllProductsPage 