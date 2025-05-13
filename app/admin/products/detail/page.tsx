'use client'

import ImageGalleryThumbnail from '@/components/ImageGalleryThumbnail'
import ImageGallery from '@/components/ImageGallery'
import {
    Avatar,
    Box,
    Divider,
    LinearProgress,
    MenuItem,
    Pagination,
    Paper,
    SelectChangeEvent,
    Tab,
    Tabs,
    Typography,
    Select
} from '@mui/material'
import { ShoppingCartIcon, StarIcon, ThumbsDownIcon, ThumbsUpIcon, UserCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IFilter } from '@/models/Common'
import { useSearchReviewQuery } from '@/services/ReviewService'
import { IReview } from '@/models/Review'
import DOMPurify from 'dompurify'

// Sample data that matches your shoes images
const productImages = [
    {
        id: 1,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp', // Xanh lá chính diện
        alt: 'Green shoes front view'
    },
    {
        id: 2,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp', // Góc khác của giày xanh lá
        alt: 'Green shoes side view'
    },
    {
        id: 3,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp', // Giày trắng
        alt: 'White shoes'
    },
    {
        id: 4,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp', // Giày trắng hồng
        alt: 'White and pink shoes'
    },
    {
        id: 5,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp', // Giày xám
        alt: 'Grey shoes'
    },
    {
        id: 6,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp', // Giày nâu
        alt: 'Brown shoes'
    },
    {
        id: 7,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp', // Giày nâu
        alt: 'Brown shoes'
    },
    {
        id: 8,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp', // Giày nâu
        alt: 'Brown shoes'
    },
    {
        id: 9,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-9.webp', // Giày nâu
        alt: 'Brown shoes'
    },
    {
        id: 10,
        src: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp', // Giày nâu
        alt: 'Brown shoes'
    }
    // Thêm các ảnh khác nếu cần
]

const reviews: IReview[] = [
    {
        avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
        fullName: 'John Doe',
        reviewDate: '2023-10-01',
        rating: 4,
        comment:
            'Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. Great shoes! Very comfortable and stylish. ',
        images: [
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-14.webp'
        ],
        likes: 10,
        dislikes: 2
    },
    {
        avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
        fullName: 'John Doe',
        reviewDate: '2023-10-01',
        rating: 4,
        comment: 'Great shoes! Very comfortable and stylish.',
        images: undefined,
        likes: 10,
        dislikes: 2
    },
    {
        avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
        fullName: 'John Doe',
        reviewDate: '2023-10-01',
        rating: 4,
        comment: 'Great shoes! Very comfortable and stylish.',
        images: [
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-14.webp'
        ],
        likes: 10,
        dislikes: 2
    },
    {
        avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp',
        fullName: 'John Doe',
        reviewDate: '2023-10-01',
        rating: 4,
        comment: 'Great shoes! Very comfortable and stylish.',
        images: [
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-14.webp'
        ],
        likes: 10,
        dislikes: 2
    },
    {
        avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp',
        fullName: 'John Doe',
        reviewDate: '2023-10-01',
        rating: 4,
        comment: 'Great shoes! Very comfortable and stylish.',
        images: undefined,
        likes: 10,
        dislikes: 2
    }
]

const colors = [
    { name: 'Red Coral', hex: '#FF6B6B' },
    { name: 'Mint Green', hex: '#6BCB77' },
    { name: 'Sky Blue', hex: '#4D96FF' },
    { name: 'Mango', hex: '#FFC75F' },
    { name: 'Lemon Yellow', hex: '#F9F871' },
    { name: 'Lavender', hex: '#B983FF' },
    { name: 'Baby Pink', hex: '#FF8FAB' },
    { name: 'Purple', hex: '#6C5CE7' },
    { name: 'Aqua Green', hex: '#00C9A7' },
    { name: 'Peach', hex: '#FFB4A2' },
    { name: 'Sunflower', hex: '#FFD93D' },
    { name: 'Light Blue', hex: '#3ABEF9' },
    { name: 'Deep Lavender', hex: '#845EC2' },
    { name: 'Watermelon', hex: '#F67280' },
    { name: 'Cyan Blue', hex: '#00A8CC' }
]

const types = [
    { name: 'Sneakers', image: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-14.webp' },
    { name: 'Boots', image: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-15.webp' },
    { name: 'Sandals', image: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-19.webp' },
    { name: 'Loafers', image: 'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-11.webp' }
]

const ProductPage = () => {
    const { t } = useTranslation('common')
    const [color, setColor] = useState('Red Coral')
    const [size, setSize] = useState(40)
    const [activeTab, setActiveTab] = useState('info')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IFilter>({
        pageSize: 10,
        pageNumber: 1
    })
    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchReviewQuery(filter)

    const htmlContent = `
    <h2>Specifications</h2>
<table>
<tbody>
<tr>
<td>Category</td>
<td>Mobile</td>
</tr>
<tr>
<td>Manufacturer</td>
<td>Apple</td>
</tr>
<tr>
<td>Warranty</td>
<td>12 Months</td>
</tr>
<tr>
<td>Serial number</td>
<td>358607726380311</td>
</tr>
<tr>
<td>Ships from</td>
<td>United States</td>
</tr>
</tbody>
</table>
<h2>Product details</h2>
<ul>
<li>
<p>The foam sockliner feels soft and comfortable</p>
</li>
<li>
<p>Pull tab</p>
</li>
<li>
<p>Not intended for use as Personal Protective Equipment</p>
</li>
<li>
<p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p>
</li>
<li>
<p>Style: 921826-109</p>
</li>
<li>
<p>Country/Region of Origin: China</p>
</li>
</ul>
<h2>Benefits</h2>
<ul>
<li>
<p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>
and durability.</li>
<li>
<p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>
ning underfoot.</li>
<li>
<p>The foam midsole feels springy and soft.</p>
</li>
<li>
<p>The rubber outsole adds traction and durability.</p>
</li>
</ul>
<h2>Delivery and returns</h2>
<p>Your order of $200 or more gets free standard delivery.</p>
<ul>
<li>
<p>Standard delivered 4-5 Business Days</p>
</li>
<li>
<p>Express delivered 2-4 Business Days</p>
</li>
</ul>
<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>
  `

    const cleanHtml = DOMPurify.sanitize(htmlContent)

    // const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const productData = dataResponse?.data?.records || (reviews as IReview[])

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0
    const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44]

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

    useEffect(() => {
        if (!isFetching && productData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, productData?.length)
            setFrom(from)

            const to = Math.min(productData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, productData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    return (
        <Box
            sx={{
                padding: '24px',
                margin: '0 auto',
                maxWidth: '1100px'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: '50px'
                }}
            >
                {/* Product Images */}
                <Box
                    sx={{
                        flex: 1,
                        maxWidth: '500px'
                    }}
                >
                    <ImageGallery images={productImages} />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'var(--text-color)'
                        }}
                    >
                        Classic Canvas Sneakers
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '15px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            color: '#22c55e'
                        }}
                    >
                        {t('COMMON.PRODUCT.IN_STOCK')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                        }}
                    >
                        <StarIcon size={20} color='#ffb81e' fill='#ffb81e' />
                        <StarIcon size={20} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                        <StarIcon size={20} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                        <StarIcon size={20} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                        <StarIcon size={20} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />

                        <Typography
                            sx={{
                                fontSize: '14px',
                                ml: '12px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            223
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '14px',
                                ml: '1px',
                                textTransform: 'lowercase',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.PRODUCT.REVIEWS')}
                        </Typography>

                        <Divider
                            sx={{
                                ml: '5px',
                                borderRight: '1px solid var(--border-color)',
                                height: '20px'
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: '14px',
                                ml: '5px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            23
                        </Typography>

                        <Typography
                            sx={{
                                ml: '1px',
                                fontSize: '14px',
                                textTransform: 'lowercase',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.PRODUCT.SOLD')}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            my: '5px',
                            padding: '18px',
                            backgroundColor: 'var(--background-color-secondary)',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                color: 'var(--primary-color)'
                            }}
                        >
                            125.000 VND
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '15px',
                                textDecoration: 'line-through',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            125.000 VND
                        </Typography>

                        <Typography
                            sx={{
                                padding: '5px 5px',
                                borderRadius: '5px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                backgroundColor: '#d7e8ff',
                                color: 'var(--primary-color)'
                            }}
                        >
                            -25%
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: 'var(--label-title-color)'
                        }}
                    >
                        Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97
                        lets you push your style full-speed ahead.
                    </Typography>

                    <Divider
                        sx={{
                            borderBottom: '1px dashed var(--border-color)',
                            width: '100%',
                            my: '10px',
                            height: '1px'
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '15px',
                                mt: '15px',
                                minWidth: '100px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.PRODUCT.COLOR')}
                        </Typography>

                        <Box
                            sx={{
                                maxHeight: '150px',
                                overflow: 'auto',
                                gap: '10px',
                                flexWrap: 'wrap',
                                display: 'flex'
                            }}
                        >
                            {colors.map((colorOption, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        padding: '8px 10px',
                                        gap: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: colorOption.hex,
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%'
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {colorOption.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            mt: '24px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '15px',
                                mt: '15px',
                                minWidth: '100px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.PRODUCT.PRODUCT_TYPE')}
                        </Typography>

                        <Box
                            sx={{
                                maxHeight: '150px',
                                overflow: 'auto',
                                gap: '10px',
                                flexWrap: 'wrap',
                                display: 'flex'
                            }}
                        >
                            {types.map((type, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        padding: '8px 10px',
                                        gap: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Avatar
                                        src={type.image}
                                        sx={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '5px'
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {type.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            mt: '24px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '15px',
                                mt: '10px',
                                minWidth: '100px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.PRODUCT.SIZE')}
                        </Typography>

                        <Box
                            sx={{
                                maxHeight: '150px',
                                overflow: 'auto',
                                gap: '10px',
                                flexWrap: 'wrap',
                                display: 'flex'
                            }}
                        >
                            {sizes.map((size, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        padding: '7px 10px',
                                        gap: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {size}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
                {/* Product Info */}
                {/* <div className='w-full md:w-1/2'>
                        <h1 className='text-3xl font-bold mb-2'>Classic Canvas Sneakers</h1>
                        <div className='flex items-center mb-4'>
                            <div className='flex text-yellow-400'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                            </div>
                            <span className='ml-2 text-gray-600'>(128 reviews)</span>
                        </div>

                        <div className='mb-6'>
                            <div className='text-2xl font-bold text-blue-600'>$89.99</div>
                            <div className='text-gray-500 line-through'>$129.99</div>
                        </div>

                        <div className='mb-6'>
                            <h3 className='text-lg font-semibold mb-2'>Color</h3>
                            <div className='flex space-x-3'>
                                {colors.map(colorOption => (
                                    <button
                                        key={colorOption.id}
                                        onClick={() => setColor(colorOption.id)}
                                        className={`w-10 h-10 rounded-full border-2 ${
                                            color === colorOption.id ? 'border-blue-600' : 'border-gray-300'
                                        }`}
                                        style={{ backgroundColor: colorOption.hex }}
                                        aria-label={`Select ${colorOption.name} color`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='mb-8'>
                            <h3 className='text-lg font-semibold mb-2'>Size</h3>
                            <div className='flex flex-wrap gap-2'>
                                {sizes.map(sizeOption => (
                                    <button
                                        key={sizeOption}
                                        onClick={() => setSize(sizeOption)}
                                        className={`w-12 h-10 flex items-center justify-center rounded border ${
                                            size === sizeOption
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 hover:border-blue-600'
                                        }`}
                                    >
                                        {sizeOption}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex space-x-4 mb-8'>
                            <button className='px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex-1'>
                                Add to Cart
                            </button>
                            <button className='p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-300'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className='border-t border-gray-200 pt-6'>
                            <h3 className='text-lg font-semibold mb-2'>Product Details</h3>
                            <ul className='list-disc list-inside text-gray-700 space-y-2'>
                                <li>Breathable canvas upper for lightweight comfort</li>
                                <li>Signature side stripe design</li>
                                <li>Padded collar for added comfort</li>
                                <li>Vulcanized rubber outsole for durability</li>
                                <li>Reinforced toe cap for extended wear</li>
                                <li>Cushioned footbed for all-day support</li>
                            </ul>

                            <div className='mt-6'>
                                <h3 className='text-lg font-semibold mb-2'>Shipping & Returns</h3>
                                <p className='text-gray-700'>
                                    Free shipping on orders over $50. Returns accepted within 30 days of purchase.
                                </p>
                            </div>
                        </div>
                    </div> */}
            </Box>

            <Paper
                sx={{
                    mt: '40px',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor='primary'
                    textColor='primary'
                    sx={{
                        maxHeight: '60px',
                        display: 'flex',
                        borderRadius: '15px 0 0 0',
                        borderBottom: '1px solid var(--border-color)',
                        alignItems: 'center',
                        '& .Mui-selected': {
                            backgroundColor: '#2c6cee !important',
                            color: 'white !important'
                        }
                    }}
                >
                    <Tab
                        label={t('COMMON.PRODUCT.DESCRIPTION')}
                        value='info'
                        iconPosition='start'
                        icon={
                            <UserCircleIcon
                                size={20}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                        }
                        sx={{
                            padding: '10px 24px',
                            color: 'var(--label-title-color)',
                            '&: hover': {
                                backgroundColor: 'var(--background-color-item-hover)'
                            },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    />
                    <Tab
                        label={t('COMMON.PRODUCT.REVIEWS')}
                        value='reviews'
                        iconPosition='start'
                        icon={
                            <ShoppingCartIcon
                                size={20}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                        }
                        sx={{
                            padding: '10px 24px',
                            color: 'var(--label-title-color)',
                            '&: hover': {
                                backgroundColor: 'var(--background-color-item-hover)'
                            },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    />
                </Tabs>

                {activeTab === 'info' && (
                    <Box
                        sx={{
                            margin: '24px'
                        }}
                    >
                        <div
                            className='mce-content-body tinymce-content'
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </Box>
                )}

                {activeTab === 'reviews' && (
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '24px',
                                gap: '120px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.AVERAGE_RATING')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '35px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    4.5/5
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '3px'
                                    }}
                                >
                                    <StarIcon size={22} color='#ffb81e' fill='#ffb81e' />
                                    <StarIcon size={22} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                                    <StarIcon size={22} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                                    <StarIcon size={22} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                                    <StarIcon size={22} color='#ffb81e' style={{ marginLeft: '2px' }} fill='#ffb81e' />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        mt: '5px',
                                        textTransform: 'lowercase',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    123 {t('COMMON.PRODUCT.REVIEWS')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        5 {t('COMMON.PRODUCT.STAR')}
                                    </Typography>

                                    <LinearProgress
                                        variant='determinate'
                                        value={20}
                                        sx={{
                                            backgroundColor: '#c9cbcd',
                                            borderRadius: '5px',
                                            width: '200px',
                                            height: '5px',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'var(--text-color)'
                                            }
                                        }}
                                    ></LinearProgress>

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--label-title-color)'
                                        }}
                                    >
                                        1.1k
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        4 {t('COMMON.PRODUCT.STAR')}
                                    </Typography>

                                    <LinearProgress
                                        variant='determinate'
                                        value={20}
                                        sx={{
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'var(--text-color)'
                                            },
                                            backgroundColor: '#c9cbcd',
                                            borderRadius: '5px',
                                            width: '200px',
                                            height: '5px'
                                        }}
                                    ></LinearProgress>

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--label-title-color)'
                                        }}
                                    >
                                        1.1k
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        3 {t('COMMON.PRODUCT.STAR')}
                                    </Typography>

                                    <LinearProgress
                                        variant='determinate'
                                        value={20}
                                        sx={{
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'var(--text-color)'
                                            },
                                            backgroundColor: '#c9cbcd',
                                            borderRadius: '5px',
                                            width: '200px',
                                            height: '5px'
                                        }}
                                    ></LinearProgress>

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--label-title-color)'
                                        }}
                                    >
                                        1.1k
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        2 {t('COMMON.PRODUCT.STAR')}
                                    </Typography>

                                    <LinearProgress
                                        variant='determinate'
                                        value={20}
                                        sx={{
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'var(--text-color)'
                                            },
                                            backgroundColor: '#c9cbcd',
                                            borderRadius: '5px',
                                            width: '200px',
                                            height: '5px'
                                        }}
                                    ></LinearProgress>

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--label-title-color)'
                                        }}
                                    >
                                        1.1k
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        1 {t('COMMON.PRODUCT.STAR')}
                                    </Typography>

                                    <LinearProgress
                                        variant='determinate'
                                        value={20}
                                        sx={{
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'var(--text-color)'
                                            },
                                            backgroundColor: '#c9cbcd',
                                            borderRadius: '5px',
                                            width: '200px',
                                            height: '5px'
                                        }}
                                    ></LinearProgress>

                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: 'var(--label-title-color)'
                                        }}
                                    >
                                        1.1k
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                backgroundColor: 'var(--border-color)',
                                borderStyle: 'dashed'
                            }}
                        ></Divider>

                        <Box
                            sx={{
                                padding: '30px 50px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '25px'
                            }}
                        >
                            {reviews.map((review, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        ':not(:last-child)': {
                                            paddingBottom: '20px',
                                            borderBottom: ' 1px solid var(--border-color)'
                                        },
                                        justifyContent: 'start',
                                        gap: '60px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexShrink: 0,
                                            gap: '8px',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Avatar
                                            src={review.avatar}
                                            alt={review.fullName}
                                            sx={{ width: 60, height: 60 }}
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                width: '100px',
                                                textAlign: 'center',
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {review.fullName}
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: '12px', color: 'var(--label-title-color)', mt: '-5px' }}
                                        >
                                            {review.reviewDate}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'start',
                                            justifyContent: 'start',
                                            gap: '10px',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '3px'
                                            }}
                                        >
                                            <StarIcon size={18} color='#ffb81e' fill='#ffb81e' />
                                            <StarIcon size={18} color='#ffb81e' fill='#ffb81e' />
                                            <StarIcon size={18} color='#ffb81e' fill='#ffb81e' />
                                            <StarIcon size={18} color='#ffb81e' fill='#ffb81e' />
                                            <StarIcon size={18} color='#ffb81e' fill='#ffb81e' />
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {review.comment}
                                        </Typography>

                                        {review.images && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <ImageGalleryThumbnail
                                                    images={review.images.map((image, index) => ({
                                                        id: index,
                                                        src: image,
                                                        alt: image.split('/').pop() || 'Image'
                                                    }))}
                                                />
                                            </Box>
                                        )}

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '22px'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    color: '#08ca08',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                <ThumbsUpIcon size={16} />
                                                <Typography sx={{ fontSize: '15px' }}>{review.likes}</Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    color: '#d50e0e',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                <ThumbsDownIcon size={16} />
                                                <Typography sx={{ fontSize: '15px' }}>{review.dislikes}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box display='flex' alignItems='center' justifyContent='space-between' padding='0px 50px 24px'>
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
                                                            backgroundColor:
                                                                'var(--background-color-item-hover) !important'
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
                    </Box>
                )}
            </Paper>
        </Box>
    )
}

export default ProductPage
