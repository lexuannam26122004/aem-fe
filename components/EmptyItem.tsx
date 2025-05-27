'use client'
import React from 'react'

interface EmptyItemProps {
    title: string
    description: string
    buttonText: string
    onClick: () => void
    icon: React.ReactNode
}

export default function EmptyItem(props: EmptyItemProps) {
    const { title, description, buttonText, onClick, icon } = props
    return (
        <div className='rounded-[15px] mx-auto overflow-hidden w-[65%] shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
            <div className='py-16 px-6 text-center'>
                <div className='mb-6 inline-flex p-4 bg-blue-50 rounded-full'>{icon}</div>
                <h3 className='text-xl font-medium text-gray-800'>{title}</h3>
                <p className='mt-2 text-gray-500 mx-auto'>{description}</p>
                <button
                    className='mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm'
                    onClick={onClick}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}
