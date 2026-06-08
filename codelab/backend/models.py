from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class PingResponse(BaseModel):
    mensaje: str
    servidor: str = "FastAPI"


class ProductoCrear(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    precio: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)


class ProductoLeer(ProductoCrear):
    id: int


class ProductoActualizar(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    precio: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)


class UsuarioCrear(BaseModel):
    nombre: str = Field(..., min_length=1)
    email: EmailStr


class UsuarioLeer(UsuarioCrear):
    id: int


class NotaCrear(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=200)
    texto: str = Field(default="")


class NotaLeer(NotaCrear):
    id: int
