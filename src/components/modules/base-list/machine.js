import { Machine } from "xstate";
import { objNameCreator, spawnEventLogic } from "@/helpers/machine";

export const machineName = "base-list";
const name = objNameCreator(machineName);

export const events = {
  RELOAD: name.Event("RELOAD"),
  CREATE_BASE: name.Event("CREATE_BASE"),
  REMOVE_BASE: name.Event("REMOVE_BASE"),
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
  LOADING: name.State("LOADING"),
  SUCCESS: name.State("SUCCESS"),
  NORMAL: name.State("NORMAL"),
  ERROR: name.State("ERROR")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  context: {},
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
        ...spawnEventLogic,
        [events.CREATE_BASE]: {
          actions: [actionTypes.beginCreateBase]
        }
      },
      initial: states.NORMAL,
      states: {
        [states.NORMAL]: {
          on: {
            "": {
              cond: { type: guardTypes.shouldCreateNew },
              target: states.EMPTY
            },
            [events.REMOVE_BASE]: {
              actions: [actionTypes.beginCreateBase]
            }
          }
        },
        [states.EMPTY]: {
          on: {
            [events.ADDED_BASE]: {
              target: states.NORMAL
            }
            // [events.CREATE_BASE]: {
            //   actions: [actionTypes.beginCreateBase]
            // }
          }
        }
      }
    }
  }
});
