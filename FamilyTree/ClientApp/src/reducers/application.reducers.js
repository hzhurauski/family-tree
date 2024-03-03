import {
    SHOW_LOADER,
    HIDE_LOADER,
    SET_BIGSCALE,
    REMOVE_BIGSCALE
} from './application.actions'

const initialState = {
    loading: true,
    bigScale: false
}

export default function confirmDialog(state = initialState, action) {
    switch (action.type) {
        case SHOW_LOADER:
            return {
                ...state,
                loading: true
            }
        case HIDE_LOADER:
            return {
                ...state,
                loading: false
            }      
        case SET_BIGSCALE:
            return {
                ...state,
                bigScale: true
            }
        case REMOVE_BIGSCALE:
            return {
                ...state,
                bigScale: false
            }
        default:
            return state
    }
}
