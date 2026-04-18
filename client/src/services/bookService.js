import api from './api';

export const bookService = {
  // 📚 Get all books with filters
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // 📖 Get single book
  getBook: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // 🔍 Search books
  searchBooks: async (query) => {
    const response = await api.get('/books', { params: { search: query } });
    return response.data;
  },

  // 🤖 Get AI recommendations
  getRecommendations: async (limit = 10) => {
    const response = await api.get('/books/recommendations', { params: { limit } });
    return response.data;
  },

  // 📊 Get similar books
  getSimilarBooks: async (bookId, limit = 5) => {
    const response = await api.get(`/books/similar/${bookId}`, { params: { limit } });
    return response.data;
  },

  // ➕ Create book (Admin)
  createBook: async (formData) => {
    const response = await api.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ✏️ Update book (Admin)
  updateBook: async (id, formData) => {
    const response = await api.put(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 🗑️ Delete book (Admin)
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // ⬇️ Download book
  downloadBook: async (id) => {
    const response = await api.get(`/books/${id}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `book-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};