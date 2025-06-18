'use client'

import Grid2 from '@mui/material/Grid2'
import PermissionForRole from './PermissionForRole'

const Permissions = () => {
    return (
        <Grid2 container spacing={3}>
            <Grid2 size={12}>
                <PermissionForRole />
            </Grid2>
        </Grid2>
    )
}

export default Permissions
