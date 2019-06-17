const config = {
  id: "base-list",
  initial: "x/base-list/INIT",
  states: {
    "x/base-list/INIT": { on: { "": "x/base-list/LOADING" } },
    "x/base-list/LOADING": {
      invoke: {
        src: "xsvc_base-list#FETCH_BASE",
        onDone: { target: "x/base-list/SUCCESS" },
        onError: "x/base-list/ERROR"
      }
    },
    "x/base-list/ERROR": {
      on: { "xevt/base-list/RELOAD": "x/base-list/LOADING" }
    },
    "x/base-list/SUCCESS": {
      on: {
        "": {
          cond: { type: "xgrd_base-list_shouldCreateNew" },
          target: "x/base-list/EMPTY"
        },
        "xevt/base-list/CREATE_BASE": {
          actions: ["xact_base-list#BEGIN_CREATE_BASE"]
        }
      }
    },
    "x/base-list/EMPTY": {
      on: {
        "xevt/base-list/ADDED_BASE": { target: "x/base-list/SUCCESS" },
        "xevt/base-list/CREATE_BASE": {
          actions: ["xact_base-list#BEGIN_CREATE_BASE"]
        }
      }
    }
  }
};
