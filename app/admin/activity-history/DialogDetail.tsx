import React from 'react'
import { Mail, CheckCircleIcon, XCircleIcon, UserCircleIcon, CalendarIcon } from 'lucide-react'
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IActivityLog } from '@/models/ActivityLog'

interface Props {
    activity: IActivityLog
    isOpen: boolean
    onClose: () => void
}

const DialogDetail: React.FC<Props> = ({ activity, isOpen, onClose }) => {
    const { t } = useTranslation('common')
    if (!isOpen) return null

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth='md'
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px'
                    }
                }
            }}
            sx={{
                '& .MuiDialog-paper': {
                    width: '55vw !important'
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(7px)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    backgroundColor: 'var(--background-color)',
                    padding: '0 0 12px 0'
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(to right, #2563eb, #60a4fa)',
                        p: '24px',
                        borderRadius: '12px 12px 0 0',
                        color: 'white'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(4px)',
                                        borderRadius: '50%',
                                        p: 0.75
                                    }}
                                >
                                    {activity.avatarPath ? (
                                        <Avatar
                                            src={activity.avatarPath}
                                            alt={activity.fullName}
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                bgcolor: 'linear-gradient(to bottom right, #bbdefb, #90caf9)',
                                                color: '#1565c0',
                                                fontSize: '1.875rem',
                                                fontWeight: 'bold',
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        >
                                            {activity.fullName.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '3px',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant='h4' fontWeight='bold'>
                                    {activity.fullName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                    {activity.status ? (
                                        <Chip
                                            icon={
                                                <CheckCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.ACTIVITY_LOG.SUCCESSFUL')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#00ff28a6',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 7px'
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            icon={
                                                <XCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.ACTIVITY_LOG.FAILED')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#e15f5a',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 7px'
                                            }}
                                        />
                                    )}
                                </Box>
                                {/* <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        gap: '5px',
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <UserCircleIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'> {activity.username}</Typography>
                                </Box> */}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    pt: '12px !important',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <TableContainer
                    sx={{
                        padding: '0 17px 0 24px',
                        flexGrow: 1,
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
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        paddingLeft: '0px',
                                        borderColor: 'var(--border-color)',
                                        fontSize: '15px',
                                        minWidth: '170px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    {t('COMMON.ACTIVITY_LOG.INFO')}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        <UserCircleIcon
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '8px'
                                            }}
                                        />
                                        {activity.username}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: '10px',
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        <Mail
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '8px'
                                            }}
                                        />
                                        {activity.email}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        paddingLeft: '0px',
                                        borderColor: 'var(--border-color)',
                                        fontSize: '15px',
                                        minWidth: '170px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.CREATED_AT')}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        <CalendarIcon
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '8px'
                                            }}
                                        />
                                        {new Date(activity.logDate).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        paddingLeft: '0px',
                                        borderColor: 'var(--border-color)',
                                        fontSize: '15px',
                                        minWidth: '170px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    {t('COMMON.ACTIVITY_LOG.ACTIVITY_TYPE')}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {activity.activityType}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell
                                    sx={{
                                        paddingLeft: '0px',
                                        border: 'none',
                                        fontSize: '15px',
                                        minWidth: '170px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.SUPPLIERS.DESCRIPTION')}
                                </TableCell>
                                <TableCell sx={{ border: 'none' }}>
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {activity.description}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        ml: '4px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: !activity.status ? '#e82323' : 'var(--active-color)'
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: !activity.status ? '#e82323' : 'var(--active-color)'
                        }}
                    >
                        {activity.status
                            ? t('COMMON.ACTIVITY_LOG.DESC_SUCCESSFUL')
                            : t('COMMON.ACTIVITY_LOG.DESC_FAILED')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px'
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: 'var(--background-color-button-cancel)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-cancel-hover)'
                            },
                            borderRadius: '8px',
                            padding: '6px 30px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color-button-cancel)',
                            textTransform: 'none'
                        }}
                        onClick={onClose}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DialogDetail
