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


class SiteSetting(BaseModel):
    key: str
    value: dict
    updated_at: str | None = None


class SiteSettingUpdate(BaseModel):
    value: dict


class OrderItem(BaseModel):
    id: int
    product_name: str | None = None
    size: str | None = None
    quantity: int = 1
    unit_price: float = 0


class Order(BaseModel):
    id: int
    customer_name: str | None = None
    customer_email: str | None = None
    customer_phone: str | None = None
    customer_id_number: str | None = None
    shipping_address: str | None = None
    shipping_city: str | None = None
    status: str = "pending"
    subtotal: float = 0
    wompi_reference: str | None = None
    created_at: str | None = None
    items: list[OrderItem] = []


class OrderStatusUpdate(BaseModel):
    status: str
