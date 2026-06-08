# LearnWithMe — CodeLab

App web didáctica para enseñar programación a principiantes absolutos. El alumno aprende JavaScript paso a paso, prueba código en el navegador y, en los proyectos finales, guarda datos en un servidor real.

---

## Qué es este proyecto

**CodeLab** es una plataforma de aprendizaje interactiva con 12 lecciones guiadas. Está pensada para clase o autoestudio: lenguaje sencillo, ejemplos editables y feedback inmediato.

### Estructura del repositorio

```
LearnWithMe/
└── codelab/
    ├── backend/     → API con FastAPI + SQLite
    └── frontend/    → Interfaz con Vue 3 + Vite
```

| Parte | Tecnología | Qué hace |
|-------|------------|----------|
| **Frontend** | Vue 3, Vite | Lecciones, editor de código, juego, formularios |
| **Backend** | FastAPI, SQLite | API REST para notas y productos; base de datos local |
| **Base de datos** | SQLite (`codelab.db`) | Se crea sola al arrancar el backend |

### Recorrido de lecciones

**Aprende (9 lecciones)**

| # | Tema | Contenido |
|---|------|-----------|
| 1 | Cómo funciona una web | HTML, CSS, JS y servidor; demo de ping |
| 2 | Variables | `let`, `const`, `var` y errores comunes |
| 3 | Tipos de datos | string, number, boolean |
| 4 | Operadores | `+`, `-`, `*`, `/`, comparaciones |
| 5 | Condicionales | `if` / `else` |
| 6 | Bucles | `for` y `while` |
| 7 | Funciones | Entrada → lógica → salida |
| 8 | Arrays / listas | Índices, recorrer listas |
| 9 | Objetos | Propiedades y fichas |

**Proyectos simples (3 lecciones)**

| # | Tema | Contenido |
|---|------|-----------|
| 10 | El juego | Dos cuadrados con teclado (hay un bug que corregir) |
| 11 | Mis notas | Guardar notas en el servidor (POST) |
| 12 | Productos | Catálogo con API (opcional) |

### Funciones destacadas

- **Editor de código** en cada lección: el alumno modifica JavaScript y ve el resultado al instante.
- **Modo curioso** (menú lateral): muestra el panel **Network** tipo DevTools para ver qué pasa entre navegador y servidor.
- **Actividades por lección**: al probar una actividad, la petición aparece en Network → pestaña *Esta lección*.
- **Retos con bugs**: en los proyectos, el código viene roto a propósito; hay que arreglarlo para que funcione.

### Puertos en local

| Servicio | URL |
|----------|-----|
| App (frontend) | http://localhost:5173 |
| API (backend) | http://localhost:8000 |
| Documentación API | http://localhost:8000/docs |

El frontend redirige `/api` al backend automáticamente. **Tienen que estar los dos servicios en marcha.**

---

## Requisitos previos

Instala esto **una vez** en cada máquina (Mac o Windows):

| Herramienta | Versión mínima | Comprobar |
|-------------|----------------|-----------|
| **Python** | 3.9+ | `python --version` o `python3 --version` |
| **Node.js** | 18+ (incluye npm) | `node --version` y `npm --version` |

**Descargas**

- Python: https://www.python.org/downloads/  
  En Windows, marca **"Add Python to PATH"** durante la instalación.
- Node.js: https://nodejs.org/ (versión LTS)

---

## Pasar el proyecto de Mac a Windows

No copies estas carpetas/archivos (se regeneran en cada máquina):

- `codelab/backend/venv/`
- `codelab/backend/__pycache__/`
- `codelab/backend/codelab.db`
- `codelab/frontend/node_modules/`
- `codelab/frontend/dist/`

**Opciones para mover el código:**

1. **Git** (recomendado): `git clone` o `git pull` en Windows.
2. **Copiar la carpeta** `LearnWithMe` por USB, nube, etc. (sin las carpetas de arriba).

Luego sigue los pasos de instalación de tu sistema operativo.

---

## Arrancar en Mac

Necesitas **dos terminales** abiertas a la vez.

### Terminal 1 — Backend

```bash
cd ruta/a/LearnWithMe/codelab/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Deberías ver algo como: `Uvicorn running on http://127.0.0.1:8000`

### Terminal 2 — Frontend

```bash
cd ruta/a/LearnWithMe/codelab/frontend
npm install
npm run dev
```

Deberías ver: `Local: http://localhost:5173/`

### Abrir la app

Abre el navegador en: **http://localhost:5173**

### Parar los servicios

En cada terminal: `Ctrl + C`

### Volver a arrancar (ya instalado)

**Terminal 1 (backend):**

```bash
cd ruta/a/LearnWithMe/codelab/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 (frontend):**

```bash
cd ruta/a/LearnWithMe/codelab/frontend
npm run dev
```

---

## Arrancar en Windows

Necesitas **dos terminales** (PowerShell o CMD). Sustituye `ruta\a\LearnWithMe` por la ruta real, por ejemplo `C:\Users\TuUsuario\Desktop\LearnWithMe`.

### Terminal 1 — Backend

**PowerShell o CMD:**

```powershell
cd ruta\a\LearnWithMe\codelab\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> Si `python` no funciona, prueba con `py`:
> ```powershell
> py -m venv venv
> venv\Scripts\activate
> pip install -r requirements.txt
> uvicorn main:app --reload --port 8000
> ```

Deberías ver: `Uvicorn running on http://127.0.0.1:8000`

### Terminal 2 — Frontend

```powershell
cd ruta\a\LearnWithMe\codelab\frontend
npm install
npm run dev
```

Deberías ver: `Local: http://localhost:5173/`

### Abrir la app

Abre el navegador en: **http://localhost:5173**

### Parar los servicios

En cada terminal: `Ctrl + C`

### Volver a arrancar (ya instalado)

**Terminal 1 (backend):**

```powershell
cd ruta\a\LearnWithMe\codelab\backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 (frontend):**

```powershell
cd ruta\a\LearnWithMe\codelab\frontend
npm run dev
```

---

## Problemas frecuentes

| Problema | Solución |
|----------|----------|
| `python` no reconocido (Windows) | Usa `py` o reinstala Python marcando "Add to PATH" |
| `uvicorn` no reconocido | Activa el venv: Mac `source venv/bin/activate` · Windows `venv\Scripts\activate` |
| `npm` no reconocido | Instala Node.js LTS y reinicia la terminal |
| La app carga pero notas/productos fallan | El backend no está corriendo. Arranca la Terminal 1 |
| Puerto 8000 o 5173 ocupado | Cierra la otra instancia o cambia el puerto en el comando |
| Error al activar venv en Windows | Ejecuta en PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |

---

## Comandos útiles

```bash
# Backend — comprobar que responde
curl http://localhost:8000/api/ping

# Frontend — build de producción (opcional)
cd codelab/frontend
npm run build
npm run preview
```

---

## Resumen rápido

| Paso | Mac | Windows |
|------|-----|---------|
| 1. Backend | `source venv/bin/activate` | `venv\Scripts\activate` |
| 2. Instalar deps Python | `pip install -r requirements.txt` | Igual |
| 3. Arrancar API | `uvicorn main:app --reload --port 8000` | Igual |
| 4. Instalar deps JS | `npm install` (en `frontend/`) | Igual |
| 5. Arrancar app | `npm run dev` (en `frontend/`) | Igual |
| 6. Abrir | http://localhost:5173 | http://localhost:5173 |
