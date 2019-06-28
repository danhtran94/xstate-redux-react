import { interpret } from "xstate";
import { dissocPath } from "ramda";
import { getNestedActor, createSpawnEvent } from "@/helpers/machine";

const types = {
  add: "xstate/ADD",
  update: "xstate/UPDATE",
  register: "xstate/REGISTER",
  remove: "xstate/REGISTER"
};

const mutations = {
  addService: ({ name, service, watch }) => ({
    type: types.add,
    payload: { name, service, watch }
  }),
  remove: ({ name }) => ({
    type: types.remove,
    payload: { name }
  }),
  update: ({ name, state }) => ({
    type: types.update,
    payload: { name, state }
  }),
  regService: (handler, { parent, name, ref, watch = true, setSvc }) => ({
    type: types.register,
    payload: { handler, parent, name, ref, watch, setSvc }
  })
};

export const xstateMutations = mutations;

const initial = {};

const xstatesReducer = (state = initial, { type, payload }) => {
  switch (type) {
    case `${types.add}`:
      if (payload.watch) {
        return {
          ...state,
          [payload.name]: {
            service: payload.service,
            state: payload.service.initialState
          }
        };
      }
      return {
        ...state,
        [payload.name]: {
          service: payload.service
        }
      };
    case `${types.remove}`:
      return dissocPath([payload.name], state);
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
      const { handler, parent, name, ref, watch, setSvc } = payload;
      const machine = handler({ dispatch, getState });

      if (!parent) {
        const service = interpret(machine)
          .onTransition(mstate => {
            if (mstate.changed && watch) {
              dispatch(mutations.update({ name, state: mstate }));
            }
          })
          .onDone(() => {
            dispatch(mutations.remove({ name }));
          });
        dispatch(mutations.addService({ name, service, watch }));

        service.start();
        return service;
      }

      const [root, target] = getNestedActor(getState, parent);
      target.send(
        createSpawnEvent(machine, {
          name,
          ref,
          watch,
          setSvc
        })
      );

      return root;
    }

    return next(action);
  };
};

export default xstatesReducer;
