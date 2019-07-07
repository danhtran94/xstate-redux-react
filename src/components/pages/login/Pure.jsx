import React, { useState } from "react";
import { Button } from "antd";

export const PurePageLogin = ({ logging, onLogin }) => {
  return (
    <Button loading={logging} icon="user" type="primary" onClick={onLogin}>
      Login
    </Button>
  );
};

export default PurePageLogin;
