const types = {
  update: "bases/UPDATE",
  add: "bases/ADD"
};

const mutations = {
  updateBases: bases => ({ type: types.update, payload: bases }),
  addBase: base => ({ type: types.add, payload: base })
};

export const basesMutations = mutations;

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
