import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import ProductList from '../Home/ProductList';
import { Modal } from '../../context/Modal';
import ProductModal from './ProductModal';
import '../Home/Homepage.css';

function AllProductsPage() {
    const [filters, setFilters] = useState({});
    const [size, setSize] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All Products');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const location = useLocation();
    const history = useHistory();

    // Check if filters.size exists and set size value
    useEffect(() => {
        if (filters.size) {
            setSize(filters.size);
        }
    }, [filters]);

    // Handle URL search parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const search = urlParams.get('search');
        if (search) {
            setSearchQuery(search);
            setActiveFilter('All Products'); // Reset filter when searching
        } else {
            setSearchQuery('');
        }
    }, [location.search]);

    const products = Object.values(useSelector((state) => state.products)).sort(sortProductsByName);
    const user = useSelector(state => state.session.user);

    // Handle opening modal from URL parameter (for edit form redirect)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const openModalProductId = urlParams.get('openModal');
        
        if (openModalProductId && products.length > 0) {
            const product = products.find(p => p.id === parseInt(openModalProductId));
            if (product) {
                setSelectedProduct(product);
                setShowProductModal(true);
                
                // Clean up URL parameter without causing a re-render
                const newParams = new URLSearchParams(location.search);
                newParams.delete('openModal');
                const newSearch = newParams.toString();
                const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
                history.replace(newUrl);
            }
        }
    }, [location.search, products, history, location.pathname]);
    
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

    // Get unique product types from the products data
    const productTypes = ['All Products', ...new Set(products.map(product => product.product_type))];

    // Filter products based on active filter and search query
    const getFilteredProducts = () => {
        let filtered = products;
        
        // Apply category filter
        if (activeFilter !== 'All Products') {
            filtered = filtered.filter(product => product.product_type === activeFilter);
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();         
            
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(query) 
            );
        }
        
        return filtered;
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
                        <h1 className="page-title">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                        </h1>
                        <p className="page-subtitle">
                            {searchQuery 
                                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search`
                                : 'Discover our complete collection of fresh, locally-sourced produce from trusted farmers'
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <div className="container">
                    {/* Search Info */}
                    {searchQuery && (
                        <div className="search-info">
                            <div className="search-info-content">
                                <span className="search-info-text">
                                    Searching for: <strong>"{searchQuery}"</strong>
                                </span>
                                <button 
                                    className="search-clear-btn"
                                    onClick={() => {
                                        window.history.pushState({}, '', '/products');
                                        setSearchQuery('');
                                    }}
                                    title="Clear search"
                                >
                                    <i className="fas fa-times"></i>
                                    Clear search
                                </button>
                            </div>
                        </div>
                    )}

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
                                <h3 className="no-products-title">
                                    {searchQuery ? 'No results found' : 'No products found'}
                                </h3>
                                <p className="no-products-subtitle">
                                    {searchQuery 
                                        ? `We couldn't find any products matching "${searchQuery}". Try searching with different keywords or browse all products.`
                                        : 'Try adjusting your filters or check back later for new products.'
                                    }
                                </p>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => {
                                        handleFilterClick('All Products');
                                        if (searchQuery) {
                                            window.history.pushState({}, '', '/products');
                                            setSearchQuery('');
                                        }
                                    }}
                                >
                                    <i className="fas fa-refresh"></i>
                                    {searchQuery ? 'Browse All Products' : 'Show All Products'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Product Modal */}
            {showProductModal && selectedProduct && (
                <Modal onClose={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                }}>
                    <ProductModal 
                        product={selectedProduct}
                        userId={user?.id}
                        setShowProductModal={setShowProductModal}
                    />
                </Modal>
            )}
        </div>
    )
}

export default AllProductsPage 