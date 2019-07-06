import { Machine } from "xstate";
import { objNameCreator } from "@/helpers/machine";

export const machineName = "page-login";
const name = objNameCreator(machineName);
// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {
  loginSuccess: name.Guard("loginSuccess")
};

// events
export const events = {
  DO_LOGIN: name.Event("DO_LOGIN")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  goToHomePage: name.Action("goToHomePage"),
  doLogin: name.Action("doLogin")
};

// services - external i/o operations
export const serviceTypes = {};

export const states = {
  INIT: name.State("INIT"),
  LOGIN: name.State("LOGIN"),
  LOGGED: name.State("LOGGED")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  context: {},
  states: {
    [states.INIT]: {
      initial: states.LOGIN,
      states: {
        [states.LOGIN]: {
          on: {
            [events.DO_LOGIN]: {
              // actions: [actionTypes.doLogin],
              // cond: [guardTypes.loginSuccess],
              target: states.LOGGED
            }
          }
        },
        [states.LOGGED]: {
          entry: [actionTypes.goToHomePage]
        }
      }
    }
  }
});
