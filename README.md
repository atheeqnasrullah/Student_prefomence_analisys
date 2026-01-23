🎓 Student Performance Analysis System

A web-based Student Performance Analysis System built using Python (Flask), SQLite, and Data Visualization libraries.
This application helps teachers manage student records, analyze academic performance, allocate exam rooms, and allows students to securely view their results and exam room details.

🚀 Features
👨‍🎓 Student Module

Secure student login

Student dashboard with options:

📄 View Result

🏫 View Exam Room Allocation

Displays:

Subject-wise marks

Total & average

Pass/Fail result

Performance feedback

👩‍🏫 Teacher Module

Teacher registration & login

Add, edit, delete student records

View all students

Allocate exam rooms to students

Visualize performance using bar charts

Download student data as Excel file

🛠️ Technologies Used
Backend

Python

Flask

SQLite

Frontend

HTML5

CSS3

JavaScript

Data & Visualization

NumPy

Matplotlib

Seaborn

Pandas

OpenPyXL

📂 Project Structure
STUDENT_PERFORMANCE/
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   ├── index.html
│   ├── student_login.html
│   ├── student_options.html
│   ├── view_result.html
│   ├── view_room.html
│   ├── allocate_room.html
│   ├── teacher_login.html
│   ├── teacher_register.html
│   ├── teacher_dashboard.html
│   ├── add.html
│   ├── edit.html
│   ├── all.html
│   └── bar_chart.html
│
├── app.py
├── init_db.py
├── create_db.py
├── database.db
├── model.pkl
├── requirements.txt
├── students_data.xlsx
└── README.md

📦 Requirements
numpy==1.26.4
matplotlib==3.8.4
seaborn==0.13.2
openpyxl==3.1.2
pandas
flask

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/student-performance-analysis.git


Navigate to the project folder

cd STUDENT_PERFORMANCE


Install dependencies

pip install -r requirements.txt


Initialize the database

python init_db.py


Run the application

python app.py


Open in browser

http://127.0.0.1:5000/

📊 Data Visualization

Bar chart showing subject-wise performance

Helps teachers understand overall class strength and weakness

📥 Excel Export

Teachers can download all student records in Excel format

Useful for reports and documentation

🔐 Authentication

Separate login for Students and Teachers

Session-based authentication for security

🎯 Use Case

Colleges & schools

Internal assessment tracking

Exam room allocation management

Academic performance analysis

👩‍💻 Author

Elamathi
MCA Graduate | Python Developer
