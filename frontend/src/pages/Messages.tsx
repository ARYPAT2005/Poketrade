import React from "react";

import { userIdAtom } from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";

const Messages: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  return (
    <div>
      <h1>Messages</h1>
      {userId ? <p>Message other users here!</p> : <LoginPrompt />}
    </div>
  );
};

export default Messages;
