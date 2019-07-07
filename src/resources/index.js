import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import basesReducer from "./bases";
import xstatesReducer, { xstateMiddleware } from "./xstates";
import userReducer from "./user";

/**
 * Create redux store
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
const store = createStore(
  combineReducers({
    xstates: xstatesReducer,
    bases: basesReducer,
    user: userReducer
  }),
  composeEnhancers(applyMiddleware(xstateMiddleware))
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
