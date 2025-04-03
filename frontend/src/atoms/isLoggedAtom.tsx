import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isLoggedAtom = atomWithStorage<boolean>("isLogged", true);
export const usernameAtom = atom(""); 