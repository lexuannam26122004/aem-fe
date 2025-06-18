export interface IPurchaseOrderItem {
    id: number
    productId: string
    productName: string
    image: string
    quantity: number
    totalPrice: number
    subtotal: number
    taxAmount: number
    discountType: number
    discountValue: number
    sku?: string
}
