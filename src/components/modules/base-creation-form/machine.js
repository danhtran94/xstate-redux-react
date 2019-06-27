import { Machine, send } from "xstate";
import { objNameCreator } from "@/helpers/machine";

export const machineName = "base-creation-form";
const name = objNameCreator(machineName);

// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {
  shouldInvalid: name.Guard("SHOULD_INVALID"),
  shouldSuccess: name.Guard("SHOULD_SUCCESS")
};

// events
export const events = {
  CONFIRM: name.Event("CONFIRM"),
  CANCEL: name.Event("CANCEL"),
  RESTART: name.Event("RESTART"),
  RECEIVED_BASE: name.Event("RECEIVED_BASE"),
  _END: name.Event("_END")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  receiveBaseData: name.Action("RECEIVE_BASE_DATA"),
  reloadBases: name.Action("RELOAD_BASES")
};

// services - external i/o operations
export const serviceTypes = {
  createNewBase: name.Service("CREATE_NEW_BASE")
};

export const states = {
  INIT: name.State("INIT"),
  CREATING: name.State("CREATING"),
  ERROR: name.State("ERROR"),
  INVALID: name.State("INVALID"),
  SUCCESS: name.State("SUCCESS"),
  END: name.State("END")
};

export default Machine({
  id: machineName,
  initial: states.END,
  states: {
    [states.INIT]: {
      on: {
        [events.RESTART]: states.INIT,
        [events.CONFIRM]: states.CREATING,
        [events.CANCEL]: states.END
      }
    },
    [states.CREATING]: {
      invoke: {
        src: serviceTypes.createNewBase,
        onDone: states.SUCCESS,
        onError: states.ERROR
      },
      on: {
        [events.CANCEL]: states.END
      }
    },
    [states.ERROR]: {
      on: {
        [events.CANCEL]: states.END
      }
    },
    [states.SUCCESS]: {
      entry: [
        send(events._END, {
          delay: 1000
        }),
        actionTypes.reloadBases
      ],
      on: {
        [events._END]: states.END
      }
    },
    [states.END]: {
      on: {
        [events.RESTART]: states.INIT
      }
    }
  }
});
