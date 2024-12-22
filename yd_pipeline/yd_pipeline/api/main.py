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

def get_distinct_map(
    table: str, 
    column_name: str, 
    year: Optional[int]=None
) -> dict[str, int]:
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT DISTINCT {column_name} FROM {table}"
    
    if year:
        query += " WHERE strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    
    return {dict(row)[column_name]: index for index, row in enumerate(rows)}
    

@app.get('/workout-data', response_model=dict)
def get_workout_data(year: Optional[int] = Query(None)):
    table = "workout_data_daily"
    return {
        "distinct_categories": get_distinct_map(table, "workout_name", year),
        "data": get_annual_table_data(table, year)
    }

@app.get('/kindle-data', response_model=dict)
def get_kindle_data(year: Optional[int] = Query(None)):
    table = "kindle_data_daily"
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT DISTINCT ASIN FROM {table} WHERE total_reading_minutes >= 10"
    
    if year:
        query += " AND strftime('%Y', date) = ?"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        rows = cursor.execute(query).fetchall()
    
    conn.close()
    return {
        "distinct_categories": {dict(row)["ASIN"]: index for index, row in enumerate(rows)},
        "data": get_annual_table_data(table, year)
    }

@app.get("/distinct-kindle-books", response_model=List[dict])
def get_distinct_kindle_books(year: Optional[int] = Query(None)):
    table = "kindle_distinct_books"
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT * FROM {table}"
    
    if year:
        query += " WHERE strftime('%Y', latest_date) = ?"
        query += " ORDER BY latest_date DESC"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        query += " ORDER BY latest_date DESC"
        rows = cursor.execute(query).fetchall()
    
    conn.close()

    return [dict(row) for row in rows]


@app.get('/github-data', response_model=List[dict])
def get_github_data(year: Optional[int] = Query(None)):
    table = "github_data_daily"
    return get_annual_table_data(table, year)

@app.get("/distinct-github-repos", response_model=List[dict])
def get_distinct_github_repos(year: Optional[int] = Query(None)):
    table = "github_distinct_repos"
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT * FROM {table}"
    
    if year:
        query += " WHERE strftime('%Y', latest_date) = ?"
        query += " ORDER BY latest_date DESC"
        rows = cursor.execute(query, (str(year),)).fetchall()
    else:
        query += " ORDER BY latest_date DESC"
        rows = cursor.execute(query).fetchall()
    
    conn.close()

    return [dict(row) for row in rows]

@app.get("/sleep-data", response_model=dict)
def get_sleep_data(year: Optional[int] = Query(None)):
    table = "fitbit_sleep_data_processed"
    return {
        "distinct_categories": {
            "sleep": 0
        },
        "data": get_annual_table_data(table, year)
    } 