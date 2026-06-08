import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).parent / "codelab.db"


class SQLLogger:
    """Captura las consultas SQL ejecutadas en una petición."""

    def __init__(self):
        self.queries: list[dict[str, Any]] = []

    def log(self, sql: str, params: tuple = ()):
        self.queries.append({"sql": sql.strip(), "params": list(params)})

    def clear(self):
        self.queries = []


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS notas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            texto TEXT NOT NULL DEFAULT ''
        );
    """)
    conn.commit()
    conn.close()


def execute(conn: sqlite3.Connection, logger: SQLLogger, sql: str, params: tuple = ()):
    logger.log(sql, params)
    return conn.execute(sql, params)


def fetchall(conn: sqlite3.Connection, logger: SQLLogger, sql: str, params: tuple = ()):
    logger.log(sql, params)
    return conn.execute(sql, params).fetchall()


def fetchone(conn: sqlite3.Connection, logger: SQLLogger, sql: str, params: tuple = ()):
    logger.log(sql, params)
    return conn.execute(sql, params).fetchone()


def with_sql_log(data: Any, logger: SQLLogger) -> dict:
    """Añade _sql_log a la respuesta para el inspector."""
    if isinstance(data, dict):
        result = {**data}
    elif isinstance(data, list):
        result = {"items": data}
    else:
        result = {"data": data}
    result["_sql_log"] = logger.queries
    return result
