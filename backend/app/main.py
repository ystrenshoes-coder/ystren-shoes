import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import supabase
from app.schemas import Brand, Category, Product

load_dotenv()

app = FastAPI(title="Ystren Shoes API")

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "Ystren Shoes API"}


def _flatten_product_fields(product: dict) -> dict:
    category = product.get("category")
    brand = product.get("brand")
    images = product.get("images") or []
    sizes = product.get("sizes") or []
    product["category"] = category["slug"] if category else None
    product["brand"] = brand["slug"] if brand else None
    product["images"] = [
        img["image_url"]
        for img in sorted(images, key=lambda img: img["sort_order"])
    ]
    product["sizes"] = [
        {"size": s["size"], "stock": s["stock"]} for s in sizes
    ]
    return product


PRODUCT_SELECT = (
    "*, category:categories(slug), brand:brands(slug),"
    " images:product_images(image_url, sort_order),"
    " sizes:product_sizes(size, stock)"
)


@app.get("/products", response_model=list[Product])
def list_products(
    category: str | None = None,
    brand: str | None = None,
    search: str | None = None,
    popular: bool | None = None,
    is_new: bool | None = None,
    sort: str | None = None,
):
    query = supabase.table("products").select(PRODUCT_SELECT)
    if search:
        query = query.ilike("name", f"%{search}%")
    if popular is not None:
        query = query.eq("is_popular", popular)
    if is_new is not None:
        query = query.eq("is_new", is_new)
    if sort == "price_asc":
        query = query.order("price")
    elif sort == "price_desc":
        query = query.order("price", desc=True)
    else:
        query = query.order("sort_order")
    result = query.execute()
    products = [_flatten_product_fields(p) for p in result.data]
    if category:
        products = [p for p in products if p["category"] == category]
    if brand:
        products = [p for p in products if p["brand"] == brand]
    return products


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    result = (
        supabase.table("products")
        .select(PRODUCT_SELECT)
        .eq("id", product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _flatten_product_fields(result.data[0])


@app.get("/categories", response_model=list[Category])
def list_categories():
    result = (
        supabase.table("categories")
        .select("id, name, slug, image_url")
        .order("sort_order")
        .execute()
    )
    return result.data


@app.get("/brands", response_model=list[Brand])
def list_brands():
    result = (
        supabase.table("brands")
        .select("id, name, slug, logo_url")
        .order("sort_order")
        .execute()
    )
    return result.data
