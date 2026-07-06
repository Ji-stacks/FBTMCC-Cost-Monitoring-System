const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('costmon_local.db');

db.run(
  "UPDATE expense_categories SET name = '[MAIN] Credit Card' WHERE name = 'Credit Card'",
  function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Updated ${this.changes} rows in categories.`);
    }
    db.close();
  }
);
