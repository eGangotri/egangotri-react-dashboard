import { BURGUNDY_RED_TW, LIGHT_YELLOW_TW, PARTIAL_SUCCESS_AMBER_TW, SUCCESS_GREEN_TW } from "constants/colors"
import { UploadCycleTableData } from "mirror/types"

export const createBackgroundForRow = (row: UploadCycleTableData) => {
    if ((row?.allUploadVerified === false) && (row?.countIntended !== row?.totalCount)) {
        return PARTIAL_SUCCESS_AMBER_TW
    }
    if (row?.countIntended !== row?.totalCount) {
        return LIGHT_YELLOW_TW
    }
    if (row?.allUploadVerified === true) {
        return SUCCESS_GREEN_TW
    }
    if (row?.allUploadVerified === false) {
        return BURGUNDY_RED_TW
    }
}

export const checkCountEquality = (row: UploadCycleTableData) => {
    return (row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)
}

