import React, { forwardRef, useEffect } from "react";
import { Modal, Form, Icon, Input, Button, Checkbox } from "antd";

const PureBaseCreationForm = (
  { form, showModal, error, creating, onConfirm, onCancel },
  ref
) => {
  if (error) {
    return <div>Creating error.</div>;
  }

  useEffect(() => {
    ref.current = form;
    return () => {
      ref.current = undefined;
    };
  }, []);

  const { getFieldDecorator } = form;
  return (
    <Modal
      title="Create new base"
      visible={showModal}
      confirmLoading={creating}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form layout="vertical" className="login-form">
        <Form.Item label="Base ID">
          {getFieldDecorator("id", {
            rules: [
              { required: true, message: "Please input base identifier!" }
            ]
          })(<Input placeholder="example-id-for-base" />)}
        </Form.Item>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Please input base name!" }]
          })(<Input placeholder="A beautiful name" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(PureBaseCreationForm);
