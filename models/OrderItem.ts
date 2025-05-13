export interface IOrderItem {
    id: number
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
    subtotal: number
    sku?: string
}
