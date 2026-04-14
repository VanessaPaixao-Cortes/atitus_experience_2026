from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(title="Atitus Site")

# Diretório com os arquivos estáticos do site
BASE_DIR = os.path.dirname(__file__)
SITE_DIR = os.path.join(BASE_DIR, "HtmlCssParte1")

if not os.path.isdir(SITE_DIR):
    raise RuntimeError(f"Pasta do site não encontrada: {SITE_DIR}")

# Monta a pasta do site como estática na raiz — serve index.html automaticamente
app.mount("/", StaticFiles(directory=SITE_DIR, html=True), name="site")


@app.get("/health")
def health():
    return JSONResponse({"status": "ok"})


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
