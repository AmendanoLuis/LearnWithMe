# CodeLab

La documentación completa del proyecto (qué es, lecciones, arranque en Mac y Windows) está en el README principal del repositorio:

**[../README.md](../README.md)**

## Arranque rápido

### Mac

```bash
# Terminal 1
cd codelab/backend && python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Terminal 2
cd codelab/frontend && npm install && npm run dev
```

### Windows (PowerShell)

```powershell
# Terminal 1
cd codelab\backend; python -m venv venv; venv\Scripts\activate
pip install -r requirements.txt; uvicorn main:app --reload --port 8000

# Terminal 2
cd codelab\frontend; npm install; npm run dev
```

Abre **http://localhost:5173**
