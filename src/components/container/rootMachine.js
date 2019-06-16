import { Machine } from "xstate";
import {
  objNameCreator,
  spawnEventLogic,
  syncSpawnedReduxActs
} from "@/helpers/machine";

export const machineName = "root";
const name = objNameCreator(machineName);

const states = {
  INIT: name.State("INIT"),
  STARTED: name.State("STARTED"),
  ERROR: name.State("ERROR")
};

export default ({ dispatch }) =>
  Machine(
    {
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
    },
    {
      actions: {
        ...syncSpawnedReduxActs(dispatch)
      }
    }
  );
