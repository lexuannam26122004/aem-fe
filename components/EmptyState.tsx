'use client'

import React from 'react'
import { Package2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

const EmptyState = () => {
    const { t } = useTranslation('common')
    const { theme: themeSystem } = useTheme()
    const isDark =
        themeSystem === 'dark' ||
        (themeSystem === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const theme = isDark
        ? {
              bg: 'bg-gray-900',
              border: 'border-blue-900/30',
              title: 'text-gray-100',
              iconBg: 'bg-blue-900/30',
              iconColor: 'text-blue-400',
              accentColor: 'text-blue-800/20',
              decorBg1: 'bg-blue-800/10',
              decorBg2: 'bg-blue-700/10',
              decorBg3: 'bg-blue-900/20',
              shadow: 'shadow-lg shadow-blue-900/10'
          }
        : {
              bg: 'bg-white',
              border: 'border-blue-100',
              title: 'text-gray-800',
              iconBg: 'bg-blue-50',
              iconColor: 'text-blue-500',
              accentColor: 'text-blue-500/10',
              decorBg1: 'bg-blue-50',
              decorBg2: 'bg-blue-200',
              decorBg3: 'bg-blue-100',
              shadow: 'shadow-lg'
          }

    const config = {
        icon: <Package2 strokeWidth={1.5} size={64} className={theme.iconColor} />,
        title: t('COMMON.NO_DATA'),
        message: t('COMMON.NO_DATA_MESSAGE')
    }

    return (
        <div className='w-full flex flex-col items-center justify-center py-0 px-4'>
            <div
                className={`${theme.bg} rounded-2xl ${theme.shadow} border ${theme.border} p-10 max-w-md w-full flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:shadow-xl`}
            >
                {/* Top wave pattern */}
                <div className='absolute top-0 left-0 w-full'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' className={theme.accentColor}>
                        <path
                            fill='currentColor'
                            fillOpacity='1'
                            d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,128C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
                        ></path>
                    </svg>
                </div>

                {/* Icon with decoration */}
                <div className='relative mb-8 mt-4'>
                    <div className={`${theme.iconBg} p-6 rounded-full z-10 shadow-md backdrop-blur-sm`}>
                        {config.icon}
                    </div>
                    <div className='absolute -top-4 -right-4 w-8 h-8 rounded-full bg-blue-500/20 animate-ping'></div>
                    <div className='absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-blue-400/20 animate-pulse'></div>
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold ${theme.title} mb-3 text-center`}>{config.title}</h3>

                <p
                    className={'text-center mb-6'}
                    style={{
                        fontSize: '15px',
                        color: 'var(--label-title-color)'
                    }}
                >
                    {config.message}
                </p>

                {/* Decorative elements */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-full ${theme.decorBg1}`}></div>
                <div className={`absolute top-20 right-8 w-3 h-3 rounded-full ${theme.decorBg2}`}></div>
                <div className={`absolute bottom-16 left-10 w-4 h-4 rounded-full ${theme.decorBg3}`}></div>

                {/* Highlight glow */}
                <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl'></div>
            </div>
        </div>
    )
}

export default EmptyState
