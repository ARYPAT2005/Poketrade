import React from "react";

import { Button } from "react-bootstrap";

import { useAtom } from "jotai";
import { isLoggedAtom } from "../atoms/isLoggedAtom";

const Login = () => {
  const [isLogged, setIsLogged] = useAtom(isLoggedAtom);
  return (
    <div>
      <h1>Login</h1>
      <p>
        {isLogged
          ? "You are logged in. Click the button below to logout."
          : "You are not logged in. Click the button below to login."}
      </p>
      <Button
        onClick={() => {
          setIsLogged(!isLogged);
        }}
        variant={isLogged ? "danger" : "success"}
      >
        {isLogged ? "Logout" : "Login"}
      </Button>
    </div>
  );
};

export default Login;
