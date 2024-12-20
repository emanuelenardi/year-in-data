from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import sqlite3

app = FastAPI()

# Handle cors stuff
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect('data/output/year_in_data.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_annual_table_data(table: str, year: Optional[int]):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT * FROM {table}"
    
    if year:
        query += " WHERE strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@app.get('/workout-data', response_model=List[dict])
def get_workout_data(year: Optional[int] = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM workout_data_daily"

    if year:
        query += " WHERE strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@app.get('/kindle-data', response_model=List[dict])
def get_kindle_data(year: Optional[int] = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM kindle_data_daily"
    
    if year:
        query += " WHERE strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@app.get('/github-data', response_model=List[dict])
def get_github_data(year: Optional[int] = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM github_data_daily"
    
    if year:
        query += " WHERE strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@app.get("/sleep-data", response_model=List[dict])
def get_sleep_data(year: Optional[int] = Query(None)):
    return get_annual_table_data("fitbit_sleep_data_processed", year)