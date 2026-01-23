import sqlite3

# Connect to the database (data is stored permanently in 'database.db')
conn = sqlite3.connect('database.db')
c = conn.cursor()

# Create tables only if they do not exist
c.execute('''
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT,
    regno TEXT,
    standard TEXT,
    tamil INTEGER,
    english INTEGER,
    maths INTEGER,
    science INTEGER,
    social INTEGER,
    total INTEGER,
    average REAL,
    result TEXT
)
''')

c.execute('''
CREATE TABLE IF NOT EXISTS stud_login (
    id TEXT PRIMARY KEY,
    password TEXT
)
''')

c.execute('''
CREATE TABLE IF NOT EXISTS teachers (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
)
''')

c.execute('''
CREATE TABLE IF NOT EXISTS room_allocations (
    student_id TEXT PRIMARY KEY,
    block_name TEXT,
    room_number TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
)
''')

# Insert sample student login only if it does not exist
c.execute("INSERT OR IGNORE INTO stud_login (id, password) VALUES (?, ?)", ('S001', '1234'))

# Insert sample teacher login only if it does not exist
c.execute("INSERT OR IGNORE INTO teachers (username, password) VALUES (?, ?)", ('admin', 'admin123'))

# Commit changes
conn.commit()
conn.close()

print("Database initialized. Data will be stored permanently.")
