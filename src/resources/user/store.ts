import { Store, StoreConfig } from "@datorama/akita";
import { User } from "./domain";

@StoreConfig({
  name: "user",
})
export class UserStore extends Store<User> {
  constructor() {
    super({});
  }
}

export const userStore = new UserStore();
