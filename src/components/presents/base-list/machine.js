import { Machine, send } from "xstate";
import { objNameCreator } from "../../../helpers/machine";

export const machineName = "base-list";
const name = objNameCreator(machineName);

// finite states
const INIT = name.State("INIT");
const EMPTY = name.State("EMPTY");
const LOADING = name.State("LOADING");
const SUCCESS = name.State("SUCCESS");
const ERROR = name.State("ERROR");
const NEW = name.State("NEW");

export const states = {
  INIT,
  EMPTY,
  NEW,
  LOADING,
  SUCCESS,
  ERROR
};

// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {
  shouldCreateNew: name.Guard("SHOULD_CREATE_NEW"),
  shouldShow: name.Guard("SHOULD_SHOW")
};

const guards = {
  [guardTypes.shouldCreateNew]: (ctx, { type, data }) => {
    // console.log(ctx, type);
    return ctx.bases.length === 0;
  },
  [guardTypes.shouldShow]: (ctx, { data }) => {
    console.log(ctx, data);
    return ctx.bases;
  }
};

// events
export const events = {
  RELOAD: name.Event("RELOAD"),
  INTERNAL_VALID: name.Event("INTERNAL_VALID"),
  CREATE_BASE: name.Event("CREATE_BASE")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  beginCreateBase: name.Action("BEGIN_CREATE_BASE"),
  updateBasesData: name.Action("UPDATE_BASES_DATA"),
  spawnBaseCreationForm: name.Action("SPAWN_BASE_CREATION_FORM")
};

const actions = {
  // [actionTypes.updateBasesData]: ctx => {
  //   return {
  //     ...ctx,
  //     bases: []
  //   };
  // }
};

// actives
export const activities = {
  CREATING_BASE: name.Acti("CREATING_BASE")
};

// services - external i/o operations
export const serviceTypes = {
  fetchBases: name.Service("FETCH_BASE"),
  createNewBase: name.Service("CREATE_NEW_BASE")
};

const services = {
  [serviceTypes.fetchBases]: ctx => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ bases: [] });
      }, 1000);
    });
  }
};

const config = Machine({
  id: machineName,
  initial: INIT,
  context: { bases: [] },
  states: {
    [INIT]: {
      onEntry: [
        actionTypes.spawnBaseCreationForm,
        send(events.INTERNAL_VALID, {
          delay: 1000
        })
      ],
      on: {
        [events.INTERNAL_VALID]: [
          {
            target: LOADING
            // cond: check_auth_token
          }
        ]
      }
    },
    [LOADING]: {
      invoke: {
        src: serviceTypes.fetchBases,
        onDone: SUCCESS,
        onError: ERROR
      }
    },
    [ERROR]: {
      on: {
        [events.RELOAD]: {
          target: LOADING
        }
      }
    },
    [SUCCESS]: {
      onEntry: actionTypes.updateBasesData,
      on: {
        "": {
          cond: guardTypes.shouldCreateNew,
          target: EMPTY
        }
      }
    },
    [EMPTY]: {
      on: {
        // [events.RELOAD]: {
        //   target: LOADING
        // },
        [events.CREATE_BASE]: {
          actions: [actionTypes.beginCreateBase]
        }
      }
    }
  }
})
  .withConfig({
    guards,
    actions,
    services
  })
  .withContext({
    bases: []
  });

export default config;
