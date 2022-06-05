/**
 *  Custom hook to get window height and width
 *  on mobile resize. Runs on client (SSR ready)
 */

import { useEffect, useState } from "react";

const useDimensions = () => {
  const isBrowser = typeof window !== "undefined";

  const getWindowDimensions = () => {
    const width = isBrowser ? window.innerWidth : null;
    const height = isBrowser ? window.innerHeight : null;

    return { height, width };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (isBrowser) {
      const handleResize = () => setWindowDimensions(getWindowDimensions());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isBrowser]);

  return windowDimensions;
};

export { useDimensions };
