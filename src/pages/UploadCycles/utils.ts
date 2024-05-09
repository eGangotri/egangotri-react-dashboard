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
    return (row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)
}

