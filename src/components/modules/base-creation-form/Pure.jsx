import React from "react";
import { Modal } from "antd";

const PureBaseCreationForm = ({
  showModal,
  error,
  creating,
  onConfirm,
  onCancel
}) => {
  if (error) {
    return <div>Creating error.</div>;
  }

  if (creating) {
    return <div>Requesting.</div>;
  }

  return (
    <Modal
      title="Create new base"
      visible={showModal}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default PureBaseCreationForm;
