import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database import supabase
from app.schemas import (
    Brand,
    Category,
    Order,
    OrderItem,
    OrderStatusUpdate,
    Product,
    SiteSetting,
    SiteSettingUpdate,
)

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


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    category_id: int | None = None
    brand_id: int | None = None
    is_popular: bool = False
    is_new: bool = False
    images: list[str] = []
    sizes: list[dict] = []


@app.post("/products", status_code=201)
def create_product(payload: ProductCreate):
    result = (
        supabase.table("products")
        .insert(
            {
                "name": payload.name,
                "description": payload.description,
                "price": payload.price,
                "category_id": payload.category_id,
                "brand_id": payload.brand_id,
                "is_popular": payload.is_popular,
                "is_new": payload.is_new,
            }
        )
        .select()
        .single()
        .execute()
    )
    product_id = result.data["id"]

    if payload.images:
        supabase.table("product_images").insert(
            [
                {"product_id": product_id, "image_url": url, "sort_order": i}
                for i, url in enumerate(payload.images)
            ]
        ).execute()

    if payload.sizes:
        supabase.table("product_sizes").insert(
            [
                {"product_id": product_id, "size": s["size"], "stock": s["stock"]}
                for s in payload.sizes
                if s.get("stock", 0) > 0
            ]
        ).execute()

    return {"id": product_id, "status": "created"}


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


@app.get("/settings", response_model=list[SiteSetting])
def list_settings():
    result = supabase.table("site_settings").select("*").execute()
    return result.data


@app.get("/settings/{key}", response_model=SiteSetting)
def get_setting(key: str):
    result = (
        supabase.table("site_settings").select("*").eq("key", key).single().execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Setting no encontrada")
    return result.data


@app.put("/settings/{key}")
def update_setting(key: str, payload: SiteSettingUpdate):
    result = (
        supabase.table("site_settings")
        .update({"value": payload.value, "updated_at": "now()"})
        .eq("key", key)
        .execute()
    )
    return {"status": "updated", "key": key}


@app.get("/orders", response_model=list[Order])
def list_orders(status: str | None = None, search: str | None = None):
    result = (
        supabase.table("orders")
        .select("*, items:order_items(*)")
        .order("created_at", desc=True)
        .execute()
    )
    orders = result.data
    if status:
        orders = [o for o in orders if o.get("status") == status]
    if search:
        q = search.lower()
        orders = [
            o
            for o in orders
            if q in (o.get("customer_name") or "").lower()
            or q in (o.get("customer_id_number") or "").lower()
            or q in (o.get("customer_email") or "").lower()
        ]
    return orders


@app.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: int):
    result = (
        supabase.table("orders")
        .select("*, items:order_items(*)")
        .eq("id", order_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return result.data


@app.put("/orders/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusUpdate):
    supabase.table("orders").update({"status": payload.status}).eq(
        "id", order_id
    ).execute()
    return {"status": "updated", "order_id": order_id, "new_status": payload.status}
