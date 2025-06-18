import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { toastSlice, toastSelector } from '@/redux/slices/toastSlice'

const ToastContainer = () => {
    const dispatch = useDispatch()
    const toasts = useSelector(toastSelector)
    const [toastHeights, setToastHeights] = useState<{ [key: string]: number }>({})

    const handleClose = (id: string) => {
        dispatch(toastSlice.actions.removeToast(id))
    }

    useEffect(() => {
        const heights: { [key: string]: number } = {}
        toasts.forEach(toast => {
            const element = document.getElementById(`toast-${toast.id}`)
            if (element) {
                heights[toast.id] = element.offsetHeight
            }
        })
        setToastHeights(heights)
    }, [toasts])

    const getToastClasses = (typeToast: string) => {
        const baseClasses =
            'fixed right-6 flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 ease-out transform min-w-80 max-w-md z-50'

        switch (typeToast) {
            case 'success':
                return `${baseClasses} bg-green-50/95 border-green-200/50 text-green-600`
            case 'error':
                return `${baseClasses} bg-red-50/95 border-red-200/50 text-red-600`
            case 'info':
                return `${baseClasses} bg-blue-50/95 border-blue-200/50 text-blue-600`
            case 'warning':
                return `${baseClasses} bg-yellow-50/95 border-yellow-200/50 text-yellow-600`
            default:
                return `${baseClasses} bg-gray-50/95 border-gray-200/50 text-gray-600`
        }
    }

    const getIcon = (typeToast: string) => {
        const iconClasses = 'flex-shrink-0 mr-3 mt-0.5'

        switch (typeToast) {
            case 'success':
                return <CheckCircle className={`${iconClasses} text-green-500`} size={20} />
            case 'error':
                return <AlertCircle className={`${iconClasses} text-red-500`} size={20} />
            case 'info':
                return <Info className={`${iconClasses} text-blue-500`} size={20} />
            case 'warning':
                return <AlertTriangle className={`${iconClasses} text-yellow-500`} size={20} />
            default:
                return <Info className={`${iconClasses} text-gray-500`} size={20} />
        }
    }

    const getCloseButtonClasses = (typeToast: string) => {
        const baseClasses =
            'flex-shrink-0 ml-3 p-1.5 rounded-full transition-all duration-200 opacity-80 hover:opacity-100'

        switch (typeToast) {
            case 'success':
                return `${baseClasses} text-green-500 hover:bg-green-100`
            case 'error':
                return `${baseClasses} text-red-500 hover:bg-red-100`
            case 'info':
                return `${baseClasses} text-blue-500 hover:bg-blue-100`
            case 'warning':
                return `${baseClasses} text-yellow-500 hover:bg-yellow-100`
            default:
                return `${baseClasses} text-gray-500 hover:bg-gray-100`
        }
    }

    const calculateTopPosition = (currentIndex: number) => {
        let totalHeight = 24 // Initial top margin
        for (let i = 0; i < currentIndex; i++) {
            const toast = toasts[i]
            const height = toastHeights[toast.id] || 72 // fallback height
            totalHeight += height + 12 // 12px gap between toasts
        }
        return totalHeight
    }

    return (
        <div className='fixed top-0 right-0 pointer-events-none' style={{ zIndex: 9999 }}>
            {toasts.slice(0, 5).map((toast, index) => (
                <div
                    key={toast.id}
                    id={`toast-${toast.id}`}
                    className={getToastClasses(toast.typeToast)}
                    style={{
                        top: `${calculateTopPosition(index)}px`,
                        animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: 'auto'
                    }}
                    onAnimationEnd={() => {
                        // Auto close after animation
                        if (toast.hideDuration !== 0) {
                            setTimeout(() => {
                                handleClose(toast.id)
                            }, toast.hideDuration || 3000)
                        }
                    }}
                >
                    {getIcon(toast.typeToast)}

                    <div className='flex-1 text-sm font-medium leading-relaxed pr-2'>{toast.message}</div>

                    <button onClick={() => handleClose(toast.id)} className={getCloseButtonClasses(toast.typeToast)}>
                        <X size={16} />
                    </button>
                </div>
            ))}

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}

export default ToastContainer
