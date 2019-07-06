import React, { useState } from "react";
import { Button } from "antd";

export const PurePageLogin = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    onLogin();
  };

  return (
    <Button loading={loading} icon="user" type="primary" onClick={handleClick}>
      Login
    </Button>
  );
};

export default PurePageLogin;
