const types = {
  update: "user/UPDATE",
  add: "user/ADD"
};

const mutations = {
  add: user => ({ type: types.add, payload: user }),
  update: user => ({ type: types.update, payload: user })
};

export const userMutations = mutations;

const initial = {
  isLogged: false
};

const userReducer = (state = initial, { type, payload }) => {
  switch (type) {
    case `${types.add}`:
      return { ...state, isLogged: true, ...payload };
    case `${types.update}`:
      return { ...payload };
  }

  return state;
};

export default userReducer;
