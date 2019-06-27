import React from "react";
import { states } from "./machine";

import { Modal } from "carbon-components-react";

const PureBaseCreationForm = ({ modifier, onConfirm, onCancel }) => {
  const views = {
    [states.END]: <div />,
    [states.ERROR]: <div>Creating error.</div>,
    [states.INIT]: (
      <Modal
        modalHeading="Create new base"
        primaryButtonText="Create"
        secondaryButtonText="Cancel"
        open={true}
        onRequestClose={onCancel}
        onRequestSubmit={onConfirm}
        onSecondarySubmit={onCancel}
      />
    ),
    [states.INVALID]: <div>Invalid.</div>,
    [states.CREATING]: <div>Requesting.</div>,
    [states.SUCCESS]: <div />
  };

  return views[modifier];
};

export default PureBaseCreationForm;
