export interface IPurchaseOrderItem {
    id: number
    productId: string
    productName: string
    productImage: string
    quantity: number
    purchasePrice: number
    subtotal: number
    taxAmount: number
    discountType: number
    discountValue: number
    sku?: string
}
