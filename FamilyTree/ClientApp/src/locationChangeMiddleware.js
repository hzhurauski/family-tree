// TODO in the future the payload might contain the previous location
/* Code from: https://github.com/ReactTraining/react-router/issues/1066#issuecomment-412907443 */
/* Also see: https://github.com/supasate/connected-react-router/pull/302/files */
import { LOCATION_CHANGE } from 'connected-react-router'

let previousLocation = ''

export default () => next => action => {
    if (action.type !== LOCATION_CHANGE) {
        return next(action)
    }

    const newAction = {
        ...action,
        payload: {
            ...action.payload,
            previousLocation
        }
    }

    previousLocation = action.payload.location
    return next(newAction)
}
