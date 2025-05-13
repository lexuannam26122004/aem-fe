'use client'

import {
    Box,
    Divider,
    Modal,
    Paper,
    TableContainer,
    Table,
    Typography,
    TableRow,
    TableBody,
    TableCell,
    Avatar,
    Button,
    Tooltip,
    Tab,
    Tabs,
    Chip
} from '@mui/material'
import {
    CalendarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    FileUser,
    Link,
    MailIcon,
    ShoppingCartIcon,
    Trash2,
    TrendingUpIcon,
    UserCircleIcon,
    XCircleIcon
} from 'lucide-react'
import { ISupplier } from '@/models/Supplier'
import { useTranslation } from 'react-i18next'
import CallRoundedIcon from '@mui/icons-material/CallRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import BusinessIcon from '@mui/icons-material/Business'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/common/format'

interface Props {
    open: boolean
    handleToggle: () => void
    handleDelete: () => void
    supplier: ISupplier
}

function DetailModal({ open, handleToggle, supplier, handleDelete }: Props) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [tooltip, setTooltip] = useState(t('COMMON.SUPPLIERS.COPY_LINK'))
    const [tab, setTab] = useState('info')

    const handleButtonUpdateClick = (id: number) => {
        router.push(`/admin/suppliers/update?id=${id}`)
    }

    const copyToClipboard = () => {
        const textToCopy = supplier.url?.toString()

        if (!textToCopy) {
            setTooltip(t('COMMON.SUPPLIERS.NO_LINK'))

            setTimeout(() => {
                setTooltip(t('COMMON.SUPPLIERS.COPY_LINK'))
            }, 5000)

            return
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            setTooltip(t('COMMON.SUPPLIERS.COPIED'))

            setTimeout(() => {
                setTooltip(t('COMMON.SUPPLIERS.COPY_LINK'))
            }, 5000)
        })
    }

    return (
        <Modal open={open} onClose={handleToggle}>
            <Box
                sx={{
                    maxWidth: '70vw',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    height: '85vh',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '17px',
                    overflow: 'hidden',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: 'var(--background-color)',
                        boxShadow: 'var(--customShadows-card)',
                        borderRadius: '15px',
                        display: 'flex',
                        overflowY: 'hidden',
                        flexDirection: 'column',
                        width: '700px',
                        height: '100%'
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
                                        {supplier.avatarPath ? (
                                            <Avatar
                                                src={supplier.avatarPath}
                                                alt={supplier.supplierName}
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
                                                {supplier.supplierName.charAt(0)}
                                            </Avatar>
                                        )}
                                    </Box>
                                    {supplier.isPartner && (
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '25px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {supplier.supplierName}
                                        </Typography>

                                        <Tooltip title={tooltip} placement='top' arrow>
                                            <Button
                                                sx={{
                                                    padding: '7px',
                                                    '&:hover': {
                                                        border: '1px solid var(--border-color)',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                    },
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    minWidth: 'auto',
                                                    borderRadius: '50%',
                                                    textTransform: 'none',
                                                    backgroundColor: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={copyToClipboard}
                                            >
                                                <Link size={18} color='white' />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                        {supplier.isPartner ? (
                                            <Chip
                                                icon={
                                                    <CheckCircleIcon
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginRight: 1,
                                                            color: 'white'
                                                        }}
                                                    />
                                                }
                                                label={t('COMMON.SUPPLIERS.PARTNER')}
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
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginRight: 1,
                                                            color: 'white'
                                                        }}
                                                    />
                                                }
                                                label={t('COMMON.SUPPLIERS.NOT_PARTNER')}
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
                            </Box>
                        </Box>
                    </Box>

                    <Tabs
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        sx={{
                            flexShrink: 0,
                            margin: '12px 24px',
                            width: 'fit-content',
                            backgroundColor: 'var(--background-color-component)',
                            height: '42px',
                            minHeight: '42px',
                            borderRadius: '10px',
                            '& .MuiTabs-indicator': { display: 'none' }
                        }}
                    >
                        <Tab
                            label={t('COMMON.INFORMATION')}
                            value='info'
                            icon={<FileUser size={17} />}
                            iconPosition='start'
                            sx={{
                                display: 'flex',
                                height: '42px',
                                minHeight: '42px',
                                color: 'var(--text-color)',
                                padding: '0px 20px',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                textTransform: 'none',
                                border: '2px solid transparent',
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--background-color)',
                                    color: 'var(--text-color)',
                                    border: '2px solid var(--border-color)'
                                }
                            }}
                        />
                        <Tab
                            label={t('COMMON.STATISTICS')}
                            value='statistic'
                            icon={<TrendingUpIcon size={17} />}
                            iconPosition='start'
                            sx={{
                                display: 'flex',
                                height: '42px',
                                minHeight: '42px',
                                borderRadius: '10px',
                                color: 'var(--text-color)',
                                fontWeight: 'bold',
                                padding: '0px 20px',
                                textTransform: 'none',
                                border: '2px solid transparent',
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--background-color)',
                                    color: 'var(--text-color)',
                                    border: '2px solid var(--border-color)'
                                }
                            }}
                        />
                    </Tabs>

                    <Divider
                        sx={{
                            borderColor: 'var(--border-color)'
                        }}
                    />

                    <TableContainer
                        sx={{
                            padding: '10px 17px 0 24px',
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
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.INFO_CONTACT')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                borderColor: 'var(--border-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            <PersonRoundedIcon
                                                sx={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'var(--text-label-color)',
                                                    marginRight: '8px'
                                                }}
                                            />
                                            {supplier.contactName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            <CallRoundedIcon
                                                sx={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'var(--text-label-color)',
                                                    marginRight: '8px'
                                                }}
                                            />
                                            {supplier.phoneNumber}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            borderColor: 'var(--border-color)',
                                            fontSize: '15px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.ADDRESS')}
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
                                            <BusinessIcon
                                                sx={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'var(--text-label-color)',
                                                    marginRight: '8px'
                                                }}
                                            />
                                            {supplier.address}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            border: 'none',
                                            fontSize: '15px',
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
                                            {supplier.description}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            display: 'flex',
                            marginTop: 'auto',
                            borderTop: '1px solid var(--border-color)',
                            padding: '18px 24px',
                            justifyContent: 'space-between',
                            alignItems: 'center'
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
                                    backgroundColor: !supplier.isPartner ? '#e82323' : 'var(--active-color)'
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: '15px',
                                    color: !supplier.isPartner ? '#e82323' : 'var(--active-color)'
                                }}
                            >
                                {supplier.isPartner
                                    ? t('COMMON.SUPPLIERS.COLLABORATION')
                                    : t('COMMON.SUPPLIERS.NOT_COLLABORATION')}
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
                                onClick={handleToggle}
                            >
                                {t('COMMON.BUTTON.CLOSE')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default DetailModal
