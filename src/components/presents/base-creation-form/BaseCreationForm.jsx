import React from "react";
import { states } from "@/components/container/widgets/base-creation-form/machine";

const BaseCreationForm = ({ modifier, onConfirm }) => {
  const views = {
    [states.END]: <div />,
    [states.ERROR]: <div>Creating error.</div>,
    [states.INIT]: (
      <div>
        Please enter.
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ),
    [states.INVALID]: <div>Invalid.</div>,
    [states.CREATING]: <div>Requesting.</div>,
    [states.SUCCESS]: <div>Complete.</div>
  };

  return views[modifier];
};

export default BaseCreationForm;
