const types = {
  add: "xstate/ADD",
  update: "xstate/UPDATE"
};

export const mutations = {
  addService: ({ name, service }) => ({
    type: types.add,
    payload: { name, service }
  }),
  update: ({ name, state }) => ({
    type: types.update,
    payload: { name, state }
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

export default xstatesReducer;
