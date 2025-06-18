function sortTable(array: any[], comparator: (a: any, b: any) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [any, number])
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order

        return a[1] - b[1]
    })

    return stabilizedThis?.map(el => el[0])
}

export function getComparator(order: 'asc' | 'desc', orderBy: string) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy)
}

export function descendingComparator(a: any, b: any, orderBy: string) {
    const lowerA = String(a[orderBy]).toLowerCase()
    const lowerB = String(b[orderBy]).toLowerCase()

    if (lowerB < lowerA) {
        return -1
    }
    if (lowerB > lowerA) {
        return 1
    }

    return 0
}
export default sortTable
