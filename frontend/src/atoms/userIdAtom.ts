import { atomWithStorage } from "jotai/utils";

const userIdAtom = atomWithStorage<string | null>("userId", null);

export default userIdAtom;

// FIXME: This can be deprecated in the future by only using userAtom
