const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const db = require('../config/db');

// Upload media
exports.uploadMedia = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  const title = req.body.title || null; // Title is optional

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'amf_media', resource_type: 'auto' },
    async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Upload failed', error });
      }
      
      try {
        // Save to database
        const [dbResult] = await db.query(
          'INSERT INTO media (title, url, public_id) VALUES (?, ?, ?)',
          [title, result.secure_url, result.public_id]
        );
        
        res.status(201).json({
          message: 'File uploaded successfully',
          id: dbResult.insertId,
          title,
          url: result.secure_url,
          public_id: result.public_id
        });
      } catch (dbError) {
        console.error(dbError);
        res.status(500).json({ message: 'Database error while saving media details' });
      }
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

// Get all media
exports.getAllMedia = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM media ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching media' });
  }
};

// Update media title
exports.updateMedia = async (req, res) => {
  try {
    const { title } = req.body;
    const [result] = await db.query('UPDATE media SET title = ? WHERE id = ?', [title, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.json({ message: 'Media updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating media' });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    // First, find the public_id and url in the database
    const [rows] = await db.query('SELECT public_id, url FROM media WHERE id = ?', [mediaId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const { public_id: publicId, url } = rows[0];

    // Determine resource_type from url
    let resourceType = 'image';
    if (url.includes('/video/upload/')) {
      resourceType = 'video';
    } else if (url.includes('/raw/upload/')) {
      resourceType = 'raw';
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

    // Delete from database
    await db.query('DELETE FROM media WHERE id = ?', [mediaId]);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting media' });
  }
};
