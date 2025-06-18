import { createSelector, createSlice } from '@reduxjs/toolkit'
import deepMerge from 'deepmerge'
import { IFunctions, ITablePermission, ITableTempData } from '@/models/TablePermissionModel'
import { RootState } from '@/redux/store'

const initialState: {
    defaultData: any[]
    role: ITablePermission[]
    function: any
} = {
    defaultData: [],
    role: [],
    function: []
}

const customDeepMerge = (a: ITablePermission[], b: ITablePermission[]) => {
    const cloneA = structuredClone(a)
    b.forEach(itemB => {
        // find a that matches id b
        const findA = cloneA.find(itemA => itemA.id === itemB.id)
        if (findA) {
            findA.function = itemB.function
        }
    })

    return cloneA
}

const customDeepMergeForAPI = (a: any[], b: any[]) => {
    const cloneA = structuredClone(a)
    const cloneB = b
    cloneB.forEach(itemB => {
        // find a that matches id b

        const findA = cloneA.find(itemA => itemA.controllerName === itemB.controllerName)
        if (findA) {
            findA.isCheckedCtrl = itemB.isCheckedCtrl
            findA.permissionModels = itemB.permissionModels
        }
    })

    return cloneA
}

const cleanDoubleElementArray = (array: any) => {
    const input = [...array]
    const seen = new Set()
    const uniqueArray = input.filter((el: any) => {
        const duplicate = seen.has(el.id)
        seen.add(el.id)

        return !duplicate
    })

    return uniqueArray
}

export const tablePermissionSlice = createSlice({
    name: 'tablePermission',
    initialState,
    reducers: {
        addDefaultData: (state, action) => {
            const input = action.payload
            state.defaultData.length = 0
            state.function.length = 0
            state.role.length = 0
            state.defaultData.push(...input)
            state.function.push(...input)
            state.role.push(...input)
        },

        addRoleData: (state, action) => {
            if (action.payload.length > 0) {
                const defaultDataNoProxy = JSON.parse(JSON.stringify(state.defaultData))
                const mergeData: ITablePermission[] = deepMerge(defaultDataNoProxy, JSON.parse(action.payload), {
                    arrayMerge: customDeepMerge
                })
                const modifyData = cleanDoubleElementArray(mergeData)
                state.role.length = 0
                state.role.push(...modifyData)
            }
        },

        addFunctionData: (state, action) => {
            if (action.payload.length > 0) {
                const defaultDataNoProxy = JSON.parse(JSON.stringify(state.defaultData))
                const mergeData: any[] = deepMerge(defaultDataNoProxy, JSON.parse(action.payload), {
                    arrayMerge: customDeepMergeForAPI
                })

                state.function.length = 0
                state.function.push(...mergeData)
            }
        },

        cleanData: state => {
            state.defaultData = []
            state.function = []
            state.role = []

            return state
        },

        updateDataByCheckBox: (state, action) => {
            const { id, data } = action.payload.value
            const find = state.role.find((item: any) => item.id === id)
            if (find && find.function) {
                const updatedPermission = { ...find.function, ...data }

                const { isAllowView, isAllowEdit, isAllowCreate, isAllowPrint, isAllowDelete } = updatedPermission

                const updatedPermissionWithAllowAll = {
                    ...updatedPermission,
                    isAllowAll: isAllowView && isAllowEdit && isAllowCreate && isAllowPrint && isAllowDelete
                }
                const updatedData = state.role.map((item: any) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            function: updatedPermissionWithAllowAll
                        }
                    }

                    return item
                })

                return {
                    ...state,
                    role: updatedData
                }
            }
        },

        updateDataByCheckAll: (state, action) => {
            const { parentId, keyName, value } = action.payload
            const getAllDataById = (data: ITablePermission[], parentId?: number) => {
                data.filter((item: ITablePermission) => item.parentId === parentId).forEach(
                    (item: ITablePermission) => {
                        if (item.function) {
                            if (keyName === 'isAllowAll') {
                                item.function = {
                                    isAllowAll: value,
                                    isAllowView: value,
                                    isAllowEdit: value,
                                    isAllowCreate: value,
                                    isAllowPrint: value,
                                    isAllowDelete: value
                                }
                            } else {
                                item.function = { ...item.function, [keyName]: value }

                                const { isAllowView, isAllowEdit, isAllowCreate, isAllowPrint, isAllowDelete } =
                                    item.function
                                if (isAllowView && isAllowEdit && isAllowCreate && isAllowPrint && isAllowDelete) {
                                    item.function = { ...item.function, isAllowAll: true }
                                } else {
                                    item.function = { ...item.function, isAllowAll: false }
                                }
                            }
                        }
                        getAllDataById(data, item.id)
                    }
                )
            }

            getAllDataById(state.role, parentId)
        }
    }
})

// selectors
const tablePermissionForRoleSelector = (state: RootState) => state.tablePermission.role
const tablePermissionForFunctionSelector = (state: RootState) => state.tablePermission.function

const customDataByIdSelector = (state: RootState, parentId?: number) => {
    let result: ITableTempData[] = []
    state.tablePermission.role
        .filter((item: ITablePermission) => item.parentId === parentId)
        .forEach((item: ITablePermission) => {
            if (item.function) {
                result.push({ id: item.id, data: item.function })
            }
            result = result.concat(customDataByIdSelector(state, item.id))
        })

    return result
}
const getStatusChecked = (data: ITableTempData[], keyName: keyof IFunctions) => {
    return data.every(item => {
        if (!item?.data) {
            return true
        }

        return item.data?.[keyName]
    })
}
const checkStatusByIdSelector = (state: RootState, parentId: number, keyName: keyof IFunctions) => {
    const data = customDataByIdSelector(state, parentId)
    const allow = getStatusChecked(data, keyName)
    const ids = data.map(e => e.id)

    return { allow, ids }
}

// createSelectors
export const getPermissionForRoleSelector = createSelector(tablePermissionForRoleSelector, data => data)
export const getPermissionForFunctionSelector = createSelector(tablePermissionForFunctionSelector, data => data)
export const getDataPermissionByParentSelector = createSelector(checkStatusByIdSelector, result => result)
