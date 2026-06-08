from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from models import (
    PingResponse,
    ProductoCrear,
    ProductoLeer,
    ProductoActualizar,
    UsuarioCrear,
    UsuarioLeer,
    NotaCrear,
    NotaLeer,
)
from db import (
    init_db,
    get_connection,
    execute,
    fetchall,
    fetchone,
    SQLLogger,
    with_sql_log,
)
from seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed()
    yield


app = FastAPI(
    title="CodeLab API",
    description="API didáctica para enseñar fundamentos de programación",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Devuelve errores de validación Pydantic de forma legible para la lección L7."""
    errors = []
    for err in exc.errors():
        field = " → ".join(str(loc) for loc in err["loc"])
        errors.append({"campo": field, "error": err["msg"], "tipo": err["type"]})
    return JSONResponse(
        status_code=422,
        content={
            "mensaje": "El payload no cumple el schema (contrato de datos)",
            "errores": errors,
            "_schema_validacion": "Pydantic rechazó los datos enviados",
        },
    )


# --- Ping ---

@app.get("/api/ping", response_model=PingResponse, tags=["Sistema"])
def ping():
    return PingResponse(mensaje="pong", servidor="FastAPI")


# --- Productos CRUD ---

@app.get("/api/productos", tags=["Productos"])
def listar_productos():
    logger = SQLLogger()
    conn = get_connection()
    try:
        rows = fetchall(conn, logger, "SELECT id, nombre, precio, stock FROM productos ORDER BY id")
        productos = [dict(row) for row in rows]
        return with_sql_log(productos, logger)
    finally:
        conn.close()


@app.get("/api/productos/{producto_id}", tags=["Productos"])
def obtener_producto(producto_id: int):
    logger = SQLLogger()
    conn = get_connection()
    try:
        row = fetchone(
            conn, logger,
            "SELECT id, nombre, precio, stock FROM productos WHERE id = ?",
            (producto_id,),
        )
        if not row:
            raise HTTPException(status_code=404, detail=f"Producto {producto_id} no encontrado")
        return with_sql_log(dict(row), logger)
    finally:
        conn.close()


@app.post("/api/productos", status_code=201, tags=["Productos"])
def crear_producto(producto: ProductoCrear):
    logger = SQLLogger()
    conn = get_connection()
    try:
        cursor = execute(
            conn, logger,
            "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
            (producto.nombre, producto.precio, producto.stock),
        )
        conn.commit()
        nuevo = fetchone(
            conn, logger,
            "SELECT id, nombre, precio, stock FROM productos WHERE id = ?",
            (cursor.lastrowid,),
        )
        return with_sql_log(dict(nuevo), logger)
    finally:
        conn.close()


@app.put("/api/productos/{producto_id}", tags=["Productos"])
def actualizar_producto(producto_id: int, producto: ProductoActualizar):
    logger = SQLLogger()
    conn = get_connection()
    try:
        row = fetchone(
            conn, logger,
            "SELECT id, nombre, precio, stock FROM productos WHERE id = ?",
            (producto_id,),
        )
        if not row:
            raise HTTPException(status_code=404, detail=f"Producto {producto_id} no encontrado")

        datos = dict(row)
        if producto.nombre is not None:
            datos["nombre"] = producto.nombre
        if producto.precio is not None:
            datos["precio"] = producto.precio
        if producto.stock is not None:
            datos["stock"] = producto.stock

        execute(
            conn, logger,
            "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
            (datos["nombre"], datos["precio"], datos["stock"], producto_id),
        )
        conn.commit()
        actualizado = fetchone(
            conn, logger,
            "SELECT id, nombre, precio, stock FROM productos WHERE id = ?",
            (producto_id,),
        )
        return with_sql_log(dict(actualizado), logger)
    finally:
        conn.close()


@app.delete("/api/productos/{producto_id}", tags=["Productos"])
def eliminar_producto(producto_id: int):
    logger = SQLLogger()
    conn = get_connection()
    try:
        row = fetchone(
            conn, logger,
            "SELECT id, nombre, precio, stock FROM productos WHERE id = ?",
            (producto_id,),
        )
        if not row:
            raise HTTPException(status_code=404, detail=f"Producto {producto_id} no encontrado")

        execute(conn, logger, "DELETE FROM productos WHERE id = ?", (producto_id,))
        conn.commit()
        return with_sql_log({"eliminado": dict(row), "mensaje": "Producto eliminado"}, logger)
    finally:
        conn.close()


# --- Notas CRUD ---

@app.get("/api/notas", tags=["Notas"])
def listar_notas():
    logger = SQLLogger()
    conn = get_connection()
    try:
        rows = fetchall(conn, logger, "SELECT id, titulo, texto FROM notas ORDER BY id DESC")
        notas = [dict(row) for row in rows]
        return with_sql_log(notas, logger)
    finally:
        conn.close()


@app.post("/api/notas", status_code=201, tags=["Notas"])
def crear_nota(nota: NotaCrear):
    logger = SQLLogger()
    conn = get_connection()
    try:
        cursor = execute(
            conn, logger,
            "INSERT INTO notas (titulo, texto) VALUES (?, ?)",
            (nota.titulo, nota.texto),
        )
        conn.commit()
        nueva = fetchone(
            conn, logger,
            "SELECT id, titulo, texto FROM notas WHERE id = ?",
            (cursor.lastrowid,),
        )
        return with_sql_log(dict(nueva), logger)
    finally:
        conn.close()


@app.delete("/api/notas/{nota_id}", tags=["Notas"])
def eliminar_nota(nota_id: int):
    logger = SQLLogger()
    conn = get_connection()
    try:
        row = fetchone(
            conn, logger,
            "SELECT id, titulo, texto FROM notas WHERE id = ?",
            (nota_id,),
        )
        if not row:
            raise HTTPException(status_code=404, detail=f"Nota {nota_id} no encontrada")
        execute(conn, logger, "DELETE FROM notas WHERE id = ?", (nota_id,))
        conn.commit()
        return with_sql_log({"eliminado": dict(row)}, logger)
    finally:
        conn.close()


# --- Usuarios (legacy) ---

@app.post("/api/usuarios", status_code=201, tags=["Usuarios"])
def crear_usuario(usuario: UsuarioCrear):
    logger = SQLLogger()
    conn = get_connection()
    try:
        cursor = execute(
            conn, logger,
            "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
            (usuario.nombre, usuario.email),
        )
        conn.commit()
        nuevo = fetchone(
            conn, logger,
            "SELECT id, nombre, email FROM usuarios WHERE id = ?",
            (cursor.lastrowid,),
        )
        return with_sql_log(dict(nuevo), logger)
    finally:
        conn.close()


@app.get("/api/usuarios", tags=["Usuarios"])
def listar_usuarios():
    logger = SQLLogger()
    conn = get_connection()
    try:
        rows = fetchall(conn, logger, "SELECT id, nombre, email FROM usuarios ORDER BY id")
        usuarios = [dict(row) for row in rows]
        return with_sql_log(usuarios, logger)
    finally:
        conn.close()


# --- Endpoints de funciones (para L2) ---

@app.get("/api/funciones/mayusculas", tags=["Funciones"])
def funcion_mayusculas(texto: str):
    return {"entrada": texto, "salida": texto.upper(), "funcion": "aMayusculas"}


@app.get("/api/funciones/sumar", tags=["Funciones"])
def funcion_sumar(a: float, b: float):
    return {"entrada": {"a": a, "b": b}, "salida": a + b, "funcion": "sumar"}


@app.get("/api/funciones/pares", tags=["Funciones"])
def funcion_pares(numeros: str):
    lista = [int(n.strip()) for n in numeros.split(",") if n.strip()]
    pares = [n for n in lista if n % 2 == 0]
    return {"entrada": lista, "salida": pares, "funcion": "filtrarPares"}
