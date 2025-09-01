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

  // Enable foreign key constraints
  db.run('PRAGMA foreign_keys = ON');

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
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
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
  // seedMockData();
  

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
    const {
      search = '',
      sortBy = 'first_name',
      sortOrder = 'ASC',
      limit = 10,
      offset = 0
    } = req.query;
  
    // ✅ Whitelist allowed sort fields and directions
    const allowedSortFields = ['id', 'first_name', 'last_name'];
    const allowedSortOrders = ['ASC', 'DESC'];
  
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'first_name';
    const sortDirection = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
  
    // ✅ SQL clauses
    const joinClause = `
      FROM customers c
      LEFT JOIN addresses a ON c.id = a.customer_id
    `;
  
    const whereClause = search
      ? `WHERE
          c.first_name LIKE ? OR
          c.last_name LIKE ? OR
          c.phone_number LIKE ? OR
          a.city LIKE ? OR
          a.state LIKE ? OR
          a.pin_code LIKE ?`
      : '';
  
    const countSql = `
      SELECT COUNT(DISTINCT c.id) AS total
      ${joinClause}
      ${whereClause}
    `;
  
    const dataSql = `
      SELECT DISTINCT c.*
      ${joinClause}
      ${whereClause}
      ORDER BY c.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;
  
    const searchParams = search
      ? [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      : [];
  
    const dataParams = [...searchParams, limit, offset];
  
    db.get(countSql, searchParams, (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });
  
      db.all(dataSql, dataParams, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
  
        res.json({
          total: countRow.total,
          data: rows
        });
      });
    });
  });
  
  app.get('/api/customers/:id', (req, res) => {
    const { id } = req.params;
  
    const customerSql = `SELECT * FROM customers WHERE id = ?`;
    const addressSql = `SELECT * FROM addresses WHERE customer_id = ?`;
    const countSql = `SELECT COUNT(*) AS count FROM addresses WHERE customer_id = ?`;
  
    db.get(customerSql, [id], (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
  
      db.all(addressSql, [id], (err, addresses) => {
        if (err) return res.status(500).json({ error: err.message });
  
        db.get(countSql, [id], (err, countRow) => {
          if (err) return res.status(500).json({ error: err.message });
  
          res.json({
            customer,
            addresses,
            onlyOneAddress: countRow.count === 1
          });
        });
      });
    });
  });                                                 

  app.post('/api/customers/:id/addresses', (req, res) => {
    const { id } = req.params;
    const { address_details, city, state, pin_code } = req.body;
  
    // Basic validation
    if (!address_details || !city || !state || !pin_code) {
      return res.status(400).json({ error: 'All address fields are required.' });
    }
  
    // Check if customer exists
    const checkCustomerSql = `SELECT * FROM customers WHERE id = ?`;
    db.get(checkCustomerSql, [id], (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!customer) return res.status(404).json({ error: 'Customer not found.' });
  
      // Insert address
      const insertSql = `
        INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [id, address_details, city, state, pin_code];
  
      db.run(insertSql, params, function (err) {
        if (err) return res.status(500).json({ error: 'Failed to add address.' });
  
        res.status(201).json({
          message: 'Address added successfully',
          address_id: this.lastID
        });
      });
    });
  });


  app.put('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
    const { address_details, city, state, pin_code } = req.body;
  
    if (!address_details || !city || !state || !pin_code) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    const sql = `
      UPDATE addresses
      SET address_details = ?, city = ?, state = ?, pin_code = ?
      WHERE id = ?
    `;
    const params = [address_details, city, state, pin_code, addressId];
  
    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: 'Internal server error.' });
  
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Address not found.' });
      }
  
      res.json({ message: 'Address updated successfully' });
    });
  });
  
  app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
  
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    const sql = `
      UPDATE customers
      SET first_name = ?, last_name = ?, phone_number = ?
      WHERE id = ?
    `;
    const params = [first_name, last_name, phone_number, id];
  
    db.run(sql, params, function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: customers.phone_number')) {
          return res.status(409).json({ error: 'Phone number already registered with another account.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
      }
  
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      res.json({ message: 'Customer updated successfully' });
    });
  });
  

  app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = `DELETE FROM customers WHERE id = ?`;
  
    db.run(`DELETE FROM addresses WHERE customer_id = ?`, [id], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to delete addresses.' });
    
      db.run(`DELETE FROM customers WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete customer.' });
        res.json({ message: 'Customer and addresses deleted successfully' });
      });
    });
    
  });

  
  app.delete('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
  
    const sql = `DELETE FROM addresses WHERE id = ?`;
  
    db.run(sql, [addressId], function (err) {
      if (err) return res.status(500).json({ error: 'Internal server error.' });
  
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Address not found.' });
      }
  
      res.json({ message: 'Address deleted successfully' });
    });
  });
  
  