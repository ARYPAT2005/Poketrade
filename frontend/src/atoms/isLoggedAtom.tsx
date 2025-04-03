import { atomWithStorage } from "jotai/utils";

export const isLoggedAtom = atomWithStorage<boolean>("isLogged", true);
export const isRegisteredAtom = atomWithStorage<boolean>("isRegistered", true);
export const usernameAtom = atomWithStorage('username', '');