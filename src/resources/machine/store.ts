import { EntityStore, EntityState, StoreConfig } from "@datorama/akita";
import { MachineState } from "./domain";

export interface MachineSchema extends EntityState<MachineState, string> {}

@StoreConfig({
  name: "machine",
  deepFreezeFn: state => state, // not freeze machines
})
export class MachineStore extends EntityStore<MachineSchema> {
  constructor() {
    super();
  }
}

export const machineStore = new MachineStore();
