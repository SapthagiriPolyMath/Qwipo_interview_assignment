const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL UNIQUE
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      address_details TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function seedMockData() {
    const firstNames = ['Ravi', 'Priya', 'Karthik', 'Meena', 'Arjun', 'Sneha'];
    const lastNames = ['Kumar', 'Rajan', 'Balan', 'Ravi', 'Singh', 'Sivam'];
    const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
    const states = ['TN', 'MH', 'DL', 'KA', 'TS'];
    const pinCodes = ['600001', '400001', '110001', '560001', '500001'];
  
    for (let i = 0; i < 20; i++) {
      const first_name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last_name = lastNames[Math.floor(Math.random() * lastNames.length)];
      const phone_number = '9' + Math.floor(100000000 + Math.random() * 900000000);
  
      db.run(
        `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`,
        [first_name, last_name, phone_number],
        function (err) {
          if (!err) {
            const customerId = this.lastID;
            const addressCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 addresses
  
            for (let j = 0; j < addressCount; j++) {
              const address_details = `Street ${j + 1}, Block ${Math.floor(Math.random() * 10)}`;
              const city = cities[Math.floor(Math.random() * cities.length)];
              const state = states[Math.floor(Math.random() * states.length)];
              const pin_code = pinCodes[Math.floor(Math.random() * pinCodes.length)];
  
              db.run(
                `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`,
                [customerId, address_details, city, state, pin_code]
              );
            }
          }
        }
      );
    }
  
    console.log('Mock data seeded.');
  }
  
  // Uncomment to run once
  //seedMockData();
  

  app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
  
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    const params = [first_name, last_name, phone_number];
  
    db.run(sql, params, function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: customers.phone_number')) {
          return res.status(409).json({ error: 'Phone number already exists.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
      }
  
      res.status(201).json({
        message: 'Customer created successfully',
        customer_id: this.lastID
      });
    });
  });
  
  app.get('/api/customers', (req, res) => {
    const sql = `SELECT * FROM customers`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  });
  
  