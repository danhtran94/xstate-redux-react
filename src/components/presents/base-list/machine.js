import { Machine } from "xstate";
import { objNameCreator } from "@/helpers/machine";

export const machineName = "base-list";
const name = objNameCreator(machineName);

export const events = {
  RELOAD: name.Event("RELOAD"),
  CREATE_BASE: name.Event("CREATE_BASE"),
  ADDED_BASE: name.Event("ADDED_BASE")
};

export const guardTypes = {
  shouldCreateNew: name.Guard("shouldCreateNew")
};

export const actionTypes = {
  beginCreateBase: name.Action("BEGIN_CREATE_BASE"),
  receiveBasesData: name.Action("RECEIVE_BASES_DATA")
};

export const activities = {
  CREATING_BASE: name.Acti("CREATING_BASE")
};

export const serviceTypes = {
  fetchBases: name.Service("FETCH_BASE")
};

export const states = {
  INIT: name.State("INIT"),
  EMPTY: name.State("EMPTY"),
  NEW: name.State("NEW"),
  LOADING: name.State("LOADING"),
  SUCCESS: name.State("SUCCESS"),
  ERROR: name.State("ERROR")
};

const config = Machine({
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
          target: states.EMPTY,
          cond: { type: guardTypes.shouldCreateNew }
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
});

export default config;
