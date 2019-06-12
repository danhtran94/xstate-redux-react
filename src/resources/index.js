import { Machine, interpret } from "xstate";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { objNameCreator } from "@/helpers/machine";

import basesReducer from "./bases";

/**
 * Root statechart machine
 */
const name = objNameCreator("root");
const states = {
  INIT: name.State("INIT"),
  STARTED: name.State("STARTED"),
  ERROR: name.State("ERROR")
};

let rootMachine = Machine({
  initial: states.INIT,
  states: {
    [states.INIT]: {
      invoke: {
        src: serviceTypes.fetchBases,
        onDone: states.STARTED,
        onError: states.ERROR
      }
    },
    [states.STARTED]: {},
    [states.ERROR]: {}
  }
});
/**
 * END Root statechart machine
 */

/**
 * Reducer to store xstate state + service
 */
const UPDATE = "@@xstate/UPDATE";
function xstateReducer(state = null, action) {
  if (action.type === UPDATE) {
    return action.payload;
  }
  return state;
}

const INIT_SVC = "@@xservice/INIT";
function xserviceReducer(state = null, action) {
  if (action.type === INIT_SVC) {
    return action.payload;
  }
  return state;
}

/**
 * Create redux store
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
const store = createStore(
  combineReducers({
    xstate: xstateReducer,
    xservice: xserviceReducer,
    bases: basesReducer
  }),
  composeEnhancers(applyMiddleware(...[]))
);

/**
 * Inject redux method into xstate machine
 */
const initRootMachine = rootMachine.withContext({
  redux: {
    getState: store.getState,
    dispatch: store.dispatch
  }
});

/**
 * Sync xstate service state with redux
 */
const rootService = interpret(initRootMachine).onTransition(state => {
  if (state.changed) {
    store.dispatch({ type: UPDATE, payload: state });
  }
});
rootService.start();

/**
 * Inject xstate service + state into redux store
 */
store.dispatch({
  type: INIT_SVC,
  payload: rootService
});
store.dispatch({
  type: UPDATE,
  payload: rootService.initialState
});

export default store;
