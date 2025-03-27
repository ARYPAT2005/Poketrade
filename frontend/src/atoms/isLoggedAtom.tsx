import { atomWithStorage } from "jotai/utils";

export const isLoggedAtom = atomWithStorage<boolean>("isLogged", true);
