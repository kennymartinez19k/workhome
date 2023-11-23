export interface Product {
    productId?: string
    nombre: string
    precio: number
    stock: number
    img: string | null
    imageName: string;
    categoryId: string
}