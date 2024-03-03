import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'

import { initSagas } from './initSagas'
import createRootReducer from './reducers/rootReducer'
import locationChangeMiddleware from './locationChangeMiddleware'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory()

const createStoreWithMiddleware = composeWithDevTools(
    compose(
        applyMiddleware(
            routerMiddleware(history), // for dispatching history actions
            locationChangeMiddleware,
            sagaMiddleware
        )
    )
)(createStore)

export default function configureStore(initialState) {
    const rootReducer = createRootReducer(history) // root reducer with router state
    const store = createStoreWithMiddleware(rootReducer, initialState)
    initSagas(sagaMiddleware)
    return { store, history }
}
