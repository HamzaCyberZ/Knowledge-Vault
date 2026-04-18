import React from 'react';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { BookOpen } from 'lucide-react';

const BookList = ({ books, loading, hasMore, onLoadMore }) => {
  if (loading && books.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <BookOpen className="h-16 w-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium">No books found</h3>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard key={book._id} book={book} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;