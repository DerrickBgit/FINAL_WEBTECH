const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  getCategories: async () => {
    const response = await fetch(`${API_URL}/inventory/categories`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createCategory: async (data) => {
    const response = await fetch(`${API_URL}/inventory/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    return response.json();
  },

  updateCategory: async (id, data) => {
    const response = await fetch(`${API_URL}/inventory/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/inventory/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
    return response.json();
  },

  // Items
  getItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/inventory/items?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  getItem: async (id) => {
    const response = await fetch(`${API_URL}/inventory/items/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  createItem: async (data) => {
    const response = await fetch(`${API_URL}/inventory/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }
    return response.json();
  },

  updateItem: async (id, data) => {
    const response = await fetch(`${API_URL}/inventory/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }
    return response.json();
  },

  deleteItem: async (id) => {
    const response = await fetch(`${API_URL}/inventory/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete item');
    }
    return response.json();
  },

  getStockMovements: async (itemId) => {
    const response = await fetch(`${API_URL}/inventory/items/${itemId}/movements`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch stock movements');
    return response.json();
  },

  createStockMovement: async (itemId, data) => {
    const response = await fetch(`${API_URL}/inventory/items/${itemId}/movements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create stock movement');
    }
    return response.json();
  },

  // Sales
  getSales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/inventory/sales?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  },

  createSale: async (data) => {
    const response = await fetch(`${API_URL}/inventory/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create sale');
    }
    return response.json();
  },

  // Forecasts
  getForecasts: async (days = 30) => {
    const response = await fetch(`${API_URL}/inventory/forecast?days=${days}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch forecasts');
    return response.json();
  },

  getItemForecast: async (itemId, days = 30) => {
    const response = await fetch(`${API_URL}/inventory/items/${itemId}/forecast?days=${days}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return response.json();
  },

  updateUser: async (data) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  }
};

