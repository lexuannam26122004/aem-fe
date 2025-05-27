export interface IOrderItem {
    id: number
    productId: string
    productName: string
    productImage: string
    productVariant: string
    quantity: number
    price: number
    subtotal: number
    sku?: string
}
