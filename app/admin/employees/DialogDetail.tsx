import React from 'react'
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    UserCircle,
    CheckCircleIcon,
    XCircleIcon,
    MailIcon,
    CalendarIcon
} from 'lucide-react'
import { IEmployee } from '@/models/Employee'
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2,
    Paper,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/common/format'

interface EmployeeDetailsDialogProps {
    employee: IEmployee
    isOpen: boolean
    onClose: () => void
}

const DialogDetail: React.FC<EmployeeDetailsDialogProps> = ({ employee, isOpen, onClose }) => {
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
                                    {employee.avatar ? (
                                        <Avatar
                                            src={employee.avatar}
                                            alt={employee.fullName}
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
                                            {employee.fullName.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>
                                {employee.isActive && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 4,
                                            right: 4,
                                            bgcolor: '#22c55e',
                                            height: 20,
                                            width: 20,
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '3px',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant='h4' fontWeight='bold'>
                                    {employee.fullName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                    {employee.isActive ? (
                                        <Chip
                                            icon={
                                                <CheckCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.CUSTOMER.ACTIVE')}
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
                                            label={t('COMMON.CUSTOMER.INACTIVE')}
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
                                    <Typography variant='body2'> {employee.username}</Typography>
                                </Box> */}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Button
                                variant='contained'
                                startIcon={<MailIcon style={{ width: 16, height: 16 }} />}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    maxWidth: '130px',
                                    alignSelf: 'flex-end',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 1.25,
                                    fontWeight: 600,
                                    borderRadius: '9px',
                                    '&:hover': {
                                        bgcolor: '#e9f5ff'
                                    },
                                    textTransform: 'none'
                                }}
                            >
                                {t('COMMON.CUSTOMER.SEND_EMAIL')}
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    flexDirection: 'column',
                                    gap: 1,
                                    color: 'rgba(255, 255, 255, 1)',
                                    fontSize: '14px'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CalendarIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'>
                                        {t('COMMON.CUSTOMER.CREATED_AT')} {formatDate(employee.createdDate)}
                                    </Typography>
                                </Box>
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
                <Grid2 container spacing='24px'>
                    <DetailItem
                        icon={<UserCircle className='text-blue-600' />}
                        label={t('COMMON.CUSTOMER.USER_NAME')}
                        value={employee.username}
                    />
                    <DetailItem
                        icon={<ShieldCheck className='text-blue-600' />}
                        label={t('COMMON.CUSTOMER.ROLES')}
                        value={employee.roles.join(', ')}
                    />

                    <DetailItem icon={<Mail className='text-blue-600' />} label='Email' value={employee.email} />
                    <DetailItem
                        icon={<Phone className='text-blue-600' />}
                        label={t('COMMON.CUSTOMER.PHONE')}
                        value={employee.phoneNumber}
                    />

                    <DetailItem
                        icon={<Calendar className='text-blue-600' />}
                        label={t('COMMON.CUSTOMER.BIRTHDAY')}
                        value={employee.birthday}
                    />
                    <DetailItem
                        icon={<MapPin className='text-blue-600' />}
                        label={t('COMMON.CUSTOMER.ADDRESS')}
                        value={employee.address}
                    />
                </Grid2>
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
                            backgroundColor: !employee.isActive ? '#e82323' : 'var(--active-color)'
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: !employee.isActive ? '#e82323' : 'var(--active-color)'
                        }}
                    >
                        {employee.isActive ? t('COMMON.EMPLOYEES.WORKING') : t('COMMON.EMPLOYEES.LEFT')}
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
                            backgroundColor: 'var(--background-color-button-save)',
                            width: 'auto',
                            padding: '6px 30px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-save-hover)'
                            },
                            borderRadius: '8px',
                            color: 'var(--text-color-button-save)',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                    >
                        {t('COMMON.BUTTON.UPDATE')}
                    </Button>

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

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Grid2 size={6}>
        <Paper
            sx={{
                backgroundColor: 'var(--background-color-item)',
                padding: '15px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'var(--background-color-secondary)',
                    padding: '10px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography
                    sx={{
                        fontSize: '13px',
                        mb: '4px',
                        color: 'var(--label-title-color)'
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '15px',
                        color: 'var(--text-color)'
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Paper>
    </Grid2>
)

export default DialogDetail
