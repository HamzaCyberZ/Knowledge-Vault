import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, Star, Eye, Calendar, 
  User, Tag, BookOpen, Crown, Share2, Heart 
} from 'lucide-react';
import { bookService } from '../services/bookService';
import { useAuthStore } from '../context/AuthContext';
import PDFViewer from '../components/books/PDFViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const BookDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const [bookRes, similarRes] = await Promise.all([
        bookService.getBook(id),
        bookService.getSimilarBooks(id, 4),
      ]);
      setBook(bookRes.book);
      setSimilarBooks(similarRes.books);
    } catch (error) {
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to download');
      return;
    }
    
    if (book.isPremium && user?.subscriptionStatus !== 'active' && user?.role !== 'admin') {
      toast.error('Premium subscription required');
      return;
    }

    try {
      await bookService.downloadBook(id);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const canAccess = !book?.isPremium || user?.subscriptionStatus === 'active' || user?.role === 'admin';

  if (loading) return <LoadingSpinner fullScreen />;
  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Cover */}
                  <div className="w-full md:w-1/3">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 shadow-md">
                      {book.coverImage?.url ? (
                        <img
                          src={`http://localhost:5000${book.coverImage.url}`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                          <span className="text-6xl font-bold text-primary-600">
                            {book.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                        <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
                      </div>
                      {book.isPremium && (
                        <span className="flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          <Crown className="h-4 w-4 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{book.rating?.average?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        {book.views} views
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center text-gray-600">
                        <Download className="h-4 w-4 mr-1" />
                        {book.downloads} downloads
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {book.category}
                      </span>
                      {book.tags?.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-6 text-gray-700 leading-relaxed">{book.description}</p>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Published: {book.publishYear || 'Unknown'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Pages: {book.pdfFile?.pages || 'Unknown'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Tag className="h-4 w-4 mr-2" />
                        Language: {book.language?.toUpperCase()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        Added by: {book.addedBy?.name}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        {showPreview ? 'Close Preview' : 'Preview Book'}
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={!canAccess}
                        className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download PDF
                      </button>
                    </div>

                    {!canAccess && (
                      <p className="mt-2 text-sm text-amber-600 text-center">
                        <Link to="/subscription" className="underline">
                          Upgrade to Premium to download
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Preview */}
              {showPreview && book.pdfFile?.url && (
                <div className="border-t p-8 bg-gray-50">
                  <PDFViewer
                    url={book.pdfFile.url}
                    filename={book.title}
                    onDownload={handleDownload}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Similar Books */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Similar Books</h3>
            <div className="space-y-4">
              {similarBooks.map((similarBook) => (
                <Link
                  key={similarBook._id}
                  to={`/book/${similarBook._id}`}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-28 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    {similarBook.coverImage?.url ? (
                      <img
                        src={`http://localhost:5000${similarBook.coverImage.url}`}
                        alt={similarBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                        <span className="text-xl font-bold text-primary-600">
                          {similarBook.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 line-clamp-2">{similarBook.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{similarBook.author}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">
                        {similarBook.rating?.average?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;