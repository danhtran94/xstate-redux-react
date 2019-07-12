import { QueryEntity } from "@datorama/akita";
import { MachineSchema, MachineStore, machineStore } from "./store";

export class MachineQuery extends QueryEntity<MachineSchema> {
  constructor(protected store: MachineStore) {
    super(store);
  }
}

export const machineQuery = new MachineQuery(machineStore);
