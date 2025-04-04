import React from "react";

import { userIdAtom } from "../atoms/userIdAtom";
import { useAtomValue, useAtom } from "jotai";
import { isLoggedAtom, usernameAtom} from "../atoms/isLoggedAtom";

import LoginPrompt from "./LoginPrompt";

const Trade: React.FC = () => {
  const [isLogged, setIsLogged] = useAtom(isLoggedAtom);
  const userId = useAtomValue(userIdAtom);
  return (
    <div>
      <h1>Trade</h1>
      {isLogged ? <p>Trade with other users here!</p> : <LoginPrompt />}
    </div>
  );
};

export default Trade;
