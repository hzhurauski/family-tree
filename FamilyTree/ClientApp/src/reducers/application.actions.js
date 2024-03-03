export const SHOW_LOADER = 'APP/SHOW_LOADER'
export const HIDE_LOADER = 'APP/HIDE_LOADER'
export const SET_BIGSCALE = 'APP/SET_BIGSCALE'
export const REMOVE_BIGSCALE = 'APP/REMOVE_BIGSCALE'

export function showAppLoader() {
    return {
        type: SHOW_LOADER
    }
}

export function hideAppLoader() {
    return {
        type: HIDE_LOADER
    }
}

export function setBigScale() {
    return {
        type: SET_BIGSCALE
    }
}

export function removeBigScale() {
    return {
        type: REMOVE_BIGSCALE
    }
}
