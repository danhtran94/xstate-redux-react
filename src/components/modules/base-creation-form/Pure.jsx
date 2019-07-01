import React from "react";
import { states } from "./machine";

import { Modal } from "antd";

const PureBaseCreationForm = ({ modifier, onConfirm, onCancel }) => {
  const views = {
    [states.END]: <div />,
    [states.ERROR]: <div>Creating error.</div>,
    [states.INIT]: (
      <Modal
        title="Create new base"
        visible={true}
        onOk={onConfirm}
        onCancel={onCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    ),
    [states.INVALID]: <div>Invalid.</div>,
    [states.CREATING]: <div>Requesting.</div>,
    [states.SUCCESS]: <div />
  };

  return views[modifier];
};

export default PureBaseCreationForm;
