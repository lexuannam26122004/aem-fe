'use client'

import { ChevronFirst, ChevronLast } from 'lucide-react'
import { useContext, createContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactDOM from 'react-dom'

const SidebarContext = createContext({ expanded: true })

import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function Sidebar({ children }: { children: ReactNode }) {
    const [expanded, setExpanded] = useState(true)

    return (
        <>
            <aside className='h-screen'>
                <nav className='h-full flex flex-col bg-[var(--background-color)] border-r border-[var(--border-color)] shadow-sm'>
                    <div
                        className={`p-4 pb-2 flex items-center ${
                            expanded ? 'justify-between ml-2' : 'ml-0 justify-center'
                        }`}
                    >
                        <h1
                            className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-[-3px] ${
                                expanded ? '' : 'hidden'
                            }`}
                        >
                            SHOPFINITY
                        </h1>
                        {/* <img
                            className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
                            src='/images/logo.png'
                        /> */}
                        <button
                            onClick={() => setExpanded(curr => !curr)}
                            className='p-2 rounded-lg bg-[var(--hover-color)] hover:bg-[var(--background-color-item-hover)] text-[var(--text-label-color)]'
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <Box
                            className='flex-1 px-2 pt-3 pb-3'
                            sx={{
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                scrollbarGutter: 'stable both-edges',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                    backgroundColor: 'var(--background-color)'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'var(--scrollbar-color)',
                                    borderRadius: '10px'
                                },
                                backgroundColor: 'var(--background-color)'
                            }}
                        >
                            {children}
                        </Box>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    )
}

interface TypographyItemProps {
    text: string
}

export const TypographyItem: React.FC<TypographyItemProps> = ({ text }) => {
    const { expanded } = useContext(SidebarContext)
    const { t } = useTranslation('common')

    return (
        <Typography
            variant='h6'
            sx={{
                fontSize: '14px',
                fontWeight: 'bold',
                height: '23px',
                paddingLeft: '13px',
                color: 'var(--text-color)',
                opacity: expanded ? 1 : 0,
                visibility: expanded ? 'visible' : 'hidden',
                transition: 'all 300ms ease-in-out',
                marginTop: t('COMMON.SIDEBAR.DASHBOARD') !== text ? '20px' : '0',
                width: expanded ? 'auto' : 0,
                overflow: 'hidden'
            }}
        >
            {text}
        </Typography>
    )
}

interface SidebarItemProps {
    icon: ReactNode
    text: string
    active?: boolean
    alert?: boolean
    link: string
}

export function SidebarItem({ icon, text, active, alert, link }: SidebarItemProps) {
    const { expanded } = useContext(SidebarContext)
    const router = useRouter()
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

    const handleMouseEnter = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setTooltipPosition({
            top: rect.top + window.scrollY + 6.5,
            left: rect.right + 8
        })
        setShowTooltip(true)
    }

    useEffect(() => {
        const container =
            document.getElementById('tooltip-portal') ||
            (() => {
                const el = document.createElement('div')
                el.id = 'tooltip-portal'
                document.body.appendChild(el)
                return el
            })()
        setPortalContainer(container)

        return () => {
            if (container && document.body.contains(container)) {
                document.body.removeChild(container)
            }
        }
    }, [])

    const handleMouseLeave = () => {
        setShowTooltip(false)
    }
    return (
        <Box
            className={`group relative flex items-center py-2.5 px-3 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${
                active
                    ? 'bg-[var(--background-color-item-selected)] hover:bg-[var(--background-color-item-hover)] text-[var(--primary-color)]'
                    : 'hover:bg-[var(--background-color-item-hover)] text-[var(--label-title-color)]'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => router.push(link)}
        >
            {icon}

            {expanded === true && (
                <span
                    style={{ width: '190px', fontWeight: '550', fontSize: '15px' }}
                    className='overflow-hidden transition-all duration-40 ml-3'
                >
                    {text}
                </span>
            )}

            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}></div>
            )}

            {!expanded &&
                showTooltip &&
                portalContainer &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: 'absolute',
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                            zIndex: 1000000
                        }}
                        className='rounded-md px-2 py-1 bg-[var(--background-color-item-hover)] text-[var(--text-color)] text-sm transition-opacity opacity-100 shadow-lg'
                    >
                        {text}
                    </div>,
                    portalContainer
                )}
        </Box>
    )
}
