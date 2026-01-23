from flask import Flask, render_template, request, redirect, session, url_for, g, flash

import pandas as pd
import sqlite3
from flask import send_file
import os

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect("database.db", check_same_thread=False)  # ✅ FIX
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
        
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/student_options')
def student_option_page():
    return render_template('student_options.html')



@app.route('/student')
def student_page():
    return render_template('student_options.html')

@app.route('/student/login', methods=['GET', 'POST'])
def student_login():
    if request.method == 'POST':
        student_id = request.form.get('id')
        db = get_db()

        student = db.execute(
            "SELECT * FROM students WHERE id=?",
            (student_id,)
        ).fetchone()

        if student:
            session['student'] = student_id

            # Redirect directly to result page on successful login
            return redirect(url_for('view_result_page'))

        return render_template(
            'student_login.html',
            error="Invalid Student ID"
        )

    return render_template('student_login.html')


# --- student view room ---

@app.route('/student/view_room', methods=['GET', 'POST'])
def view_room_page():
    room = None

    if request.method == 'POST':
        student_id = request.form.get('student_id')
        db = get_db()

        room = db.execute("""
            SELECT s.name, s.id, r.block_name, r.room_number
            FROM students s
            LEFT JOIN room_allocations r ON s.id = r.student_id
            WHERE s.id = ?
        """, (student_id,)).fetchone()

    return render_template('view_room.html', room=room)

# --- student view result ---
@app.route('/student/view_result')
def view_result_page():
    if 'student' not in session:
        print("Student not logged in, redirecting...")
        session['next'] = 'result'
        return redirect(url_for('student_login'))

    db = get_db()
    student_id = session['student']
    print(f"Fetching results for student: {student_id}")

    student_data = db.execute(
        "SELECT * FROM students WHERE id=?",
        (student_id,)
    ).fetchone()

    if not student_data:
        print("Student not found in DB!")
        flash("Student record not found.")
        return redirect(url_for('student_login'))

    avg = student_data['average']

    if avg >= 90:
        feedback = "Excellent! Keep it up!"
    elif avg >= 75:
        feedback = "Very Good. Aim for excellence!"
    elif avg >= 60:
        feedback = "Good. Keep improving."
    elif avg >= 40:
        feedback = "Fair. Try harder next time."
    else:
        feedback = "Needs Improvement. Don't give up!"

    return render_template('view_result.html', student=student_data, feedback=feedback)



@app.route('/teacher')
def teacher_page():
    return render_template('teacher_options.html')

# --- Teacher register Route ---

@app.route('/teacher/register', methods=['GET', 'POST'])
def teacher_register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        try:
            conn = get_db()
            conn.execute("INSERT INTO teachers (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            return redirect('/teacher/dashboard')  # ✅ Correct path

        except sqlite3.IntegrityError:
            return render_template('teacher_register.html', error="Username already taken.")

        except Exception as e:
            return f"An error occurred: {e}"

    return render_template('teacher_register.html')



# --- Teacher Login Route ---
@app.route('/teacher/login', methods=['GET', 'POST'])
def teacher_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            return render_template('teacher_login.html', error="Please fill all fields.")

        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM teachers WHERE username = ? AND password = ?", (username, password))
        teacher = cursor.fetchone()
        conn.close()

        if teacher:
            print("Login successful")  # Debug line
            return redirect('/teacher/dashboard')
        else:
            return render_template('teacher_login.html', error="Invalid credentials")

    return render_template('teacher_login.html')


# --- Teacher Dashboard Route ---
@app.route('/teacher/dashboard')
def teacher_dashboard():
    return render_template('teacher_dashboard.html')

@app.route('/add', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        student_id = request.form.get('id')
        name = request.form.get('name')
        regno = request.form.get('regno')
        tamil = int(request.form.get('tamil'))
        english = int(request.form.get('english'))
        maths = int(request.form.get('maths'))
        science = int(request.form.get('science'))
        social = int(request.form.get('social'))

        total = tamil + english + maths + science + social
        average = round(total / 5, 2)

        result = "Fail" if min(tamil, english, maths, science, social) < 35 else "Pass"

        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

      
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                name TEXT,
                regno TEXT,
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

        cursor.execute('''
            INSERT INTO students (id, name, regno, tamil, english, maths, science, social, total, average, result)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (student_id, name, regno, tamil, english, maths, science, social, total, average, result))

        conn.commit()
        conn.close()
        return redirect(url_for('all_students'))

    return render_template('add.html')


# Show all students
@app.route('/all', methods=['GET', 'POST'])
def all_students():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    if request.method == 'POST':
        student_id = request.form.get('student_id')
        if student_id:
            cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        else:
            cursor.execute("SELECT * FROM students")
    else:
        cursor.execute("SELECT * FROM students")

    students = cursor.fetchall()
    conn.close()
    return render_template('all.html', students=students)



# ---------- Edit Student ----------
@app.route('/edit/<id>', methods=['GET', 'POST'])
def edit_student(id):
    db = get_db()
    
    if request.method == 'POST':
        # 1. Get the new values from the form
        name = request.form.get('name')
        regno = request.form.get('regno')
        tamil = int(request.form.get('tamil'))
        english = int(request.form.get('english'))
        maths = int(request.form.get('maths'))
        science = int(request.form.get('science'))
        social = int(request.form.get('social'))

        # 2. RE-CALCULATE the fields that are "not changing"
        total = tamil + english + maths + science + social
        average = round(total / 5, 2)
        
        # Result logic: Pass if all subjects are >= 35
        result = "Fail" if min(tamil, english, maths, science, social) < 35 else "Pass"

        # 3. Update the database with EVERYTHING
        db.execute("""
            UPDATE students
            SET name=?, regno=?, tamil=?, english=?, maths=?, science=?, social=?, 
                total=?, average=?, result=?
            WHERE id=?
        """, (name, regno, tamil, english, maths, science, social, total, average, result, id))

        db.commit()
        return redirect('/all')
    
    else:
        # GET request: Show the form with current data
        student = db.execute("SELECT * FROM students WHERE id=?", (id,)).fetchone()
        return render_template('edit.html', student=student)


# ---------- Delete Student ----------
@app.route('/delete/<id>')
def delete_student(id):
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id=?", (id,))
    conn.commit()
    return redirect('/all')
@app.route('/bar-chart')
def bar_chart():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Get sum of each subject across all students
    cursor.execute('''
        SELECT 
            SUM(tamil), 
            SUM(english), 
            SUM(maths), 
            SUM(science), 
            SUM(social) 
        FROM students
    ''')
    data = cursor.fetchone()
    conn.close()

    subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social']
    subject_totals = list(data)

    return render_template('bar_chart.html', subjects=subjects, totals=subject_totals)


@app.route('/download-excel')
def download_excel():
    # Connect to the database
    conn = sqlite3.connect('database.db')
    query = "SELECT * FROM students"
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Save to Excel
    file_path = "students_data.xlsx"
    df.to_excel(file_path, index=False, engine='openpyxl')

    # Send file to user
    return send_file(
        file_path,
        as_attachment=True,
        download_name='All_Student_Records.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
# --- ROUTE TO SHOW THE TABLE ---
@app.route('/allocate_room')
def allocate_room_page():
    db = get_db()
    # LEFT JOIN ensures names show up even if room_allocations is empty
    query = '''
        SELECT s.id, s.name, s.id AS student_id, r.block_name, r.room_number 
        FROM students s
        LEFT JOIN room_allocations r ON s.id = r.student_id
    '''
    students = db.execute(query).fetchall()
    return render_template('allocate_room.html', students=students)

# --- ROUTE TO SAVE THE TYPED DATA ---
@app.route('/save_room', methods=['POST'])
def save_room():
    student_id = request.form.get('student_id')
    block = request.form.get('block_name')
    room = request.form.get('room_number')

    db = get_db()

    student = db.execute(
        "SELECT id FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()

    if not student:
        flash("Invalid Student ID", "error")
        return redirect('/allocate_room')

    db.execute("""
        INSERT OR REPLACE INTO room_allocations (student_id, block_name, room_number)
        VALUES (?, ?, ?)
    """, (student_id, block, room))

    db.commit()

    flash("Room Allocated Successfully", "success")
    return redirect('/allocate_room')




@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')
if __name__ == '__main__':
 app.run(debug=True)