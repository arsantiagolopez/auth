/**
 *  Handle popover blurs onClicks & when to lose focus.
 *  Loses focus whenever clicked outside of the ref and
 *  whenever a child node is clicked.
 **/

import { useDelay } from "./useDelay";

const handleBlur = async (event, ref, setIsOpen) => {
  const { relatedTarget: clickedNode } = event;

  // Close popover if clicked anywhere outside ref
  const clickedOutsideRef = !ref.current.contains(clickedNode);

  if (clickedOutsideRef) {
    setIsOpen(false);
  }

  // Close popover if button inside ref is clicked
  const clickedChoice = !clickedOutsideRef && clickedNode.tagName === "BUTTON";

  if (clickedChoice) {
    await useDelay(200);
    setIsOpen(false);
  }
};

export { handleBlur };
