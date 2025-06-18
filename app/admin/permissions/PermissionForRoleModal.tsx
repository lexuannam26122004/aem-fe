import { Box, Button, CircularProgress, Modal, Paper, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJsonRoleHasFunctionsQuery, useUpdateJsonRoleHasFunctionsMutation } from '@/services/AspNetRoleService'
import { useGetAllFunctionsQuery } from '@/services/SysFunctionService'
import { useToast } from '@/hooks/useToast'
import { useSelector, useDispatch } from 'react-redux'
import TablePermission from '@/components/TablePermission'
import { tablePermissionSlice, getPermissionForRoleSelector } from '@/redux/slices/tablePermissionSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import { SaveIcon, XIcon } from 'lucide-react'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'

interface Props {
    data: IAspNetRoleGetAll | null
    open: boolean
    onClose: () => void
}

function PermissionForRoleModal({ data, open, onClose }: Props) {
    const toast = useToast()

    const { t } = useTranslation('common')
    const { data: sysFunctionData, isLoading: isSysFunctionDataLoading } = useGetAllFunctionsQuery()
    const {
        data: jsonRoleData,
        isLoading: isJsonRoleDataLoading,
        refetch: refetchJsonRoleData
    } = useGetJsonRoleHasFunctionsQuery(data?.id ?? '')
    const [updateJsonRole, resultUpdateRoleMutation] = useUpdateJsonRoleHasFunctionsMutation()
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [isClose, setIsClose] = useState(false)

    const dataPermission = useSelector(getPermissionForRoleSelector)

    const dispatch = useDispatch()

    const handleClose = () => {
        onClose()
    }

    // Hàm async đảm bảo dispatch xong dữ liệu
    const loadData = async () => {
        if (sysFunctionData?.data?.records) {
            await dispatch(tablePermissionSlice.actions.addDefaultData(sysFunctionData.data.records))
        }
        if (jsonRoleData?.data?.jsonRoleHasFunctions) {
            await dispatch(tablePermissionSlice.actions.addRoleData(jsonRoleData.data.jsonRoleHasFunctions))
        }
        setIsDataLoaded(true)
    }

    useEffect(() => {
        if (!isSysFunctionDataLoading && !isJsonRoleDataLoading) {
            loadData()
        }
    }, [isSysFunctionDataLoading, isJsonRoleDataLoading, sysFunctionData, jsonRoleData])

    const handleSave = async () => {
        try {
            await updateJsonRole({
                id: data?.id,
                jsonRoleHasFunctions: JSON.stringify(dataPermission)
            })
        } catch {}
    }

    const handleSaveAndClose = async () => {
        try {
            await updateJsonRole({
                id: data?.id,
                JsonRoleHasFunctions: JSON.stringify(dataPermission)
            })
            setIsClose(true)
        } catch {}
    }

    useEffect(() => {
        if (resultUpdateRoleMutation.isSuccess && isClose && !resultUpdateRoleMutation.isLoading) {
            handleClose()
        }
    }, [isClose, resultUpdateRoleMutation])

    useEffect(() => {
        if (resultUpdateRoleMutation.isSuccess) {
            toast(t('COMMON.PERMISSION.UPDATE_PERMISSION_SUCCESS'), 'success')
            refetchJsonRoleData()
        }
        if (resultUpdateRoleMutation.isError) {
            toast('Cập nhật quyền lỗi!', 'error')
        }
    }, [resultUpdateRoleMutation])

    return (
        <Modal open={open} sx={{ padding: 10 }} onClose={handleClose}>
            <Paper
                sx={{
                    width: '90vw',
                    maxWidth: '1200px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--background-color-item)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '15px'
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        padding: '24px',
                        borderWidth: '0px',
                        height: '88vh',
                        borderStyle: 'solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ paddingBottom: 2 }}>
                        <Typography
                            variant='h5'
                            sx={{ fontWeight: 'Bold', color: 'var(--text-color)', textAlign: 'center' }}
                        >
                            {t('COMMON.PERMISSION.TITLE')}
                        </Typography>
                        <Typography
                            variant='h5'
                            sx={{ color: 'red', fontWeight: 'Bold', textAlign: 'center', mt: '5px' }}
                        >
                            {data?.name}
                        </Typography>
                    </Box>

                    {!isDataLoaded ? (
                        <Grid2 container justifyContent={'center'} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Grid2>
                    ) : (
                        <TablePermission height='100%' sx={{ flexGrow: '1', overflowY: 'auto' }} />
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            mt: '24px'
                        }}
                    >
                        <LoadingButton
                            variant='contained'
                            {...(resultUpdateRoleMutation.isLoading && { loading: true })}
                            loadingPosition='start'
                            startIcon={<SaveIcon />}
                            sx={{
                                height: '50px',
                                backgroundColor: 'var(--background-color-button-save)',
                                width: 'auto',
                                padding: '0px 30px',
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
                            onClick={handleSave}
                        >
                            {t('COMMON.BUTTON.SAVE')}
                        </LoadingButton>

                        <LoadingButton
                            variant='contained'
                            {...(resultUpdateRoleMutation.isLoading && { loading: true })}
                            loadingPosition='start'
                            startIcon={<SaveIcon />}
                            sx={{
                                height: '50px',
                                backgroundColor: 'var(--background-color-button-save)',
                                width: 'auto',
                                padding: '0px 30px',
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-button-save-hover)'
                                },
                                color: 'var(--text-color-button-save)',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                textTransform: 'none'
                            }}
                            onClick={handleSaveAndClose}
                        >
                            {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                        </LoadingButton>

                        <Button
                            variant='contained'
                            startIcon={<XIcon />}
                            sx={{
                                height: '50px',
                                backgroundColor: 'var(--background-color-button-cancel)',
                                width: 'auto',
                                fontSize: '16px',
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-button-cancel-hover)'
                                },
                                borderRadius: '8px',
                                padding: '0px 30px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                color: 'var(--text-color-button-cancel)',
                                textTransform: 'none'
                            }}
                            onClick={handleClose}
                        >
                            {t('COMMON.BUTTON.CLOSE')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    )
}

export default PermissionForRoleModal
