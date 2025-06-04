import React from 'react'

const Loader = () => {
    return (
        <div className='flex justify-center items-center w-full h-screen bg-white relative overflow-hidden'>
            {/* CSS Animations */}
            <style jsx>{`
                @keyframes morphAndSpin {
                    0% {
                        border-radius: 12px;
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        border-radius: 25px;
                        transform: rotate(90deg) scale(1.1);
                    }
                    50% {
                        border-radius: 50px;
                        transform: rotate(180deg) scale(1);
                    }
                    75% {
                        border-radius: 25px;
                        transform: rotate(270deg) scale(0.9);
                    }
                    100% {
                        border-radius: 12px;
                        transform: rotate(360deg) scale(1);
                    }
                }

                @keyframes morphAndSpinReverse {
                    0% {
                        border-radius: 50px;
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        border-radius: 30px;
                        transform: rotate(-90deg) scale(0.95);
                    }
                    50% {
                        border-radius: 12px;
                        transform: rotate(-180deg) scale(1.05);
                    }
                    75% {
                        border-radius: 30px;
                        transform: rotate(-270deg) scale(0.98);
                    }
                    100% {
                        border-radius: 50px;
                        transform: rotate(-360deg) scale(1);
                    }
                }

                @keyframes logoScale {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .morph-spin-outer {
                    animation: morphAndSpin 3s ease-in-out infinite;
                }

                .morph-spin-middle {
                    animation: morphAndSpinReverse 2.5s ease-in-out infinite;
                }

                .logo-scale {
                    animation: logoScale 2s ease-in-out infinite;
                }
            `}</style>

            {/* Background Particles */}
            <div className='absolute inset-0 opacity-8'>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse'
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${4 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Loader Container */}
            <div className='relative flex justify-center items-center'>
                {/* Outer Ring - Square to Circle */}
                <div className='absolute w-32 h-32 border-4 border-blue-300 morph-spin-outer bg-blue-50/30'></div>

                {/* Middle Ring - Circle to Square (Reverse) */}
                <div className='absolute w-24 h-24 border-2 border-blue-400 morph-spin-middle bg-blue-100/40'></div>

                {/* Center Element - Stylized S Logo */}
                <div className='absolute w-16 h-16 flex items-center justify-center logo-scale'>
                    <svg viewBox='0 0 100 100' className='w-12 h-12 text-blue-500' fill='currentColor'>
                        <path
                            d='M70 25 
                                C70 15, 60 10, 50 10
                                C40 10, 30 15, 30 25
                                C30 35, 40 40, 50 40
                                C60 40, 70 45, 70 55
                                C70 65, 60 70, 50 70
                                C40 70, 30 65, 30 55
                                M25 55
                                C25 75, 35 85, 50 85
                                C65 85, 75 75, 75 55
                                C75 35, 65 25, 50 25
                                C35 25, 25 35, 25 55'
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Loader
