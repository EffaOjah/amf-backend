const db = require('../config/db');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, media_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO blogs (title, content, author, media_url) VALUES (?, ?, ?, ?)',
      [title, content, author, media_url]
    );
    res.status(201).json({ id: result.insertId, title, content, author, media_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author, media_url } = req.body;
    const [result] = await db.query(
      'UPDATE blogs SET title = ?, content = ?, author = ?, media_url = ? WHERE id = ?',
      [title, content, author, media_url, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
