# Ystren Shoes

Sitio web de Ystren Shoes: catalogo de calzado, carrito de compras y pago en
linea con Wompi.

## Estructura

- `backend/` — API en FastAPI (Python), conectada a Supabase (Postgres). Solo lectura publica (catalogo).
- `frontend/` — Sitio en Next.js (React) que consume la API: sitio publico + panel admin + carrito + checkout.

## Desarrollo local

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # completar SUPABASE_URL y SUPABASE_KEY
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.

### Base de datos

En el SQL Editor de Supabase, ejecutar `backend/supabase_schema.sql` para crear todas las tablas (categorias, marcas, productos, imagenes, tallas, ordenes) con RLS y datos de ejemplo.

### Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

## Despliegue (gratis)

- **Backend:** Render (free tier), usando `backend/render.yaml`.
- **Frontend:** Vercel (free tier), apuntando a la carpeta `frontend/`.
- **Base de datos/Auth/Storage:** Supabase (free tier).
- **Pagos:** Wompi (modo sandbox mientras se prueba, luego produccion).
