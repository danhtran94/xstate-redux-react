import { QueryEntity } from "@datorama/akita";
import { BaseSchema, BaseStore, baseStore } from "./store";

class BaseQuery extends QueryEntity<BaseSchema> {
  constructor(protected store: BaseStore) {
    super(store);
  }

  selectBases$ = this.selectAll();
}

export const baseQuery = new BaseQuery(baseStore);
