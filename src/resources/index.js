import { connectAdvanced } from "react-redux";
import {
  createStore,
  combineReducers
  // applyMiddleware, compose
} from "redux";
import { createSpawnEvent, getSvc } from "@/helpers/machine";
import basesReducer from "./bases";
import xstatesReducer from "./xstates";

/**
 * Create redux store
 */
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
const store = createStore(
  combineReducers({
    xstates: xstatesReducer,
    bases: basesReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const customConnect = (selectorFactory, connectOptions) => {
  const binder = machineHandler =>
    machineHandler({ getState: store.getState, dispatch: store.dispatch });

  return connectAdvanced(selectorFactory, {
    ...connectOptions,
    bindStoreToHandler: binder,
    regChildService: (machineHandler, { parent, name, ref }) => {
      const machine = binder(machineHandler);

      const parentService = getSvc(store.getState, parent);
      parentService.send(
        createSpawnEvent(machine, {
          name,
          ref
        })
      );
    }
  });
};

export default store;
