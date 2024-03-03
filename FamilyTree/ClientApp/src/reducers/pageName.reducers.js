import {
    CHANGE_PAGE_NAME,
} from './pageName.actions'

const initialState = {
    pageName: ''
}

export default function confirmDialog(state = initialState, action) {
    switch (action.type) {
        case CHANGE_PAGE_NAME:
            return {
                ...state,
                pageName: action.pageName
            }
        default:
            return state
    }
}
