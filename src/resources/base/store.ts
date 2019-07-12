import { EntityStore, EntityState, StoreConfig } from "@datorama/akita";
import { Base } from "./domain";

export interface BaseSchema extends EntityState<Base, string> {}

@StoreConfig({
  name: "base",
})
export class BaseStore extends EntityStore<BaseSchema> {
  constructor() {
    super();
  }
}

export const baseStore = new BaseStore();
