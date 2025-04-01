import { atomWithStorage } from "jotai/utils";

export const userIdAtom = atomWithStorage<string | null>("userId", null);
