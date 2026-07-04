const db = require('./config/db');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  try {
    // Create admins table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Admins table checked/created.');

    // Create site_visits table
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Site visits table checked/created.');

    // Check if any admin exists
    const [admins] = await db.query('SELECT * FROM admins LIMIT 1');
    
    if (admins.length === 0) {
      console.log('No admins found. Creating default admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Default admin created successfully. (username: admin, password: password123)');
    } else {
      console.log('Admin user already exists. Skipping default creation.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();
