import { Machine } from "xstate";
import { objNameCreator, spawnEventLogic } from "@/helpers/machine";

export const machineName = "page-bases-container";
const name = objNameCreator(machineName);
// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {};

// events
export const events = {
  SPAWN_BASE_CREATION_FORM: name.Event("SPAWN_BASE_CREATION_FORM"),
  SPAWN_BASE_LIST: name.Event("SPAWN_BASE_LIST")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  spawnMachine: name.Action("spawnMachine"),
  storeService: name.Action("storeService")
};

// services - external i/o operations
export const serviceTypes = {};

export const states = {
  INIT: name.State("INIT"),
  NORMAL: name.State("DEFAULT")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  context: {},
  states: {
    [states.INIT]: {
      on: {
        ...spawnEventLogic
      },
      initial: states.NORMAL,
      states: {
        [states.NORMAL]: {}
      }
    }
  }
});
