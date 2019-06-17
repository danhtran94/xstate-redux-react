import { interpret } from "xstate";
import { getSvc, createSpawnEvent } from "@/helpers/machine";

const types = {
  add: "xstate/ADD",
  update: "xstate/UPDATE",
  register: "xstate/REGISTER"
};

export const mutations = {
  addService: ({ name, service }) => ({
    type: types.add,
    payload: { name, service }
  }),
  update: ({ name, state }) => ({
    type: types.update,
    payload: { name, state }
  }),
  regService: (handler, { parent, name, ref }) => ({
    type: types.register,
    payload: { handler, parent, name, ref }
  })
};

const initial = {};

const xstatesReducer = (state = initial, { type, payload }) => {
  switch (type) {
    case `${types.add}`:
      return {
        ...state,
        [payload.name]: {
          service: payload.service,
          state: payload.service.initialState
        }
      };
    case `${types.update}`:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          state: payload.state
        }
      };
  }

  return state;
};

export const xstateMiddleware = ({ dispatch, getState }) => next => {
  return action => {
    const { type, payload } = action;
    if (type === types.register) {
      const { handler, parent, name, ref } = payload;
      const machine = handler({ dispatch, getState });

      if (!parent) {
        const service = interpret(machine).onTransition(mstate => {
          if (mstate.changed) {
            dispatch(mutations.update({ name, state: mstate }));
          }
        });
        dispatch(mutations.addService({ name, service }));

        service.start();
        return service;
      }

      const parentService = getSvc(getState, parent);
      parentService.send(
        createSpawnEvent(machine, {
          name,
          ref
        })
      );
      return getSvc(getState, name);
    }

    return next(action);
  };
};

export default xstatesReducer;
