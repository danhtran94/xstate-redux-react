import { assign, spawn } from "xstate";
import { useService } from "@xstate/react";
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

export const createSpawnEvent = (
  machine,
  {
    name,
    ref
    // watch
  }
) => ({
  type: spawnEvent,
  machine: machine,
  name: name,
  refName: ref
  // watch
});

export const spawnAndStore = [
  "spawnMachine"
  // "storeMachine"
];

export const spawnEventLogic = {
  [spawnEvent]: {
    actions: spawnAndStore
  }
};

export const syncSpawnedReduxActs = dispatch => ({
  spawnMachine: assign((ctx, evt) => {
    console.log("spawning", evt.name);
    return {
      [evt.refName]: spawn(evt.machine, { name: evt.name, sync: true })
    };
  })
  // storeMachine: (ctx, evt) => {
  //   if (evt.watch) {
  //     // console.log("storing svc", evt.name);
  //     // dispatch(
  //     //   mutations.addService({
  //     //     name: evt.name,
  //     //     service: ctx[evt.refName]
  //     //   })
  //     // );
  //     // ctx[evt.refName].onTransition(currentState => {
  //     //   if (currentState.changed) {
  //     //     dispatch(
  //     //       mutations.update({
  //     //         name: evt.name,
  //     //         state: currentState
  //     //       })
  //     //     );
  //     //   }
  //     // });
  //   }
  // }
});

export const getSvc = (fromState, name) => {
  console.log("get", name, "svc from store");
  return fromState().xstates[name].service;
};
/**
 * getNestedActor(getState, "page-bases.baseListRef.baseItemRef")
 **/
export const getNestedActor = (fromState, refSelector) => {
  const [root, ...refs] = refSelector.split(".");
  const rootSvc = getSvc(fromState, root);
  console.log("getting actor refs", refs, "from", root);
  const targetSvc = refs.reduce((parentSvc, ref) => {
    console.log("get", ref, "actor");
    return parentSvc.state.context[ref];
  }, rootSvc);
  return [rootSvc, targetSvc];
};
export const getState = (fromState, name) => fromState().xstates[name].state;

export const useActor = (parentService, refSelector) => {
  const refs = refSelector.split(".");
  const [parent, parentSend] = useService(parentService);

  const target = refs.reduce((parentSvc, ref) => {
    return parentSvc.state.context[ref];
  }, parentService);

  if (target) {
    return [target.state, target.send];
  }
  return [parent, parentSend];
};
