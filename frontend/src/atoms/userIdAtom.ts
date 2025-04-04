import { atomWithStorage } from "jotai/utils";

const userIdAtom = atomWithStorage<string | null>("userId", null);

export default userIdAtom;
