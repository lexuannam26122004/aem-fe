export interface IPaymentRequest {
    orderCode: string
    amount: number
}

export interface IPaymentResponse {
    paymentUrl: string
}
