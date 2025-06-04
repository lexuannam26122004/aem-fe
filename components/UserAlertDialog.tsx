import React, { useState } from 'react'

const UserAlertDialog = ({
    open,
    setOpen,
    type = 'info',
    title,
    alertText,
    textButton = {
        cancel: 'Cancel',
        confirm: 'Confirm'
    },
    onConfirm,
    isLoading = false
}) => {
    if (!open) return null

    const getTypeConfig = () => {
        switch (type) {
            case 'error':
                return {
                    accent: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    icon: (
                        <div className='w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4'>
                            <svg
                                className='w-6 h-6 text-red-600 dark:text-red-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                                />
                            </svg>
                        </div>
                    )
                }
            case 'warning':
                return {
                    accent: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
                    confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
                    icon: (
                        <div className='w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4'>
                            <svg
                                className='w-6 h-6 text-amber-600 dark:text-amber-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                                />
                            </svg>
                        </div>
                    )
                }
            case 'success':
                return {
                    accent: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
                    confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
                    icon: (
                        <div className='w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4'>
                            <svg
                                className='w-6 h-6 text-emerald-600 dark:text-emerald-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                    )
                }
            default:
                return {
                    accent: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    icon: (
                        <div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4'>
                            <svg
                                className='w-6 h-6 text-blue-600 dark:text-blue-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                            </svg>
                        </div>
                    )
                }
        }
    }

    const typeConfig = getTypeConfig()

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300'
                onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <div className='relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md transform transition-all duration-300 scale-100'>
                {/* Content */}
                <div className='p-6 text-center flex flex-col items-center'>
                    {typeConfig.icon}

                    <h3 className='text-[16px] font-semibold text-gray-900 dark:text-white mb-3 leading-tight'>
                        {title}
                    </h3>

                    <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6'>{alertText}</p>

                    {/* Action Buttons */}
                    <div className='flex gap-6 justify-center'>
                        <button
                            onClick={() => setOpen(false)}
                            className='px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[90px]'
                        >
                            {textButton.cancel}
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg min-w-[90px] flex items-center justify-center ${typeConfig.confirmBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    Loading
                                </>
                            ) : (
                                textButton.confirm
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAlertDialog
