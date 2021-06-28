import React, { useState } from "react";
import { Local as LocalLogin } from "./Local";
import { Social as SocialLogin } from "./Social";

const Login = ({ handleClick, slideLeft }) => {
  const [isLocalActive, setIsLocalActive] = useState(false);

  const socialProps = {
    handleClick,
    slideLeft,
    setIsLocalActive,
  };

  const localProps = {
    isLocalActive,
    setIsLocalActive,
  };

  return (
    <>
      {!isLocalActive ? (
        <SocialLogin {...socialProps} />
      ) : (
        <LocalLogin {...localProps} />
      )}
    </>
  );
};

export { Login };
