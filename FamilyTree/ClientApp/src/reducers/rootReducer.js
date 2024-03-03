import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import pageName from './pageName.reducers'
import application from './application.reducers'

export default (history) => combineReducers({
    router: connectRouter(history),
    pageName,
    application
})
