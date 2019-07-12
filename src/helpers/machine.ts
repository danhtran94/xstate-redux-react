import { assign, spawn, Interpreter, State, StateMachine } from "xstate";
import { useRef, useState, useEffect } from "react";
import { HashMap } from "@datorama/akita";
import { pathOr } from "ramda";

import { MachineState } from "@/resources/machine/domain";

export const objNameCreator = (machineName: string) => ({
  State: (name: string) => `x/${machineName}/${name}`,
  Guard: (name: string) => `xgrd_${machineName}_${name}`,
  Event: (name: string) => `xevt/${machineName}/${name}`,
  Action: (name: string) => `xact_${machineName}#${name}`,
  Acti: (name: string) => `xatv/${machineName}/${name}`,
  Service: (name: string) => `xsvc_${machineName}#${name}`,
});

const spawnEvent = "SPAWN_MACHINE";

interface SpawnEvent {
  type: string;
  machine: StateMachine<any, any, any>;
  name: string;
  refName: string;
  watch: boolean;
  svcSetter: (svc: Interpreter<any, any>) => void;
}
export const createSpawnEvent = (
  machine: StateMachine<any, any, any>,
  {
    name,
    ref,
    watch,
    svcSetter,
  }: { name: string; ref: string; watch: boolean; svcSetter: (svc: Interpreter<any, any>) => void },
) =>
  ({
    type: spawnEvent,
    machine: machine,
    name: name,
    refName: ref,
    watch,
    svcSetter,
  } as SpawnEvent);

export const spawnAndStore = ["spawnMachine", "storeMachine"];

export const spawnEventLogic = {
  [spawnEvent]: {
    actions: spawnAndStore,
  },
};

export const syncSpawnedReduxActs = {
  spawnMachine: assign((_, evt: SpawnEvent) => {
    return {
      [evt.refName]: spawn(evt.machine, {
        name: evt.name,
        sync: false,
      }),
    };
  }),
  storeMachine: (ctx, evt: SpawnEvent) => {
    if (evt.svcSetter && ctx[evt.refName]) evt.svcSetter(ctx[evt.refName]);
  },
};

export const getSvc = (machines: HashMap<MachineState>, name) => {
  return pathOr(undefined, [name, "service"], machines) as Interpreter<any, any>;
};
/**
 * getActor(getState, "page-bases.baseListRef.baseItemRef")
 **/
export function getActor(machines: HashMap<MachineState>, refSelector: string) {
  const [root, ...refs] = refSelector.split(".");
  const rootSvc = getSvc(machines, root);
  const targetSvc = refs.reduce(
    ((parentSvc, ref) => {
      return pathOr(null, ["state", "context", ref], parentSvc);
    }) as (svc: Interpreter<any, any>, ref: string) => Interpreter<any, any>,
    rootSvc,
  );

  return [rootSvc, targetSvc];
}

export const useActor = () => {
  const [svcState, setSvcState] = useState<State<any, any>>(undefined);

  const service = useRef<Interpreter<any, any>>(undefined);
  const setService = (svc: Interpreter<any, any>) => {
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
