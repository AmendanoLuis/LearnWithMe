from db import get_connection, init_db, execute, SQLLogger


PRODUCTOS_EJEMPLO = [
    ("Manzana", 1.50, 100),
    ("Pera", 2.00, 50),
    ("Uva", 3.50, 30),
    ("Naranja", 1.80, 75),
    ("Plátano", 1.20, 120),
]

NOTAS_EJEMPLO = [
    ("Bienvenida", "Esta es tu primera nota de ejemplo."),
    ("Recuerda", "Programar es practicar poco a poco."),
]


def seed():
    init_db()
    conn = get_connection()
    logger = SQLLogger()

    count = execute(conn, logger, "SELECT COUNT(*) as total FROM productos").fetchone()["total"]
    if count == 0:
        for nombre, precio, stock in PRODUCTOS_EJEMPLO:
            execute(
                conn,
                logger,
                "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
                (nombre, precio, stock),
            )
        conn.commit()
        print(f"✓ Insertados {len(PRODUCTOS_EJEMPLO)} productos de ejemplo")

    count_notas = execute(conn, logger, "SELECT COUNT(*) as total FROM notas").fetchone()["total"]
    if count_notas == 0:
        for titulo, texto in NOTAS_EJEMPLO:
            execute(
                conn,
                logger,
                "INSERT INTO notas (titulo, texto) VALUES (?, ?)",
                (titulo, texto),
            )
        conn.commit()
        print(f"✓ Insertadas {len(NOTAS_EJEMPLO)} notas de ejemplo")

    conn.close()


if __name__ == "__main__":
    seed()
