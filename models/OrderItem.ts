export interface IOrderItem {
    id: number
    productId: string
    productName: string
    image: string
    variants: string
    quantity: number
    price: number
    subtotal: number
    sku?: string
}
