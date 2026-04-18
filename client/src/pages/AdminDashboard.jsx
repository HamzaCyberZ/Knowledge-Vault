import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';
import { 
  BookOpen, Plus, Trash2, Search, LogOut, 
  BarChart3, Home, Users, X 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'programming',
    isPremium: false,
    coverImage: null,
    pdfFile: null
  });

  const categories = ['programming', 'design', 'business', 'marketing', 'ai-ml', 'other'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Book added successfully!');
        setShowModal(false);
        resetForm();
        fetchBooks();
      } else {
        toast.error(result.message || 'Failed to add book');
      }
    } catch (error) {
      toast.error('Error adding book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'programming',
      isPremium: false,
      coverImage: null,
      pdfFile: null
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Book deleted!');
        fetchBooks();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex overflow-hidden">
      {/* Sidebar - Fixed width */}
      <div className="w-64 min-h-screen bg-slate-900 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <BarChart3 size={20} />
              Dashboard
            </button>
            <Link to="/browse" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl">
              <Home size={20} />
              View Site
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl">
              <Users size={20} />
              Users
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/10">
          <p className="text-sm text-slate-400 mb-1">Logged in as</p>
          <p className="font-semibold text-cyan-400 mb-4">{user?.username || 'Admin'}</p>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content - Full width */}
      <div className="flex-1 min-h-screen overflow-auto bg-[#0f172a]">
        <div className="p-8 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 w-full">
            <div>
              <h1 className="text-3xl font-bold mb-2">Book Management</h1>
              <p className="text-slate-400">Manage your digital library</p>
            </div>
            
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform flex-shrink-0"
            >
              <Plus size={20} />
              Add New Book
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Total Books</p>
              <p className="text-3xl font-bold text-cyan-400">{books.length}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Premium</p>
              <p className="text-3xl font-bold text-purple-400">
                {books.filter(b => b.isPremium).length}
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Categories</p>
              <p className="text-3xl font-bold text-green-400">6</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Total Views</p>
              <p className="text-3xl font-bold text-pink-400">
                {books.reduce((acc, b) => acc + (b.views || 0), 0)}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Books Table - Full width */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 w-full overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-slate-900/50 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-slate-400 whitespace-nowrap">Book</th>
                    <th className="text-left p-4 text-slate-400 whitespace-nowrap">Category</th>
                    <th className="text-left p-4 text-slate-400 whitespace-nowrap">Type</th>
                    <th className="text-left p-4 text-slate-400 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400">
                        No books found. Click "Add New Book" to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen size={20} className="text-slate-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{book.title}</p>
                              <p className="text-sm text-slate-400 truncate">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-700 rounded-full text-sm capitalize">
                            {book.category}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {book.isPremium ? (
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                              Premium
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleDelete(book._id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Book</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title *</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Author *</label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                  placeholder="Book description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleInputChange}
                    id="isPremium"
                    className="w-5 h-5 rounded border-white/10 bg-slate-800 text-cyan-500"
                  />
                  <label htmlFor="isPremium" className="text-slate-300">
                    Premium Book
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Cover Image *</label>
                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 border-dashed rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500/20 file:text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">PDF File *</label>
                  <input
                    type="file"
                    name="pdfFile"
                    onChange={handleInputChange}
                    accept=".pdf"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 border-dashed rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-500/20 file:text-purple-400"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-700 rounded-xl font-semibold hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;