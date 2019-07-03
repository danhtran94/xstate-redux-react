import { assign, spawn } from "xstate";
import { useRef, useState, useEffect } from "react";

import { xstateMutations } from "@/resources/xstates";

export const objNameCreator = machineName => ({
  State: name => `x/${machineName}/${name}`,
  Guard: name => `xgrd_${machineName}_${name}`,
  Event: name => `xevt/${machineName}/${name}`,
  Action: name => `xact_${machineName}#${name}`,
  Acti: name => `xatv/${machineName}/${name}`,
  Service: name => `xsvc_${machineName}#${name}`
});

const spawnEvent = "SPAWN_MACHINE";

export const createSpawnEvent = (machine, { name, ref, watch, svcSetter }) => ({
  type: spawnEvent,
  machine: machine,
  name: name,
  refName: ref,
  watch,
  svcSetter
});

export const spawnAndStore = ["spawnMachine", "storeMachine"];

export const spawnEventLogic = {
  [spawnEvent]: {
    actions: spawnAndStore
  }
};

export const syncSpawnedReduxActs = dispatch => ({
  spawnMachine: assign((ctx, evt) => {
    return {
      [evt.refName]: spawn(evt.machine, {
        name: evt.name,
        sync: false
      })
    };
  }),
  storeMachine: (ctx, evt) => {
    if (evt.svcSetter) evt.svcSetter(ctx[evt.refName]);

    if (evt.watch) {
      dispatch(
        xstateMutations.addService({
          name: evt.name,
          service: ctx[evt.refName],
          watch: true
        })
      );
      ctx[evt.refName].onTransition(currentState => {
        if (currentState.changed) {
          dispatch(
            xstateMutations.update({
              name: evt.name,
              state: currentState
            })
          );
        }
      });
    }
  }
});

export const getSvc = (fromState, name) => {
  // console.log("get", name, "svc from store");
  return fromState().xstates[name].service;
};
/**
 * getNestedActor(getState, "page-bases.baseListRef.baseItemRef")
 **/
export const getNestedActor = (fromState, refSelector) => {
  const [root, ...refs] = refSelector.split(".");
  const rootSvc = getSvc(fromState, root);
  // console.log("getting actor refs", refs, "from", root);
  const targetSvc = refs.reduce((parentSvc, ref) => {
    // console.log("get", ref, "actor");
    return parentSvc.state.context[ref];
  }, rootSvc);
  return [rootSvc, targetSvc];
};
export const getState = (fromState, name) => fromState().xstates[name].state;

export const useActor = () => {
  const [svcState, setSvcState] = useState(undefined);

  const service = useRef(undefined);
  const setService = svc => {
    service.current = svc;
  };

  useEffect(() => {
    const svc = service.current;

    if (svc) {
      setSvcState(svc.state);

      const listener = state => {
        if (state.changed) {
          setSvcState(state);
        }
      };

      svc.onTransition(listener);

      return () => {
        svc.off(listener);
      };
    }
  }, [!!service.current]);

  return [svcState, service.current, setService];
};
