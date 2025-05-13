import Badge from '@mui/material/Badge'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { Box, ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import NotificationsPage from '@/app/admin/notification/page'
import { usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { countNewNotificationSelector, countNewNotificationSlice } from '@/redux/slices/countNewNotificationSlice'
import { useGetCountIsNewQuery } from '@/services/UserNotificationsService'

interface Props {
    isUser?: boolean
}

const NotificationMenu = ({ isUser }: Props) => {
    const pathname = usePathname()
    const anchorRef = useRef<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    const [hover, setHover] = useState(false)
    const dispatch = useDispatch()
    const { data: response, isFetching } = useGetCountIsNewQuery()

    const unreadCount = useSelector(countNewNotificationSelector)

    const handleClick = () => {
        if (pathname === '/admin/notification') {
            return
        }
        setOpen(prev => !prev)
    }

    useEffect(() => {
        if (!isFetching && response?.Data) {
            dispatch(countNewNotificationSlice.actions.updateCountNewNotification(response.Data))
        }
    }, [isFetching, response])

    useEffect(() => {
        if (pathname === '/admin/notification') {
            setOpen(false)
            setHover(true)
        } else {
            setHover(false)
        }
    }, [pathname, hover])

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }
        setOpen(false)
    }

    // const handleListKeyDown = (event: React.KeyboardEvent) => {
    //     if (event.key === 'Tab' || event.key === 'Escape') {
    //         event.preventDefault()
    //         setOpen(false)
    //     }
    // }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current?.focus()
        }
        prevOpen.current = open
    }, [open])

    return (
        <Box>
            <Badge
                badgeContent={unreadCount}
                variant='dot'
                color='error'
                max={99}
                invisible={unreadCount === 0}
                sx={{
                    userSelect: 'none',
                    '& .MuiBadge-badge': {
                        right: 9,
                        top: 9,
                        backgroundColor: 'red',
                        fontSize: '10px'
                    }
                }}
            >
                <Box
                    ref={anchorRef}
                    onClick={handleClick}
                    sx={{
                        cursor: !hover ? 'pointer' : 'default',
                        padding: '6px',
                        borderRadius: '50%',
                        ...(hover && {
                            backgroundColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)',
                            borderColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)'
                        }),
                        color: isUser === true ? '#fff' : 'var(--text-color)',
                        ...(open && {
                            backgroundColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)',
                            borderColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)'
                        }),
                        '&:hover': {
                            backgroundColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)',
                            borderColor: isUser === true ? '#5ce2c2' : 'var(--hover-color)'
                        }
                    }}
                >
                    <NotificationsOutlinedIcon
                        sx={{
                            fontSize: 28
                        }}
                    />
                </Box>
            </Badge>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                sx={{
                    borderRadius: '10px'
                }}
                placement='bottom-end'
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        timeout={0}
                        style={{
                            borderRadius: '10px',
                            marginTop: '5px',
                            transformOrigin: 'right top'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '6px',
                                padding: 0,
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                backgroundImage:
                                    'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                backgroundPosition: 'top right, bottom left',
                                backgroundSize: '50%, 50%',
                                backgroundRepeat: 'no-repeat',
                                backdropFilter: 'blur(20px)',
                                backgroundColor: 'var(--background-item)',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box
                                    sx={{
                                        maxHeight: '84vh',
                                        overflowY: 'auto',
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        }
                                    }}
                                >
                                    <NotificationsPage menu={true} />
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}

export default NotificationMenu
