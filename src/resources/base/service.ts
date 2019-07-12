import { BaseStore, baseStore } from "./store";

export interface BaseMedia {
  id: string;
  name: string;
}

export type BaseMediaCollection = BaseMedia[];

export class BaseService {
  constructor(private baseStore: BaseStore) {}

  addBase({ id, name }: { id: string; name: string }) {
    this.baseStore.upsert(id, { id, name });
  }

  updateBases({ bases }: { bases: BaseMediaCollection }) {
    this.baseStore.set(bases);
  }
}

export const baseService = new BaseService(baseStore);
