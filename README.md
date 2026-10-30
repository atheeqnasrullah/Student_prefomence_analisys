# Student Performance Analysis

A Flask web app for managing student marks, viewing results, and analysing class performance. Teachers add and manage student records; students log in with their ID to see their result and exam room.

## Features

**Teacher**
- Register and log in
- Add, edit, delete, and search student records (Tamil, English, Maths, Science, Social)
- Total, average, and Pass/Fail are calculated automatically (Fail if any subject is below 35)
- Bar chart of subject-wise totals across all students
- Download all records as an Excel file
- Allocate exam rooms (block and room number) to students

**Student**
- Log in with Student ID
- View marks, total, average, result, and performance feedback
- View allocated exam room

## Tech Stack

- **Backend:** Python, Flask
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript (Jinja2 templates)
- **Libraries:** Pandas, OpenPyXL, NumPy, Matplotlib, Seaborn

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/atheeqnasrullah/Student_prefomence_analisys.git
cd Student_prefomence_analisys
```

### 2. Create and activate a virtual environment
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux
```

### 3. Install dependencies
```bash
pip install flask pandas
pip install -r requirements.txt
```

### 4. Initialise the database
```bash
python create_db.py
```

### 5. Run the app
```bash
python app.py
```
Open http://127.0.0.1:5000 in your browser.

## Default Login

| Role    | Username | Password   |
|---------|----------|------------|
| Teacher | `admin`  | `admin123` |

Students log in with a Student ID that a teacher has added.

## Project Structure

```
Student_prefomence_analisys/
├── app.py               # Main Flask application (all routes)
├── create_db.py         # Creates SQLite tables and default logins
├── database.db          # SQLite database
├── requirements.txt     # Python dependencies
├── Procfile.txt         # Gunicorn start command for deployment
├── static/
│   ├── style.css
│   └── script.js
└── templates/           # HTML pages
    ├── index.html
    ├── teacher_login.html, teacher_register.html, teacher_dashboard.html
    ├── add.html, edit.html, all.html, bar_chart.html, allocate_room.html
    └── student_login.html, view_result.html, view_room.html
```

## Main Routes

| Route                 | Description                     |
|-----------------------|---------------------------------|
| `/`                   | Home page                       |
| `/teacher/login`      | Teacher login                   |
| `/teacher/register`   | Teacher registration            |
| `/teacher/dashboard`  | Teacher dashboard               |
| `/add`                | Add a student                   |
| `/all`                | View / search all students      |
| `/edit/<id>`          | Edit a student                  |
| `/delete/<id>`        | Delete a student                |
| `/bar-chart`          | Subject-wise performance chart  |
| `/download-excel`     | Export records to Excel         |
| `/allocate_room`      | Allocate exam rooms             |
| `/student/login`      | Student login                   |
| `/student/view_result`| Student result and feedback     |
| `/student/view_room`  | Student exam room               |
