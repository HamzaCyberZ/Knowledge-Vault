/**
 * Book Controller
 * Handles CRUD operations, search, and file management
 */
const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

// 📖 Get all books with filtering & pagination
exports.getBooks = async (req, res, next) => {
  try {
    const {
      search,
      category,
      author,
      isPremium,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (author) query.author = new RegExp(author, 'i');
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions['rating.average'] = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'views') {
      sortOptions.views = order === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('addedBy', 'name');

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      books,
    });
  } catch (error) {
    next(error);
  }
};

// 📖 Get single book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.views += 1;
    await book.save();

    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

// ➕ Create book (Admin only)
exports.createBook = async (req, res, next) => {
  try {
    const bookData = { ...req.body, addedBy: req.user.id };

    if (typeof bookData.tags === 'string') bookData.tags = JSON.parse(bookData.tags);
    if (typeof bookData.keywords === 'string') bookData.keywords = JSON.parse(bookData.keywords);

    if (req.files) {
      if (req.files.coverImage) {
        const coverFile = req.files.coverImage[0];
        bookData.coverImage = {
          url: `/uploads/${coverFile.filename}`,
          filename: coverFile.filename,
        };
      }
      if (req.files.pdfFile) {
        const pdfFile = req.files.pdfFile[0];
        bookData.pdfFile = {
          url: `/uploads/${pdfFile.filename}`,
          filename: pdfFile.filename,
          size: pdfFile.size,
        };
      }
    }

    const requiredFields = ['title', 'author', 'description', 'category'];
    for (const field of requiredFields) {
      if (!bookData[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const book = await Book.create(bookData);

    res.status(201).json({ success: true, message: 'Book created successfully', book });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          const filePath = path.join(__dirname, '../uploads', file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      });
    }
    next(error);
  }
};

// ✏️ Update book (Admin only)
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (req.files?.coverImage) {
      if (book.coverImage?.filename) {
        const oldPath = path.join(__dirname, '../uploads', book.coverImage.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.coverImage = {
        url: `/uploads/${req.files.coverImage[0].filename}`,
        filename: req.files.coverImage[0].filename,
      };
    }

    if (req.files?.pdfFile) {
      if (book.pdfFile?.filename) {
        const oldPath = path.join(__dirname, '../uploads', book.pdfFile.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.pdfFile = {
        url: `/uploads/${req.files.pdfFile[0].filename}`,
        filename: req.files.pdfFile[0].filename,
        size: req.files.pdfFile[0].size,
      };
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Book updated successfully', book });
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete book (Admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.coverImage?.filename) {
      const coverPath = path.join(__dirname, '../uploads', book.coverImage.filename);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    if (book.pdfFile?.filename) {
      const pdfPath = path.join(__dirname, '../uploads', book.pdfFile.filename);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await book.deleteOne();

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ⬇️ Download book
exports.downloadBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !book.pdfFile?.filename) {
      return res.status(404).json({ success: false, message: 'Book or file not found' });
    }

    if (book.isPremium && req.user.role !== 'admin') {
      if (req.user.subscriptionStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Premium subscription required',
        });
      }
    }

    book.downloads += 1;
    await book.save();

    const filePath = path.join(__dirname, '../uploads', book.pdfFile.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, `${book.title}.pdf`);
  } catch (error) {
    next(error);
  }
};

// 🔍 Get recommendations
exports.getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recommendations = await Book.find({ isActive: true })
      .sort({ views: -1 })
      .limit(limit);

    res.json({ success: true, count: recommendations.length, recommendations });
  } catch (error) {
    next(error);
  }
};

// 📊 Get similar books
exports.getSimilarBooks = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const limit = parseInt(req.query.limit) || 5;

    const similar = await Book.find({
      _id: { $ne: book._id },
      category: book.category,
      isActive: true,
    }).limit(limit);

    res.json({ success: true, books: similar });
  } catch (error) {
    next(error);
  }
};