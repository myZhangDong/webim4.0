import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createLogger } from "redux-logger";
import thunk from 'redux-thunk'
import { loginReducer } from "./login";
import { commonReducer } from "./common"
import { messageReducer } from "./message"
import { rosterReducer } from "./roster"
import { sessionReducer } from './session'
import './webim'
const logger = createLogger(); // initialize logger
const rootReducer = combineReducers({
    login: loginReducer,
    common: commonReducer,
    message: messageReducer,
    roster: rosterReducer,
    session: sessionReducer
})
const middlewares = [thunk, logger]

// const store = createStore(rootReducer, compose(
//     applyMiddleware(...middlewares),
//     window.devToolsExtension ? window.devToolsExtension() : f => f
// ))


const store = createStore(rootReducer, applyMiddleware(...middlewares))

export default store

