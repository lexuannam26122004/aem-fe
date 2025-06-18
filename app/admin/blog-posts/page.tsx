'use client'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    TextField,
    InputAdornment,
    Button,
    Divider
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import BlogPostTable from './BlogPostTable'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import { CirclePlus } from 'lucide-react'
import { IBlogPost, IBlogPostFilter } from '@/models/BlogPost'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

const countResponse = {
    data: {
        countDraft: 2,
        countPublished: 5
    }
}

const dataResponse = {
    data: {
        totalRecords: 7,
        records: [
            {
                id: 1,
                postTitle: 'Cách chăm sóc cây cảnh trong nhà',
                postContent: 'Hướng dẫn chi tiết về cách chăm sóc cây cảnh.',
                publishDate: '2025-03-01T10:00:00Z',
                slug: 'cach-cham-soc-cay-canh',
                featuredImage: 'https://example.com/images/cay-canh.jpg',
                description: 'Hướng dẫn cách chăm sóc cây cảnh tại nhà.',
                isPublished: true,
                isActive: true,
                createdAt: '2025-02-25T09:00:00Z',
                createdBy: 'admin',
                authorName: 'Nguyễn Văn A',
                viewCount: 120,
                authorAvatar: null
            },
            {
                id: 2,
                postTitle: 'Công thức làm bánh kem tại nhà',
                postContent: 'Bí quyết để làm bánh kem ngon như ngoài tiệm.',
                publishDate: '2025-03-02T14:00:00Z',
                slug: 'cong-thuc-lam-banh-kem',
                featuredImage: 'https://example.com/images/banh-kem.jpg',
                description: 'Cách làm bánh kem đơn giản.',
                isPublished: true,
                isActive: true,
                createdAt: '2025-02-26T11:00:00Z',
                createdBy: 'admin',
                authorName: 'Trần Thị B',
                viewCount: 85,
                authorAvatar: null
            },
            {
                id: 3,
                postTitle: 'Hướng dẫn sử dụng Docker',
                postContent: 'Tìm hiểu cách sử dụng Docker cho dự án của bạn.',
                publishDate: '2025-03-03T16:00:00Z',
                slug: 'huong-dan-su-dung-docker',
                featuredImage: 'https://example.com/images/docker.jpg',
                description: 'Hướng dẫn từ cơ bản đến nâng cao về Docker.',
                isPublished: true,
                isActive: true,
                createdAt: '2025-02-27T13:00:00Z',
                createdBy: 'admin',
                authorName: 'Lê Văn C',
                viewCount: 200,
                authorAvatar: null
            },
            {
                id: 4,
                postTitle: 'Lịch sử phát triển của AI',
                postContent: 'Tóm tắt quá trình phát triển của trí tuệ nhân tạo.',
                publishDate: '2025-03-04T09:00:00Z',
                slug: 'lich-su-ai',
                featuredImage: 'https://example.com/images/ai-history.jpg',
                description: 'Lịch sử phát triển và các cột mốc quan trọng của AI.',
                isPublished: true,
                isActive: true,
                createdAt: '2025-02-28T08:00:00Z',
                createdBy: 'admin',
                authorName: 'Phạm Thị D',
                viewCount: 150,
                authorAvatar: null
            },
            {
                id: 5,
                postTitle: 'Top 10 địa điểm du lịch năm 2025',
                postContent: 'Danh sách các điểm đến hấp dẫn nhất năm 2025.',
                publishDate: '2025-03-05T12:00:00Z',
                slug: 'top-10-du-lich-2025',
                featuredImage: 'https://example.com/images/du-lich-2025.jpg',
                description: 'Những điểm du lịch không thể bỏ qua.',
                isPublished: true,
                isActive: true,
                createdAt: '2025-02-29T10:00:00Z',
                createdBy: 'admin',
                authorName: 'Ngô Văn E',
                viewCount: 300,
                authorAvatar: null
            },
            {
                id: 6,
                postTitle: 'Hướng dẫn tập gym cho người mới',
                postContent: 'Các bài tập cơ bản dành cho người mới tập gym.',
                publishDate: '',
                slug: 'huong-dan-tap-gym',
                featuredImage: 'https://example.com/images/gym.jpg',
                description: 'Lộ trình tập gym hiệu quả.',
                isPublished: false,
                isActive: false,
                createdAt: '2025-03-01T14:00:00Z',
                createdBy: 'admin',
                authorName: 'Hoàng Văn F',
                viewCount: 10,
                authorAvatar: null
            },
            {
                id: 7,
                postTitle: 'Các mẹo học lập trình hiệu quả',
                postContent: 'Những mẹo nhỏ giúp bạn học lập trình tốt hơn.',
                publishDate: '',
                slug: 'meo-hoc-lap-trinh',
                featuredImage: 'https://example.com/images/lap-trinh.jpg',
                description: 'Cách học lập trình nhanh và hiệu quả.',
                isPublished: false,
                isActive: false,
                createdAt: '2025-03-01T15:00:00Z',
                createdBy: 'admin',
                authorName: 'Bùi Thị G',
                viewCount: 5,
                authorAvatar: null
            }
        ]
    }
}

function Page() {
    const router = useRouter()
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IBlogPostFilter>({
        pageSize: 10,
        pageNumber: 1
    })
    useEffect(() => {}, [setFrom, setTo, filter])
    const [keyword, setKeyword] = useState('')

    // const { data: dataResponse, isLoading, isFetching, refetch } = useSearchSupplierQuery(filter)

    // const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountPartnerQuery()

    const supplierData = dataResponse?.data?.records as IBlogPost[]

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countDraft = countResponse?.data.countDraft || 0
    const countPublished = countResponse?.data.countPublished || 0

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                pageNumber: newPage
            }
        })
    }

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setPage(1)
        setRowsPerPage(event.target.value as string)
        setFilter(prev => {
            return {
                ...prev,
                pageSize: Number(event.target.value),
                pageNumber: 1
            }
        })
    }

    // const refetchPage = () => {
    //     refetch()
    //     countRefetch()
    // }

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setFilter(prev => ({
                ...prev,
                keyword: value,
                pageNumber: 1
            }))
        }, 100),
        []
    )

    const handleSearchKeyword = (value: string) => {
        setPage(1)
        setKeyword(value)
        debouncedSetFilter(value)
    }

    // useEffect(() => {
    //     if (!isFetching && supplierData) {
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, supplierData?.length)
    //         setFrom(from)

    //         const to = Math.min(supplierData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, supplierData, page, rowsPerPage])

    // useEffect(() => {
    //     refetch()
    // }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    const handleChangeTabs = (newValue: number) => {
        setCurrentTab(newValue)
        if (newValue === 1) {
            setFilter(prev => ({
                ...prev,
                isPartner: true
            }))
        } else if (newValue === 2) {
            setFilter(prev => ({
                ...prev,
                isPartner: false
            }))
        } else {
            setFilter(prev => ({
                ...prev,
                isPartner: undefined
            }))
        }
    }

    // if (isLoading || countLoading) {
    //     return <Loading />
    // }

    const badgeStyle: React.CSSProperties = {
        fontSize: '12px',
        height: '24px',
        minWidth: '24px',
        borderRadius: '6px',
        padding: '0px 7px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: 'auto',
                mt: '24px'
            }}
        >
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
                <Typography
                    sx={{
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '20px 24px'
                    }}
                >
                    {t('COMMON.POSTS.TITLE')}
                </Typography>

                <Divider
                    sx={{
                        borderColor: 'var(--border-color)',
                        borderStyle: 'dashed'
                    }}
                />

                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={(e, newValue) => handleChangeTabs(newValue)}
                        variant='scrollable'
                        scrollButtons={false}
                        sx={{
                            overflowX: 'auto',
                            '& .MuiTabs-flexContainer': {
                                flexWrap: 'nowrap'
                            },
                            '&::-webkit-scrollbar': {
                                height: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ccc',
                                borderRadius: '4px'
                            },
                            position: 'relative',
                            '::after': {
                                content: '""',
                                display: 'block',
                                width: '100%',
                                bottom: '0',
                                zIndex: 0,
                                borderRadius: '1px',
                                left: '0',
                                position: 'absolute',
                                height: '2px',
                                backgroundColor: 'var(--border-tab)'
                            }
                        }}
                        slotProps={{
                            indicator: {
                                sx: {
                                    zIndex: 1,
                                    background: 'linear-gradient(to right,rgb(103, 255, 164),rgb(255, 182, 127))',
                                    height: '2px',
                                    borderRadius: '1px'
                                }
                            }
                        }}
                    >
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--label-title-color)',
                                fontWeight: '600',
                                paddingLeft: '25px',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('COMMON.POSTS.ALL')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 0
                                                    ? 'var(--background-color-all-selected)'
                                                    : 'var(--background-color-all)',
                                            color:
                                                currentTab === 0
                                                    ? 'var(--text-color-all-selected)'
                                                    : 'var(--text-color-all)'
                                        }}
                                    >
                                        {countDraft + countPublished}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(0)}
                        />
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--label-title-color)',
                                fontWeight: '600',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('COMMON.POSTS.PUBLISHED')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 1
                                                    ? 'var(--background-color-success-selected)'
                                                    : 'var(--background-color-success)',
                                            color:
                                                currentTab === 1
                                                    ? 'var(--text-color-success-selected)'
                                                    : 'var(--text-color-success)'
                                        }}
                                    >
                                        {countPublished}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(1)}
                        />
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--label-title-color)',
                                fontWeight: '600',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('COMMON.POSTS.DRAFT')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 2
                                                    ? 'var(--background-color-cancel-selected)'
                                                    : 'var(--background-color-cancel)',
                                            color:
                                                currentTab === 2
                                                    ? 'var(--text-color-cancel-selected)'
                                                    : 'var(--text-color-cancel)'
                                        }}
                                    >
                                        {countDraft}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>

                <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                    <Box sx={{ position: 'relative', width: '50%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.POSTS.SEARCH')}
                            variant='outlined'
                            required
                            value={keyword}
                            onChange={e => handleSearchKeyword(e.target.value)}
                            sx={{
                                color: 'var(--text-color)',
                                padding: '0px',
                                width: '100%',
                                '& fieldset': {
                                    borderRadius: '10px',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': { paddingLeft: '0px', paddingRight: '12px' },
                                '& .MuiInputBase-input': {
                                    padding: '15px 0px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--field-color-hover)'
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--field-color-selected)',
                                    borderWidth: '2px'
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{
                                                mr: 0
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    color: '#a5bed4',
                                                    padding: '10.5px',
                                                    zIndex: 100
                                                }}
                                            >
                                                <SearchIcon />
                                            </Box>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    {/* {menuLeft['Discipline'].IsAllowCreate && ( */}
                    <Button
                        variant='contained'
                        startIcon={<CirclePlus />}
                        sx={{
                            ml: 'auto',
                            height: '51px',
                            backgroundColor: 'var(--background-color-button-save)',
                            width: 'auto',
                            padding: '0px 30px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-save-hover)'
                            },
                            color: 'var(--text-color-button-save)',
                            fontSize: '15px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={() => router.push('/admin/blog-posts/create')}
                    >
                        {t('COMMON.BUTTON.CREATE')}
                    </Button>
                    {/* )} */}
                </Box>

                <BlogPostTable
                    blogPosts={supplierData}
                    refetch={() => {} /*refetchPage*/}
                    totalRecords={totalRecords}
                />

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='24px'>
                    <Box display='flex' alignItems='center'>
                        <Typography sx={{ mr: '10px', color: 'var(--text-color)', fontSize: '15px' }}>
                            {t('COMMON.PAGINATION.ROWS_PER_PAGE')}
                        </Typography>
                        <Select
                            id='select'
                            sx={{
                                width: '71px',
                                padding: '5px',
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                '& .MuiSelect-icon': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--border-color)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--field-color-hover)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--field-color-selected)'
                                },
                                '& .MuiSelect-select': {
                                    padding: '6px 32px 6px 10px'
                                }
                            }}
                            value={rowsPerPage}
                            defaultValue='10'
                            onChange={handleChangeRowsPerPage}
                            MenuProps={{
                                PaperProps: {
                                    elevation: 0,
                                    sx: {
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--background-color-item)',
                                        '& .MuiList-root': {
                                            borderRadius: '0px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-color-item)',
                                            padding: '5px',
                                            '& .MuiMenuItem-root': {
                                                color: 'var(--text-color)',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--background-color-item-hover) !important'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-color-item-selected)'
                                                }
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem sx={{ marginBottom: '3px' }} value={5}>
                                5
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={10}>
                                10
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={20}>
                                20
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={30}>
                                30
                            </MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                        </Select>
                        <Typography sx={{ ml: '30px', color: 'var(--text-color)', fontSize: '15px' }}>
                            {t('COMMON.PAGINATION.FROM_TO', { from, to, totalRecords })}
                        </Typography>
                    </Box>

                    <Pagination
                        count={Math.ceil(totalRecords / (rowsPerPage ? Number(rowsPerPage) : 1))}
                        page={page}
                        onChange={handleChangePage}
                        boundaryCount={2}
                        siblingCount={0}
                        variant='outlined'
                        sx={{
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)',
                            '& .MuiPaginationItem-root': {
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)',
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--background-color-item-selected) ',
                                    borderColor: 'var(--background-color-item-selected) ',
                                    color: 'var(--text-color)'
                                },
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-item-hover) !important',
                                    borderColor: 'var(--background-color-item-hover) !important'
                                }
                            }
                        }}
                        color='primary'
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
