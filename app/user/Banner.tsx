'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Banner() {
    const { t } = useTranslation('common')
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()

    const slides = [
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp',
            title: t('COMMON.USER.MODERN_ELECTRONICS'),
            subtitle: t('COMMON.USER.UPGRADE_LIVING_SPACE'),
            cta: t('COMMON.USER.EXPLORE_NOW'),
            color: 'from-blue-600 to-purple-600'
        },
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp',
            title: t('COMMON.USER.SMART_SOLUTIONS'),
            subtitle: t('COMMON.USER.AUTOMATION_FOR_ALL'),
            cta: t('COMMON.USER.VIEW_PRODUCTS'),
            color: 'from-green-600 to-teal-600'
        },
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp',
            title: t('COMMON.USER.CUTTING_EDGE_TECH'),
            subtitle: t('COMMON.USER.LEADING_FUTURE_TRENDS'),
            cta: t('COMMON.USER.LEARN_MORE'),
            color: 'from-red-600 to-orange-600'
        }
    ]

    const nextSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
        setTimeout(() => setIsAnimating(false), 1000)
    }

    const prevSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
        setTimeout(() => setIsAnimating(false), 1000)
    }

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 6000)
        return () => clearInterval(timer)
    }, [isAnimating])

    return (
        <div className='h-[500px] relative overflow-hidden rounded-xl'>
            {/* Overlay gradient pattern for better text readability */}
            <div className='absolute bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10'></div>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 h-full w-full transition-all duration-1000 ${
                        currentSlide === index
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                >
                    {/* Dynamic animated gradient overlay */}
                    <div className='absolute inset-0 bg-black/40 z-10 pointer-events-none'>
                        <div className='absolute inset-0  pointer-events-none z-10 bg-gradient-to-r from-black/80 via-transparent to-black/80 animate-gradientMove'></div>

                        {/* Technology grid effect overlay */}
                        <div className="absolute pointer-events-none inset-0 z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')] opacity-50"></div>
                    </div>

                    <img
                        src={slide.image}
                        alt={slide.title}
                        className='object-cover w-full h-full absolute inset-0 z-0'
                    />

                    {/* Main content */}
                    <div className='absolute inset-0 z-20 flex items-center justify-center'>
                        <div className='text-center max-w-4xl px-6 relative'>
                            {/* AI Badge with pulse effect */}
                            <div className='flex justify-center mb-6'>
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${slide.color} text-white text-sm font-bold tracking-wider animate-fadeDown`}
                                >
                                    <span className='flex h-2 w-2 relative'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
                                        <span className='relative inline-flex rounded-full h-2 w-2 bg-white'></span>
                                    </span>
                                    AI POWERED
                                </div>
                            </div>

                            {/* Futuristic title with typewriter effect */}
                            <div className='relative mb-4'>
                                <h1 className='text-4xl md:text-5xl font-bold text-white drop-shadow-md space-y-1'>
                                    <span className='block overflow-hidden'>
                                        <span className='typewriter-text inline-block animate-typewriter'>
                                            {slide.title}
                                        </span>
                                    </span>
                                </h1>

                                {/* Glitch effect line */}
                                <div className='absolute inset-x-0 h-[1px] bg-white/50 bottom-0 animate-glitchLine'></div>
                            </div>

                            {/* Subtitle with data visualization style */}
                            <div className='relative mb-8'>
                                <p className='text-xl md:text-2xl text-white font-light drop-shadow-md max-w-2xl mx-auto animate-fadeUp'>
                                    {slide.subtitle}
                                </p>

                                <div className='absolute left-1/2 transform -translate-x-1/2 -bottom-4 flex space-x-16 opacity-70'>
                                    <div className='h-[2px] w-16 bg-gradient-to-r from-transparent via-white to-transparent'></div>
                                    <div className='h-[2px] w-8 bg-gradient-to-r from-white to-transparent animate-pulse'></div>
                                    <div className='h-[2px] w-16 bg-gradient-to-r from-transparent via-white to-transparent'></div>
                                </div>
                            </div>

                            {/* Interactive buttons with tech design */}
                            <div className='flex justify-center space-x-6 z-30 animate-fadeIn'>
                                <button
                                    onClick={() => {
                                        router.push('/user/#flash-sale')
                                    }}
                                    className='bg-blue-600 z-30 hover:bg-blue-700 text-white px-6 py-[11px] rounded-lg font-medium transition-all duration-300 transform animate-fadeIn'
                                >
                                    {slide.cta}
                                </button>

                                <button className='group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-[11px] rounded-lg font-medium transition-all duration-300 relative'>
                                    <span className='flex items-center gap-2'>
                                        {/* Data dots */}
                                        <span className='flex items-center gap-[3px] mt-[2px]'>
                                            <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'></span>
                                            <span
                                                className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'
                                                style={{ animationDelay: '0.2s' }}
                                            ></span>
                                            <span
                                                className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'
                                                style={{ animationDelay: '0.4s' }}
                                            ></span>
                                        </span>
                                        {t('COMMON.USER.DETAILS')}
                                    </span>
                                </button>
                            </div>

                            {/* Tech circuit decoration */}
                            <div className='absolute -right-8 z-10 top-0 w-24 h-32 opacity-30 pointer-events-none hidden md:block'>
                                <div className='absolute top-4 right-4 w-[1px] h-8 bg-white'></div>
                                <div className='absolute top-12 right-4 w-6 h-[1px] bg-white'></div>
                                <div className='absolute top-12 right-10 w-[1px] h-6 bg-white'></div>
                                <div className='absolute top-18 right-10 w-4 h-[1px] bg-white'></div>
                                <div className='absolute top-4 right-4 h-2 w-2 rounded-full border border-white'></div>
                                <div className='absolute top-12 right-10 h-2 w-2 rounded-full bg-white animate-ping opacity-75'></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation arrows with improved design */}
            <button
                onClick={prevSlide}
                className='absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 rounded-full p-2 backdrop-blur-md transition-all border border-white/20 shadow-lg disabled:opacity-50'
                disabled={isAnimating}
            >
                <ChevronLeft size={24} className='text-white' />
            </button>

            <button
                onClick={nextSlide}
                className='absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 rounded-full p-2 backdrop-blur-md transition-all border border-white/20 shadow-lg disabled:opacity-50'
                disabled={isAnimating}
            >
                <ChevronRight size={24} className='text-white' />
            </button>

            {/* Slide indicators with animations */}
            <div className='absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-3'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true)
                                setCurrentSlide(index)
                                setTimeout(() => setIsAnimating(false), 1000)
                            }
                        }}
                        className={`transition-all duration-500 focus:outline-none ${
                            currentSlide === index
                                ? 'w-8 h-2.5 bg-white rounded-full shadow-lg'
                                : 'w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-white/70'
                        }`}
                        aria-label={`${t('COMMON.USER.VIEW_SLIDE')} ${index + 1}`}
                    />
                ))}
            </div>

            {/* Add custom animations at the component level */}
            <style jsx global>{`
                @keyframes fadeDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                @keyframes typewriter {
                    from {
                        width: 0;
                    }
                    to {
                        width: 100%;
                    }
                }
                @keyframes cursorBlink {
                    0%,
                    75% {
                        opacity: 1;
                    }
                    76%,
                    100% {
                        opacity: 0;
                    }
                }
                @keyframes glitchLine {
                    0% {
                        transform: scaleX(0);
                        transform-origin: left;
                    }
                    49% {
                        transform: scaleX(1);
                        transform-origin: left;
                    }
                    50% {
                        transform: scaleX(1);
                        transform-origin: right;
                    }
                    100% {
                        transform: scaleX(0);
                        transform-origin: right;
                    }
                }
                @keyframes scanningLight {
                    from {
                        left: -100%;
                    }
                    to {
                        left: 200%;
                    }
                }
                .animate-fadeDown {
                    animation: fadeDown 0.8s ease-out forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                .animate-fadeUp {
                    animation: fadeUp 0.8s ease-out forwards;
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                    animation-delay: 0.6s;
                    opacity: 0;
                }
                .animate-gradientMove {
                    animation: gradientMove 8s ease infinite;
                    background-size: 200% 200%;
                }
                .animate-typewriter {
                    overflow: hidden;
                    white-space: nowrap;
                    border-right: 3px solid transparent;
                    width: 0;
                    animation: typewriter 1.2s steps(40, end) forwards;
                    animation-delay: 0.8s;
                }
                .animate-cursorBlink {
                    opacity: 0;
                    animation: cursorBlink 0.8s step-end infinite;
                    animation-delay: 2s;
                }
                .animate-glitchLine {
                    animation: glitchLine 4s linear infinite;
                    animation-delay: 1s;
                }
                .animate-scanningLight {
                    animation: scanningLight 2s linear infinite;
                }
            `}</style>
        </div>
    )
}
