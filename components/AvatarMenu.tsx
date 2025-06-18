import {
    Avatar,
    Box,
    ClickAwayListener,
    Paper,
    MenuList,
    Divider,
    Grow,
    Popper,
    Typography,
    MenuItem
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useRouter } from 'next/navigation'
import { keyframes } from '@emotion/react'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import { useGetAuthMeQuery } from '@/services/AuthService'

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const AvatarMenu = () => {
    const router = useRouter()
    const { t } = useTranslation('common')
    const anchorRef = useRef<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)

    const [avatarPath, setAvatarPath] = useState('')
    const [fullName, setFullName] = useState('')
    const [roles, setRoles] = useState<string[]>([])

    const { data: responseData, isFetching: isFetchingGetMe } = useGetAuthMeQuery()
    const data = responseData?.data

    useEffect(() => {
        if (!isFetchingGetMe && data) {
            console.log('User data:', data)
            setAvatarPath(data.avatar ? data.avatar : '/images/account.png')
            setFullName(data.fullName || 'N/A')
            setRoles(data.roles || [])
        }
    }, [data, isFetchingGetMe])

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen)
    }

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }
        setOpen(false)
    }

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
            event.preventDefault()
            setOpen(false)
        }
    }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current?.focus()
        }
        prevOpen.current = open
    }, [open])

    const handleChangePassword = () => {
        setOpen(false)
        router.push('/auth/change-password')
    }

    const handleLogout = () => {
        setOpen(false)
        router.push('/auth/login')
    }

    return (
        <Box>
            <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    gap: '14px',
                    padding: '0 0 0 6px',
                    borderRadius: '6px'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundImage: 'linear-gradient(#ffac06, #3675ff)',
                            animation: `${rotate} 5s linear infinite`,
                            zIndex: 0
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '95%',
                            height: '95%',
                            borderRadius: '50%',
                            backgroundColor: 'var(--background-color-item)',
                            zIndex: 0,
                            transform: 'translate(-50%, -50%)' /* Dịch chuyển về giữa */
                        }
                    }}
                >
                    <Avatar src={avatarPath} sx={{ width: 37, height: 37, zIndex: 2 }} />
                </Box>
                <Box>
                    <Typography
                        variant='subtitle2'
                        sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: 'var(--text-color)'
                        }}
                    >
                        {fullName}
                    </Typography>
                    <Typography
                        variant='body2'
                        sx={{
                            mt: '-1.14px',
                            color: 'red',
                            fontSize: '12px'
                        }}
                    >
                        {roles.join(', ')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        padding: '2.5px',
                        color: 'var(--label-title-color)'
                    }}
                >
                    {open ? <ChevronUp /> : <ChevronDown />}
                </Box>
            </Box>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement='bottom-end'
                transition
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        timeout={0}
                        style={{
                            marginTop: '6px',
                            transformOrigin: 'right top'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundImage:
                                    'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                backgroundPosition: 'top right, bottom left',
                                backgroundSize: '50%, 50%',
                                backgroundRepeat: 'no-repeat',
                                backdropFilter: 'blur(20px)',
                                backgroundColor: 'var(--background-color-item)',
                                border: '1px solid var(--border-color)',
                                padding: '0 8px',
                                borderRadius: '10px',
                                minWidth: '208px'
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={false}
                                    id='avatar-menu'
                                    onKeyDown={handleListKeyDown}
                                    sx={{
                                        borderRadius: '8px',
                                        minWidth: '200px'
                                    }}
                                >
                                    {/* <MenuItem sx={{ padding: '8px', cursor: 'default' }}>
                                        <Avatar sx={{ width: 40, height: 40 }} />
                                        <Box sx={{ ml: 2 }}>
                                            <Typography
                                                variant='subtitle2'
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '16px',
                                                    color: 'var(--text-color)'
                                                }}
                                            >
                                                Nam Lee
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                sx={{
                                                    color: 'var(--text-role-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Manager
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    <Divider sx={{ margin: '0 -8px', borderColor: 'var(--border-color)' }} /> */}
                                    {/* 
                                    {pathName.includes('/admin') && (
                                        <MenuItem
                                            onClick={handlePersonal}
                                            sx={{
                                                color: 'var(--text-color)',
                                                borderRadius: '8px',
                                                padding: '9px 12px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--background-color-item-hover)'
                                                }
                                            }}
                                        >
                                            <User style={{ marginRight: '16px' }} />
                                            {t('COMMON.AVATAR_MENU.PERSONAL')}
                                        </MenuItem>
                                    )} */}
                                    {/* 
                                    {pathName.includes('/user') && data.IsAdmin === true && (
                                        <MenuItem
                                            onClick={handleAdmin}
                                            sx={{
                                                color: 'var(--text-color)',
                                                borderRadius: '8px',
                                                padding: '9px 12px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--background-color-item-hover)'
                                                }
                                            }}
                                        >
                                            <User style={{ marginRight: '16px' }} />
                                            {t('COMMON.AVATAR_MENU.PAGE_ADMIN')}
                                        </MenuItem>
                                    )} */}

                                    {/* <MenuItem
                                        onClick={handleCreateNotification}
                                        sx={{
                                            color: 'var(--text-color)',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <PencilLine style={{ marginRight: '16px' }} />
                                        {t('COMMON.AVATAR_MENU.CREATE_NOTIFICATIONS')}
                                    </MenuItem> */}

                                    {/* <MenuItem
                                        onClick={handleSchedular}
                                        sx={{
                                            color: 'var(--text-color)',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <CalendarClock style={{ marginRight: '16px' }} />
                                        {t('COMMON.AVATAR_MENU.SCHEDULAR')}
                                    </MenuItem> */}

                                    <MenuItem
                                        onClick={() => router.push('/user')}
                                        sx={{
                                            color: 'var(--text-color)',
                                            borderRadius: '8px',
                                            padding: '9px 12px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <LocalMallOutlinedIcon sx={{ mr: 2 }} />
                                        {t('COMMON.AVATAR_MENU.CUSTOMER_PAGE')}
                                    </MenuItem>

                                    <MenuItem
                                        onClick={handleChangePassword}
                                        sx={{
                                            color: 'var(--text-color)',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <VpnKeyOutlinedIcon sx={{ mr: 2 }} />
                                        {t('COMMON.AVATAR_MENU.CHANGE_PASSWORD')}
                                    </MenuItem>

                                    {/* 
                                    <MenuItem
                                        onClick={handleClose}
                                        sx={{
                                            color: 'var(--text-color)',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <HelpOutlineIcon sx={{ mr: 2 }} />
                                        {t('COMMON.AVATAR_MENU.HELP')}
                                    </MenuItem> */}

                                    <Divider sx={{ margin: '0 -8px', borderColor: 'var(--border-color)' }} />
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            color: 'var(--text-color)',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                    >
                                        <LogoutOutlinedIcon sx={{ mr: 2 }} />
                                        {t('COMMON.AVATAR_MENU.LOGOUT')}
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}

export default AvatarMenu
