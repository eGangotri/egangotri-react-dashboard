import { BURGUNDY_RED, LIGHT_RED, SUCCESS_GREEN } from "constants/colors"
import { UploadCycleTableData } from "mirror/types"

export const createBackgroundForRow = (row: UploadCycleTableData) => {
    if (row?.countIntended !== row?.totalCount) {
        return {
            backgroundColor: `${LIGHT_RED}`
        }
    }

    if (row?.allUploadVerified === true) {
        return {
            backgroundColor: `${SUCCESS_GREEN}`
        }
    }
    if (row?.allUploadVerified === false) {
        return {
            backgroundColor: `${BURGUNDY_RED}`
        }
    }
}

export const checkCountEquality = (row: UploadCycleTableData) => {
    const hasUploadCycleGlobalValues = (row?.countIntended || 0) > 0;
    const equality = hasUploadCycleGlobalValues ? ((row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)) : (row?.totalCount === row?.totalQueueCount)
    return {
        hasUploadCycleGlobalValues,
        equality: equality || row.allUploadVerified === false
       // equality: row?.allUploadVerified === true
    }
}

