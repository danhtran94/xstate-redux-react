import { Interpreter, State, interpret, StateMachine } from "xstate";
import { pathOr } from "ramda";

import { createSpawnEvent, getActor } from "@/helpers/machine";

import { MachineStore, machineStore } from "./store";
import { machineQuery } from "./query";

export class MachineService {
  constructor(private machineStore: MachineStore) {}

  addService({ name, service, watch }: { name: string; service: Interpreter<any, any>; watch?: boolean }): void {
    service
      .onTransition(mstate => {
        if (mstate.changed && watch) {
          this.updateState({ name, machineState: mstate });
        }
      })
      .onStop(() => {
        this.removeService(name);
      });

    const machineState = {
      service,
      state: service.state,
    };

    if (watch) {
      delete machineState.state;
    }

    this.machineStore.upsert(name, machineState);
  }

  updateState({ name, machineState }: { name: string; machineState: State<any, any> }): void {
    this.machineStore.update(name, machine => ({
      ...machine,
      state: machineState,
    }));
  }

  removeService(name: string): void {
    this.machineStore.remove(name);
  }

  regService(
    machine: StateMachine<any, any, any>,
    {
      parent,
      name,
      ref,
      watch = false,
      svcSetter,
    }: { parent?: string; name: string; ref?: string; watch?: boolean; svcSetter?: (svc) => void },
  ): Interpreter<any, any, any> {
    const stateMachines = machineQuery.getValue().entities;

    if (!parent) {
      const isExist = !!stateMachines[name];
      if (isExist) {
        return stateMachines[name].service;
      }

      const service = interpret(machine);
      this.addService({ name, service, watch });
      service.start();

      return service;
    }

    const [root, target] = getActor(stateMachines, parent);

    const child: Interpreter<any, any> = pathOr(undefined, [name], target.state.context);
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!child) {
      svcSetter(child);
      return target;
    }

    target.send(
      createSpawnEvent(machine, {
        name,
        ref,
        watch,
        svcSetter: (svc: Interpreter<any, any>) => {
          if (svc) {
            if (watch) {
              this.addService({ name, service: svc, watch: true });
            }
            svcSetter(svc);
          }
        },
      }),
    );

    return target;
  }
}

export const machineService = new MachineService(machineStore);
