import { Machine } from "xstate";
import { objNameCreator, spawnEventLogic } from "@/helpers/machine";

export const machineName = "app";
const name = objNameCreator(machineName);

const states = {
  INIT: name.State("INIT"),
  STARTED: name.State("STARTED"),
  ERROR: name.State("ERROR")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  context: {},
  states: {
    [states.INIT]: {
      on: {
        ...spawnEventLogic
      }
    }
  }
});
