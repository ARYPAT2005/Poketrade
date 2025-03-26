import React from "react";

import { isLoggedAtom } from "../atoms/isLoggedAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";

const Store: React.FC = () => {
  const isLogged = useAtomValue(isLoggedAtom);
  return (
    <div>
      <h1>Store</h1>
      {isLogged ? <p>Buy and sell items here!</p> : <LoginPrompt />}
    </div>
  );
};

export default Store;
