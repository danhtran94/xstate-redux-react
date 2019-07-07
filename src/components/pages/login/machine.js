import { Machine } from "xstate";
import { objNameCreator } from "@/helpers/machine";

export const machineName = "page-login";
const name = objNameCreator(machineName);
// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {
  loginSuccess: name.Guard("loginSuccess"),
  loginFail: name.Guard("loginFail")
};

// events
export const events = {
  DO_LOGIN: name.Event("DO_LOGIN"),
  AUTH0_HOOK: name.Event("AUTH0_HOOK")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  goToHomePage: name.Action("goToHomePage"),
  auth0Cb: name.Action("auth0Cb")
};

// services - external i/o operations
export const serviceTypes = {
  doLogin: name.Service("doLogin")
};

export const states = {
  INIT: name.State("INIT"),
  LOGIN: name.State("LOGIN"),
  LOGGING: name.State("LOGGING"),
  LOGGED: name.State("LOGGED")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  context: {},
  states: {
    [states.INIT]: {
      entry: actionTypes.auth0Cb,
      initial: states.LOGIN,
      states: {
        [states.LOGIN]: {
          on: {
            [events.DO_LOGIN]: {
              target: states.LOGGING
            }
          }
        },
        [states.LOGGING]: {
          invoke: {
            src: serviceTypes.doLogin,
            onDone: [
              {
                cond: guardTypes.loginSuccess,
                target: states.LOGGED
              },
              {
                cond: guardTypes.loginFail,
                target: states.LOGIN
              }
            ],
            onError: states.LOGIN
          }
        },
        [states.LOGGED]: {
          entry: [actionTypes.goToHomePage]
        }
      }
    }
  }
});
