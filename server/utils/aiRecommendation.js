/**
 * AI Recommendation Engine
 * Hybrid approach combining collaborative filtering and content-based filtering
 * Beginner-friendly implementation with clear logic
 */

const Book = require('../models/Book');
const User = require('../models/User');

class RecommendationEngine {
  constructor() {
    this.weights = {
      category: 0.3,      // User's preferred categories
      history: 0.25,      // Reading history similarity
      popularity: 0.2,    // Trending books
      collaborative: 0.15, // Similar users' preferences
      diversity: 0.1,     // Ensure variety
    };
  }

  /**
   * 🎯 Main recommendation function
   * Returns personalized book recommendations for a user
   */
  async getRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId)
        .populate('readingHistory.book')
        .populate('subscription');

      if (!user) throw new Error('User not found');

      // Get candidate books (exclude already read)
      const readBookIds = user.readingHistory.map(h => h.book?._id.toString());
      const candidates = await Book.find({
        _id: { $nin: readBookIds },
        isActive: true,
      }).limit(100);

      if (candidates.length === 0) return [];

      // Calculate scores for each candidate
      const scoredBooks = candidates.map(book => ({
        book,
        score: this.calculateScore(book, user, candidates),
        reasons: this.getRecommendationReasons(book, user),
      }));

      // Sort by score and return top recommendations
      const recommendations = scoredBooks
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return recommendations.map(r => ({
        ...r.book.toObject(),
        recommendationScore: Math.round(r.score * 100),
        reasons: r.reasons,
      }));
      
    } catch (error) {
      console.error('Recommendation error:', error);
      // Fallback to popular books
      return this.getPopularBooks(limit);
    }
  }

  /**
   * 📊 Calculate recommendation score for a book
   */
  calculateScore(book, user, allBooks) {
    let score = 0;

    // 1. Category Match (Content-Based)
    if (user.preferredCategories.includes(book.category)) {
      score += this.weights.category;
    }

    // 2. Reading History Similarity (Content-Based)
    const historyScore = this.calculateHistorySimilarity(book, user.readingHistory);
    score += historyScore * this.weights.history;

    // 3. Popularity Score (Trending)
    const popularityScore = this.normalizePopularity(book.views, allBooks);
    score += popularityScore * this.weights.popularity;

    // 4. Collaborative Filtering (Similar Users)
    // Simplified: Check if book is popular among users with similar preferences
    const collaborativeScore = this.calculateCollaborativeScore(book, user);
    score += collaborativeScore * this.weights.collaborative;

    // 5. Diversity Boost (Avoid same category overload)
    const diversityScore = this.calculateDiversityScore(book, user);
    score += diversityScore * this.weights.diversity;

    return Math.min(score, 1); // Cap at 1
  }

  /**
   * 📚 Calculate similarity with reading history
   */
  calculateHistorySimilarity(book, history) {
    if (history.length === 0) return 0.5; // Neutral for new users

    let similarity = 0;
    history.forEach(item => {
      if (!item.book) return;
      
      // Same category
      if (item.book.category === book.category) similarity += 0.4;
      
      // Shared tags
      const sharedTags = item.book.tags?.filter(tag => book.tags?.includes(tag));
      similarity += (sharedTags?.length || 0) * 0.1;
      
      // Same author
      if (item.book.author === book.author) similarity += 0.3;
    });

    return Math.min(similarity / history.length, 1);
  }

  /**
   * 📈 Normalize popularity across all books
   */
  normalizePopularity(views, allBooks) {
    const maxViews = Math.max(...allBooks.map(b => b.views), 1);
    return views / maxViews;
  }

  /**
   * 👥 Simple collaborative filtering
   */
  async calculateCollaborativeScore(book, currentUser) {
    // Find users with similar reading history
    const similarUsers = await User.find({
      'readingHistory.book': { $in: currentUser.readingHistory.map(h => h.book?._id) },
      _id: { $ne: currentUser._id },
    }).limit(20);

    // Check if this book is in their reading history
    let score = 0;
    similarUsers.forEach(user => {
      const hasRead = user.readingHistory.some(h => 
        h.book?.toString() === book._id.toString()
      );
      if (hasRead) score += 0.1;
    });

    return Math.min(score, 1);
  }

  /**
   * 🎨 Ensure diversity in recommendations
   */
  calculateDiversityScore(book, user) {
    // Simple check: if user has many books in this category, lower the score slightly
    const categoryCount = user.readingHistory.filter(
      h => h.book?.category === book.category
    ).length;
    
    if (categoryCount > 5) return 0.5; // Reduce score if too many in same category
    return 1;
  }

  /**
   * 📝 Generate human-readable reasons for recommendation
   */
  getRecommendationReasons(book, user) {
    const reasons = [];

    if (user.preferredCategories.includes(book.category)) {
      reasons.push(`Matches your interest in ${book.category}`);
    }

    const hasReadAuthor = user.readingHistory.some(
      h => h.book?.author === book.author
    );
    if (hasReadAuthor) {
      reasons.push(`By ${book.author}, an author you've enjoyed`);
    }

    if (book.views > 1000) {
      reasons.push('Trending among readers');
    }

    if (book.rating.average > 4) {
      reasons.push('Highly rated by community');
    }

    return reasons.length > 0 ? reasons : ['Recommended for you'];
  }

  /**
   * 🔥 Fallback: Get popular books
   */
  async getPopularBooks(limit = 10) {
    return await Book.find({ isActive: true })
      .sort({ views: -1, 'rating.average': -1 })
      .limit(limit);
  }

  /**
   * 🆕 "Because you read X" recommendations
   */
  async getSimilarBooks(bookId, limit = 5) {
    const referenceBook = await Book.findById(bookId);
    if (!referenceBook) return [];

    const similarBooks = await Book.find({
      _id: { $ne: bookId },
      isActive: true,
      $or: [
        { category: referenceBook.category },
        { author: referenceBook.author },
        { tags: { $in: referenceBook.tags } },
      ],
    }).limit(limit * 2);

    // Score and sort
    const scored = similarBooks.map(book => {
      let score = 0;
      if (book.category === referenceBook.category) score += 0.4;
      if (book.author === referenceBook.author) score += 0.3;
      const sharedTags = book.tags.filter(tag => referenceBook.tags.includes(tag));
      score += sharedTags.length * 0.1;
      
      return { book, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.book);
  }

  /**
   * 🎯 Update user preferences based on activity
   */
  async updateUserPreferences(userId, activity) {
    const user = await User.findById(userId);
    if (!user) return;

    // Add to reading history
    if (activity.bookId) {
      const existingIndex = user.readingHistory.findIndex(
        h => h.book?.toString() === activity.bookId
      );

      if (existingIndex >= 0) {
        user.readingHistory[existingIndex].viewedAt = new Date();
        user.readingHistory[existingIndex].timeSpent += activity.timeSpent || 0;
      } else {
        user.readingHistory.push({
          book: activity.bookId,
          timeSpent: activity.timeSpent || 0,
        });
      }
    }

    // Update preferred categories based on views
    if (activity.category && !user.preferredCategories.includes(activity.category)) {
      user.preferredCategories.push(activity.category);
      // Keep only top 5 categories
      if (user.preferredCategories.length > 5) {
        user.preferredCategories.shift();
      }
    }

    await user.save();
  }
}

module.exports = new RecommendationEngine();