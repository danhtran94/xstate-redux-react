import { assign, spawn } from "xstate";
import { useService } from "@xstate/react";
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

export const createSpawnEvent = (machine, { name, ref, watch, setSvc }) => ({
  type: spawnEvent,
  machine: machine,
  name: name,
  refName: ref,
  watch,
  setSvc
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
    if (evt.setSvc) {
      evt.setSvc(ctx[evt.refName]);
    }
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
  const target = useRef();

  if (!target.current) {
    target.current = refs.reduce((parentSvc, ref) => {
      return parentSvc ? parentSvc.state.context[ref] : undefined;
    }, parentService);
  }

  if (target.current) {
    return [target.current.state, target.current.send];
  }

  return [parent, parentSend];
};

export const useChild = () => {
  const [current, setCurrent] = useState(undefined);
  const [svc, setSvc] = useState();
  useEffect(() => {
    if (svc) {
      setCurrent(svc.state);

      const listener = state => {
        if (state.changed) {
          setCurrent(state);
        }
      };

      svc.onTransition(listener);

      return () => {
        svc.off(listener);
      };
    }
  }, [svc]);
  return [current, svc ? svc.send : undefined, setSvc];
};
