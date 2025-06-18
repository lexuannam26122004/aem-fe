import { TableCell, Typography } from '@mui/material'
import { memo, useCallback } from 'react'
import { IFunctions } from '@/models/TablePermissionModel'
import { getDataPermissionByParentSelector, tablePermissionSlice } from '@/redux/slices/tablePermissionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

interface Props {
    id: number
    keyName: keyof IFunctions
}

let elementHoverSelectors: NodeListOf<Element> | any[] = []

function TableCellLabel({ id, keyName }: Props) {
    const dataSelectorCol = useSelector((state: RootState) => getDataPermissionByParentSelector(state, id, keyName))
    const dispatch = useDispatch()
    const { t } = useTranslation('common')
    const handleClick = useCallback(() => {
        dispatch(
            tablePermissionSlice.actions.updateDataByCheckAll({
                keyName,
                value: !dataSelectorCol.allow,
                parentId: id
            })
        )
    }, [dataSelectorCol.allow, dispatch, id, keyName])

    const handleMouseOver = () => {
        if (keyName === 'isAllowAll') {
            elementHoverSelectors = []

            dataSelectorCol.ids.map(id => {
                elementHoverSelectors = [
                    ...Array.from(elementHoverSelectors),
                    ...Array.from(document.querySelectorAll(`[data-hover^="${id}_"]`))
                ]
            })
        } else {
            elementHoverSelectors = dataSelectorCol.ids.map(id => {
                return document.querySelector(`[data-hover^="${id}_${keyName}"]`)
            })
        }

        if (elementHoverSelectors) {
            elementHoverSelectors.forEach(element => {
                const el = element as HTMLElement
                if (el) {
                    el.style.background = 'var(--background-color-item-hover)'
                }
            })
        }
    }

    const handleMouseLeave = () => {
        if (elementHoverSelectors) {
            elementHoverSelectors.forEach(element => {
                element?.removeAttribute('style')
            })
        }
    }

    return (
        <TableCell
            size='small'
            align='center'
            sx={{
                maxWidth: 100,
                minWidth: 100,
                paddingLeft: 1,
                paddingRight: 1,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'var(--background-color-item-hover)'
                }
            }}
            {...(id === 15 ? { 'data-hover': `${id}_${keyName}` } : {})}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <Typography p={1} sx={{ color: 'var(--text-color)' }}>
                {dataSelectorCol.allow ? t('COMMON.PERMISSION.UNSELECT_ALL') : t('COMMON.PERMISSION.SELECT_ALL')}
            </Typography>
        </TableCell>
    )
}

export default memo(TableCellLabel)
