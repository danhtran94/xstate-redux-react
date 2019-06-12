import { Machine, send } from "xstate";
import { objNameCreator } from "@/helpers/machine";

export const machineName = "base-creation-form";
const name = objNameCreator(machineName);

// finite states
const INIT = name.State("INIT");
const LOADING = name.State("LOADING");
const ERROR = name.State("ERROR");
const INVALID = name.State("INVALIDATION");
const SUCCESS = name.State("SUCCESS");
const END = name.State("END");

export const states = {
  INIT,
  LOADING,
  ERROR,
  INVALID,
  SUCCESS,
  END
};

// guards.js - conditional functions used to determine what the next step in the flow is
export const guardTypes = {
  shouldInvalid: name.Guard("SHOULD_INVALID"),
  shouldSuccess: name.Guard("SHOULD_SUCCESS")
};

const guards = {
  [guardTypes.shouldInvalid](ctx, { type, data }) {
    // console.log(ctx, type);
    return !data;
  },
  [guardTypes.shouldSuccess](ctx, { data }) {
    // console.log("shouldSuccess", ctx, data);
    return data;
  }
};

// events
export const events = {
  CONFIRM: name.Event("CONFIRM"),
  CANCEL: name.Event("CANCEL"),
  RESTART: name.Event("RESTART"),
  _END: name.Event("_END")
};

// actions.js - functions that perform an action like updating the stateful data in the app
export const actionTypes = {
  updateCreated: name.Action("UPDATE_CREATED"),
  updateBaseData: name.Action("UPDATE_BASE_DATA"),
  reloadBases: name.Action("RELOAD_BASES")
};

const actions = {
  [actionTypes.updateCreated](ctx, event) {
    // console.log(ctx, event);

    return {
      ...ctx,
      created: event.data
    };
  },
  [actionTypes.updateBaseData](ctx, event) {
    // console.log(ctx, event);

    return {
      ...ctx,
      created: undefined,
      base: event.base
    };
  }
};

// services - external i/o operations
export const serviceTypes = {
  createNewBase: name.Service("CREATE_NEW_BASE")
};

const services = {
  [serviceTypes.createNewBase](ctx, event) {
    // console.log("serviceTypes.createNewBase", ctx, event);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          id: 100,
          name: event.base.name
        });
      }, 1000);
    });
  }
};

const config = Machine({
  id: machineName,
  initial: END,
  states: {
    [INIT]: {
      on: {
        [events.RESTART]: INIT,
        [events.CONFIRM]: [
          {
            target: LOADING,
            actions: [actionTypes.updateBaseData]
          }
        ],
        [events.CANCEL]: END
      }
    },
    [LOADING]: {
      invoke: {
        src: serviceTypes.createNewBase,
        onDone: [
          {
            cond: guardTypes.shouldSuccess,
            target: SUCCESS,
            actions: [actionTypes.updateCreated]
          },
          {
            cond: guardTypes.shouldInvalid,
            target: INVALID
          }
        ],
        onError: ERROR
      },
      on: {
        [events.CANCEL]: END
      }
    },
    [ERROR]: {
      on: {
        [events.CANCEL]: END
      }
    },
    [SUCCESS]: {
      onEntry: [
        send(events._END, {
          delay: 1000
        }),
        actionTypes.reloadBases
      ],
      on: {
        [events._END]: END
      }
    },
    [INVALID]: {
      on: {
        [events.CANCEL]: END
      }
    },
    [END]: {
      on: {
        [events.RESTART]: INIT
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
