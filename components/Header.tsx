'use client'

import * as React from 'react'
import Stack from '@mui/material/Stack'
import ColorModeIconDropdown from './ColorModeIconDropdown'
import LanguageMenu from './LanguageMenu'
// import NotificationMenu from './NotificationMenu'
import AvatarMenu from './AvatarMenu'
import { Box } from '@mui/material'

export default function Header() {
    return (
        <Stack
            direction='row'
            sx={{
                display: 'flex',
                right: '24px',
                left: '24px',
                alignItems: 'center',
                height: '70px',
                position: 'absolute',
                top: 0,
                padding: '0 24px',
                zIndex: 50,
                backdropFilter: 'blur(10px)' // Làm mờ phần nền phía sau header
            }}
            spacing={2}
        >
            <Stack
                direction='row'
                sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'right' }}
            >
                <Box className='flex items-center gap-4'>
                    {/* <Search />
                    <Divider
                        orientation='vertical'
                        flexItem
                        sx={{ width: '1.5px', mr: 1, ml: 1, borderColor: 'var(--border-color)' }}
                    /> */}
                    <LanguageMenu />
                    <ColorModeIconDropdown />
                    {/* <NotificationMenu /> */}
                    <AvatarMenu />
                </Box>
            </Stack>
        </Stack>
    )
}
