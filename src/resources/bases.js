const types = {
  update: "bases/UPDATE",
  add: "bases/ADD"
};

export const mutations = {
  updateBases: bases => ({ type: types.update, payload: bases }),
  addBase: base => ({ type: types.add, payload: base })
};

const initial = [];

const basesReducer = (state = initial, { type, payload }) => {
  switch (type) {
    case `${types.update}`:
      return [...payload];
    case `${types.add}`:
      return [...state, payload];
  }

  return state;
};

export default basesReducer;
