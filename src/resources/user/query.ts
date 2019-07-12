import { Query } from "@datorama/akita";
import { UserStore, userStore } from "./store";
import { User } from "./domain";

export class UserQuery extends Query<User> {
  constructor(protected store: UserStore) {
    super(store);
  }

  getCurrentUser$ = this.select();
}

export const userQuery = new UserQuery(userStore);
