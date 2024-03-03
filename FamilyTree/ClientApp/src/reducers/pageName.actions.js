export const CHANGE_PAGE_NAME = 'CONFIRM_DIALOG/SHOW'

export function changePageName(pageName) {
    return {
        type: CHANGE_PAGE_NAME,
        pageName
    }
}

