# backend/main.py
from flask import Flask, request, jsonify
import psycopg2
import os

app = Flask(__name__)

# Database connection settings
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'mydatabase')
DB_USER = os.getenv('DB_USER', 'user')
DB_PASS = os.getenv('DB_PASS', 'password')

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn

# Initialize the database table
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, content FROM tasks')
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([{'id': task[0], 'content': task[1]} for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({'error': 'Task content is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tasks (content) VALUES (%s) RETURNING id', (content,))
    task_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'id': task_id, 'content': content})

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({'error': 'Task content is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tasks SET content = %s WHERE id = %s RETURNING id, content', (content, task_id))
    updated_task = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()

    if updated_task:
        return jsonify({'id': updated_task[0], 'content': updated_task[1]})
    else:
        return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return '', 204

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
