import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        logout();
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      if (err.message === 'Unauthorized') {
        logout();
        navigate('/login');
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            Products Gallery
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Manage and showcase your inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/add-product" className="btn-success group">
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Product
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-lg">Loading products...</p>
        </div>
      )}
      
      {error && (
        <div className="glass-panel border-danger/30 p-6 text-center text-danger mb-8">
          <p className="font-semibold text-lg">Error loading products</p>
          <p className="text-sm mt-1 text-danger/80">{error}</p>
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="glass-panel p-16 text-center border-dashed border-2 border-slate-700">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">Your inventory is currently empty. Get started by adding your first product to the gallery.</p>
          <Link to="/add-product" className="btn-primary">Add Your First Product</Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div 
            key={product.id} 
            className="glass-panel group flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border-t border-white/5 overflow-hidden"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {product.imageUrl ? (
              <div className="w-full h-48 overflow-hidden bg-slate-900 border-b border-border">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
             <div className="w-full h-48 bg-slate-800/50 border-b border-border flex items-center justify-center">
               <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                {product.category ? (
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-md border border-primary/20 backdrop-blur-sm">
                    {product.category}
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-md">
                    Uncategorized
                  </span>
                )}
                <h4 className="text-xl font-bold text-success">${product.price}</h4>
              </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
            
            <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
              {product.description || 'No description available for this majestic product.'}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Link to={`/edit-product/${product.id}`} className="btn-secondary py-2 text-sm">
                Edit
              </Link>
              <button onClick={() => handleDelete(product.id)} className="btn-danger py-2 text-sm bg-danger/5 hover:bg-danger text-danger hover:text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Products;
