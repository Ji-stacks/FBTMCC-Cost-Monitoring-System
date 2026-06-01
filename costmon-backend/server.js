const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
// Pinapayagan ang lahat sa local network na kumonekta sa backend
app.use(cors()); 
app.use(express.json());

// Gagawa ng database file na 'costmon_local.db' sa loob ng backend folder
const dbPath = path.resolve(__dirname, 'costmon_local.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the local SQLite database.');
  }
});

// Setup Database Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS disbursements (
    id TEXT PRIMARY KEY,
    project_code TEXT,
    date TEXT,
    payee TEXT,
    particulars TEXT,
    tin TEXT,
    cv_no TEXT,
    check_no TEXT,
    or_inv_no TEXT,
    accts_pay REAL,
    input_tax REAL,
    output_tax REAL,
    target_cib REAL,
    gross_amount REAL,
    ewt_amount REAL,
    net_amount REAL,
    expenses_json TEXT,
    created_at TEXT
  )`);
});

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. GET - Kunin lahat ng records
app.get('/api/disbursements', (req, res) => {
  db.all("SELECT * FROM disbursements ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // I-format ang JSON string pabalik sa array bago ibigay sa Frontend
    const formattedRows = rows.map(row => ({
      ...row,
      expenses: row.expenses_json ? JSON.parse(row.expenses_json) : []
    }));
    res.json(formattedRows);
  });
});

// 2. POST - Mag-save ng bagong record
app.post('/api/disbursements', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`
    INSERT INTO disbursements (
      id, project_code, date, payee, particulars, tin, cv_no, check_no, or_inv_no, 
      accts_pay, input_tax, output_tax, target_cib, gross_amount, ewt_amount, net_amount, expenses_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.id, data.project_code, data.date, data.payee, data.particulars, data.tin, data.cv_no, 
    data.check_no, data.or_inv_no, data.accts_pay || 0, data.input_tax || 0, data.output_tax || 0, 
    data.target_cib || 0, data.gross_amount || 0, data.ewt_amount || 0, data.net_amount || 0, 
    JSON.stringify(data.expenses), data.created_at,
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Record saved successfully.' });
    }
  );
  stmt.finalize();
});

// 3. PUT - I-update ang umiiral na record (kapag nag-double click at nag-edit)
app.put('/api/disbursements/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  
  const stmt = db.prepare(`
    UPDATE disbursements SET 
      project_code=?, date=?, payee=?, particulars=?, tin=?, cv_no=?, check_no=?, or_inv_no=?, 
      accts_pay=?, input_tax=?, output_tax=?, target_cib=?, gross_amount=?, ewt_amount=?, net_amount=?, expenses_json=?
    WHERE id=?
  `);

  stmt.run(
    data.project_code, data.date, data.payee, data.particulars, data.tin, data.cv_no, 
    data.check_no, data.or_inv_no, data.accts_pay || 0, data.input_tax || 0, data.output_tax || 0, 
    data.target_cib || 0, data.gross_amount || 0, data.ewt_amount || 0, data.net_amount || 0, 
    JSON.stringify(data.expenses), id,
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Record updated successfully.' });
    }
  );
  stmt.finalize();
});

// Simulan ang Server sa Port 3001
const PORT = 3001;
// Ang '0.0.0.0' ay kailangan para makapasok ang ibang computers sa network
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Local Network API Server running on port ${PORT}`);
  console.log(`Access it across the network via your PC's IP Address.`);
});