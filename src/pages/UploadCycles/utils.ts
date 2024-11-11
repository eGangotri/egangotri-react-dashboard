import { BURGUNDY_RED_TW, LIGHT_YELLOW_TW, MISSED_AND_FAILED_TW as MISSED_AND_FAILED_RED_TW, PARTIAL_SUCCESS_LIME_YELLOW_TW, RED_TO_YELLOW as RED_TO_YELLOW_GRADIENT_TW, SUCCESS_GREEN_TW } from "constants/colors"
import { UploadCycleTableData } from "mirror/types"

export const createBackgroundForRow = (row: UploadCycleTableData) => {
    const countMatch = row?.countIntended === row?.totalCount;
   
    console.log(`row?.allUploadVerified && countMatch ${row?.allUploadVerified} && ${countMatch} -> ${row?.allUploadVerified && countMatch}`)

    if (row?.allUploadVerified === null && !countMatch) {
        return LIGHT_YELLOW_TW;
    }
    if (!row?.allUploadVerified && !countMatch) {
        return RED_TO_YELLOW_GRADIENT_TW
    }
    if (row?.allUploadVerified && !countMatch) {
        return LIGHT_YELLOW_TW
    }

    if (!row?.allUploadVerified) {
        return BURGUNDY_RED_TW
    }

    if (row?.allUploadVerified) {
        return SUCCESS_GREEN_TW
    }
}

export const checkCountEquality = (row: UploadCycleTableData) => {
    return (row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)
}

