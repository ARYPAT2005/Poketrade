import React from "react";

import { isLoggedAtom } from "../atoms/isLoggedAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";

const Trade: React.FC = () => {
  const isLogged = useAtomValue(isLoggedAtom);
  return (
    <div>
      <h1>Trade</h1>
      {isLogged ? <p>Trade with other users here!</p> : <LoginPrompt />}
    </div>
  );
};

export default Trade;
