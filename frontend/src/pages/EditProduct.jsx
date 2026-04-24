import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EditProduct = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.getProduct(id);
        const product = res.data;
        if (product) {
          setTitle(product.title || '');
          setPrice(product.price || '');
          setDescription(product.description || '');
          setCategory(product.category || '');
          setImageUrl(product.imageUrl || '');
        }
      } catch (err) {
        if (err.message === 'Unauthorized') {
          logout();
          navigate('/login');
        } else {
          setError(err.message);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id, logout, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.updateProduct(id, { 
        title, 
        price: Number(price), 
        description, 
        category,
        imageUrl
      });
      navigate('/products');
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

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
      <div className="mb-8 relative">
        <Link to="/products" className="inline-flex items-center text-slate-400 hover:text-primary transition-colors text-sm font-medium mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Gallery
        </Link>
        <h2 className="text-3xl font-bold text-white">Edit Product</h2>
        <p className="text-slate-400 mt-1">Make changes to the product details below.</p>
      </div>

      <div className="glass-panel p-8 sm:p-10 animate-in slide-in-from-bottom-4 duration-500">
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start">
            <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="input-field text-lg font-medium"
                placeholder="e.g. Premium Wireless Headphones"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-medium">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="input-field pl-9"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="input-field"
                placeholder="e.g. Electronics"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
              <input 
                type="url" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea 
                rows="5"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="input-field resize-y"
                placeholder="Describe the product features, specifications, and details..."
              />
            </div>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-800">
            <Link to="/products" className="btn-secondary hidden sm:inline-flex px-8">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Updating...</span>
                </span>
              ) : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
