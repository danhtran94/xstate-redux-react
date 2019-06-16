import { assign, spawn } from "xstate";
import { mutations } from "@/resources/xstates";

export const objNameCreator = machineName => ({
  State: name => `x/${machineName}/${name}`,
  Guard: name => `xgrd_${machineName}_${name}`,
  Event: name => `xevt/${machineName}/${name}`,
  Action: name => `xact_${machineName}#${name}`,
  Acti: name => `xatv/${machineName}/${name}`,
  Service: name => `xsvc_${machineName}#${name}`
});

const spawnEvent = "SPAWN_MACHINE";

export const createSpawnEvent = (machine, { name, ref }) => ({
  type: spawnEvent,
  machine: machine,
  name: name,
  refName: ref
});

export const spawnAndStore = ["spawnMachine", "storeMachine"];

export const spawnEventLogic = {
  [spawnEvent]: {
    actions: spawnAndStore
  }
};

export const syncSpawnedReduxActs = dispatch => ({
  spawnMachine: assign((ctx, evt) => ({
    [evt.refName]: spawn(evt.machine, evt.name)
  })),
  storeMachine: (ctx, evt) => {
    dispatch(
      mutations.addService({
        name: evt.name,
        service: ctx[evt.refName]
      })
    );

    ctx[evt.refName].onTransition(currentState => {
      if (currentState.changed) {
        dispatch(
          mutations.update({
            name: evt.name,
            state: currentState
          })
        );
      }
    });
  }
});

export const getSvc = (fromState, name) => fromState().xstates[name].service;
export const getState = (fromState, name) => fromState().xstates[name].state;
