/**
 * Book Model
 * Stores book metadata, files, and access control information
 */
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true, // For search optimization
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'fiction',
        'non-fiction',
        'technology',
        'science',
        'business',
        'history',
        'philosophy',
        'art',
        'education',
        'other',
      ],
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    // File information
    coverImage: {
      url: String,
      filename: String,
    },
    pdfFile: {
      url: String,
      filename: String,
      size: Number, // in bytes
      pages: Number,
    },
    // Access control
    isPremium: {
      type: Boolean,
      default: false,
    },
    accessTier: {
      type: String,
      enum: ['free', 'basic', 'premium', 'all'],
      default: 'free',
    },
    // Metadata
    publishYear: Number,
    language: {
      type: String,
      default: 'en',
    },
    publisher: String,
    isbn: String,
    // Statistics for AI recommendations
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    // Content analysis for recommendations
    keywords: [String], // Extracted keywords for matching
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔍 Text search index
bookSchema.index({ title: 'text', description: 'text', author: 'text', tags: 'text' });

// 📊 Virtual for formatted file size
bookSchema.virtual('formattedSize').get(function () {
  if (!this.pdfFile.size) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.pdfFile.size) / Math.log(1024));
  return Math.round(this.pdfFile.size / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

module.exports = mongoose.model('Book', bookSchema);