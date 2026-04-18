import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye, Download, Crown } from 'lucide-react';

const BookCard = ({ book, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/book/${book._id}`}>
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          {book.coverImage?.url ? (
            <img
              src={`http://localhost:5000${book.coverImage.url}`}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <span className="text-4xl font-bold text-primary-600">
                {book.title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Premium Badge */}
          {book.isPremium && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-700">
                {book.rating?.average?.toFixed(1) || '0.0'}
              </span>
              <span className="text-xs text-gray-500">({book.rating?.count || 0})</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-500 text-xs">
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {book.views}
              </span>
              <span className="flex items-center">
                <Download className="h-3 w-3 mr-1" />
                {book.downloads}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
              {book.category}
            </span>
            {book.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                book.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                book.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {book.difficulty}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;