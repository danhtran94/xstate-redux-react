import { UserStore, userStore } from "./store";

export class UserService {
  constructor(private userStore: UserStore) {}

  saveCredential({ idTokenPayload, accessToken }: { idTokenPayload: string; accessToken: string }) {
    this.userStore.update(state => ({ ...state, idTokenPayload, accessToken }));
  }
}

export const userService = new UserService(userStore);
