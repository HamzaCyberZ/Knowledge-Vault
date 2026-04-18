const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// AI Book Recommendations
router.post('/recommend', protect, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Here you can integrate with OpenAI, Claude, or other AI services
    // For now, returning smart recommendations based on category
    
    const recommendations = await Book.find({
      category: { $in: preferences },
      isActive: true
    }).limit(5);
    
    res.json({
      success: true,
      recommendations,
      aiMessage: `Based on your interest in ${preferences.join(', ')}, here are top picks for you!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI Search with natural language
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Simple AI-like search (can be replaced with actual AI)
    const keywords = query.toLowerCase().split(' ');
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: keywords } }
      ]
    }).limit(10);
    
    res.json({
      success: true,
      books,
      aiResponse: `Found ${books.length} books matching "${query}"`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;