from pydantic import BaseModel


class ProductSize(BaseModel):
    size: str
    stock: int


class Product(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    images: list[str] = []
    category: str | None = None
    brand: str | None = None
    sizes: list[ProductSize] = []
    is_popular: bool = False
    is_new: bool = False


class Category(BaseModel):
    id: int
    name: str
    slug: str
    image_url: str | None = None


class Brand(BaseModel):
    id: int
    name: str
    slug: str
    logo_url: str | None = None
