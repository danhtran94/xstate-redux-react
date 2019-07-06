import { interpret } from "xstate";
import { dissocPath } from "ramda";
import { getNestedActor, createSpawnEvent } from "@/helpers/machine";

const types = {
  add: "xstate/ADD",
  update: "xstate/UPDATE",
  register: "xstate/REGISTER",
  remove: "xstate/REMOVE"
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
  regService: (handler, { parent, name, ref, watch, svcSetter }) => ({
    type: types.register,
    payload: { handler, parent, name, ref, watch, svcSetter }
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
      const {
        handler,
        parent,
        name,
        ref,
        watch = false,
        svcSetter = () => {}
      } = payload;
      const { xstates } = getState();
      const machine = handler({ dispatch, getState });

      if (!parent) {
        const isExist = !!xstates[name];
        if (isExist) {
          return xstates[name].service;
        }

        const service = interpret(machine)
          .onTransition(mstate => {
            if (mstate.changed && watch) {
              dispatch(mutations.update({ name, state: mstate }));
            }
          })
          .onStop(() => {
            dispatch(mutations.remove({ name }));
          });
        dispatch(mutations.addService({ name, service, watch }));
        service.start();
        return service;
      }

      const [root, target] = getNestedActor(getState, parent);
      const child = target.children.get(name);
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!child) {
        svcSetter(child);
        return target;
      }

      target.send(
        createSpawnEvent(machine, {
          name,
          ref,
          watch,
          svcSetter
        })
      );

      return target;
    }

    return next(action);
  };
};

export default xstatesReducer;
