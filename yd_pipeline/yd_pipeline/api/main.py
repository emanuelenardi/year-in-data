from fastapi import FastAPI, Query
from typing import List, Optional
import sqlite3

app = FastAPI()

# Connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect('data/output/year_in_data.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get('/heatmap-data', response_model=List[dict])
def get_heatmap_data(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    print(start_date)
    query = "SELECT * FROM workout_data"

    if start_date and end_date:
        query += " WHERE date >= ? AND date <= ?"
        rows = cursor.execute(query, (start_date, end_date)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]