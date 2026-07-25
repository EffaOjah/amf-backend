const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM academic_calendar ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { event, date } = req.body;
    if (!event || !date) {
      return res.status(400).json({ message: 'Event and date are required' });
    }

    const [result] = await db.query(
      'INSERT INTO academic_calendar (event, date) VALUES (?, ?)',
      [event, date]
    );

    res.status(201).json({ id: result.insertId, event, date });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event, date } = req.body;

    if (!event || !date) {
      return res.status(400).json({ message: 'Event and date are required' });
    }

    await db.query(
      'UPDATE academic_calendar SET event = ?, date = ? WHERE id = ?',
      [event, date, id]
    );

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM academic_calendar WHERE id = ?', [id]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
