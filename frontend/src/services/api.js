const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  async register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getProducts() {
    const res = await fetch(`${API_URL}/products`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  async getProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
    return data;
  },

  async addProduct(product) {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add product');
    return data;
  },

  async updateProduct(id, product) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  }
};
