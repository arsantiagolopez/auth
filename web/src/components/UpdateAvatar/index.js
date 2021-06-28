import React, { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { UrlBar } from "./UrlBar";

const UpdateAvatar = ({ isUrlActive, setIsUrlActive, onChange, errors }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [isValidUrl, setIsValidUrl] = useState(null);

  const avatarProps = {
    imgUrl,
    setIsUrlActive,
    setIsValidUrl,
    isValidUrl,
    errors,
  };

  const urlBarProps = { setIsUrlActive, setImgUrl };

  // Url isn't valid if empty
  useEffect(() => {
    if (imgUrl === "") {
      setIsValidUrl(false);
    }
  }, [imgUrl]);

  // Update form field if valid
  useEffect(() => {
    if (isValidUrl) {
      onChange(imgUrl);
    } else {
      onChange(undefined);
    }
  }, [isValidUrl]);

  return (
    <>
      {!isUrlActive ? <Avatar {...avatarProps} /> : <UrlBar {...urlBarProps} />}
    </>
  );
};

export { UpdateAvatar };
