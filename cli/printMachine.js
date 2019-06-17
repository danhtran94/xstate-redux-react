const util = require("util");

const objNameCreator = machineName => ({
  State: name => `x/${machineName}/${name}`,
  Guard: name => `xgrd_${machineName}_${name}`,
  Event: name => `xevt/${machineName}/${name}`,
  Action: name => `xact_${machineName}#${name}`,
  Acti: name => `xatv/${machineName}/${name}`,
  Service: name => `xsvc_${machineName}#${name}`
});

const machineName = "base-list";
const name = objNameCreator(machineName);

const events = {
  RELOAD: name.Event("RELOAD"),
  CREATE_BASE: name.Event("CREATE_BASE"),
  ADDED_BASE: name.Event("ADDED_BASE")
};

const guardTypes = {
  shouldCreateNew: name.Guard("shouldCreateNew")
};

const actionTypes = {
  beginCreateBase: name.Action("BEGIN_CREATE_BASE"),
  receiveBasesData: name.Action("RECEIVE_BASES_DATA")
};

const activities = {
  CREATING_BASE: name.Acti("CREATING_BASE")
};

const serviceTypes = {
  fetchBases: name.Service("FETCH_BASE")
};

const states = {
  INIT: name.State("INIT"),
  EMPTY: name.State("EMPTY"),
  NEW: name.State("NEW"),
  LOADING: name.State("LOADING"),
  SUCCESS: name.State("SUCCESS"),
  ERROR: name.State("ERROR")
};

const config = {
  id: machineName,
  initial: states.INIT,
  states: {
    [states.INIT]: {
      on: {
        "": states.LOADING
      }
    },
    [states.LOADING]: {
      invoke: {
        src: serviceTypes.fetchBases,
        onDone: {
          target: states.SUCCESS
        },
        onError: states.ERROR
      }
    },
    [states.ERROR]: {
      on: {
        [events.RELOAD]: states.LOADING
      }
    },
    [states.SUCCESS]: {
      on: {
        "": {
          cond: { type: guardTypes.shouldCreateNew },
          target: states.EMPTY
        },
        [events.CREATE_BASE]: {
          actions: [actionTypes.beginCreateBase]
        }
      }
    },
    [states.EMPTY]: {
      on: {
        [events.ADDED_BASE]: {
          target: states.SUCCESS
        },
        [events.CREATE_BASE]: {
          actions: [actionTypes.beginCreateBase]
        }
      }
    }
  }
};

console.log(util.inspect(config, { showHidden: false, depth: null }));
