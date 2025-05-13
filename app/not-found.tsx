'use client'

import { Button, Typography, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const Custom404Page: FC = () => {
    const router = useRouter()
    const { t } = useTranslation('common')

    const handleClick = () => {
        router.push('/admin')
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                textAlign: 'center'
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    padding: '40px 0 40px',
                    margin: '0 300px',
                    textAlign: 'center',
                    color: '#fff'
                }}
            >
                <Typography variant='h3' sx={{ fontWeight: 'bold', color: 'var(--text-color)' }}>
                    Sorry, page not found!
                </Typography>
                <Typography variant='h6' sx={{ mt: 4, fontSize: '17px', color: 'var(--label-title-color)' }}>
                    Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to
                    check your spelling.
                </Typography>

                <Box
                    sx={{
                        backgroundImage:
                            'url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/illustrations/characters/character-question.webp)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '65% 60%',
                        backgroundSize: '140px',
                        margin: '0 auto',
                        mt: 12,
                        width: '450px'
                    }}
                >
                    <img src='/images/404.svg' style={{ width: '100%', height: 'auto' }} />
                </Box>

                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        flex: 1,
                        mt: 12,
                        fontSize: '16px',
                        padding: '10px 24px',
                        fontWeight: 'bold',
                        color: 'var(--text-color-button-save)',
                        backgroundColor: 'var(--background-color-button-save)',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-save-hover)'
                        },
                        textTransform: 'none'
                    }}
                    onClick={handleClick}
                >
                    {t('COMMON.BUTTON.GO_BACK_HOME')}
                </Button>
            </Box>
        </Box>
    )
}

export default Custom404Page
