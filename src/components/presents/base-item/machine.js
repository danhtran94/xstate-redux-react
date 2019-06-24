import { Machine } from "xstate";
import { objNameCreator } from "@/helpers/machine";

const machineName = "base-item";
const name = objNameCreator(machineName);

export const events = {
  DELETE: name.Event("DELETE")
};

export const guardTypes = {};

export const actionTypes = {
  notifyDeleted: name.Action("notifyDeleted"),
  notifyError: name.Action("notifyError")
};

export const activities = {};

export const serviceTypes = {
  removeBase: name.Service("removeBase")
};

export const states = {
  DEFAULT: name.State("DEFAULT"),
  REMOVING: name.State("REMOVING")
};

export default Machine({
  id: machineName,
  initial: states.DEFAULT,
  states: {
    [states.DEFAULT]: {
      on: {
        [events.DELETE]: {
          target: states.REMOVING
        }
      }
    },
    [states.REMOVING]: {
      invoke: {
        src: serviceTypes.removeBase,
        onDone: {
          actions: [actionTypes.notifyDeleted]
        },
        onError: {
          actions: [actionTypes.notifyError]
        }
      }
    }
  }
});
