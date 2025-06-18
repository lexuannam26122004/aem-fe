'use client'

import { Avatar, Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const responseData = {
    data: {
        statsByDay: [
            {
                totalWarranty: 280, // Tổng tháng này
                averageTime: 6.4, // Hôm nay
                repeatRate: 10
            }
        ],
        rate: {
            totalWarranty: 7.69,
            averageTime: 16.36,
            repeatRate: -25.0
        }
    }
}

function Page() {
    const { t } = useTranslation('common')

    // const { data: responseData, isLoading } = useStatsDisplayQuery(currentDate.toISOString().split('T')[0])

    const totalWarranty = responseData?.data?.statsByDay[0]?.totalWarranty || 0
    const averageTime = responseData?.data?.statsByDay[0]?.averageTime || 0
    const repeatRate = responseData?.data?.statsByDay[0]?.repeatRate || 0
    const totalWarrantyRate = responseData?.data?.rate.totalWarranty
    const averageTimeRate = responseData?.data?.rate.averageTime
    const repeatRateRate = responseData?.data?.rate.repeatRate

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #3675ff',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#3675ff',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.WARRANTY_REPORT.TOTAL_WARRANTY_CLAIMS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {totalWarranty}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {totalWarrantyRate !== null &&
                                (!(!totalWarrantyRate || totalWarrantyRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {totalWarrantyRate !== null ? totalWarrantyRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '53px', height: '53px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/warranty.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #00a76f',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#00a76f',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.WARRANTY_REPORT.AVERAGE_RESOLUTION_TIME')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                textTransform: 'lowercase',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {averageTime !== null ? averageTime + 'h' : t('COMMON.HOME.NO_CHANGE')}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {averageTimeRate !== null &&
                                (!(!averageTimeRate || averageTimeRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {averageTimeRate !== null ? averageTimeRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '55px', height: '55px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/time_icon.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #f1aa2e',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#f1aa2e',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.WARRANTY_REPORT.REPEAT_WARRANTY_RATE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {repeatRate}%
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)', //!(!rewardRate || rewardRate >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {repeatRateRate !== null &&
                                (!(!repeatRateRate || repeatRateRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {repeatRateRate !== null ? repeatRateRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '52px', height: '52px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/repeat_icon.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
