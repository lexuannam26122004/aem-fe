export interface IPaymentRequest {
    orderId: string
    amount: number
}

export interface IPaymentResponse {
    paymentUrl: string
}
