'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VnpayReturn() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode')
        const orderId = searchParams.get('vnp_TxnRef')

        if (responseCode === '00') {
            alert(`Thanh toán thành công! Đơn hàng: ${orderId}`)
        } else {
            alert('Thanh toán thất bại hoặc bị huỷ.')
        }
    }, [searchParams])

    return <div>Đang xử lý kết quả thanh toán...</div>
}
