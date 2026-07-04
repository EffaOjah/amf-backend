const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [blogRows] = await db.query('SELECT COUNT(*) as count FROM blogs');
    const [mediaRows] = await db.query('SELECT COUNT(*) as count FROM media');
    const [visitRows] = await db.query('SELECT COUNT(*) as count FROM site_visits');
    
    res.json({
      totalBlogs: blogRows[0].count,
      totalMedia: mediaRows[0].count,
      totalVisits: visitRows[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};

exports.recordVisit = async (req, res) => {
  try {
    await db.query('INSERT INTO site_visits () VALUES ()');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ message: 'Server error recording visit' });
  }
};
