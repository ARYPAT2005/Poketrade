import React from "react";

import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";

const Trade: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  return (
    <div>
      <h1>Trade</h1>
      {userId ? <p>Trade with other users here!</p> : <LoginPrompt />}
    </div>
  );
};

export default Trade;
