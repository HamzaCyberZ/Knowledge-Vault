import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Star, TrendingUp, Clock, ChevronRight,
  Filter, Grid, List, Heart, Share2, MoreHorizontal 
} from 'lucide-react';

const categories = [
  { name: 'All', icon: '📚' },
  { name: 'Technology', icon: '💻' },
  { name: 'Fiction', icon: '📖' },
  { name: 'Business', icon: '💼' },
  { name: 'Science', icon: '🔬' },
  { name: 'History', icon: '🏛️' },
  { name: 'Philosophy', icon: '🤔' },
];

const books = [
  {
    id: 1,
    title: 'The Future of AI',
    author: 'Dr. Sarah Chen',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=600&fit=crop',
    rating: 4.8,
    reviews: 234,
    category: 'Technology',
    price: 0,
    isPremium: false,
    trending: true,
  },
  {
    id: 2,
    title: 'Deep Learning Mastery',
    author: 'Andrew Ng',
    cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop',
    rating: 4.9,
    reviews: 567,
    category: 'Technology',
    price: 29.99,
    isPremium: true,
    trending: true,
  },
  {
    id: 3,
    title: 'The Art of War',
    author: 'Sun Tzu',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    rating: 4.7,
    reviews: 890,
    category: 'History',
    price: 0,
    isPremium: false,
    trending: false,
  },
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Floating Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Knowledge Vault
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Discover</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Categories</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Community</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-sm">
                HK
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Discover Your Next
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Favorite Book
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Discover your next favorite book among thousands of titles. Get personalized recommendations powered by AI.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative flex items-center bg-slate-900 rounded-2xl border border-white/10">
                <Search className="absolute left-6 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, or topics..."
                  className="w-full pl-16 pr-6 py-5 bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none"
                />
                <button className="mr-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-white/10'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-cyan-400" />
              Trending Books
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Book Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  
                  {book.isPremium && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-xs font-bold text-black">
                      PREMIUM
                    </div>
                  )}
                  
                  {book.trending && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-medium flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      HOT
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                    <button className="mx-2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
                      <Heart className="h-6 w-6" />
                    </button>
                    <button className="mx-2 p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full transition-colors">
                      <BookOpen className="h-6 w-6" />
                    </button>
                    <button className="mx-2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                      {book.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{book.author}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {book.reviews} reviews
                    </span>
                    <span className="text-lg font-bold text-white">
                      {book.price === 0 ? 'Free' : `$${book.price}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;