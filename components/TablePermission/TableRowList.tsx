import { TableCell, TableRow, Typography } from '@mui/material'
import deepEqual from 'deep-equal'
import { Fragment, memo, useMemo } from 'react'
import { IFunctions, ITablePermission } from '@/models/TablePermissionModel'
import CustomListTable from './TableList'
import CustomTableCellCheckbox from './TableCellCheckbox'
import TableCellLabel from './TableCellLabel'

interface Props {
    data: ITablePermission
    level?: number
}

const keyNames: (keyof IFunctions)[] = [
    'isAllowAll',
    'isAllowView',
    'isAllowEdit',
    'isAllowCreate',
    'isAllowPrint',
    'isAllowDelete'
]

function TableRowList({ data, level = 0 }: Props) {
    const isCheckBox = useMemo(() => {
        if (data.parentId) {
            return true
        } else {
            return false
        }
    }, [data.parentId])

    return (
        <>
            <TableRow
                key={data.name}
                sx={{
                    background: !isCheckBox
                        ? 'var(--background-color-secondary)' //'rgb(83 173 247 / 10%)'
                        : 'var(--background-color-item)'
                }}
            >
                <TableCell component='th' scope='row' sx={{ color: 'var(--text-color)' }}>
                    <Typography sx={{ paddingLeft: 6 * level }}>{data.name}</Typography>
                </TableCell>

                {data.pathTo.includes('statistics') ? (
                    <>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        {data.name === 'Statistics' ? (
                            <TableCellLabel id={Number(data.id || 0)} keyName={'isAllowView'} />
                        ) : (
                            <Fragment key={'isAllowView'}>
                                <CustomTableCellCheckbox
                                    id={Number(data.id || 0)}
                                    checked={data.function?.['isAllowView'] || false}
                                    keyName={'isAllowView'}
                                />
                            </Fragment>
                        )}
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                    </>
                ) : (
                    keyNames.map(item => (
                        <Fragment key={item}>
                            {isCheckBox ? (
                                <CustomTableCellCheckbox
                                    id={Number(data.id || 0)}
                                    checked={data.function?.[item] || false}
                                    keyName={item}
                                />
                            ) : (
                                <TableCellLabel id={Number(data.id || 0)} keyName={item} />
                            )}
                        </Fragment>
                    ))
                )}
            </TableRow>

            <CustomListTable data={data?.children || []} level={level + 1} />
        </>
    )
}

export default memo(TableRowList, (prevProps: Props, currentProps: Props) => {
    return deepEqual(prevProps.data, currentProps.data)
})
