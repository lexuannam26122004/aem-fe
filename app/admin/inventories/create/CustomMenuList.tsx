import { components } from 'react-select'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

const CustomMenuList = (props: any) => {
    const { children, selectProps } = props
    const { isLoading } = selectProps

    const handleScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
        if (bottom && selectProps.onMenuScrollToBottom) {
            selectProps.onMenuScrollToBottom()
        }
    }

    return (
        <components.MenuList {...props} innerRef={undefined} onScroll={handleScroll}>
            {children}

            {isLoading && (
                <Box sx={{ px: 2, py: 2 }}>
                    {/* Fake loading sản phẩm */}
                    {[...Array(3)].map((_, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Skeleton variant='rectangular' width={40} height={40} sx={{ borderRadius: 2 }} />
                            <Box sx={{ ml: 2, flex: 1 }}>
                                <Skeleton variant='text' height={20} width='80%' />
                                <Skeleton variant='text' height={16} width='50%' sx={{ mt: 0.5 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </components.MenuList>
    )
}

export default CustomMenuList
