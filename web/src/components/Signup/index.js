import React, { useState } from "react";
import { CompleteProfile } from "./CompleteProfile";
import { Registration } from "./Registration";

const Signup = ({ handleClick, slideLeft }) => {
  const [isReady, setIsReady] = useState(false);

  const registrationProps = {
    handleClick,
    slideLeft,
    setIsReady,
  };

  const completeProfileProps = { isReady };

  return (
    <>
      {!isReady ? (
        <Registration {...registrationProps} />
      ) : (
        <CompleteProfile {...completeProfileProps} />
      )}
    </>
  );
};

export { Signup };
