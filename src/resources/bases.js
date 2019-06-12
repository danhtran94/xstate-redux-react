import {
  ImmerReducer,
  createActionCreators,
  createReducerFunction
} from "immer-reducer";

// reducers
class BasesReducer extends ImmerReducer {
  addBase(base) {
    this.draftState.data = [...this.state.data, base];
  }
  setBases(bases) {
    this.draftState.data = [...bases];
  }
}

export const basesActions = createActionCreators(BasesReducer);
const baseReducer = createReducerFunction(BasesReducer, { data: [] });

export default baseReducer;
